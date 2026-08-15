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

    return env.ASSETS.fetch(request);
  },
};
