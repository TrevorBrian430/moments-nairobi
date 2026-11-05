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


# Part 3 Redesign Changes: Homepage Sections Below the Hero

## 1. What Was Removed Entirely
- **Marquee Ticker**: Removed the continuous scrolling text banner (`MarqueeBanner`).
- **Trust Strip**: Removed the 4-card banner with pastel rounded icon squares (`Delivery Countrywide`, `Physical Shop`, `WhatsApp Orders`, `100% Quality Fits`).
- **Sparkle Icons & Badges**: Removed all emoji/sparkle badges (`HOT ITEM • GOYARD PATTERN`, `NEW DROP` badges across every item).
- **Category Circle Avatars**: Removed the Instagram-story-style circle row (`CategoryCircles`).
- **Dark Editorial Cards**: Removed the heavy black lookbook card (`EditorialStory`) and dark "Goyard-Style Luxury Backpack" spotlight card.
- **Pink Promo Banner**: Removed the gradient pink banner (`PromoBar`).
- **Placeholder Testimonials**: Removed the "Happy Clients" card trio with placeholder quotes (`Testimonials`).
- **Filter Pills from Home**: Removed category filter tabs from the homepage product view (moved exclusively to `/shop`).

## 2. Sections Rebuilt (In Strict Specified Order)
1. **Category Tiles (`CategoryTiles.tsx`)**:
   - Asymmetric 12-column grid.
   - Backpacks: Tall tile (5 columns, aspect 4:5).
   - Crossbody Bags & Designer Bags: Two stacked tiles (7 columns, each aspect 16:9).
   - Clothing & Accessories: Two equal tiles below (6 columns each, aspect 3:2).
   - Image zooms 1.03x over 300ms on hover.
   - Category name and real item count rendered strictly **below** the image (no overlays, no gradients, no paragraphs).
   - Configured via `src/config/categories.ts`.
2. **New Arrivals (`NewArrivals.tsx` & `ProductCard.tsx`)**:
   - Shared `SectionHeader` with title "New arrivals" and text link "View all".
   - 4-column grid on desktop, 2-column grid on mobile (gap 24px desktop / 16px mobile).
   - Shows at most 8 items, strictly trimmed to multiples of 4 so rows are complete on both desktop and mobile without any orphan cards.
   - Built shared `ProductCard`:
     - 4:5 image on `#EDEAE4` with 2px radius.
     - On desktop hover: swaps to second product image if available, and displays desktop "Quick add" button at image bottom.
     - On mobile tap: navigates directly to `/product/[slug]`.
     - 14px name, 14px price formatted in KES using `Price` primitive.
     - 12px color swatches only when variants exist.
     - "New" tag rendered top-left **only** if product `createdAt` is under 14 days old (never on every item).
3. **Editorial Band (`EditorialBand.tsx`)**:
   - 560px tall desktop band with full-width image.
   - Solid off-white panel (`bg-[var(--color-background)]`) cleanly overlapping the image's left edge without any dark overlay on the photo.
   - Real specs: "Durable canvas construction with an adjustable nylon shoulder strap. Fits phones up to 6.8 inches, passport, and daily essentials."
   - Configured via `src/config/editorial.ts`.
4. **Social Proof (`SocialProof.tsx`) — CONDITIONAL**:
   - *Status*: **Hidden** due to missing verified data.
   - *Reason*: `/public/proof/` does not exist in the workspace, and no real customer review records exist in the database. Per instructions, placeholder testimonials were not generated.
5. **First-Order Offer Line (`OfferLine.tsx`)**:
   - Slim 48px off-white banner with hairline borders top and bottom.
   - Clean accent text: "First order? Get 10% off when you order on WhatsApp." with "Message us" WhatsApp link.
   - Controlled via `src/config/offers.ts` (`offers.firstOrder.enabled: true`).
6. **Store Info (`StoreInfo.tsx`)**:
   - Two columns inside `Container` with vertical hairline divider.
   - Left column: h2 "Visit the shop", factual address, phone link, and clean text links ("Open in Google Maps", "Chat on WhatsApp").
   - Right column: Clean two-column table of store hours pulling from the **same** `STORE_HOURS` constant as Part 1, ensuring 100% synchronization with the footer.
7. **Instagram Grid (`InstagramGrid.tsx`) — CONDITIONAL**:
   - *Status*: **Hidden** due to missing images.
   - *Reason*: `/public/instagram/` contains 0 images (fewer than the required 6) and no active external feed integration exists.

## 3. Configuration Files Created
- `src/config/categories.ts`: Category tile slugs, labels, image sources, neutral alt text, and object positions.
- `src/config/editorial.ts`: Editorial band headlines, copy, links, and product photo settings.
- `src/config/offers.ts`: Promotional offer copy, WhatsApp phone, default message, and enabled toggle.


# Part 4 Redesign Changes: Shop Listing and Category Views (/shop)

## 1. Step 0 Audit: Previous Filter, Sort, and Category Behavior
- **Previous Category Selection**: Relied solely on local component state initialized once from query parameters. Clicking category pills did not synchronize with the URL, preventing shareable category links and breaking browser back/forward navigation.
- **Previous Sorting**: Kept entirely in local React state (`useState`) without query parameter tracking.
- **Previous Price Filtering**: Single slider input (`KES 1,000` to `KES 6,000`) without explicit min/max inputs or presets.
- **Removed Elements**:
  - Horizontal pill category filter row.
  - "Trending Essentials For You" headings and marketing copy.
  - Star ratings, heart/wishlist buttons, green WhatsApp bubble buttons on images, and always-visible Add buttons.
  - "NEW DROP" badges from every card.
  - "Popular" sort option (removed as no real sales volume metric exists).
  - Trademark brand names in suggestion tags (e.g. removed "Goyard" from search suggestions).

## 2. Page Structure & Components Created
- **`ShopPage` (`src/app/(storefront)/shop/page.tsx`)**:
  - Breadcrumb navigation (`Home / Shop` or `Home / Shop / [Category Name]`).
  - H1 with category name or "All products" and factual result count ("24 products").
  - Sticky toolbar with active filter chips, mobile "Filters" trigger button, and native sort selector.
  - Responsive two-column desktop layout: 260px sticky left filter rail and right product grid (3 cols at 1024px–1279px, 4 cols at ≥ 1280px, 2 cols on mobile).
  - Clean pagination in steps of 12 items with "Showing X of Y" and "Load more" button. Zero orphan rows on incomplete pages.
- **`FilterRail` (`src/components/shop/FilterRail.tsx`)**:
  - Sticky at `top-[136px]`, 260px wide.
  - Accordions open by default:
    - *Category*: List with real item counts; active category marked by 2px accent left bar and 500 font weight.
    - *Price*: Two number inputs with KES prefix for min/max prices (applied on blur or Enter) + preset list ("Under 2,000", "2,000 to 4,000", "Above 4,000").
    - *Color*: 20px circular swatches with visible selected rings, tooltips, and multi-select support.
    - *Size*: Multi-select buttons for sizes present in product data (e.g. 32–38, M–3XL).
  - Top "Clear all" link visible only when filters are active.
- **`FilterDrawer` (`src/components/shop/FilterDrawer.tsx`)**:
  - Mobile bottom sheet modal drawer opened by the toolbar "Filters" button with active count badge.
  - Accessible dialog (`role="dialog"`, `aria-modal="true"`, Escape key dismissal, body scroll lock).
  - Sticky Apply and Clear buttons at the bottom.
- **`SortSelect` (`src/components/shop/SortSelect.tsx`)**:
  - Native select with options: "Newest", "Price: low to high", "Price: high to low".
- **`ActiveFilterChips` (`src/components/shop/ActiveFilterChips.tsx`)**:
  - Individual removable chips for category, price range, color, and size with 2px radius and hairline borders. Horizontally scrollable on mobile.
- **`ProductGridSkeleton` (`src/components/shop/ProductGridSkeleton.tsx`)**:
  - 12 skeleton cards (4:5 ratio, `#EDEAE4`, slow 1.5s pulse, no layout shift).
- **`EmptyState` (`src/components/shop/EmptyState.tsx`)**:
  - Factual single line "No products match these filters.", "Clear filters" action, and 4 suggested products from the catalog (no illustrations).
- **`URL Param Helpers` (`src/lib/shop-params.ts`)**:
  - Synchronizes all filters and sort parameters into query strings (`?category=...&min=...&max=...&color=...&size=...&sort=...`).
  - Employs `router.replace(url, { scroll: false })` to eliminate history clutter and maintain scroll stability.


# Part 5 Redesign Changes: Product Details Page (/product/[slug])

## 1. Step 0 Data Audit: Field Availability & Missing Data Handling
- **Existing Fields in Data (`Product` / `PRODUCTS`)**:
  - `id`, `name`, `slug`, `category`, `price`, `salePrice` (optional), `description`, `images`, `colors` (name, hex, optional image), `sizes` (on select apparel), `inStock`, `stockCount` (optional), `isFeatured`, `isNew`.
- **Missing Fields (Not Present in Data)**:
  - `createdAt`: Not tracked on product data objects.
  - `reviews` / `rating`: No review data, ratings, or feedback counts exist in data. Previously, a fake 5.0 rating and fake "48 reviews" were hardcoded in the client component.
  - `material`: No structured material property exists (only mentioned sporadically in unstructured feature bullet points).
  - `dimensions`: No dimension data exists on products.
  - `laptopSize`: No structured laptop sizing property exists (only mentioned in unstructured feature bullets for backpacks).
- **UI Hidden Due to Missing Data**:
  - Removed the fake 5-star rating line and "48 reviews".
  - Structured spec list in Details accordion only renders rows where data actually exists (color options, available sizes, laptop size if mentioned in features, closure/strap if mentioned). Missing dimension and material rows are skipped.
  - Removed `aggregateRating` from Product JSON-LD schema (schema only includes valid brand, price, currency, availability, and description).
- **TODO on Generic Product Names**:
  - Catalog contains generic titles such as `"Designer Backpack"` (`designer-backpack`) and `"Everyday Backpack"`.
  - **TODO**: In future catalog content updates, replace generic titles with descriptive, distinctive model names (e.g. *"Chevron Pattern Commuter Backpack"*, *"Monogram Embossed Laptop Backpack"*). Per instructions, existing data names were preserved.

## 2. What Was Removed Entirely
- **"Limited Time Drop" Scarcity Box**: Removed fake countdown timer (`hours:minutes:seconds`), fake "Only 3 items left in shop", fake "14 people viewing", and gradient inventory progress meter.
- **Badges & Pills**: Removed "Popular in Nairobi" badge and "New Release" pill badge over product images.
- **Fake Social Proof**: Removed 5-star rating line and "(48 reviews)".
- **"Buy Now" Button**: Removed "Buy Now" to establish a single clear primary CTA ("Add to cart").
- **Styling Anti-Patterns**: Removed tinted delivery box, rounded image frame (`rounded-2xl`, `rounded-3xl`), and rounded thumbnails (`rounded-xl`). Applied strict 2px radius (`rounded-[2px]`).
- **"WhatsApp Order FAQ" Tab**: Removed redundant FAQ tab.
- **Unsubstantiated Copy**: Removed unverified marketing claims ("water-resistant canvas", "heavy-duty zips", "reinforced straps", "Gunmetal Zippers") and duplicate bullets.
- **Em Dashes (`—`)**: Removed all em dashes from page copy and metadata.
- **Third-Party Brand Names**: Removed all mentions of third-party luxury brands (Louis Vuitton, Goyard) in customer-facing titles, alt text, descriptions, structured data, and WhatsApp order messages; replaced with neutral descriptors ("monogram print", "chevron print").

## 3. Bugs Fixed
- **Cart Thumbnail Bug**: When adding a variant (such as Brown Monogram), the cart could receive an incorrect image (e.g. the grey interior image). Fixed by adding `variantId`, `variantLabel`, and `variantImage` to `CartItem` and ensuring the add-to-cart payload assigns `image: selectedVariantImage || chosenImage`.
- **Mobile Touch Interactivity**: Fixed non-clickable thumbnails and buttons on mobile by removing restrictive pointer-event locks and overflow cutoffs.
- **Header Cart Badge Quantity Sync**: Ensured that adding multiple items immediately increments the cart badge by the total added item quantity (via Zustand `totalItems`).

## 4. Components & Architecture Created
- **`src/config/policies.ts`**:
  - Central source of truth for store policies: Delivery ("Free in Nairobi CBD. Courier countrywide KES 300 to 500."), Pickup ("Twilight Suites, 4th Floor, Shop F4-08, Tom Mboya Street. Ready within 1 hour." with store hours), and Exchange ("48-hour exchange for size or color swap with tags attached and receipt.").
- **`Gallery` (`src/components/product/Gallery.tsx`)**:
  - Desktop: Vertical 64px thumbnail strip on the left (4:5 ratio, 2px radius, hairline border, selected ink border) and large 4:5 image on the right (`#EDEAE4` fallback background, 2px radius). Keyboard arrow navigation and preloading of the next image.
  - Variant image switching: Selecting a color automatically jumps the gallery to that variant's image without breaking if no image is defined.
  - Mobile: Full-width horizontal swipe carousel with scroll-snap, dot indicators, and mobile-only "1 / N" counter.
- **`Lightbox` (`src/components/product/Lightbox.tsx`)**:
  - Accessible fullscreen image modal with zoom in/out, Escape key dismissal, keyboard arrow navigation, and focus trap.
- **`VariantSelector` (`src/components/product/VariantSelector.tsx`)**:
  - Color swatches: 24px circles with visible ink selection rings, hover labels, and `aria-pressed` states. Out-of-stock variants disabled and crossed out.
  - Size selector: 44px touch target buttons, rendered only if size data exists on the product.
- **`QuantityStepper` (`src/components/product/QuantityStepper.tsx`)**:
  - 44px height, 2px radius, hairline border with min 1 and max = stock count.
- **`AddToCart` (`src/components/product/AddToCart.tsx`)**:
  - 52px accent button (`#BB4C6C`). Shows inline "Added. View cart" state for 3 seconds on success. Disabled "Sold out" state when out of stock.
- **`WhatsAppOrderButton` (`src/components/product/WhatsAppOrderButton.tsx`)**:
  - 48px outlined `#1FA855` button. Prefilled message includes clean product name, selected color, quantity, total price, and page URL. Automatically changes to "Ask about restock" if item is out of stock.
- **`InfoRows` (`src/components/product/InfoRows.tsx`)**:
  - Hairline separated plain text rows for Delivery, Pickup, and Exchange sourced from `src/config/policies.ts`. No box, no icons.
- **`DetailsAccordion` (`src/components/product/DetailsAccordion.tsx`)**:
  - 200ms ease-out accordion with Details (description + 2-column real spec list), Materials and fit, Delivery and pickup (pickup address, store hours, and 3-step WhatsApp guide), and Exchange. First item open on desktop, all closed on mobile.
- **`RelatedProducts` (`src/components/product/RelatedProducts.tsx`)**:
  - "More in [category]" using shared `ProductCard`. Displays up to 4 distinct products in the same category excluding the current product and any product sharing the same primary image. Hidden completely if fewer than 2 qualify.
- **`StickyMobileBar` (`src/components/product/StickyMobileBar.tsx`)**:
  - 56px off-white bottom bar (`#F6F4F0`) with hairline top border, price, and Add to cart button. Appears on mobile via `IntersectionObserver` when the main Add to Cart button scrolls out of view.
- **`ProductJsonLd` (`src/components/product/ProductJsonLd.tsx`)**:
  - Valid schema.org `Product` structured data with clean brand ("Moments Nairobi"), KES currency, and stock availability.
- **`ProductPage` (`src/app/(storefront)/product/[slug]/page.tsx`)**:
  - Server-rendered page with dynamic metadata, canonical URL, and clean 404 handling via `notFound()`.
- **States & Performance**:
  - `not-found.tsx`: Clean 404 state with "Return to shop" action.
  - `loading.tsx`: Zero-layout-shift skeleton for gallery and info column.

