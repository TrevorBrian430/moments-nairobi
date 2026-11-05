# Part 1 Redesign Changes: Design Tokens, Brand Assets, Header, and Footer

## 1. Accent & Color Sampling
- **Sampled Logo Mauve**: Sampled directly from `/public/images/logo.png` pixel data.
  - Primary Logo Mauve (`--accent`, `--color-accent`): **`#BB4C6C`** (exact dominant non-background pixel mode).
  - Hover / Dark Mauve: `#9A3E58`
  - Subtle Mauve Tint: `#CF6885`
  - *Previous value was `#B85C6E`, which has now been updated to match the exact sampled `#BB4C6C`.*
- **WhatsApp Green**: **`#1FA855`** (muted green as specified; replacing previous neon `#25D366`).
- **Core Neutral Tokens**:
  - Background: `#F6F4F0`
  - Surface: `#FFFFFF`
  - Ink: `#111111`
  - Muted: `#6B6B66`
  - Hairline: `#E4E0D8`
  - Dark Sections: `#111111`

## 2. Brand Assets Created (`/public/brand/`)
Generated clean, transparent-background SVG vectors directly from the original raster logo:
- `/public/brand/logo-full.svg`: Full lockup (mauve rounded-square mark with negative-space "M" cutout + wide squared "MOMENTS" wordmark in `#BB4C6C`).
- `/public/brand/logo-mark.svg`: Mauve rounded-square mark with negative-space "M" cutout only (used on mobile header).
- `/public/brand/logo-full-white.svg`: Reversed full lockup in `#FFFFFF` with transparent background (no white container box) for dark sections such as the footer.

## 3. What Was Removed
- **Watermark**: Removed the giant faded "MOMENTS" background watermark from the footer.
- **Payment Pills**: Removed the pulsing green badge and payment pill buttons from the footer bottom bar; replaced with a single calm text line: `"M-Pesa and card accepted"`.
- **Generic Slogans**: Removed "Own Your Moment" slogan from layout titles, openGraph descriptions, and footer brand text.
- **Em Dashes (`—`)**: Removed all em dashes from layout copy, store info, metadata, and footer text.
- **Trademark/Brand Names in Copy**: Cleaned metadata keywords and customer-facing tags to ensure no third-party brand names (e.g. Goyard, Louis Vuitton) appear in customer-facing copy or alt text.
- **Header WhatsApp Link**: Removed the standalone WhatsApp chat icon from the desktop and mobile header bars (kept strictly in the Floating WhatsApp button and product page actions).
- **Announcement Bar Clutter**: Removed emojis (truck, bullets) and green phone link from the announcement bar; simplified to a single 36px plain-text line: `"Free pickup in Nairobi CBD. Nationwide delivery."`.
- **CSS Marquees and Pulsing**: Removed `@keyframes marquee` and pulsing animations.
- **Excessive Radii & Shadows**: Removed `rounded-2xl`, `rounded-3xl`, `rounded-xl`, and default drop shadows across header, buttons, inputs, and footer. Strict 2px radius applied (`rounded-[2px]`); 999px radius is restricted exclusively to the cart count badge.

## 4. What Was Assumed & Resolved
- **Sunday Store Hours Conflict**:
  - Previously, the header stated *"Sunday: Available on Call / WhatsApp"* while the footer stated *"Sunday: 11:00 AM - 5:00 PM"*.
  - **Resolution**: Selected **`Sunday: Available on Call / WhatsApp`** unified across the codebase in `STORE_HOURS` (`src/lib/constants.ts`). Twilight Suites F4-08 is a physical 4th-floor shop where Sunday access and pickups are managed via WhatsApp / on-call coordination.
- **Typography Tokens**:
  - Headings: `Inter_Tight` (weight 500, sentence case, normal tracking, large and calm).
  - Body: `Inter` (weight 400).
  - Small Uppercase Labels: 11px with `0.12em` tracking (`text-[11px] uppercase tracking-[0.12em]`).
  - Active Nav Links: 13px uppercase with `0.08em` tracking (`text-[13px] uppercase tracking-[0.08em] font-medium`) and a 1px accent underline on the active route.
- **Dev Hygiene**:
  - Disabled Next.js dev indicator overlay in `next.config.ts` (`devIndicators: false`) and added CSS fallback suppressions.
  - Ensured all interactive touch targets meet or exceed 44px min-height/min-width.
  - Ensured minimum 4.5:1 WCAG contrast across ink, muted, hairline, and reversed footer texts.

## 5. Primitives Created (`src/components/ui/`)
- `Button`: Primary (accent `#BB4C6C`), Secondary (white outline with `#E4E0D8` hairline border), and Text variants. 2px radius, 44px min touch target, 200ms ease-out transitions.
- `Container`: Max width 1280px with 8px-scale responsive padding (`px-4 sm:px-6 lg:px-8`).
- `SectionLabel`: 11px uppercase label with `0.12em` tracking in `#6B6B66`.
- `Price`: Clean KES currency formatting with optional accent emphasis.


# Part 2 Redesign Changes: Homepage Hero Section

## 1. What Was Removed
- **Full-Bleed Photo & Dark Overlays**: Removed the full-bleed background image and heavy dark/gradient overlays (`bg-gradient-to-t`, `md:bg-gradient-to-r`). Replaced with a calm split layout on the neutral `--background` (`#F6F4F0`) token without gradient, overlay, or pattern.
- **Pill Badge**: Removed the rounded pill badge (`bg-white/10` with pulsing dot).
- **Two-Line Slogan**: Removed "Everyday Fits. Every Occasion." in favor of a calm, factual h1: "Backpacks that fit a 15-inch laptop."
- **Multiple Buttons & Duplicate WhatsApp CTA**: Removed the secondary "Order via WhatsApp" button from the hero (covered globally by FloatingWhatsApp). Left exactly one primary CTA button and one clean text link.
- **Clutter**: Excluded all star ratings, sparkle icons, emojis, countdown timers, marquees, and trust strips from the hero section.

## 2. Layout & Responsive Architecture
- **Desktop (>= 1024px)**:
  - 12-column split grid inside `Container` (`max-w-[1280px]`).
  - Left 5 columns: vertically centered, left-aligned text block.
  - Right 7 columns: image panel bleeding edge to edge to the right viewport edge (`hero-desktop-bleed` with `calc(50% - 50vw)` right margin) while its left edge aligns directly to column 6.
  - Strict min height 640px, max height 760px. 2px radius on image panel.
- **Mobile (< 1024px)**:
  - Stacked vertically: image first with `aspect-[4/5]`, full width, 0px radius (`rounded-none`).
  - Text block placed directly below with 24px side padding (`px-6`).
  - Headline clamp lower bound set to 36px.
  - Primary button set to full width (`w-full sm:w-auto`), with "Browse everything" text link cleanly centered beneath it.

## 3. Configuration & Content
- **Config File (`src/config/hero.ts`)**:
  - Created central config exporting `{ src, alt, objectPosition }`.
  - Added TODO comment requesting a dedicated studio cutout on `#EDEAE4` / neutral light grey.
  - Selected `/images/bagpack 2.jpg` cropped tightly via `objectPosition: "center 45%"` to avoid busy background.
  - Neutral alt text: `"Black embossed backpack, front view"` (zero third-party brand names).
- **Hierarchy & Primitives**:
  - Label: `SectionLabel` plain text ("Nairobi CBD, Tom Mboya Street").
  - Heading (h1): `Inter_Tight 500`, `clamp(36px, 5vw, 72px)`, line-height 1.05, tracking -0.02em, ink color.
  - Copy: 17px muted paragraph.
  - Primary CTA: `Button` primitive (accent `#BB4C6C`, 48px min height).
  - Secondary CTA: Clean text link ("Browse everything").
  - Sub-line: 13px muted line ("Pickup at Twilight Suites F4-08. Courier countrywide.").

## 4. Motion & Performance
- **On-Load Motion**: 400ms 12px text fade up (`hero-fade-up`) and 500ms image fade in (`hero-fade-in`).
- **Accessibility**: Automatically disabled for users with `prefers-reduced-motion: reduce`.
- **LCP & SEO**: `priority` image loading with `sizes="(min-width: 1024px) 58vw, 100vw"`, quality 85, fallback background `#EDEAE4` to eliminate layout shift, and exactly one `<h1>`.
