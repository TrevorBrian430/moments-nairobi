export interface PaymentOrderPayload {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  amount: number;
  currency: string;
  description: string;
}

export interface PaymentProvider {
  createPayment(
    order: PaymentOrderPayload
  ): Promise<{ redirectUrl?: string; reference: string }>;
  getStatus(reference: string): Promise<"pending" | "paid" | "failed">;
}
