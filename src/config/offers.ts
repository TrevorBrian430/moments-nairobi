export interface OfferConfig {
  firstOrder: {
    enabled: boolean;
    text: string;
    actionText: string;
    phone: string;
    message: string;
  };
}

export const offers: OfferConfig = {
  firstOrder: {
    enabled: true,
    text: "First order? Get 10% off when you order on WhatsApp.",
    actionText: "Message us",
    phone: "254702947981",
    message: "Hi Moments Nairobi, I would like to claim my 10% first-order discount.",
  },
};
