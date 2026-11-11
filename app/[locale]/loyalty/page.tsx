import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dict, isLocale, locales } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = dict[locale];
  return {
    title: t.meta.loyaltyTitle,
    description: t.loyalty.text,
    alternates: { canonical: `/${locale}/loyalty`, languages: Object.fromEntries(locales.map((l) => [l, `/${l}/loyalty`])) },
  };
}

export default async function LoyaltyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = dict[locale].loyalty;
  return (
    <main className="page">
      <section className="section">
        <h1>{t.title}</h1>
        <p className="lead">{t.text}</p>
        <ul className="rules rules-dark">{t.rules.map((r, i) => <li key={i}>{r}</li>)}</ul>
        <div className="grid grid-3">
          {t.tiers.map((tier) => (
            <div key={tier.name} className="tier">
              <h3>{tier.name}</h3>
              <p>{tier.range}</p>
              <strong>{tier.perk}</strong>
            </div>
          ))}
        </div>
        <p className="muted center">{t.soon}</p>
        <p className="center"><Link className="btn" href={`/${locale}/account`}>{t.cta}</Link></p>
      </section>
    </main>
  );
}
