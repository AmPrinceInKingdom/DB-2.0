import HeroSection from "@/components/home/HeroSection";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import PromoBanners from "@/components/home/PromoBanners";
import FlashDeals from "@/components/home/FlashDeals";
import TrustSection from "@/components/home/TrustSection";
import BrandStrip from "@/components/home/BrandStrip";

/**
 * Homepage
 * Header and footer are already rendered globally in layout.tsx,
 * so this page should only render homepage sections.
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="pb-24 md:pb-12">
        <HeroSection />
        <FeaturedCategories />
        <FeaturedProducts />
        <PromoBanners />
        <FlashDeals />
        <TrustSection />
        <BrandStrip />
      </main>
    </div>
  );
}