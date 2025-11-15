import { HeroInteractive } from "@/components/marketing-backup/HeroInteractive";
import { TrustBar } from "@/components/marketing-backup/TrustBar";
import { ComparisonSection } from "@/components/marketing-backup/ComparisonSection";
import { InteractiveDemo } from "@/components/marketing-backup/InteractiveDemo";
import { FeaturesDetailed } from "@/components/marketing-backup/FeaturesDetailed";
import { TestimonialCarousel } from "@/components/marketing-backup/TestimonialCarousel";
import { PricingCards } from "@/components/marketing-backup/PricingCards";
import { FinalCTA } from "@/components/marketing-backup/FinalCTA";

export default function MarketingPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section with Live Data */}
      <HeroInteractive />

      {/* Trust Signals */}
      <TrustBar />

      {/* Comparative Advantage */}
      <ComparisonSection />

      {/* Interactive Demo */}
      <InteractiveDemo />

      {/* Detailed Features */}
      <FeaturesDetailed />

      {/* Social Proof */}
      <TestimonialCarousel />

      {/* Pricing */}
      <PricingCards />

      {/* Final CTA */}
      <FinalCTA />
    </main>
  );
}
