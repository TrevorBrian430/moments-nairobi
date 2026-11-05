import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function ProductNotFound() {
  return (
    <div className="bg-[#F6F4F0] min-h-[60vh] flex items-center justify-center py-24">
      <Container className="text-center space-y-4 max-w-md mx-auto">
        <h1 className="text-xl sm:text-2xl font-heading font-medium text-[#111111]">
          Product not found
        </h1>
        <p className="text-sm text-[#6B6B66]">
          The product you are looking for does not exist or has been removed.
        </p>
        <div className="pt-2">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center h-[44px] px-6 rounded-[2px] bg-[#BB4C6C] text-white text-sm font-medium hover:bg-[#9A3E58] transition-colors"
          >
            Return to shop
          </Link>
        </div>
      </Container>
    </div>
  );
}
