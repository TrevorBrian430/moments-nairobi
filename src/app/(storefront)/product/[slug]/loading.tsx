import React from "react";
import { Container } from "@/components/ui/Container";

export default function ProductLoading() {
  return (
    <div className="bg-[#F6F4F0] min-h-screen py-6 sm:py-10 animate-pulse">
      <Container>
        {/* Breadcrumb skeleton */}
        <div className="h-4 w-48 bg-[#EDEAE4] rounded-[2px] mb-8" />

        {/* 12-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left 7 cols: Gallery skeleton */}
          <div className="lg:col-span-7 flex gap-4">
            <div className="hidden lg:flex flex-col gap-2.5 w-16 shrink-0">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-16 aspect-[4/5] bg-[#EDEAE4] rounded-[2px]"
                />
              ))}
            </div>
            <div className="flex-1 aspect-[4/5] bg-[#EDEAE4] rounded-[2px]" />
          </div>

          {/* Right 5 cols: Info column skeleton */}
          <div className="lg:col-span-5 space-y-6">
            <div className="h-3 w-20 bg-[#EDEAE4] rounded-[2px]" />
            <div className="h-8 w-3/4 bg-[#EDEAE4] rounded-[2px]" />
            <div className="h-6 w-28 bg-[#EDEAE4] rounded-[2px]" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-[#EDEAE4] rounded-[2px]" />
              <div className="h-3 w-4/5 bg-[#EDEAE4] rounded-[2px]" />
            </div>
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full bg-[#EDEAE4]"
                />
              ))}
            </div>
            <div className="h-[52px] w-full bg-[#EDEAE4] rounded-[2px]" />
            <div className="h-[48px] w-full bg-[#EDEAE4] rounded-[2px]" />
            <div className="space-y-3 pt-4 border-t border-[#E4E0D8]">
              <div className="h-3 w-full bg-[#EDEAE4] rounded-[2px]" />
              <div className="h-3 w-full bg-[#EDEAE4] rounded-[2px]" />
              <div className="h-3 w-full bg-[#EDEAE4] rounded-[2px]" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
