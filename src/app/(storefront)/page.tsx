import React from "react";
import Hero from "@/components/Hero";
import CategoryTiles from "@/components/CategoryTiles";
import NewArrivals from "@/components/NewArrivals";
import EditorialBand from "@/components/EditorialBand";
import SocialProof from "@/components/SocialProof";
import OfferLine from "@/components/OfferLine";
import StoreInfo from "@/components/StoreInfo";
import InstagramGrid from "@/components/InstagramGrid";

export default function HomePage() {
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      {/* 0. Hero Section (from Part 2) */}
      <Hero />

      {/* 1. Category Tiles (Asymmetric 12-column grid) */}
      <CategoryTiles />

      {/* 2. New Arrivals (4-column desktop, 2-column mobile product grid) */}
      <NewArrivals />

      {/* 3. Editorial Band (Full-width 560px product spotlight) */}
      <EditorialBand />

      {/* 4. Social Proof (Conditional: renders only with verified proof data) */}
      <SocialProof />

      {/* 5. First-Order Offer Line (Slim 48px off-white banner) */}
      <OfferLine />

      {/* 6. Store Info (2-column shop address & shared hours table) */}
      <StoreInfo />

      {/* 7. Instagram Grid (Conditional: renders only with 6+ real post images) */}
      <InstagramGrid />
    </div>
  );
}
