import type { Request, Response } from "express";
import { z } from "zod";

export class ClientsController {
  /**
   * GET /api/clients
   * Lista clientes do BANCO LOCAL via API 1 (DB-backed).
   *
   * Observação: você mostrou que existe /v1/clients (admin) na API 1 antes.
   * Aqui usamos /v1/clients com paginação e q.
   */
  static async getClientsList(req: Request, res: Response) {
    const QuerySchema = z.object({
      page: z.coerce.number().int().min(1).optional(),
      pageSize: z.coerce.number().int().min(1).max(200).optional(),
      q: z.string().trim().optional(),
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

    const baseUrl = process.env.API1_BASE_URL;
    if (!baseUrl) {
      return res.status(503).json({
        success: false,
        error: "INTEGRATION_UNAVAILABLE",
        message: "API1_BASE_URL not configured",
      });
    }

    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 50;
    const q = query.q ? `&q=${encodeURIComponent(query.q)}` : "";

    // ✅ DB local (API 1)
    // Ajuste se o seu endpoint real for /v1/clients (como apareceu antes nos seus logs)
    const url = `${baseUrl}/v1/clients?page=${page}&pageSize=${pageSize}${q}`;

    try {
      const r = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const json = await r.json().catch(() => null);

      if (!r.ok) {
        return res.status(503).json({
          success: false,
          error: "INTEGRATION_UNAVAILABLE",
          message: json?.message || `API1 returned HTTP ${r.status}`,
        });
      }

      const clients = Array.isArray(json?.data) ? json.data : (Array.isArray(json?.clients) ? json.clients : []);
      return res.status(200).json({
        success: true,
        data: { clients },
        meta: json?.meta ?? null,
        links: json?.links ?? null,
      });
    } catch (err: any) {
      return res.status(503).json({
        success: false,
        error: "INTEGRATION_UNAVAILABLE",
        message: err?.message || "Integration error",
      });
    }
  }
}
