import { getAllActiveProducts } from "@/lib/data/products";

export default async function TestProductsPage() {
  const products = await getAllActiveProducts();

  return (
    <div style={{ padding: 40 }}>
      <h1>Products Test</h1>
      <pre>{JSON.stringify(products, null, 2)}</pre>
    </div>
  );
}