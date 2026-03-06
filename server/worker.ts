export default {
  async fetch(request: Request, env: any) {
    const url = new URL(request.url);

    // If you have API routes, you can handle them here
    if (url.pathname.startsWith('/api')) {
      return new Response(JSON.stringify({ error: "API not yet implemented on Worker" }), {
        status: 501,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Otherwise serve static assets
    try {
      const response = await env.ASSETS.fetch(request);
      // If asset is not found (404), fallback to index.html for React Router
      if (response.status === 404 || (!url.pathname.includes('.') && !url.pathname.startsWith('/api'))) {
        const indexRequest = new Request(new URL('/index.html', request.url));
        return await env.ASSETS.fetch(indexRequest);
      }
      return response;
    } catch (e) {
      const indexRequest = new Request(new URL('/index.html', request.url));
      return await env.ASSETS.fetch(indexRequest);
    }
  }
}
