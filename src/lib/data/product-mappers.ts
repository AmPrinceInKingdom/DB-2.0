type ProductImage = {
  image_url: string;
  is_primary: boolean;
  sort_order: number;
} | null;

type Category = {
  name: string;
  slug: string;
} | null;

type RawProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_at_price: number | null;
  thumbnail_url: string | null;
  short_description: string | null;
  stock_quantity: number;
  is_featured: boolean;
  categories?: Category | Category[] | null;
  product_images?: ProductImage[] | null;
};

function formatPrice(value: number) {
  return `Rs. ${value.toLocaleString()}`;
}

function getPrimaryImage(product: RawProduct) {
  if (product.thumbnail_url) return product.thumbnail_url;

  if (!product.product_images || product.product_images.length === 0) {
    return "/images/placeholder-product.jpg";
  }

  const sorted = [...product.product_images].sort(
    (a, b) => Number(b?.is_primary) - Number(a?.is_primary) || a!.sort_order - b!.sort_order
  );

  return sorted[0]?.image_url || "/images/placeholder-product.jpg";
}

function getCategoryName(categories: RawProduct["categories"]) {
  if (!categories) return "General";

  if (Array.isArray(categories)) {
    return categories[0]?.name || "General";
  }

  return categories.name || "General";
}

export function mapProductForCard(product: RawProduct) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: formatPrice(product.price),
    oldPrice: product.compare_at_price ? formatPrice(product.compare_at_price) : undefined,
    image: getPrimaryImage(product),
    category: getCategoryName(product.categories),
    description: product.short_description || "",
    stockQuantity: product.stock_quantity,
    isFeatured: product.is_featured,
  };
}