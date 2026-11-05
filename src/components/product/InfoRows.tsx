import React from "react";
import { POLICIES } from "@/config/policies";
import { cn } from "@/lib/utils";

export interface InfoRowsProps {
  className?: string;
}

export function InfoRows({ className }: InfoRowsProps) {
  return (
    <div
      className={cn(
        "border-y border-[#E4E0D8] divide-y divide-[#E4E0D8] text-xs leading-relaxed",
        className
      )}
    >
      <div className="py-3">
        <span className="font-medium text-[#111111]">Delivery:</span>{" "}
        <span className="text-[#6B6B66]">{POLICIES.delivery.summary}</span>
      </div>

      <div className="py-3">
        <span className="font-medium text-[#111111]">Pickup:</span>{" "}
        <span className="text-[#6B6B66]">{POLICIES.pickup.summary}</span>
      </div>

      <div className="py-3">
        <span className="font-medium text-[#111111]">Exchange:</span>{" "}
        <span className="text-[#6B6B66]">{POLICIES.exchange.summary}</span>
      </div>
    </div>
  );
}
