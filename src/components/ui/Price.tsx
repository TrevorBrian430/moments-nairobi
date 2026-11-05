import React from "react";
import { cn } from "@/lib/utils";

export interface PriceProps extends React.HTMLAttributes<HTMLSpanElement> {
  amount: number;
  originalAmount?: number;
  accent?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses: Record<"sm" | "md" | "lg" | "xl", string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base font-medium",
  xl: "text-lg sm:text-xl font-medium",
};

export function Price({
  amount,
  originalAmount,
  accent = false,
  size = "md",
  className,
  ...props
}: PriceProps) {
  const formattedCurrent = `KES ${amount.toLocaleString("en-KE")}`;
  const formattedOriginal = originalAmount
    ? `KES ${originalAmount.toLocaleString("en-KE")}`
    : null;

  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-2 whitespace-nowrap",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "tracking-tight",
          accent ? "text-[#BB4C6C] font-semibold" : "text-[#111111]"
        )}
      >
        {formattedCurrent}
      </span>
      {formattedOriginal && (
        <span className="text-xs text-[#6B6B66] line-through font-normal">
          {formattedOriginal}
        </span>
      )}
    </span>
  );
}

export default Price;
