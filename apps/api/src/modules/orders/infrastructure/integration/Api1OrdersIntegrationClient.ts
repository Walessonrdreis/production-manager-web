export class Api1OrdersIntegrationClient {
  private static readonly TIMEOUT_MS = 20000;

  /**
   * Estratégia correta (sem redundância):
   * - LER do banco local via endpoints admin da API 1 (legacy omie-sales-orders)
   * - NÃO chamar o endpoint /v1/integration/orders/stage20 (que tende a tocar Omie ao vivo)
   */
  static async listStage20(command: {
    externalRequestId: string;
    page?: number;
    pageSize?: number;
    q?: string;
  }) {
    const baseUrl = process.env.API1_BASE_URL;
    if (!baseUrl) {
      return {
        success: false,
        error: "INTEGRATION_UNAVAILABLE",
        message: "API1_BASE_URL not configured",
      };
    }

    const page = command.page ?? 1;
    const pageSize = command.pageSize ?? 50;
    const q = command.q ? `&q=${encodeURIComponent(command.q)}` : "";

    // ✅ Lê do banco local (legacy) — não toca Omie
    const url = `${baseUrl}/v1/admin/orders/stage20?page=${page}&pageSize=${pageSize}${q}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-External-Request-Id": command.externalRequestId,
        },
        signal: controller.signal as any,
      });

      // tenta JSON sempre
      const data = await response.json().catch(() => null);

      if (response.status >= 400) {
        return {
          success: false,
          error: data?.error || "INTEGRATION_ERROR",
          message: data?.message || `API1 returned HTTP ${response.status}`,
        };
      }

      /**
       * Respostas comuns do seu helper `paginated()`:
       * - { data: [...], meta: {...}, links: {...} }
       * ou
       * - { success:true, data:{...} } (depende do endpoint)
       *
       * Fazemos parse defensivo:
       */
      const rows =
        (Array.isArray(data?.data) && data.data) ||
        (Array.isArray(data?.items) && data.items) ||
        (Array.isArray(data?.orders) && data.orders) ||
        (Array.isArray(data) && data) ||
        [];

      // Contrato da API 2: sempre { success:true, data:{orders:[...] } }
      return {
        success: true,
        data: {
          orders: rows,
          meta: data?.meta ?? null,
          links: data?.links ?? null,
        },
      };
    } catch (error: any) {
      const isAbort = error?.name === "AbortError";
      return {
        success: false,
        error: "INTEGRATION_UNAVAILABLE",
        message: isAbort
          ? "Integration timeout"
          : error?.message || "Integration error",
      };
    } finally {
      clearTimeout(timeout);
    }
  }
}
