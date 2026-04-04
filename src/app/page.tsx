import HeroSection from "@/components/home/HeroSection";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import FlashDeals from "@/components/home/FlashDeals";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import PromoBanners from "@/components/home/PromoBanners";
import PreDealsBanner from "@/components/home/PreDealsBanner";

/**
 * Homepage
 * Header and footer are rendered globally in layout.tsx.
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="overflow-x-hidden pb-24 md:pb-12">
        {/* Hero slider */}
        <section className="w-full">
          <HeroSection />
        </section>

        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 sm:px-5 sm:py-5 md:gap-8 md:px-6 md:py-6 lg:gap-10 lg:px-8 lg:py-8">
          {/* Category showcase below hero */}
          <section className="w-full">
            <CategoryShowcase />
          </section>

          <section className="w-full">
            <PreDealsBanner />
          </section>

          {/* Deals row */}
          <section className="w-full">
            <FlashDeals />
          </section>

          {/* Featured products */}
          <section className="w-full">
            <FeaturedProducts />
          </section>

          {/* Promo banner */}
          <section className="w-full">
            <PromoBanners />
          </section>

        </div>
      </main>
    </div>
  );
}