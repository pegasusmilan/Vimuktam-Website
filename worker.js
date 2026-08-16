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

async function validSession(request, password) {
  if (!password) return false;
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/(?:^|;\s*)vimuktam_repo_session=([^;]+)/);
  if (!match) return false;

  const [expiresText, signatureText] = decodeURIComponent(match[1]).split(".");
  const expires = Number(expiresText);
  if (!Number.isFinite(expires) || expires < Date.now()) return false;

  const expected = await signSession(password, expires);
  return signatureText === expected.split(".")[1];
}

async function githubFetch(env, path) {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${env.GITHUB_TOKEN}`,
      "x-github-api-version": "2022-11-28",
      "user-agent": "Vimuktam-Repository-Portal",
    },
  });
  return response;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/cabinet/website-repository/login" && request.method === "POST") {
      if (!env.WEBSITE_REPO_PASSWORD) return json({ ok: false, error: "Cabinet authentication is not configured." }, 503);

      let body;
      try {
        body = await request.json();
      } catch {
        return json({ ok: false, error: "Invalid request." }, 400);
      }

      if (!body?.password || body.password !== env.WEBSITE_REPO_PASSWORD) {
        return json({ ok: false, error: "Incorrect cabinet password." }, 401);
      }

      const expires = Date.now() + 30 * 60 * 1000;
      const session = await signSession(env.WEBSITE_REPO_PASSWORD, expires);
      return json(
        { ok: true },
        200,
        { "set-cookie": `vimuktam_repo_session=${encodeURIComponent(session)}; Max-Age=1800; Path=/; HttpOnly; Secure; SameSite=Lax` },
      );
    }

    if (url.pathname === "/api/cabinet/website-repository/logout" && request.method === "POST") {
      return json(
        { ok: true },
        200,
        { "set-cookie": "vimuktam_repo_session=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax" },
      );
    }

    if (url.pathname === "/api/repository/tree" && request.method === "GET") {
      if (!(await validSession(request, env.WEBSITE_REPO_PASSWORD))) return json({ ok: false, error: "Unauthorized." }, 401);
      if (!env.GITHUB_TOKEN) return json({ ok: false, error: "GitHub access is not configured." }, 503);

      const repo = env.GITHUB_REPO || "pegasusmilan/Vimuktam-Website";
      const response = await githubFetch(env, `/repos/${repo}/git/trees/main?recursive=1`);
      if (!response.ok) return json({ ok: false, error: `GitHub repository request failed (${response.status}).` }, 502);

      const data = await response.json();
      return json({ ok: true, repo, tree: (data.tree || []).filter((item) => item.type === "blob").map((item) => ({ path: item.path, size: item.size })) });
    }

    if (url.pathname === "/api/repository/file" && request.method === "GET") {
      if (!(await validSession(request, env.WEBSITE_REPO_PASSWORD))) return json({ ok: false, error: "Unauthorized." }, 401);
      if (!env.GITHUB_TOKEN) return json({ ok: false, error: "GitHub access is not configured." }, 503);

      const path = url.searchParams.get("path");
      if (!path || path.includes("..")) return json({ ok: false, error: "Invalid file path." }, 400);

      const repo = env.GITHUB_REPO || "pegasusmilan/Vimuktam-Website";
      const response = await githubFetch(env, `/repos/${repo}/contents/${path}?ref=main`);
      if (!response.ok) return json({ ok: false, error: `GitHub file request failed (${response.status}).` }, 502);

      const data = await response.json();
      if (!data.content || data.encoding !== "base64") return json({ ok: false, error: "This file cannot be displayed in the portal." }, 415);

      const bytes = fromBase64url(data.content.replace(/\n/g, "").replace(/\r/g, ""));
      const text = new TextDecoder().decode(bytes);
      return json({ ok: true, path, size: data.size, text });
    }

    if (url.pathname === "/api/r2-test") {
      try {
        const listed = await env.MULTIMEDIA.list({ limit: 10 });
        return Response.json({
          ok: true,
          bucket: "vimuktam-multimedia",
          accessible: true,
          objects: listed.objects.map((object) => object.key),
        });
      } catch (error) {
        return Response.json(
          {
            ok: false,
            bucket: "vimuktam-multimedia",
            accessible: false,
            error: error instanceof Error ? error.message : String(error),
          },
          { status: 500 },
        );
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

    return env.ASSETS.fetch(request);
  },
};
