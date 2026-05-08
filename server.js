// apps/api/src/config/env.ts
import * as dotenv from "dotenv";
import events from "events";
function setupEnv() {
  dotenv.config();
  events.EventEmitter.defaultMaxListeners = 100;
  process.setMaxListeners(100);
}

// apps/api/src/bootstrap/server.ts
import express2 from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

// apps/api/src/bootstrap/app.ts
import express from "express";

// apps/api/src/bootstrap/routes.ts
import { Router as Router2 } from "express";

// apps/api/src/modules/proxy/presentation/http/routes.ts
import { Router } from "express";

// apps/api/src/modules/proxy/presentation/http/controllers/ProxyController.ts
import axios from "axios";
import https from "https";
var httpsAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 50,
  timeout: 6e4
});
httpsAgent.setMaxListeners(100);
var ProxyController = class {
  static async syncProducts(req, res) {
    console.log("[SYNC] Products Sync triggered via Proxy");
    try {
      const targetUrl = `https://production-manager-api.onrender.com/v1/products`;
      const response = await axios.get(targetUrl, {
        timeout: 6e4,
        params: { limit: 1e3 },
        httpsAgent
      });
      const products = response.data.data || [];
      return res.json({ success: true, count: products.length, data: products });
    } catch (err) {
      console.error("[SYNC PRODUCTS ERROR]", err.message);
      return res.status(500).json({ error: "Sync failed", message: err.message });
    }
  }
  static async syncOrders(req, res) {
    console.log("[SYNC] Orders Sync triggered via Proxy");
    try {
      const targetUrl = `https://production-manager-api.onrender.com/v1/orders`;
      const response = await axios.get(targetUrl, {
        timeout: 6e4,
        params: { page: 1, pageSize: 500 },
        httpsAgent
      });
      const responseData = response.data || {};
      const orders = responseData.orders || [];
      const formattedOrders = orders.map((raw) => {
        const o = raw.order || {};
        const c = raw.client || {};
        const id = o.omieCode || raw.omieCode || raw.id;
        const totalValue = Array.isArray(raw.items) ? raw.items.reduce((acc, cur) => acc + (Number(cur.totalPrice) || 0), 0) : 0;
        return {
          id,
          order_number: o.orderNumber || raw.numeroPedido || raw.order_number || id,
          customer_name: c.tradeName || c.legalName || raw.customerName || "N/A",
          customer_id: c.omieClientCode || raw.customerId || raw.customer_id || null,
          status: o.stage || raw.etapa || raw.status || "20",
          total_value: totalValue || raw.total_value || 0,
          items: raw.items || [],
          created_at: o.expectedDate || raw.created_at || (/* @__PURE__ */ new Date()).toISOString(),
          updated_at: raw.lastSyncAt || raw.updated_at || (/* @__PURE__ */ new Date()).toISOString()
        };
      });
      return res.json({ success: true, count: formattedOrders.length, data: formattedOrders });
    } catch (err) {
      console.error("[SYNC ORDERS ERROR]", err.message);
      return res.status(500).json({ error: "Sync failed", message: err.message });
    }
  }
  static async syncClients(req, res) {
    console.log("[SYNC] Clients Sync triggered via Proxy");
    try {
      const targetUrl = `https://production-manager-api.onrender.com/v1/clients`;
      const response = await axios.get(targetUrl, {
        timeout: 12e4,
        params: { page: 1, pageSize: 5e3 },
        httpsAgent
      });
      const responseData = response.data || {};
      const clients = responseData.data || responseData.clients || [];
      return res.json({ success: true, count: clients.length, data: clients });
    } catch (err) {
      console.error("[SYNC CLIENTS ERROR]", err.message);
      return res.status(500).json({ error: "Sync failed", message: err.message });
    }
  }
  static async genericProxy(req, res) {
    const rawPath = req.path.replace(/^\/|\/$/g, "");
    const targetPath = rawPath.toLowerCase();
    if (req.url === "/" && req.path === "/") return res.sendStatus(200);
    try {
      const targetUrl = `https://production-manager-api.onrender.com/v1/${targetPath}`;
      console.log(`[PROXY] ${req.method} ${rawPath}`);
      const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
      };
      if (req.headers.authorization) headers["Authorization"] = req.headers.authorization;
      const response = await axios({
        method: req.method,
        url: targetUrl,
        data: req.body,
        params: req.query,
        headers,
        timeout: 6e4,
        httpsAgent
      });
      console.log(`[PROXY] Success ${targetUrl}`);
      return res.json(response.data);
    } catch (error) {
      console.error(`[PROXY] Error ${targetPath}`, error.message);
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      }
      return res.status(500).json({ error: "Proxy request failed", message: error.message });
    }
  }
};

// apps/api/src/modules/proxy/presentation/http/routes.ts
var proxyRouter = Router();
proxyRouter.post("/admin/omie/sync/products", ProxyController.syncProducts);
proxyRouter.post("/admin/omie/orders/stage20/sync", ProxyController.syncOrders);
proxyRouter.post("/admin/omie/clients/sync", ProxyController.syncClients);
proxyRouter.use("/", ProxyController.genericProxy);

// apps/api/src/bootstrap/routes.ts
function buildApiRouter() {
  const router = Router2();
  router.use("/proxy", proxyRouter);
  return router;
}

// apps/api/src/shared/errors/AppError.ts
var AppError = class extends Error {
  constructor(message, statusCode = 400, isOperational = true) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
};

// apps/api/src/shared/http/response.ts
var HttpResponseBuilder = class {
  static success(res, data, statusCode = 200, count) {
    const payload = { success: true, data };
    if (count !== void 0) payload.count = count;
    return res.status(statusCode).json(payload);
  }
  static error(res, error, statusCode = 400) {
    return res.status(statusCode).json({ success: false, error });
  }
};

// apps/api/src/bootstrap/plugins/error-handler.ts
function globalErrorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return HttpResponseBuilder.error(res, err.message, err.statusCode);
  }
  console.error("[UNHANDLED ERROR]", err);
  return HttpResponseBuilder.error(res, "Internal server error", 500);
}

// apps/api/src/bootstrap/app.ts
function configureApp(app) {
  app.use(express.json());
  app.use("/api", buildApiRouter());
  app.use("/api", globalErrorHandler);
}

// apps/api/src/bootstrap/server.ts
async function startServer() {
  const app = express2();
  const PORT = 3e3;
  configureApp(app);
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express2.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// server.ts
setupEnv();
startServer().catch((err) => {
  console.error("[FATAL] Failed to start server:", err);
  process.exit(1);
});
