const { createProxyMiddleware } = require("http-proxy-middleware");


module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: process.env.REACT_APP_FL_SERVER_BASE_URL ?? "http://localhost:8000",
      // changeOrigin: true,
    })
  );
};
