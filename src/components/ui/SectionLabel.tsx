import React from "react";
import { cn } from "@/lib/utils";

export interface SectionLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  as?: "span" | "p" | "h2" | "h3" | "div";
}

export function SectionLabel({
  as: Component = "span",
  className,
  children,
  ...props
}: SectionLabelProps) {
  return (
    <Component
      className={cn(
        "inline-block text-[11px] uppercase tracking-[0.12em] font-medium text-[#6B6B66] select-none",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export default SectionLabel;
