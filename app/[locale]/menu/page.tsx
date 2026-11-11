import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dict, isLocale, locales } from "@/lib/i18n";
import MenuBrowser from "@/components/MenuBrowser";
import Photo from "@/components/Photo";

// Three trays fanned out on the cover, like they were just set down on the counter.
const COVER = ["/menu/m07.webp", "/menu/m03.webp", "/menu/m14.webp"];

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
    <main className="page page-cover">
      <header className="menu-cover">
        <div className="menu-cover-text">
          <h1>{t.title}</h1>
          <p className="lead">{t.text}</p>
        </div>
        <div className="menu-cover-fan" aria-hidden="true">
          {COVER.map((p, i) => <Photo key={p} path={p} alt="" className={`fan-${i}`} />)}
        </div>
      </header>
      <section className="section">
        <MenuBrowser locale={locale} allLabel={t.all} />
        <p className="muted center">{t.note}</p>
      </section>
    </main>
  );
}
