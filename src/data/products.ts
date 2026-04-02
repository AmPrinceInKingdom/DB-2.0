export type Product = {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  description: string;
  discount?: string;
  featured?: boolean;
  flashDeal?: boolean;
};

export const products: Product[] = [
  {
    id: 1,
    slug: "wireless-headphones",
    name: "Wireless Headphones",
    category: "Electronics",
    price: 12500,
    oldPrice: 15900,
    image: "🎧",
    description:
      "Comfortable wireless headphones with deep bass, long battery life, and a modern design for daily listening.",
    discount: "-21%",
    featured: true,
    flashDeal: true,
  },
  {
    id: 2,
    slug: "smart-watch-pro",
    name: "Smart Watch Pro",
    category: "Wearables",
    price: 18900,
    oldPrice: 22900,
    image: "⌚",
    description:
      "Track your daily activity, heart rate, and notifications with this clean and stylish smart watch.",
    discount: "-17%",
    featured: true,
    flashDeal: false,
  },
  {
    id: 3,
    slug: "gaming-mouse-rgb",
    name: "Gaming Mouse RGB",
    category: "Gaming",
    price: 6500,
    oldPrice: 7900,
    image: "🖱️",
    description:
      "Responsive RGB gaming mouse with ergonomic grip and fast tracking for better performance.",
    discount: "-18%",
    featured: true,
    flashDeal: true,
  },
  {
    id: 4,
    slug: "premium-backpack",
    name: "Premium Backpack",
    category: "Fashion",
    price: 7200,
    oldPrice: 8900,
    image: "🎒",
    description:
      "Durable backpack with multiple compartments, ideal for school, travel, and daily carry.",
    discount: "-19%",
    featured: false,
    flashDeal: false,
  },
  {
    id: 5,
    slug: "bluetooth-speaker-mini",
    name: "Bluetooth Speaker Mini",
    category: "Audio",
    price: 8400,
    oldPrice: 9900,
    image: "🔊",
    description:
      "Portable Bluetooth speaker with punchy sound, simple controls, and a compact body.",
    discount: "-15%",
    featured: true,
    flashDeal: true,
  },
  {
    id: 6,
    slug: "sports-water-bottle",
    name: "Sports Water Bottle",
    category: "Lifestyle",
    price: 2200,
    oldPrice: 2900,
    image: "🥤",
    description:
      "Leak-resistant reusable bottle for gym, school, sports, and outdoor activities.",
    discount: "-24%",
    featured: false,
    flashDeal: false,
  },
  {
    id: 7,
    slug: "phone-holder-stand",
    name: "Phone Holder Stand",
    category: "Accessories",
    price: 1800,
    oldPrice: 2400,
    image: "📱",
    description:
      "Simple adjustable stand for mobile phones, perfect for desk use and video watching.",
    discount: "-25%",
    featured: false,
    flashDeal: true,
  },
  {
    id: 8,
    slug: "mechanical-keyboard",
    name: "Mechanical Keyboard",
    category: "Computers",
    price: 14500,
    oldPrice: 17200,
    image: "⌨️",
    description:
      "Tactile mechanical keyboard with durable switches, modern styling, and comfortable typing feel.",
    discount: "-16%",
    featured: true,
    flashDeal: false,
  },
];

export function getAllProducts() {
  return products;
}

export function getFeaturedProducts() {
  return products.filter((product) => product.featured);
}

export function getFlashDealProducts() {
  return products.filter((product) => product.flashDeal);
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getRelatedProducts(category: string, currentSlug: string) {
  return products.filter(
    (product) => product.category === category && product.slug !== currentSlug
  );
}