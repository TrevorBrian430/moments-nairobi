export const STORE_INFO = {
  name: "Moments Nairobi",
  tagline: "Own Your Moment",
  description: "Men's Fashion • Bags • Accessories — Everyday fits. Every occasion.",
  phone: "0702947981",
  whatsappPhone: "254702947981",
  email: "info@momentsnairobi.co.ke",
  address: "Twilight Suites, 4th Floor, Shop 08, Tom Mboya Street",
  addressDetail: "Opposite Eastmart Supermarket, near the Fire Station",
  city: "Nairobi",
  country: "Kenya",
  instagram: "https://instagram.com/momentsnairobi",
  website: "https://momentsnairobi.co.ke",
} as const;

export const DELIVERY_ZONES = [
  { name: "Nairobi CBD", fee: 0, label: "Free" },
  { name: "Greater Nairobi", fee: 300, label: "KES 300" },
  { name: "Rest of Kenya", fee: 500, label: "KES 500" },
] as const;

export const CATEGORIES = [
  {
    id: "backpacks",
    name: "Backpacks",
    slug: "backpacks",
    image: "/images/bagpack 1.jpg",
    description: "Stylish & spacious backpacks for work, campus & travel",
  },
  {
    id: "crossbody-bags",
    name: "Crossbody Bags",
    slug: "crossbody-bags",
    image: "/images/crossbody-bag.jpg",
    description: "Compact & convenient for everyday essentials",
  },
  {
    id: "designer-bags",
    name: "Designer Bags",
    slug: "designer-bags",
    image: "/images/goyard-maroon.jpg",
    description: "Premium designer-style backpacks in multiple colours",
  },
  {
    id: "clothing",
    name: "Clothing",
    slug: "clothing",
    image: "/images/shacket-white.jpg",
    description: "T-shirts, jeans, shorts, jackets & more",
  },
  {
    id: "accessories",
    name: "Accessories",
    slug: "accessories",
    image: "/images/crossbody-bag 2.jpg",
    description: "Wallets, extras & everyday carry essentials",
  },
] as const;

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  salePrice?: number;
  description: string;
  features: string[];
  images: string[];
  colors?: { name: string; hex: string; image?: string }[];
  sizes?: string[];
  inStock: boolean;
  stockCount?: number;
  isFeatured: boolean;
  isNew: boolean;
};

export const PRODUCTS: Product[] = [
  // BACKPACKS
  {
    id: "everyday-backpack",
    name: "Everyday Backpack",
    slug: "everyday-backpack",
    category: "backpacks",
    price: 4500,
    description:
      "Spacious, stylish, durable and fits a 15-inch laptop. Perfect for work, campus and travel.",
    features: [
      "Fits up to a 15-inch laptop",
      "Spacious main compartment",
      "Durable construction",
      "Perfect for work, campus & travel",
      "Multiple pockets for organization",
    ],
    images: [
      "/images/bagpack 1.jpg",
      "/images/bagpack 2.jpg",
      "/images/bagpack 3.jpg",
    ],
    colors: [
      { name: "Black Monogram", hex: "#1a1a1a", image: "/images/bagpack 3.jpg" },
      { name: "Brown Monogram", hex: "#4a3728", image: "/images/bagpack 1.jpg" },
      { name: "Black Embossed", hex: "#0d0d0d", image: "/images/bagpack 2.jpg" },
    ],
    inStock: true,
    stockCount: 15,
    isFeatured: true,
    isNew: false,
  },
  {
    id: "designer-backpack-4000",
    name: "Designer Backpack",
    slug: "designer-backpack",
    category: "backpacks",
    price: 4000,
    description:
      "A backpack that stands out. Stylish, spacious and built to keep your essentials organized wherever the day takes you.",
    features: [
      "Fits up to a 15-inch laptop",
      "Stylish designer pattern",
      "Perfect for work, campus, travel & everyday use",
      "Spacious interior",
    ],
    images: [
      "/images/bagpack 1.jpg",
      "/images/bagpack 2.jpg",
      "/images/bagpack 3.jpg",
    ],
    colors: [
      { name: "Brown Monogram", hex: "#4a3728", image: "/images/bagpack 1.jpg" },
      { name: "Black Monogram", hex: "#1a1a1a", image: "/images/bagpack 3.jpg" },
      { name: "Black Embossed", hex: "#0d0d0d", image: "/images/bagpack 2.jpg" },
    ],
    inStock: true,
    stockCount: 10,
    isFeatured: false,
    isNew: true,
  },

  // CROSSBODY BAGS
  {
    id: "essentials-crossbody",
    name: "Essentials Crossbody Bag",
    slug: "essentials-crossbody-bag",
    category: "crossbody-bags",
    price: 2700,
    description:
      "Carry your essentials with ease! Perfect for your phone, keys, ID, passport and other everyday essentials. Compact, stylish and convenient for life on the go.",
    features: [
      "Compact & lightweight",
      "Fits phone, keys, ID & passport",
      "Adjustable strap",
      "Stylish embossed ESSENTIALS branding",
      "Perfect for life on the go",
    ],
    images: [
      "/images/crossbody-bag.jpg",
      "/images/crossbody-bag 2.jpg",
      "/images/crossbody-bag 3.jpg",
    ],
    colors: [
      { name: "Black", hex: "#1a1a1a", image: "/images/crossbody-bag.jpg" },
      { name: "Khaki", hex: "#c4a882", image: "/images/crossbody-bag 2.jpg" },
    ],
    inStock: true,
    stockCount: 20,
    isFeatured: true,
    isNew: false,
  },

  // DESIGNER BAGS (GOYARD STYLE)
  {
    id: "goyard-style-backpack",
    name: "Goyard-Style Backpack",
    slug: "goyard-style-backpack",
    category: "designer-bags",
    price: 4500,
    description:
      "Premium Goyard-style backpacks. Stylish & spacious, fits a 15-inch laptop. Perfect for work, campus & travel.",
    features: [
      "Stylish chevron pattern",
      "Fits a 15-inch laptop",
      "Premium materials",
      "Multiple colours available",
      "Top handle + shoulder straps",
    ],
    images: [
      "/images/goyard style blue.jpg",
      "/images/goyard-maroon.jpg",
      "/images/goyard style.jpg",
      "/images/goyard-black.jpg",
      "/images/goyard-grey.jpg",
      "/images/goyard-brown.jpg",
      "/images/goyard-blue-interior.jpg",
      "/images/goyard-maroon-interior.jpg",
      "/images/goyard-maroon-top.jpg",
      "/images/goyard-maroon-back.jpg",
    ],
    colors: [
      { name: "Green", hex: "#2d7d46", image: "/images/goyard style.jpg" },
      { name: "Blue", hex: "#1e56a0", image: "/images/goyard style blue.jpg" },
      { name: "Maroon", hex: "#8b3a4a", image: "/images/goyard-maroon.jpg" },
      { name: "Black", hex: "#2a2a2a", image: "/images/goyard-black.jpg" },
      { name: "Grey", hex: "#808080", image: "/images/goyard-grey.jpg" },
      { name: "Brown", hex: "#8b6914", image: "/images/goyard-brown.jpg" },
    ],
    inStock: true,
    stockCount: 25,
    isFeatured: true,
    isNew: true,
  },

  // CLOTHING
  {
    id: "wide-leg-jeans",
    name: "Wide Leg Jeans",
    slug: "wide-leg-jeans",
    category: "clothing",
    price: 2000,
    description: "Wide leg jeans for a relaxed, stylish fit.",
    features: [
      "Wide leg cut",
      "Comfortable fit",
      "Available in sizes 32-38",
    ],
    images: ["/images/shacket-white.jpg"],
    sizes: ["32", "34", "36", "38"],
    inStock: true,
    stockCount: 12,
    isFeatured: false,
    isNew: false,
  },
  {
    id: "graphic-tshirt",
    name: "Graphic T-Shirt",
    slug: "graphic-tshirt",
    category: "clothing",
    price: 1500,
    description:
      "Fresh designs, clean fits! Choose from a variety of designs.",
    features: [
      "Multiple designs available",
      "Sizes M-3XL",
      "Premium cotton",
      "Clean fit",
    ],
    images: ["/images/shacket-white.jpg"],
    sizes: ["M", "L", "XL", "2XL", "3XL"],
    inStock: true,
    stockCount: 8,
    isFeatured: true,
    isNew: false,
  },
  {
    id: "cropped-tee",
    name: "Cropped Tee",
    slug: "cropped-tee",
    category: "clothing",
    price: 1500,
    description: "Cropped tees for a modern, trendy look.",
    features: [
      "Cropped length",
      "Stylish fit",
      "Multiple designs",
    ],
    images: ["/images/shacket-white.jpg"],
    inStock: true,
    isFeatured: false,
    isNew: true,
  },
  {
    id: "tribal-shorts",
    name: "Tribal Shorts",
    slug: "tribal-shorts",
    category: "clothing",
    price: 1500,
    description:
      "Stand out without trying too hard. Perfect for the gym, vacation, road trips or chilling at home.",
    features: [
      "Unique tribal print",
      "Comfortable elastic waist",
      "Drawstring closure",
      "Breathable fabric",
    ],
    images: ["/images/shorts-tribal.jpg"],
    sizes: ["L", "XL"],
    inStock: true,
    stockCount: 6,
    isFeatured: false,
    isNew: false,
  },
  {
    id: "camo-cargo-shorts",
    name: "Camo Cargo Shorts",
    slug: "camo-cargo-shorts",
    category: "clothing",
    price: 1500,
    description: "Camo cargo shorts for a rugged, streetwear look.",
    features: [
      "Cargo pockets",
      "Camo print",
      "Durable material",
    ],
    images: ["/images/shorts-tribal.jpg"],
    inStock: true,
    isFeatured: false,
    isNew: true,
  },
  {
    id: "wide-leg-sweatpants",
    name: "Wide-Leg Sweatpants",
    slug: "wide-leg-sweatpants",
    category: "clothing",
    price: 1500,
    description: "Soft feel. Relaxed fit. Perfect for lounging or casual outings.",
    features: [
      "Wide-leg cut",
      "Soft & comfortable",
      "Relaxed fit",
    ],
    images: ["/images/shorts-tribal.jpg"],
    inStock: true,
    isFeatured: false,
    isNew: false,
  },
  {
    id: "shacket",
    name: "Shacket",
    slug: "shacket",
    category: "clothing",
    price: 3500,
    description:
      "Stay stylish and keep warm during the cold & rainy season. Limited pieces available.",
    features: [
      "Shirt-jacket hybrid",
      "Warm & stylish",
      "Perfect for cold weather",
    ],
    images: ["/images/shacket-white.jpg"],
    inStock: true,
    stockCount: 5,
    isFeatured: false,
    isNew: true,
  },
  {
    id: "comfort-shorts",
    name: "Comfort Shorts",
    slug: "comfort-shorts",
    category: "clothing",
    price: 1300,
    description:
      "Whether you're hitting the gym, going on vacation, taking a road trip, or just chilling at home — you need that extra comfort.",
    features: [
      "Ultra comfortable",
      "Breathable fabric",
      "Available in L & XL",
    ],
    images: ["/images/shorts-tribal.jpg"],
    sizes: ["L", "XL"],
    inStock: true,
    stockCount: 8,
    isFeatured: false,
    isNew: false,
  },

  // ACCESSORIES
  {
    id: "designer-wallet",
    name: "Designer Wallet",
    slug: "designer-wallet",
    category: "accessories",
    price: 1500,
    description:
      "Wide variety of designs to choose from. Stylish, practical & durable. Perfect gift for your boyfriend, husband, dad, brother or friend.",
    features: [
      "Wide variety of designs",
      "Stylish & practical",
      "Durable materials",
      "Perfect gift idea",
    ],
    images: ["/images/crossbody-bag 3.jpg"],
    inStock: true,
    stockCount: 30,
    isFeatured: true,
    isNew: false,
  },
];
