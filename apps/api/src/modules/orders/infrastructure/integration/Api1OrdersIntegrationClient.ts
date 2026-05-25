export class Api1OrdersIntegrationClient {
  private static readonly TIMEOUT_MS = 30000;
  private static readonly MAX_RETRIES = 2;
  private static readonly BASE_BACKOFF_MS = 1500;

  static async listStage20(command: { externalRequestId: string }) {
    const baseUrl = process.env.API1_BASE_URL;

    if (!baseUrl) {
      return {
        success: false,
        error: "INTEGRATION_UNAVAILABLE",
        message: "API1_BASE_URL not configured",
      };
    }

    const url = `${baseUrl}/v1/integration/orders/stage20`;

    for (let attempt = 0; attempt <= this.MAX_RETRIES; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-External-Request-Id": command.externalRequestId,
          },
          body: JSON.stringify({}),
          signal: controller.signal as any,
        });

        // ✅ MODO B: API 1 devolve 429 + Retry-After
        if (response.status === 429) {
          const retryAfterHeader = response.headers.get("retry-after");
          const retryAfterSeconds = retryAfterHeader ? Number(retryAfterHeader) : 60;
          const data = await response.json().catch(() => ({} as any));

          return {
            success: false,
            error: "INTEGRATION_UNAVAILABLE",
            message: data?.message || "Omie rate limited (REDUNDANT)",
            retryAfterSeconds: Number.isNaN(retryAfterSeconds) ? 60 : retryAfterSeconds,
          };
        }

        // Proxy/origin instável: 502/503/504 pode vir HTML/vazio
        if (response.status === 502 || response.status === 503 || response.status === 504) {
          const text = await response.text().catch(() => "");
          if (attempt < this.MAX_RETRIES) {
            await sleep(this.backoffMs(attempt));
            continue;
          }
          return {
            success: false,
            error: "INTEGRATION_UNAVAILABLE",
            message: "API1 unavailable (gateway/proxy error)",
            retryAfterSeconds: 30,
            details: { httpStatus: response.status, sample: text ? text.slice(0, 200) : null },
          };
        }

        // Normal: tenta JSON
        const data = await response.json().catch(async () => {
          const text = await response.text().catch(() => "");
          throw new Error(`NON_JSON_RESPONSE:${response.status}:${text.slice(0, 200)}`);
        });

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
        const msg = String(error?.message || "");

        const retryable =
          isAbort ||
          msg.includes("fetch failed") ||
          msg.includes("ECONNRESET") ||
          msg.includes("ENOTFOUND") ||
          msg.includes("ETIMEDOUT") ||
          msg.startsWith("NON_JSON_RESPONSE:");

        if (retryable && attempt < this.MAX_RETRIES) {
          await sleep(this.backoffMs(attempt));
          continue;
        }

        return {
          success: false,
          error: "INTEGRATION_UNAVAILABLE",
          message: isAbort ? "Integration timeout" : "Integration error",
          retryAfterSeconds: 30,
          details: { reason: isAbort ? "AbortError" : msg.slice(0, 200) },
        };
      } finally {
        clearTimeout(timeout);
      }
    }

    return {
      success: false,
      error: "INTEGRATION_UNAVAILABLE",
      message: "Integration failed",
      retryAfterSeconds: 30,
    };
  }

  private static backoffMs(attempt: number) {
    return this.BASE_BACKOFF_MS * (attempt + 1);
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
