// SPDX-FileCopyrightText: 2026 German Aerospace Center (DLR)
// SPDX-License-Identifier: Apache-2.0

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
