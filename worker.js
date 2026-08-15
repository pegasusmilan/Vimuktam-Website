export default {
  async fetch(request, env) {
    const url = new URL(request.url);

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
