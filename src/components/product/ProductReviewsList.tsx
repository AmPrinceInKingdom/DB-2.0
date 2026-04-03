type Review = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  is_verified_purchase: boolean;
  profiles?: {
    full_name?: string | null;
    email?: string | null;
  } | null;
};

export default function ProductReviewsList({
  reviews,
}: {
  reviews: Review[];
}) {
  if (!reviews.length) {
    return (
      <div className="rounded-3xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
        No reviews yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-zinc-900 dark:text-white">
                {review.profiles?.full_name ||
                  review.profiles?.email ||
                  "Customer"}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
                {review.is_verified_purchase ? (
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700 dark:bg-green-950 dark:text-green-300">
                    Verified Purchase
                  </span>
                ) : null}
              </div>
            </div>

            <div className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
              {review.rating}/5
            </div>
          </div>

          {review.comment ? (
            <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
              {review.comment}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}