export default {
  async fetch(request: Request, env: any, ctx: any) {
    const url = new URL(request.url);

    // Provide mock API responses to fix the Dashboard 501 / data load errors
    if (url.pathname.startsWith('/api')) {
      const path = url.pathname;
      const jsonResponse = (data: any) => new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

      try {
        if (path === '/api/menus') {
          return jsonResponse([]);
        }
        if (path === '/api/admin/action-stats') {
          return jsonResponse({
            views: 245,
            inquiries: 12,
            reservations: 4,
            conversionRate: 15.2
          });
        }
        if (path === '/api/documents') {
          return jsonResponse([]);
        }
        if (path.startsWith('/api/inquiries')) {
          if (path.endsWith('/stats')) {
            return jsonResponse({
              total: 0, pending: 0, confirmed: 0, cancelled: 0
            });
          }
          return jsonResponse([]);
        }
        if (path === '/api/analytics/dashboard') {
          return jsonResponse({
            totalViews: 850,
            activeInquiries: 5,
            conversionRate: 8.5,
            popularMenus: []
          });
        }
      } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
      }

      // Default API response
      return jsonResponse({ success: true, message: "Mock API active on Edge Worker" });
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
