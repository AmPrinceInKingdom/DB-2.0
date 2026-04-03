import { getCategories } from "@/lib/data/categories";

export default async function TestCategoriesPage() {
  const categories = await getCategories();

  return (
    <div style={{ padding: 40 }}>
      <h1>Categories Test</h1>

      <pre>{JSON.stringify(categories, null, 2)}</pre>
    </div>
  );
}