import Link from "next/link";
import { notFound } from "next/navigation";
import { dict, isLocale } from "@/lib/i18n";
import { items, MAPS_URL, ORDER_URL, PHONE, SIGNATURE, SITE_URL } from "@/lib/site";
import ScrollStory from "@/components/ScrollStory";
import MenuCard from "@/components/MenuCard";
import Photo from "@/components/Photo";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = dict[locale];
  const signature = SIGNATURE.map((id) => items.find((i) => i.id === id)!).filter(Boolean);
  const preview = items.filter((i) => i.category === "qashtota" && !SIGNATURE.includes(i.id)).slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: "Qashtota Haifa",
    alternateName: ["قشطوطة حيفا", "קשטוטה חיפה"],
    url: `${SITE_URL}/${locale}`,
    telephone: PHONE,
    servesCuisine: "Desserts",
    priceRange: "₪₪",
    address: { "@type": "PostalAddress", streetAddress: "Derech Ha'atzma'ut 78", addressLocality: "Haifa", addressCountry: "IL" },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday"], opens: "08:00", closes: "23:59" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Thursday", "Friday", "Saturday"], opens: "08:00", closes: "01:00" },
    ],
    sameAs: ["https://www.instagram.com/qashtotahaifa/"],
    hasMenu: `${SITE_URL}/${locale}/menu`,
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ScrollStory scenes={t.scenes} hint={t.scrollHint} />

      <section className="section">
        <h2>{t.signature.title}</h2>
        <p className="lead">{t.signature.text}</p>
        <div className="grid grid-4">
          {signature.map((i) => <MenuCard key={i.id} item={i} locale={locale} />)}
        </div>
      </section>

      <section className="section section-ice">
        <h2>{t.process.title}</h2>
        <ol className="steps">
          {t.process.steps.map((s, i) => (
            <li key={i}><span>{i + 1}</span>{s}</li>
          ))}
        </ol>
      </section>

      <section className="section">
        <h2>{t.menu.title}</h2>
        <p className="lead">{t.menu.text}</p>
        <div className="grid">
          {preview.map((i) => <MenuCard key={i.id} item={i} locale={locale} />)}
        </div>
        <p className="center"><Link className="btn" href={`/${locale}/menu`}>{t.menu.fullMenu}</Link></p>
      </section>

      <section id="story" className="section split">
        <div>
          <h2>{t.story.title}</h2>
          {t.story.text.map((p, i) => <p key={i}>{p}</p>)}
          <div className="note">
            <h3>{t.tasting.title}</h3>
            <p>{t.tasting.text}</p>
          </div>
        </div>
        <Photo path="/story/shop.webp" alt={t.story.title} className="photo-tall" />
      </section>

      <section className="section section-blue">
        <h2>{t.loyalty.title}</h2>
        <p className="lead">{t.loyalty.text}</p>
        <ul className="rules">{t.loyalty.rules.map((r, i) => <li key={i}>{r}</li>)}</ul>
        <p className="center"><Link className="btn btn-white" href={`/${locale}/loyalty`}>{t.loyalty.cta}</Link></p>
      </section>

      <section id="visit" className="section split">
        <div>
          <h2>{t.visit.title}</h2>
          <p className="big">{t.visit.address}</p>
          <h3>{t.visit.hoursTitle}</h3>
          <table className="hours">
            <tbody>
              {t.visit.hours.map(([d, h]) => (
                <tr key={d}><td>{d}</td><td dir="ltr">{h}</td></tr>
              ))}
            </tbody>
          </table>
          <p><a href={`tel:${PHONE}`} dir="ltr">{t.visit.phone}</a></p>
          <p className="actions">
            <a className="btn" href={MAPS_URL} target="_blank" rel="noopener">{t.visit.map}</a>
            <a className="btn btn-ghost" href={ORDER_URL} target="_blank" rel="noopener">{t.nav.order}</a>
          </p>
        </div>
        <iframe
          className="map"
          title={t.visit.address}
          loading="lazy"
          src={"https://www.google.com/maps?q=" + encodeURIComponent("Derech Ha'atzma'ut 78, Haifa") + "&output=embed"}
        />
      </section>
    </main>
  );
}
