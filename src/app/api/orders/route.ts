import { NextRequest, NextResponse } from "next/server";
import { createOrderServer, OrderInputError } from "@/lib/server-orders";
import { parseOrderInput } from "@/lib/order-input";
import { getPaymentProvider } from "@/lib/payments";

export async function POST(req: NextRequest) {
  try {
    const order = createOrderServer(parseOrderInput(await req.json()));

    // Invoke payment provider seam
    const provider = getPaymentProvider();
    const paymentResult = await provider.createPayment({
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerEmail: order.customerEmail,
      amount: order.total,
      currency: "KES",
      description: `Moments Nairobi Order #${order.orderNumber}`,
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        subtotal: order.subtotal,
        deliveryFee: order.deliveryFee,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
      },
      redirectUrl: paymentResult.redirectUrl,
    });
  } catch (error) {
    if (error instanceof OrderInputError) return NextResponse.json({ error: error.message }, { status: 400 });
    if (error instanceof SyntaxError) return NextResponse.json({ error: "Invalid order details." }, { status: 400 });
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create order. Please try again." },
      { status: 500 }
    );
  }
}
