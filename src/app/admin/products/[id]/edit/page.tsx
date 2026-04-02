import { Images, PencilLine } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import AdminEditProductForm from "@/components/admin/AdminEditProductForm";
import AddProductImageForm from "@/components/admin/AddProductImageForm";
import DeleteProductImageButton from "@/components/admin/DeleteProductImageButton";
import ProductImageSortForm from "@/components/admin/ProductImageSortForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminEditProductPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  // Load the authenticated user.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Stop here if the user is not logged in.
  if (!user) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-[30px] border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          Please log in first.
        </div>
      </div>
    );
  }

  // Confirm admin access.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-[30px] border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          Admin access required.
        </div>
      </div>
    );
  }

  // Load product, category list, and gallery images together.
  const [{ data: product }, { data: categories }, { data: images }] =
    await Promise.all([
      supabase.from("products").select("*").eq("id", id).single(),
      supabase
        .from("categories")
        .select("id, name")
        .order("sort_order", { ascending: true }),
      supabase
        .from("product_images")
        .select("*")
        .eq("product_id", id)
        .order("sort_order"),
    ]);

  // Show a clean empty state when the product does not exist.
  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-[30px] border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          Product not found.
        </div>
      </div>
    );
  }

  const galleryImages = images ?? [];
  const totalImages = (product.thumbnail_url ? 1 : 0) + galleryImages.length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
      {/* Page header */}
      <div className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
            <PencilLine className="h-6 w-6" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
              Product editing
            </p>

            <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl">
              Edit Product
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Update product details, category assignment, stock, pricing, and
              media from one organized admin editing page.
            </p>
          </div>
        </div>
      </div>

      {/* Edit form panel */}
      <div className="mt-6 rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
            Product form
          </p>

          <h2 className="mt-2 text-xl font-bold text-zinc-900 dark:text-white">
            Product Details
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            Edit the core product information below. Changes here affect how the
            product appears in seller tools, admin tools, and the storefront.
          </p>
        </div>

        <AdminEditProductForm
          product={product}
          categories={categories ?? []}
        />
      </div>

      {/* Product images panel */}
      <div className="mt-6 rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
            <Images className="h-6 w-6" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
              Product media
            </p>

            <h2 className="mt-2 text-xl font-bold text-zinc-900 dark:text-white">
              Product Images
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Cover image is required for active products. Total allowed images:
              1 to 5 including the cover image.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[22px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Current total images
            </p>
            <p className="mt-2 text-lg font-bold text-zinc-900 dark:text-white">
              {totalImages} / 5
            </p>
          </div>

          <div className="rounded-[22px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Gallery images
            </p>
            <p className="mt-2 text-lg font-bold text-zinc-900 dark:text-white">
              {galleryImages.length}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <AddProductImageForm
            productId={id}
            currentCount={galleryImages.length}
          />
        </div>

        {galleryImages.length ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {galleryImages.map((img: any) => (
              <div
                key={img.id}
                className="overflow-hidden rounded-[28px] border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="p-4">
                  <img
                    src={img.image_url}
                    alt="Product"
                    className="h-44 w-full rounded-[18px] object-cover"
                  />

                  <div className="mt-4 space-y-3">
                    <div className="rounded-[20px] border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
                      <p className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">
                        Sort Order
                      </p>

                      <ProductImageSortForm
                        imageId={img.id}
                        productId={id}
                        initialSortOrder={img.sort_order ?? 0}
                      />
                    </div>

                    <DeleteProductImageButton
                      imageId={img.id}
                      productId={id}
                    />
                  </div>
                </div>

                {/* Bottom helper bar */}
                <div className="border-t border-zinc-200 bg-white px-4 py-3 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                  Reorder or remove this gallery image as needed.
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[24px] border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            No extra gallery images added yet.
          </div>
        )}
      </div>
    </div>
  );
}