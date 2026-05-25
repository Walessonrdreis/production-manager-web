import { Router } from "express";
import { OrdersController } from "./controllers/OrdersController.js";

export const ordersRouter = Router();

/**
 * API 2 (compatibilidade com frontend)
 */
ordersRouter.get("/", OrdersController.getOrdersList);
ordersRouter.post("/sync", OrdersController.sync);
