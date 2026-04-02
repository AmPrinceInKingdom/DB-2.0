import { getProductBySlug } from "@/lib/data/products";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function TestSingleProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  return (
    <div style={{ padding: 40 }}>
      <h1>Single Product Test</h1>
      <pre>{JSON.stringify(product, null, 2)}</pre>
    </div>
  );
}