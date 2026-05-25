import { Router } from "express";
import { ClientsController } from "./controllers/ClientsController.js";

export const clientsRouter = Router();

/**
 * API 2 (compatibilidade com frontend)
 */
clientsRouter.get("/", ClientsController.getClientsList);
