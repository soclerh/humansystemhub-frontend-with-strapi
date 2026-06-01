import type { Metadata } from "next";
import { Sora, DM_Sans } from "next/font/google";
import "../globals.css";
import Header from "@/components/layouts/Header";
import Footer from "@/components/homepage/Footer";
import { getGlobalData } from "@/data/loader";

const sora = Sora({
  subsets: ["latin"],
  variable: "--heading-font",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--body-font",
});

export const metadata: Metadata = {
  title: "Human Systems - The All-in-One HR SaaS Platform",
  description:
    "Human Systems empowers businesses with a scalable, secure, and modular HR platform.",
  icons: {
    icon: "/favicon2.png", // Point to the PNG instead
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const dir = lang === "ar" ? "rtl" : "ltr";

  // Fetch Global Data for Header & (future) Footer Layouts safely
  const globalResponse = await getGlobalData(lang).catch(() => null);
  const globalData =
    globalResponse?.data?.attributes ||
    globalResponse?.data ||
    globalResponse?.data?.[0];
  const globalHeader = (globalData?.blocks || []).find(
    (b: any) => b.__component === "global.header",
  );
  const globalFooter = (globalData?.blocks || []).find(
    (b: any) => b.__component === "global.footer",
  );

  return (
    <html
      lang={lang}
      dir={dir}
      className={`${sora.variable} ${dmSans.variable}`}
    >
      <body className="antialiased">
        <Header data={globalHeader} />
        {children}
        <Footer data={globalFooter} />
      </body>
    </html>
  );
}
