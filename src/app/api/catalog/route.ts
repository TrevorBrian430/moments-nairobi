import { connection } from "next/server";
import { readStore } from "@/lib/store-db";
import { deliveryTowns } from "@/lib/delivery-fees";

export async function GET() {
  await connection();
  const { categories, products, deliveryFees } = readStore();
  return Response.json({ categories, products, towns: deliveryTowns(deliveryFees) }, {
    headers: { "Cache-Control": "no-store" },
  });
}
