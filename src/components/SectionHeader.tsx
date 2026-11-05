import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  title: string;
  label?: string;
  subtitle?: string;
  link?: {
    href: string;
    label: string;
  };
  className?: string;
}

export function SectionHeader({
  title,
  label,
  subtitle,
  link,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-8 sm:mb-10",
        className
      )}
    >
      <div className="space-y-1">
        {label && <SectionLabel className="mb-2 block">{label}</SectionLabel>}
        <h2 className="font-heading font-medium text-[clamp(28px,3vw,40px)] leading-tight tracking-[-0.02em] text-[var(--color-ink)]">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs sm:text-sm text-[var(--color-muted)] leading-relaxed pt-1">
            {subtitle}
          </p>
        )}
      </div>

      {link && (
        <Link
          href={link.href}
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-ink)] hover:text-[var(--color-accent)] underline-offset-4 hover:underline transition-colors shrink-0 py-1 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        >
          <span>{link.label}</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}

export default SectionHeader;
