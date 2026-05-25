import type { Request, Response } from "express";
import { z } from "zod";

type OrdersAdminResponse = {
  data?: any[];
  meta?: any;
  links?: any;
  message?: string;
};

export class OrdersController {
  /**
   * GET /api/orders
   * Lê pedidos do BANCO LOCAL via API 1 Admin (DB-backed).
   */
  static async getOrdersList(req: Request, res: Response) {
    const QuerySchema = z.object({
      page: z.coerce.number().int().min(1).optional(),
      pageSize: z.coerce.number().int().min(1).max(200).optional(),
      q: z.string().trim().optional(),
      enriched: z.coerce.boolean().optional(),
    });

    let query: z.infer<typeof QuerySchema>;
    try {
      query = QuerySchema.parse(req.query ?? {});
    } catch {
      return res.status(400).json({
        success: false,
        error: "VALIDATION_ERROR",
        message: "Invalid query params",
      });
    }

    return OrdersController.fetchFromDbAndReturn(res, {
      externalRequestId: req.header("X-External-Request-Id") ?? undefined,
      page: query.page,
      pageSize: query.pageSize,
      q: query.q,
      enriched: query.enriched,
    });
  }

  /**
   * POST /api/orders/sync
   * "Sync" do frontend = apenas RECARREGAR do BANCO LOCAL (não chama Omie).
   * Body pode vir vazio {}.
   */
  static async sync(req: Request, res: Response) {
    const BodySchema = z.object({
      externalRequestId: z.string().min(1).optional(),
      page: z.coerce.number().int().min(1).optional(),
      pageSize: z.coerce.number().int().min(1).max(200).optional(),
      q: z.string().trim().optional(),
      enriched: z.coerce.boolean().optional(),
    });

    let body: z.infer<typeof BodySchema>;
    try {
      body = BodySchema.parse(req.body ?? {});
    } catch {
      return res.status(400).json({
        success: false,
        error: "VALIDATION_ERROR",
        message: "Invalid request payload",
      });
    }

    // ✅ NÃO altera req.query (evita o erro do IncomingMessage)
    return OrdersController.fetchFromDbAndReturn(res, {
      externalRequestId: body.externalRequestId,
      page: body.page,
      pageSize: body.pageSize,
      q: body.q,
      enriched: body.enriched,
    });
  }

  /**
   * Helper único: busca do DB local via API 1 Admin e devolve no formato padrão da API 2.
   * OBS: aqui "v1/admin" = BANCO LOCAL (API 1), não Omie ao vivo.
   */
  private static async fetchFromDbAndReturn(
    res: Response,
    input: {
      externalRequestId?: string;
      page?: number;
      pageSize?: number;
      q?: string;
      enriched?: boolean;
    }
  ) {
    const baseUrl = process.env.API1_BASE_URL;
    if (!baseUrl) {
      return res.status(503).json({
        success: false,
        error: "INTEGRATION_UNAVAILABLE",
        message: "API1_BASE_URL not configured",
      });
    }

    const page = input.page ?? 1;
    const pageSize = input.pageSize ?? 50;
    const q = input.q ? `&q=${encodeURIComponent(input.q)}` : "";
    const path = input.enriched
      ? "/v1/admin/orders/stage20/enriched"
      : "/v1/admin/orders/stage20";

    const url = `${baseUrl}${path}?page=${page}&pageSize=${pageSize}${q}`;

    try {
      const r = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(input.externalRequestId ? { "X-External-Request-Id": input.externalRequestId } : {}),
        },
      });

      const json: OrdersAdminResponse | null = await r.json().catch(() => null);

      if (!r.ok) {
        return res.status(503).json({
          success: false,
          error: "INTEGRATION_UNAVAILABLE",
          message: json?.message || `API1 returned HTTP ${r.status}`,
        });
      }

      const orders = Array.isArray(json?.data) ? json!.data : [];
      const meta = json?.meta ?? null;
      const links = json?.links ?? null;

      return res.status(200).json({
        success: true,
        data: orders,
        meta,
        links,
      });

    } catch (err: any) {
      return res.status(503).json({
        success: false,
        error: "INTEGRATION_UNAVAILABLE",
        message: err?.message || "Integration error",
      });
    }
  }

  /**
   * Endpoint novo já existente (se você já usa no backend):
   * POST /api/commands/orders/stage20
   */
  static async stage20(req: Request, res: Response) {
    return OrdersController.sync(req, res);
  }
}

