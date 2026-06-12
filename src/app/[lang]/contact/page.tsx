import ContactHero from "@/components/contact/ContactHero";
import ContactForm from "@/components/contact/ContactForm";
import SharedCta from "@/components/shared/SharedCta";
import { getGlobalData } from "@/data/loader";

export const metadata = {
  title: "Contact Us — Socle RH | Human Systems",
  description:
    "Get in touch with the Human Systems team. Request a demo, ask about pricing, or learn how Socle RH can transform your HR operations.",
};

export default async function ContactPage(params: Promise<{ lang: string }>) {
  const { lang } = await params;
  const dir = lang === "ar" ? "rtl" : "ltr";

  const globalResponse = await getGlobalData(lang).catch(() => null);
  const globalData =
    globalResponse?.data?.attributes ||
    globalResponse?.data ||
    globalResponse?.data?.[0];

  const globalFooter = (globalData?.blocks || []).find(
    (b: any) => b.__component === "global.footer",
  );
  return (
    <main className="min-h-screen bg-white">
      <ContactHero />
      <ContactForm data={globalFooter} />
      <SharedCta />
    </main>
  );
}
