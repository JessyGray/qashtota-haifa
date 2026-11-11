import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Baloo_Bhaijaan_2, Fredoka, Nunito, Rubik } from "next/font/google";
import "../globals.css";
import { dict, isLocale, locales, rtl } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const rubik = Rubik({ subsets: ["latin", "hebrew", "arabic", "cyrillic"], weight: ["400", "500", "700", "800"], display: "swap" });
// Rounded display faces for headings, one per script (see --font-display in globals.css).
const fredoka = Fredoka({ subsets: ["latin", "hebrew"], weight: ["600", "700"], display: "swap", variable: "--font-round" });
const baloo = Baloo_Bhaijaan_2({ subsets: ["arabic", "latin"], weight: ["700", "800"], display: "swap", variable: "--font-ar" });
const nunito = Nunito({ subsets: ["cyrillic", "latin"], weight: ["800", "900"], display: "swap", variable: "--font-ru" });

export const viewport: Viewport = { themeColor: "#0080E6", width: "device-width", initialScale: 1 };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = dict[locale].meta;
  return {
    metadataBase: new URL(SITE_URL),
    title: t.title,
    description: t.description,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
    openGraph: { title: t.title, description: t.description, type: "website", locale, siteName: "Qashtota Haifa" },
    icons: { icon: "/brand/icon.png" },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={locale} dir={rtl(locale) ? "rtl" : "ltr"} className={`${rubik.className} ${fredoka.variable} ${baloo.variable} ${nunito.variable}`}>
      <body>
        <Header locale={locale} />
        {children}
        <Footer locale={locale} />
      </body>
    </html>
  );
}
