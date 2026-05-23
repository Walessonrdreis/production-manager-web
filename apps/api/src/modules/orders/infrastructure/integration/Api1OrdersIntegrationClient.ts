export class Api1OrdersIntegrationClient {
  private static readonly TIMEOUT_MS = 20000;
  private static readonly RETRY_ON_TIMEOUT = 1;

  static async listStage20(command: { externalRequestId: string }) {
    const baseUrl = process.env.API1_BASE_URL;
    if (!baseUrl) {
      return {
        success: false,
        error: "INTEGRATION_UNAVAILABLE",
        message: "API1_BASE_URL not configured",
      };
    }

    let attempt = 0;

    while (attempt <= this.RETRY_ON_TIMEOUT) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

      try {
        const response = await fetch(`${baseUrl}/v1/integration/orders/stage20`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-External-Request-Id": command.externalRequestId,
          },
          body: JSON.stringify({}),
          signal: controller.signal as any,
        });

        // Se API 1 mandar 429, repassar como indisponível + retryAfter
        if (response.status === 429) {
          const data = await response.json().catch(() => ({} as any));
          const retryAfterHeader = response.headers.get("retry-after");
          const retryAfterSeconds = retryAfterHeader ? Number(retryAfterHeader) : Number(data?.retryAfterSeconds ?? 60);

          return {
            success: false,
            error: "INTEGRATION_UNAVAILABLE",
            message: data?.message || "Omie rate limited (REDUNDANT)",
            retryAfterSeconds: Number.isNaN(retryAfterSeconds) ? 60 : retryAfterSeconds,
          };
        }

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

    return {
      success: false,
      error: "INTEGRATION_UNAVAILABLE",
      message: "Integration failed",
    };
  }
}
