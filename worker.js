function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...headers },
  });
}

function base64url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64url(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function signSession(password, expires) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(String(expires)),
  );
  return `${expires}.${base64url(new Uint8Array(signature))}`;
}

async function validSession(request, password, cookieName) {
  if (!password) return false;
  const cookie = request.headers.get("cookie") || "";
  const escapedName = cookieName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${escapedName}=([^;]+)`));
  if (!match) return false;

  const [expiresText, signatureText] = decodeURIComponent(match[1]).split(".");
  const expires = Number(expiresText);
  if (!Number.isFinite(expires) || expires < Date.now()) return false;

  const expected = await signSession(password, expires);
  return signatureText === expected.split(".")[1];
}

async function githubFetch(env, path, options = {}) {
  return fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${env.GITHUB_TOKEN}`,
      "x-github-api-version": "2022-11-28",
      "user-agent": "Vimuktam-Repository-Portal",
      ...(options.headers || {}),
    },
  });
}

function githubPath(path) {
  return path.split("/").map(encodeURIComponent).join("/");
}

function validCompanyDocsPath(path) {
  return typeof path === "string" &&
    path.startsWith("Company docs/") &&
    !path.includes("..") &&
    !path.includes("\\") &&
    path.length > "Company docs/".length &&
    path.length <= 240;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/cabinet/website-repository/login" && request.method === "POST") {
      if (!env.WEBSITE_REPO_PASSWORD) return json({ ok: false, error: "Cabinet authentication is not configured." }, 503);
      let body;
      try { body = await request.json(); } catch { return json({ ok: false, error: "Invalid request." }, 400); }
      if (!body?.password || body.password !== env.WEBSITE_REPO_PASSWORD) return json({ ok: false, error: "Incorrect cabinet password." }, 401);
      const expires = Date.now() + 30 * 60 * 1000;
      const session = await signSession(env.WEBSITE_REPO_PASSWORD, expires);
      return json({ ok: true }, 200, { "set-cookie": `vimuktam_repo_session=${encodeURIComponent(session)}; Max-Age=1800; Path=/; HttpOnly; Secure; SameSite=Lax` });
    }

    if (url.pathname === "/api/cabinet/website-repository/logout" && request.method === "POST") {
      return json({ ok: true }, 200, { "set-cookie": "vimuktam_repo_session=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax" });
    }

    if (url.pathname === "/api/repository/tree" && request.method === "GET") {
      if (!(await validSession(request, env.WEBSITE_REPO_PASSWORD, "vimuktam_repo_session"))) return json({ ok: false, error: "Unauthorized." }, 401);
      if (!env.GITHUB_TOKEN) return json({ ok: false, error: "GitHub access is not configured." }, 503);
      const repo = env.GITHUB_REPO || "pegasusmilan/Vimuktam-Website";
      const response = await githubFetch(env, `/repos/${repo}/git/trees/main?recursive=1`);
      if (!response.ok) return json({ ok: false, error: `GitHub repository request failed (${response.status}).` }, 502);
      const data = await response.json();
      return json({ ok: true, repo, tree: (data.tree || []).filter((item) => item.type === "blob").map((item) => ({ path: item.path, size: item.size })) });
    }

    if (url.pathname === "/api/repository/file" && request.method === "GET") {
      if (!(await validSession(request, env.WEBSITE_REPO_PASSWORD, "vimuktam_repo_session"))) return json({ ok: false, error: "Unauthorized." }, 401);
      if (!env.GITHUB_TOKEN) return json({ ok: false, error: "GitHub access is not configured." }, 503);
      const path = url.searchParams.get("path");
      if (!path || path.includes("..")) return json({ ok: false, error: "Invalid file path." }, 400);
      const repo = env.GITHUB_REPO || "pegasusmilan/Vimuktam-Website";
      const response = await githubFetch(env, `/repos/${repo}/contents/${githubPath(path)}?ref=main`);
      if (!response.ok) return json({ ok: false, error: `GitHub file request failed (${response.status}).` }, 502);
      const data = await response.json();
      if (!data.content || data.encoding !== "base64") return json({ ok: false, error: "This file cannot be displayed in the portal." }, 415);
      const bytes = fromBase64url(data.content.replace(/\n/g, "").replace(/\r/g, ""));
      const text = new TextDecoder().decode(bytes);
      return json({ ok: true, path, size: data.size, text });
    }

    if (url.pathname === "/api/cabinet/company-documents/login" && request.method === "POST") {
      if (!env.COMPANY_DOCS_PASSWORD) return json({ ok: false, error: "Cabinet authentication is not configured." }, 503);
      let body;
      try { body = await request.json(); } catch { return json({ ok: false, error: "Invalid request." }, 400); }
      if (!body?.password || body.password !== env.COMPANY_DOCS_PASSWORD) return json({ ok: false, error: "Incorrect cabinet password." }, 401);
      const expires = Date.now() + 30 * 60 * 1000;
      const session = await signSession(env.COMPANY_DOCS_PASSWORD, expires);
      return json({ ok: true }, 200, { "set-cookie": `vimuktam_docs_session=${encodeURIComponent(session)}; Max-Age=1800; Path=/; HttpOnly; Secure; SameSite=Lax` });
    }

    if (url.pathname === "/api/cabinet/company-documents/logout" && request.method === "POST") {
      return json({ ok: true }, 200, { "set-cookie": "vimuktam_docs_session=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax" });
    }

    if (url.pathname === "/api/company-documents/tree" && request.method === "GET") {
      if (!(await validSession(request, env.COMPANY_DOCS_PASSWORD, "vimuktam_docs_session"))) return json({ ok: false, error: "Unauthorized." }, 401);
      if (!env.GITHUB_TOKEN) return json({ ok: false, error: "GitHub access is not configured." }, 503);
      const repo = env.GITHUB_REPO || "pegasusmilan/Vimuktam-Website";
      const response = await githubFetch(env, `/repos/${repo}/git/trees/main?recursive=1`);
      if (!response.ok) return json({ ok: false, error: `GitHub repository request failed (${response.status}).` }, 502);
      const data = await response.json();
      return json({ ok: true, repo, tree: (data.tree || []).filter((item) => item.type === "blob" && item.path.startsWith("Company docs/")).map((item) => ({ path: item.path, size: item.size })) });
    }

    if (url.pathname === "/api/company-documents/file" && request.method === "GET") {
      if (!(await validSession(request, env.COMPANY_DOCS_PASSWORD, "vimuktam_docs_session"))) return json({ ok: false, error: "Unauthorized." }, 401);
      if (!env.GITHUB_TOKEN) return json({ ok: false, error: "GitHub access is not configured." }, 503);
      const path = url.searchParams.get("path");
      if (!validCompanyDocsPath(path)) return json({ ok: false, error: "Invalid company document path." }, 400);
      const repo = env.GITHUB_REPO || "pegasusmilan/Vimuktam-Website";
      const response = await githubFetch(env, `/repos/${repo}/contents/${githubPath(path)}?ref=main`);
      if (!response.ok) return json({ ok: false, error: `GitHub file request failed (${response.status}).` }, 502);
      const data = await response.json();
      return json({ ok: true, path, size: data.size, sha: data.sha, downloadUrl: data.download_url || null, htmlUrl: data.html_url || null, content: data.content || null, encoding: data.encoding || null });
    }

    if (url.pathname === "/api/company-documents/upload" && request.method === "POST") {
      if (!(await validSession(request, env.COMPANY_DOCS_PASSWORD, "vimuktam_docs_session"))) return json({ ok: false, error: "Unauthorized." }, 401);
      if (!env.GITHUB_TOKEN) return json({ ok: false, error: "GitHub access is not configured." }, 503);
      let body;
      try { body = await request.json(); } catch { return json({ ok: false, error: "Invalid request." }, 400); }
      const path = body?.path;
      const content = body?.content;
      if (!validCompanyDocsPath(path)) return json({ ok: false, error: "Choose a valid file path inside Company docs." }, 400);
      if (typeof content !== "string" || !content) return json({ ok: false, error: "No file content was supplied." }, 400);
      if (content.length > 140000000) return json({ ok: false, error: "This file is too large for the repository portal." }, 413);

      const repo = env.GITHUB_REPO || "pegasusmilan/Vimuktam-Website";
      const existing = await githubFetch(env, `/repos/${repo}/contents/${githubPath(path)}?ref=main`);
      if (existing.ok) return json({ ok: false, error: "A file with that name already exists. Rename the new file rather than replacing it here." }, 409);
      if (existing.status !== 404) return json({ ok: false, error: `GitHub file check failed (${existing.status}).` }, 502);

      const response = await githubFetch(env, `/repos/${repo}/contents/${githubPath(path)}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          message: `Add company document: ${path.slice("Company docs/".length)}`,
          content,
          branch: "main",
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) return json({ ok: false, error: data?.message || `GitHub upload failed (${response.status}).` }, response.status === 403 ? 502 : response.status);
      return json({ ok: true, path, url: data?.content?.html_url || null });
    }

    if (url.pathname === "/api/r2-test") {
      try {
        const listed = await env.MULTIMEDIA.list({ limit: 10 });
        return Response.json({ ok: true, bucket: "vimuktam-multimedia", accessible: true, objects: listed.objects.map((object) => object.key) });
      } catch (error) {
        return Response.json({ ok: false, bucket: "vimuktam-multimedia", accessible: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
      }
    }

    if (url.pathname === "/media/Hindi-teacher-Milan.webp") {
      const object = await env.MULTIMEDIA.get("Media/images/Hindi-teacher-Milan.webp");
      if (!object) return new Response("Not found", { status: 404 });
      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("etag", object.httpEtag);
      headers.set("cache-control", "public, max-age=3600");
      return new Response(object.body, { headers });
    }

    if (!env.ASSETS || typeof env.ASSETS.fetch !== "function") return new Response("Website assets are not available in this deployment.", { status: 503 });
    return env.ASSETS.fetch(request);
  },
};
