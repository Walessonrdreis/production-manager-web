import { Router, Request, Response } from "express";
import { z } from "zod";

const router = Router();

/**
 * POST /commands/orders/stage20
 * - Lê pedidos etapa 20 do BANCO LOCAL (API 1 admin)
 * - Evita Omie ao vivo (sem REDUNDANT)
 *
 * Body:
 * {
 *   externalRequestId: string,
 *   page?: number,
 *   pageSize?: number,
 *   q?: string
 * }
 */
router.post("/commands/orders/stage20", async (req: Request, res: Response) => {
  const Schema = z.object({
    externalRequestId: z.string().min(1),
    page: z.coerce.number().int().min(1).optional(),
    pageSize: z.coerce.number().int().min(1).max(200).optional(),
    q: z.string().trim().optional(),
    // opcional: escolher enriched
    enriched: z.coerce.boolean().optional(),
  });

  let input: z.infer<typeof Schema>;
  try {
    input = Schema.parse(req.body ?? {});
  } catch {
    return res.status(400).json({
      success: false,
      error: "VALIDATION_ERROR",
      message: "Invalid request payload",
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

  const page = input.page ?? 1;
  const pageSize = input.pageSize ?? 50;
  const q = input.q ? `&q=${encodeURIComponent(input.q)}` : "";

  // ✅ escolhe endpoint admin (DB-backed)
  const path = input.enriched ? "/v1/admin/orders/stage20/enriched" : "/v1/admin/orders/stage20";
  const url = `${baseUrl}${path}?page=${page}&pageSize=${pageSize}${q}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-External-Request-Id": input.externalRequestId,
      },
    });

    const json = await response.json().catch(() => null);

    if (!response.ok) {
      return res.status(503).json({
        success: false,
        error: "INTEGRATION_UNAVAILABLE",
        message: json?.message || `API1 returned HTTP ${response.status}`,
      });
    }

    /**
     * Seu endpoint admin retorna shape paginado parecido com:
     * { data: [...], meta: { page, pageSize, total }, links: { self } }
     * Você colou exatamente: "meta": { "page":1,"pageSize":50,"total":12 }
     */
    const orders = Array.isArray(json?.data) ? json.data : [];
    const meta = json?.meta ?? null;
    const links = json?.links ?? null;

    return res.status(200).json({
      success: true,
      data: { orders },
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
});

export default router;
