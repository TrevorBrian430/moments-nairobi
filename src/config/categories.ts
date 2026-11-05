export interface CategoryConfig {
  slug: string;
  label: string;
  src: string;
  alt: string;
  objectPosition: string;
}

export const CATEGORIES_CONFIG: CategoryConfig[] = [
  {
    slug: "backpacks",
    label: "Backpacks",
    src: "/images/bagpack 1.jpg",
    alt: "Structured monogram backpacks in brown and black",
    objectPosition: "center 40%",
  },
  {
    slug: "crossbody-bags",
    label: "Crossbody Bags",
    src: "/images/crossbody-bag.jpg",
    alt: "Compact black crossbody everyday carry bag",
    objectPosition: "center 40%",
  },
  {
    slug: "designer-bags",
    label: "Designer Bags",
    src: "/images/goyard-maroon.jpg",
    alt: "Chevron pattern backpack in maroon coated canvas",
    objectPosition: "center 45%",
  },
  {
    slug: "clothing",
    label: "Clothing",
    src: "/images/shacket-white.jpg",
    alt: "Textured white button-down streetwear shacket",
    objectPosition: "center 30%",
  },
  {
    slug: "accessories",
    label: "Accessories",
    src: "/images/crossbody-bag 3.jpg",
    alt: "Compact travel and everyday carry accessories",
    objectPosition: "center 45%",
  },
];
