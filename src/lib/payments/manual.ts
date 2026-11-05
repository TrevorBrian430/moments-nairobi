import { PaymentProvider, PaymentOrderPayload } from "./provider";

/**
 * ManualPaymentProvider
 * Default provider for Pay on Pickup / Pay on Delivery.
 * Returns no redirectUrl; status stays "pending".
 */
export class ManualPaymentProvider implements PaymentProvider {
  async createPayment(order: PaymentOrderPayload): Promise<{
    redirectUrl?: string;
    reference: string;
  }> {
    return {
      reference: `MAN-${order.orderNumber}`,
    };
  }

  async getStatus(_reference: string): Promise<"pending" | "paid" | "failed"> {
    return "pending";
  }
}

export const manualPaymentProvider = new ManualPaymentProvider();
