const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(createProxyMiddleware('/api', {
        target: 'http://localhost:5000',                            // 현재 프론트의 포트인 3000에서 5000으로 데이터를 전송하겠다 라는 뜻
        changeOrigin: true,
    }));   
};