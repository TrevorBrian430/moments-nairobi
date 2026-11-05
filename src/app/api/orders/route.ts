import { NextRequest, NextResponse } from "next/server";
import { createOrderServer } from "@/lib/server-orders";
import { getPaymentProvider } from "@/lib/payments";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      idempotencyKey,
      customerName,
      customerPhone,
      customerEmail,
      deliveryMethod,
      deliveryTown,
      deliveryAddress,
      deliveryLandmark,
      notes,
      paymentMethod,
      items,
    } = body;

    // Validation
    if (!customerName || typeof customerName !== "string" || !customerName.trim()) {
      return NextResponse.json(
        { error: "Customer name is required" },
        { status: 400 }
      );
    }

    if (!customerPhone || typeof customerPhone !== "string" || !customerPhone.trim()) {
      return NextResponse.json(
        { error: "Valid phone number is required" },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Order must contain at least one item" },
        { status: 400 }
      );
    }

    if (!deliveryMethod || (deliveryMethod !== "pickup" && deliveryMethod !== "courier")) {
      return NextResponse.json(
        { error: "Valid delivery method is required" },
        { status: 400 }
      );
    }

    if (deliveryMethod === "courier" && (!deliveryTown || !deliveryAddress)) {
      return NextResponse.json(
        { error: "Town and address are required for courier delivery" },
        { status: 400 }
      );
    }

    // Create order with server-recomputed prices
    const order = createOrderServer({
      idempotencyKey,
      customerName,
      customerPhone,
      customerEmail,
      deliveryMethod,
      deliveryTown,
      deliveryAddress,
      deliveryLandmark,
      notes,
      paymentMethod: paymentMethod || "pickup",
      items,
    });

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
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create order. Please try again." },
      { status: 500 }
    );
  }
}
