import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "text";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  target?: string;
  rel?: string;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#BB4C6C] hover:bg-[#9A3E58] text-white border border-transparent shadow-none active:translate-y-[1px]",
  secondary:
    "bg-white hover:bg-[#F6F4F0] text-[#111111] border border-[#E4E0D8] shadow-none active:translate-y-[1px]",
  text:
    "bg-transparent text-[#111111] hover:text-[#BB4C6C] border-none underline-offset-4 hover:underline shadow-none",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "text-xs px-3.5 py-2 min-h-[44px]",
  md: "text-sm px-5 py-2.5 min-h-[44px]",
  lg: "text-base px-6 py-3 min-h-[48px]",
};

export const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      variant = "primary",
      size = "md",
      href,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = cn(
      "inline-flex items-center justify-center font-medium rounded-[2px] transition-all duration-200 ease-out select-none cursor-pointer touch-manipulation",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BB4C6C] focus-visible:ring-offset-2",
      "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
      variantStyles[variant],
      sizeStyles[size],
      fullWidth && "w-full",
      className
    );

    if (href && !disabled) {
      return (
        <Link
          href={href}
          className={baseClasses}
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        disabled={disabled}
        className={baseClasses}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
