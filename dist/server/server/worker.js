"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    async fetch(request, env) {
        const url = new URL(request.url);
        // If you have API routes, you can handle them here
        if (url.pathname.startsWith('/api')) {
            return new Response(JSON.stringify({ error: "API not yet implemented on Worker" }), {
                status: 501,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        // Otherwise serve static assets
        return env.ASSETS.fetch(request);
    }
};
