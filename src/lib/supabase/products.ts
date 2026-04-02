import { supabase } from "@/lib/supabase/client";

export type ProductRow = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  compare_price: number | null;
  image_url: string | null;
  category: string | null;
  seller_id: string | null;
  is_active: boolean;
  created_at: string;
};

export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return {
    products: (data as ProductRow[] | null) ?? [],
    error,
  };
}

export async function createProduct(product: {
  title: string;
  description?: string;
  price: number;
  compare_price?: number | null;
  image_url?: string;
  category?: string;
  seller_id: string;
}) {
  const { data, error } = await supabase
    .from("products")
    .insert({
      title: product.title,
      description: product.description ?? null,
      price: product.price,
      compare_price: product.compare_price ?? null,
      image_url: product.image_url ?? null,
      category: product.category ?? null,
      seller_id: product.seller_id,
      is_active: true,
    })
    .select()
    .limit(1);

  return {
    product: data?.[0] ?? null,
    error,
  };
}