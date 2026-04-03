"use client";

import { useEffect, useState } from "react";
import { getProducts, type ProductRow } from "@/lib/supabase/products";

export default function ProductsTestPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      const { products, error } = await getProducts();

      if (error) {
        alert(error.message);
      } else {
        setProducts(products);
      }

      setLoading(false);
    };

    loadProducts();
  }, []);

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Products Test</h1>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="rounded border p-4">
              <h2 className="font-semibold">{product.title}</h2>
              <p className="text-sm text-zinc-500">{product.category}</p>
              <p>Rs {product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}