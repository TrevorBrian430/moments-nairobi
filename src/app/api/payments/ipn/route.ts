import { NextRequest, NextResponse } from "next/server";
import { updateOrderPaymentStatus } from "@/lib/server-orders";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json().catch(() => ({}));
    console.log("[IPN Webhook Received]:", JSON.stringify(payload));

    // TODO: Verify webhook signature from payment provider (e.g. Pesapal HMAC-SHA256 signature)
    // before trusting payload data.
    // Never mark an order paid from unauthenticated client requests.

    const reference = payload.OrderTrackingId || payload.reference || payload.orderNumber;
    const status = payload.status; // e.g. "COMPLETED" | "PAID" | "FAILED"

    if (reference && status) {
      if (status === "COMPLETED" || status === "PAID") {
        updateOrderPaymentStatus(reference, "paid");
      } else if (status === "FAILED") {
        updateOrderPaymentStatus(reference, "failed");
      }
    }

    return NextResponse.json({ status: "OK" }, { status: 200 });
  } catch (error) {
    console.error("[IPN Webhook Error]:", error);
    return NextResponse.json({ status: "ERROR" }, { status: 200 }); // Always 200 to acknowledge receipt
  }
}
