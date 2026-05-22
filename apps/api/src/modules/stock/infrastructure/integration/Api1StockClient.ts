export class Api1StockClient {
  private static readonly TIMEOUT_MS = 15000;

  static async getPosition(command: {
    productId: string;
    positionDateISO?: string;
    externalRequestId: string;
  }) {
    const baseUrl = process.env.API1_BASE_URL;
    if (!baseUrl) {
      return { success: false, error: "INTEGRATION_UNAVAILABLE", message: "API1_BASE_URL not configured" };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

    try {
      const payload = {
        productId: command.productId,
        positionDateISO: command.positionDateISO,
        externalRequestId: command.externalRequestId
      };

      console.log("[CALLING API 1 - STOCK]", payload);

      const response = await fetch(`${baseUrl}/v1/integration/stock/position`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-External-Request-Id": command.externalRequestId
        },
        body: JSON.stringify(payload),
        signal: controller.signal as any
      });

      const data = await response.json();

      if (response.status >= 400) {
        return {
          success: false,
          error: data.error || "INTERNAL_ERROR",
          message: data.message || "Unexpected error"
        };
      }

      return data;
    } catch (error: any) {
      return {
        success: false,
        error: "INTEGRATION_UNAVAILABLE",
        message: error?.name === "AbortError" ? "Integration timeout" : (error?.message || "Integration error")
      };
    } finally {
      clearTimeout(timeout);
    }
  }
}
