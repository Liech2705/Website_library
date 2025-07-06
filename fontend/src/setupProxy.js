const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:8000',
            changeOrigin: true,
            secure: false,
            pathRewrite: {
                '^/api': '/api', // Không thay đổi path
            },
            onProxyReq: function (proxyReq, req, res) {
                // Log để debug
                console.log('Proxying:', req.method, req.url, '->', proxyReq.path);
            },
            onError: function (err, req, res) {
                console.error('Proxy error:', err);
            }
        })
    );
}; 