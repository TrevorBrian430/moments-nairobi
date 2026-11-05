import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Price } from "@/components/ui/Price";
import { getOrderByIdServer } from "@/lib/server-orders";
import { STORE_INFO } from "@/lib/constants";
import { generateWhatsAppLink } from "@/lib/utils";
import { POLICIES } from "@/config/policies";
import { cleanBrandName } from "@/lib/whatsapp";
import type { Metadata } from "next";

export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order #${id} Received | Moments Nairobi`,
    description: "Thank you for your order with Moments Nairobi.",
  };
}

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = getOrderByIdServer(id);

  if (!order) {
    // If order was created in demo or not found in memory, show fallback confirmation
    return (
      <div className="bg-[#F6F4F0] min-h-[60vh] py-16">
        <Container className="max-w-xl mx-auto text-center space-y-4">
          <h1 className="text-2xl font-heading font-medium text-[#111111]">
            Order received
          </h1>
          <p className="text-xs text-[#6B6B66]">
            Order reference: <strong className="text-[#111111]">#{id}</strong>
          </p>
          <p className="text-xs text-[#6B6B66] leading-relaxed">
            Your order has been recorded. Our team at Twilight Suites will confirm details and prepare your package.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={generateWhatsAppLink(
                STORE_INFO.whatsappPhone,
                `Hi Moments Nairobi, I would like to check on my order #${id}`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto h-[48px] px-6 rounded-[2px] border border-[#1FA855] text-[#1FA855] text-xs font-medium flex items-center justify-center hover:bg-[#1FA855]/5 transition-colors"
            >
              Chat on WhatsApp about this order
            </a>
            <Link
              href="/shop"
              className="text-xs text-[#6B6B66] hover:text-[#111111] transition-colors underline underline-offset-4"
            >
              Continue shopping
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  // Payment status display
  let paymentStatusText = "Awaiting payment";
  if (order.paymentStatus === "paid") {
    paymentStatusText = "Paid";
  } else if (order.paymentMethod === "pickup") {
    paymentStatusText = "Pay on pickup";
  } else if (order.paymentMethod === "delivery") {
    paymentStatusText = "Pay on delivery";
  }

  const whatsappMessage = `Hi Moments Nairobi, I would like to check on my order #${order.orderNumber}`;
  const whatsappUrl = generateWhatsAppLink(STORE_INFO.whatsappPhone, whatsappMessage);

  return (
    <div className="bg-[#F6F4F0] min-h-screen py-8 sm:py-16">
      <Container className="max-w-2xl mx-auto">
        <div className="bg-white border border-[#E4E0D8] rounded-[2px] p-6 sm:p-10 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2 pb-6 border-b border-[#E4E0D8]">
            <h1 className="text-2xl sm:text-3xl font-heading font-medium text-[#111111]">
              Order received
            </h1>
            <p className="text-xs text-[#6B6B66]">
              Order reference:{" "}
              <span className="font-mono font-medium text-[#111111]">
                #{order.orderNumber}
              </span>
            </p>
          </div>

          {/* Next Steps (3 lines max, specific to method) */}
          <div className="p-4 bg-[#F6F4F0] rounded-[2px] border border-[#E4E0D8] space-y-2">
            <h2 className="text-xs font-medium text-[#111111] uppercase tracking-wider">
              Next steps
            </h2>
            {order.deliveryMethod === "pickup" ? (
              <ul className="text-xs text-[#6B6B66] space-y-1 list-disc list-inside">
                <li>Ready in about 1 hour during store hours.</li>
                <li>Collect at Twilight Suites, 4th Floor, Shop F4-08, Tom Mboya Street.</li>
                <li>Bring your order reference number #{order.orderNumber}.</li>
              </ul>
            ) : (
              <ul className="text-xs text-[#6B6B66] space-y-1 list-disc list-inside">
                <li>Your order is queued for courier dispatch to {order.deliveryTown}.</li>
                <li>You will receive courier dispatch updates on {order.customerPhone}.</li>
                <li>Payment is confirmed upon parcel delivery handover.</li>
              </ul>
            )}
          </div>

          {/* Order Details Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs py-2 border-y border-[#E4E0D8]">
            <div>
              <p className="text-[#6B6B66]">Delivery method</p>
              <p className="font-medium text-[#111111] mt-0.5">
                {order.deliveryMethod === "pickup"
                  ? "CBD Pickup (Twilight Suites F4-08)"
                  : `Courier to ${order.deliveryTown}`}
              </p>
              {order.deliveryAddress && (
                <p className="text-[#6B6B66] mt-0.5">{order.deliveryAddress}</p>
              )}
            </div>

            <div>
              <p className="text-[#6B6B66]">Payment status</p>
              <p className="font-medium text-[#111111] mt-0.5">
                {paymentStatusText}
              </p>
              <p className="text-[#6B6B66] mt-0.5">
                Contact: {order.customerName} ({order.customerPhone})
              </p>
            </div>
          </div>

          {/* Items Summary */}
          <div className="space-y-4">
            <h2 className="text-sm font-medium text-[#111111]">Items ordered</h2>
            <div className="divide-y divide-[#E4E0D8]">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 aspect-[4/5] bg-[#EDEAE4] rounded-[2px] overflow-hidden shrink-0 border border-[#E4E0D8]">
                      <Image
                        src={item.image}
                        alt={cleanBrandName(item.name)}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-[#111111] truncate">
                        {cleanBrandName(item.name)}
                      </p>
                      <p className="text-[#6B6B66]">
                        {item.quantity}x
                        {item.color ? ` / ${item.color}` : ""}
                        {item.size ? ` / Size ${item.size}` : ""}
                      </p>
                    </div>
                  </div>

                  <Price
                    amount={item.price * item.quantity}
                    className="font-medium text-[#111111] shrink-0"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="pt-4 border-t border-[#E4E0D8] space-y-2 text-xs">
            <div className="flex justify-between text-[#6B6B66]">
              <span>Subtotal</span>
              <Price amount={order.subtotal} className="text-[#111111] font-medium" />
            </div>
            <div className="flex justify-between text-[#6B6B66]">
              <span>Delivery fee</span>
              <span className="text-[#111111]">
                {order.deliveryFee === 0
                  ? "Free"
                  : `KES ${order.deliveryFee.toLocaleString("en-KE")}`}
              </span>
            </div>
            <div className="pt-2 border-t border-[#E4E0D8] flex justify-between text-sm font-medium text-[#111111]">
              <span>Total</span>
              <Price amount={order.total} className="text-base font-medium text-[#111111]" />
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto h-[48px] px-6 rounded-[2px] border border-[#1FA855] text-[#1FA855] hover:bg-[#1FA855]/5 text-xs font-medium flex items-center justify-center transition-colors select-none"
            >
              Chat on WhatsApp about this order
            </a>

            <Link
              href="/shop"
              className="text-xs text-[#6B6B66] hover:text-[#111111] transition-colors underline underline-offset-4"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
