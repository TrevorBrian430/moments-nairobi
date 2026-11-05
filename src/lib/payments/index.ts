import { PaymentProvider } from "./provider";
import { manualPaymentProvider } from "./manual";

export function getPaymentProvider(): PaymentProvider {
  const providerKey = process.env.PAYMENT_PROVIDER || "manual";

  switch (providerKey) {
    case "manual":
    default:
      return manualPaymentProvider;
  }
}

export * from "./provider";
export * from "./manual";
