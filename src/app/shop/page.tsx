import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
  }>;
};

export default async function ShopPage({ searchParams }: Props) {
  const { q = "", category = "", sort = "" } = await searchParams;

  const params = new URLSearchParams();

  if (q.trim()) {
    params.set("q", q.trim());
  }

  if (category.trim()) {
    params.set("category", category.trim());
  }

  if (sort.trim()) {
    params.set("sort", sort.trim());
  }

  const queryString = params.toString();

  redirect(queryString ? `/search?${queryString}` : "/search");
}