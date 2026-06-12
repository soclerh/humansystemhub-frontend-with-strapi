import ContactHero from "@/components/contact/ContactHero";
import ContactForm from "@/components/contact/ContactForm";
import SharedCta from "@/components/shared/SharedCta";
import { getGlobalData, getPageData } from "@/data/loader";

export const metadata = {
  title: "Contact Us — Socle RH | Human Systems",
  description:
    "Get in touch with the Human Systems team. Request a demo, ask about pricing, or learn how Socle RH can transform your HR operations.",
};

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // Fetch page content + global data (for contact channels) in parallel
  const [response, globalResponse] = await Promise.all([
    getPageData("contact", lang).catch(() => null),
    getGlobalData(lang).catch(() => null),
  ]);

  const blocks = response?.data?.[0]?.blocks || [];
  const heroData = blocks.find(
    (b: any) => b.__component === "shared.hero-section",
  );
  const contactInfoData = blocks.find(
    (b: any) => b.__component === "modules.all-modules",
  );
  const ctaData = blocks.find(
    (b: any) => b.__component === "shared.common-cta",
  );

  const globalData =
    globalResponse?.data?.attributes ||
    globalResponse?.data ||
    globalResponse?.data?.[0];

  const globalFooter = (globalData?.blocks || []).find(
    (b: any) => b.__component === "global.footer",
  );

  return (
    <main className="min-h-screen bg-white">
      <ContactHero data={heroData} />
      <ContactForm data={globalFooter} info={contactInfoData} lang={lang} />
      <SharedCta data={ctaData} />
    </main>
  );
}
