import express from "express";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import https from "https";
import path from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";
import events from "events";
dotenv.config();
events.EventEmitter.defaultMaxListeners = 100;
const httpsAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 50,
  timeout: 6e4
});
httpsAgent.setMaxListeners(100);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
async function startServer() {
  const app = express();
  const PORT = 3e3;
  process.setMaxListeners(100);
  app.use(express.json());
  app.use("/api/proxy", async (req, res, next) => {
    const rawPath = req.path.replace(/^\/|\/$/g, "");
    const targetPath = rawPath.toLowerCase();
    console.log(`[PROXY] ${req.method} ${rawPath}`);
    if (req.url === "/" && req.path === "/") return next();
    if (req.method === "POST" && targetPath === "admin/omie/sync/products") {
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
    if (req.method === "POST" && targetPath === "admin/omie/orders/stage20/sync") {
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
    try {
      const targetUrl = `https://production-manager-api.onrender.com/v1/${targetPath}`;
      const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
      };
      if (req.headers.authorization) {
        headers["Authorization"] = req.headers.authorization;
      }
      const response = await axios({
        method: req.method,
        url: targetUrl,
        data: req.body,
        params: req.query,
        headers,
        timeout: 6e4,
        httpsAgent
      });
      res.json(response.data);
    } catch (error) {
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      }
      res.status(500).json({
        error: "Proxy request failed",
        message: error.message
      });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
