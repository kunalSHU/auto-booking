// /Users/kunalshukla/auto-booking/src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

// This target is for the proxy running INSIDE the frontend container.
// It will use Docker's internal DNS to resolve 'auto-booking-backend'.
const proxyTarget = process.env.REACT_APP_BACKEND_PROXY_TARGET || 'http://localhost:4201';

module.exports = function(app) {
    console.log(`[Proxy] Configuring proxy for /api to target ${proxyTarget}`);
    app.use(
      '/api', // Match requests starting with /api
      createProxyMiddleware({
        target: proxyTarget,
        changeOrigin: true,
        pathRewrite: { "^/": "/api/" },
      })
    );
};
