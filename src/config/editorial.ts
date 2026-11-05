export interface EditorialConfig {
  label: string;
  headline: string;
  copy: string;
  linkHref: string;
  linkText: string;
  src: string;
  alt: string;
  objectPosition: string;
}

export const EDITORIAL_CONFIG: EditorialConfig = {
  label: "Crossbody",
  headline: "Small bag. Phone, keys, passport.",
  copy: "Durable canvas construction with an adjustable nylon shoulder strap. Fits phones up to 6.8 inches, passport, and daily essentials.",
  linkHref: "/shop?category=crossbody-bags",
  linkText: "Shop crossbody bags",
  src: "/images/crossbody-bag 2.jpg",
  alt: "Neutral tone crossbody bag detail view",
  objectPosition: "center 45%",
};
