import PricingHero from "@/components/pricing/PricingHero";
import PricingCards from "@/components/pricing/PricingCards";
import PricingComparison from "@/components/pricing/PricingComparison";
import PricingFaq from "@/components/pricing/PricingFaq";
import SharedCta from "@/components/shared/SharedCta";
import { staticPricingData } from "@/data/staticPricing";
import { getPageData } from "@/data/loader";

export const metadata = {
  title: "Pricing — Socle RH | Human Systems",
  description:
    "Simple, transparent pricing for businesses of all sizes. Choose from Starter, Professional, or Enterprise plans with multi-tenant security and GDPR compliance.",
};

export default async function PricingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const response = await getPageData("pricing", lang);
  const blocks = response?.data?.[0]?.blocks || [];

  const heroData = blocks.find(
    (b: any) => b.__component === "shared.hero-section",
  );
  const pricingData = blocks.find((b: any) => b.__component === "home.pricing");
  const faqData = blocks.find((b: any) => b.__component === "modules.faq");
  const ctaData = blocks.find(
    (b: any) => b.__component === "shared.common-cta",
  );
  const comparisonData = blocks.find(
    (b: any) => b.__component === "pricing.compare-plans",
  );

  return (
    <main className="min-h-screen bg-white">
      <PricingHero data={heroData} />
      <PricingCards
        pricingData={pricingData}
        fallbackData={staticPricingData}
      />
      <PricingComparison data={comparisonData} />
      <PricingFaq data={faqData} />
      <SharedCta data={ctaData} />
    </main>
  );
}
