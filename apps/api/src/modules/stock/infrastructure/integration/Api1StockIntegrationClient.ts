export class Api1StockIntegrationClient {
  // Render + cold start: 15s pode ser pouco. 20s é mais seguro.
  private static readonly TIMEOUT_MS = 20000;
  private static readonly RETRY_ON_TIMEOUT = 1;

  static async getPosition(command: {
    productId: string;
    externalRequestId: string;
    positionDateISO?: string;
  }) {
    const baseUrl = process.env.API1_BASE_URL;

    if (!baseUrl) {
      return {
        success: false,
        error: "INTEGRATION_UNAVAILABLE",
        message: "API1_BASE_URL not configured",
      };
    }

    const payload = {
      // API 2 não conhece Omie, envia domínio
      productId: command.productId,
      // opcional (API 1 pode ignorar)
      positionDateISO: command.positionDateISO,
      // não é obrigatório no body da API 1, mas é útil para rastreio/logs
      externalRequestId: command.externalRequestId,
    };

    console.log("[CALLING API 1 - STOCK]", payload);

    let attempt = 0;

    while (attempt <= this.RETRY_ON_TIMEOUT) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

      try {
        const response = await fetch(`${baseUrl}/v1/integration/stock/position`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-External-Request-Id": command.externalRequestId,
          },
          body: JSON.stringify(payload),
          signal: controller.signal as any,
        });

        const data = await response.json();

        if (response.status >= 400) {
          return {
            success: false,
            error: data.error || "INTEGRATION_ERROR",
            message: data.message || "Unexpected integration error",
          };
        }

        return data;
      } catch (error: any) {
        const isAbort = error?.name === "AbortError";
        if (isAbort && attempt < this.RETRY_ON_TIMEOUT) {
          console.warn("[API1 STOCK] timeout, retrying once...", {
            attempt,
            externalRequestId: command.externalRequestId,
          });
          attempt += 1;
          continue;
        }

        return {
          success: false,
          error: "INTEGRATION_UNAVAILABLE",
          message: isAbort ? "Integration timeout" : (error?.message || "Integration error"),
        };
      } finally {
        clearTimeout(timeout);
      }
    }

    // fallback (não deve chegar aqui)
    return {
      success: false,
      error: "INTEGRATION_UNAVAILABLE",
      message: "Integration failed",
    };
  }
}

