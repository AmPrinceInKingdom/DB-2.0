"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";

type Slide = {
  id: number;
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  image: string;
  align?: "left" | "center";
};

const slides: Slide[] = [
  {
    id: 1,
    eyebrow: "Deal Bazaar Support",
    title: "Find the right products exactly when you need them",
    description:
      "Browse trending products, better deals, and customer-friendly shopping in one clean marketplace.",
    primaryCta: {
      label: "Browse products",
      href: "/search",
    },
    secondaryCta: {
      label: "View deals",
      href: "/search?q=deals",
    },
    image:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1600&auto=format&fit=crop",
    align: "left",
  },
  {
    id: 2,
    eyebrow: "Top Categories",
    title: "Discover new arrivals and daily deals faster",
    description:
      "Explore featured categories, highlighted offers, and popular picks with a cleaner shopping flow.",
    primaryCta: {
      label: "Explore now",
      href: "/search",
    },
    secondaryCta: {
      label: "Browse electronics",
      href: "/search?category=Electronics",
    },
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop",
    align: "left",
  },
  {
    id: 3,
    eyebrow: "Better Marketplace",
    title: "Shop smarter with a cleaner modern experience",
    description:
      "Products, categories, and special offers are easier to see on both mobile and desktop.",
    primaryCta: {
      label: "Search products",
      href: "/search",
    },
    secondaryCta: {
      label: "My account",
      href: "/account",
    },
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop",
    align: "left",
  },
];

const AUTO_SLIDE_MS = 5000;

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, AUTO_SLIDE_MS);

    return () => window.clearInterval(interval);
  }, [isPaused]);

  function goToPrevious() {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  }

  function goToNext() {
    setActiveIndex((current) => (current + 1) % slides.length);
  }

  function goToSlide(index: number) {
    setActiveIndex(index);
  }

  return (
    <section className="db-container pb-4 pt-4 md:pb-6 md:pt-6">
      <div className="overflow-hidden rounded-[1.5rem] border border-border/70 bg-background shadow-sm sm:rounded-[1.75rem]">
        <div className="relative min-h-[360px] sm:min-h-[320px] md:min-h-[380px] lg:min-h-[430px]">
          {slides.map((slide, index) => {
            const isActive = index === activeIndex;

            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  isActive ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${slide.image})` }}
                />

                <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/65 sm:bg-gradient-to-r sm:from-black/60 sm:via-black/25 sm:to-black/10" />

                <div className="relative z-10 flex h-full items-center">
                  <div className="w-full px-4 py-5 sm:px-8 sm:py-10 md:px-10 lg:px-12">
                    <div
                      className={`max-w-xl ${
                        slide.align === "center" ? "mx-auto text-center" : ""
                      }`}
                    >
                      <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/90 backdrop-blur sm:px-3 sm:text-xs">
                        {slide.eyebrow}
                      </span>

                      <h1 className="mt-3 max-w-[280px] text-[1.9rem] font-black leading-[1.02] tracking-[-0.04em] text-white sm:mt-4 sm:max-w-none sm:text-4xl md:text-5xl">
                        {slide.title}
                      </h1>

                      <p className="mt-3 max-w-[300px] text-[13px] leading-6 text-white/85 sm:mt-4 sm:max-w-lg sm:text-base sm:leading-8">
                        {slide.description}
                      </p>

                      <div className="mt-5 flex flex-col gap-2.5 sm:mt-6 sm:flex-row">
                        <Link
                          href={slide.primaryCta.href}
                          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-primary transition hover:bg-white/90 sm:h-11 sm:w-auto"
                        >
                          {slide.primaryCta.label}
                        </Link>

                        {slide.secondaryCta ? (
                          <Link
                            href={slide.secondaryCta.href}
                            className="hidden h-11 items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15 sm:inline-flex"
                          >
                            {slide.secondaryCta.label}
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 sm:bottom-5">
            {slides.map((slide, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-2.5 rounded-full transition-all ${
                    isActive
                      ? "w-6 bg-white"
                      : "w-2.5 bg-white/55 hover:bg-white/80"
                  }`}
                />
              );
            })}
          </div>

          {/* Controls */}
          <div className="absolute bottom-4 right-4 z-20 hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={goToPrevious}
              aria-label="Previous slide"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/85 text-foreground shadow-sm backdrop-blur transition hover:bg-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={goToNext}
              aria-label="Next slide"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/85 text-foreground shadow-sm backdrop-blur transition hover:bg-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsPaused((current) => !current)}
              aria-label={isPaused ? "Play slider" : "Pause slider"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/85 text-foreground shadow-sm backdrop-blur transition hover:bg-white"
            >
              {isPaused ? (
                <Play className="h-4 w-4" />
              ) : (
                <Pause className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}