import { POLICIES } from "@/config/policies";

export function deliveryTowns(fees?: Record<string, number>) {
  return POLICIES.delivery.towns.map((town) => ({ ...town, fee: fees?.[town.name] ?? town.fee }));
}
