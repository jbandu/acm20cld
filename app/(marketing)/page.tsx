import { HeroInteractive } from "@/components/marketing/HeroInteractive";
import { TrustBar } from "@/components/marketing/TrustBar";
import { ComparisonSection } from "@/components/marketing/ComparisonSection";
import { InteractiveDemo } from "@/components/marketing/InteractiveDemo";
import { FeaturesDetailed } from "@/components/marketing/FeaturesDetailed";
import { TestimonialCarousel } from "@/components/marketing/TestimonialCarousel";
import { PricingCards } from "@/components/marketing/PricingCards";
import { FinalCTA } from "@/components/marketing/FinalCTA";

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
