import React from "react";

/**
 * Social proof component.
 * Renders customer screenshots from /public/proof/ or real verified reviews.
 * If no verified proof assets or real review records exist, returns null.
 */
export default function SocialProof() {
  // Missing data check: /public/proof/ does not exist in workspace.
  // We do not render placeholder reviews or generated testimonials.
  const hasProofData = false;

  if (!hasProofData) {
    return null;
  }

  return null;
}
