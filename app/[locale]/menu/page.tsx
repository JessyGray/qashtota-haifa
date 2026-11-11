import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dict, isLocale, locales } from "@/lib/i18n";
import MenuBrowser from "@/components/MenuBrowser";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = dict[locale].meta;
  return {
    title: t.menuTitle,
    description: t.menuDescription,
    alternates: { canonical: `/${locale}/menu`, languages: Object.fromEntries(locales.map((l) => [l, `/${l}/menu`])) },
  };
}

export default async function MenuPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = dict[locale].menu;
  return (
    <main className="page">
      <section className="section">
        <h1>{t.title}</h1>
        <p className="lead">{t.text}</p>
        <MenuBrowser locale={locale} allLabel={t.all} />
        <p className="muted center">{t.note}</p>
      </section>
    </main>
  );
}
