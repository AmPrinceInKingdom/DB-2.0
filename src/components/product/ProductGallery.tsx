"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";

type Props = {
  images: string[];
};

export default function ProductGallery({ images }: Props) {
  // Remove empty image values to avoid broken previews.
  const safeImages = useMemo(() => images.filter(Boolean), [images]);

  const [active, setActive] = useState(0);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const activeImage = safeImages[active];

  // Keep the active image index valid when the image list changes.
  useEffect(() => {
    if (active >= safeImages.length) {
      setActive(0);
    }
  }, [active, safeImages.length]);

  // Support keyboard navigation inside the lightbox.
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isLightboxOpen || safeImages.length === 0) return;

      if (e.key === "Escape") {
        setIsLightboxOpen(false);
      }

      if (e.key === "ArrowRight") {
        setActive((prev) => (prev + 1) % safeImages.length);
      }

      if (e.key === "ArrowLeft") {
        setActive((prev) => (prev - 1 + safeImages.length) % safeImages.length);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, safeImages.length]);

  // Empty state if no product images exist.
  if (!safeImages.length) {
    return (
      <div className="rounded-[28px] border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="aspect-square rounded-[24px] bg-zinc-100 dark:bg-zinc-900" />
      </div>
    );
  }

  // Desktop hover zoom effect.
  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const { currentTarget, clientX, clientY } = event;
    const rect = currentTarget.getBoundingClientRect();

    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(1.85)",
    });
    setIsZoomed(true);
  }

  // Reset zoom when leaving the image area.
  function handleMouseLeave() {
    setZoomStyle({
      transformOrigin: "center center",
      transform: "scale(1)",
    });
    setIsZoomed(false);
  }

  function showPrev() {
    setActive((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  }

  function showNext() {
    setActive((prev) => (prev + 1) % safeImages.length);
  }

  return (
    <>
      <div className="space-y-4">
        {/* Main image panel */}
        <div className="overflow-hidden rounded-[30px] border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="relative p-3 sm:p-4">
            <div
              className="group relative aspect-square overflow-hidden rounded-[24px] bg-zinc-50 dark:bg-zinc-900"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={() => setIsLightboxOpen(true)}
            >
              <img
                src={activeImage}
                alt="Product image"
                className={`h-full w-full object-cover transition duration-300 ${
                  isZoomed ? "cursor-zoom-in" : "cursor-pointer"
                }`}
                style={zoomStyle}
              />

              {/* Small expand button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLightboxOpen(true);
                }}
                className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/90 text-zinc-700 shadow-sm backdrop-blur transition hover:bg-white dark:border-zinc-700 dark:bg-black/80 dark:text-zinc-200 dark:hover:bg-zinc-900"
                aria-label="Open image preview"
              >
                <Expand className="h-4 w-4" />
              </button>

              {/* Image count badge */}
              {safeImages.length > 1 ? (
                <div className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                  {active + 1} / {safeImages.length}
                </div>
              ) : null}

              {/* Desktop next / previous buttons */}
              {safeImages.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      showPrev();
                    }}
                    className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/85 text-zinc-700 shadow-sm backdrop-blur transition hover:bg-white md:inline-flex dark:border-zinc-700 dark:bg-black/70 dark:text-zinc-200 dark:hover:bg-zinc-900"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      showNext();
                    }}
                    className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/85 text-zinc-700 shadow-sm backdrop-blur transition hover:bg-white md:inline-flex dark:border-zinc-700 dark:bg-black/70 dark:text-zinc-200 dark:hover:bg-zinc-900"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>

        {/* Thumbnail strip */}
        <div className="flex gap-2 overflow-x-auto pb-1 sm:gap-3">
          {safeImages.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border bg-white transition sm:h-24 sm:w-24 dark:bg-zinc-950 ${
                active === i
                  ? "border-red-600 ring-2 ring-red-200 dark:ring-red-950/60"
                  : "border-zinc-200 dark:border-zinc-800"
              }`}
              aria-label={`Show image ${i + 1}`}
            >
              <img
                src={img}
                alt={`Thumbnail ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {isLightboxOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-4">
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close preview"
          >
            <X className="h-5 w-5" />
          </button>

          {safeImages.length > 1 ? (
            <>
              <button
                type="button"
                onClick={showPrev}
                className="absolute left-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                type="button"
                onClick={showNext}
                className="absolute right-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          ) : null}

          <div className="flex max-h-[90vh] max-w-5xl items-center justify-center">
            <img
              src={safeImages[active]}
              alt={`Preview ${active + 1}`}
              className="max-h-[90vh] max-w-full rounded-2xl object-contain"
            />
          </div>

          {safeImages.length > 1 ? (
            <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
              <span>
                {active + 1} / {safeImages.length}
              </span>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}