import Link from "next/link";
import { notFound } from "next/navigation";
import { dict, isLocale, locales } from "@/lib/i18n";
import { INSTAGRAM_URL, itemName, items, MAPS_URL, ORDER_URL, PHONE, SIGNATURE, SITE_URL, WAZE_URL } from "@/lib/site";
import ScrollStory from "@/components/ScrollStory";
import FlavourWall from "@/components/FlavourWall";
import Photo from "@/components/Photo";
import Marquee from "@/components/Marquee";
import OpenNow from "@/components/OpenNow";

const INSTA_PHOTOS = ["M03", "M12", "M11", "M14", "M07", "M09"];

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = dict[locale];
  // The most ordered flavours first, then the rest of the qashtota range.
  const signature = SIGNATURE.map((id) => items.find((i) => i.id === id)!).filter(Boolean);
  const wall = [...signature, ...items.filter((i) => i.category === "qashtota" && !SIGNATURE.includes(i.id))];

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
      <ScrollStory
        scenes={t.scenes}
        hint={t.scrollHint}
        ctas={[{ href: `/${locale}/menu`, label: t.menu.fullMenu }, { href: ORDER_URL, label: t.nav.order, external: true }]}
      />
      {/* Haifa speaks four languages, so the band does too: each line in all of them, this page's first. */}
      <Marquee words={t.marquee.flatMap((_, k) => [locale, ...locales.filter((l) => l !== locale)].map((l) => ({ text: dict[l].marquee[k], lang: l })))} />

      <FlavourWall
        items={wall}
        locale={locale}
        title={t.signature.title}
        text={t.signature.text}
        more={{ href: `/${locale}/menu`, label: t.menu.fullMenu }}
      />

      <section id="story" className="section split">
        <div>
          <h2 className="display">{t.story.title}</h2>
          {t.story.text.map((p, i) => <p key={i}>{p}</p>)}
          <div className="note">
            <h3>{t.tasting.title}</h3>
            <p>{t.tasting.text}</p>
          </div>
        </div>
        <div className="collage">
          <Photo path="/story/m/k5.webp" alt="" className="photo-tall" />
          <Photo path="/menu/m07.webp" alt="" className="collage-a" />
          <Photo path="/menu/m12.webp" alt="" className="collage-b" />
          <span className="collage-badge">{t.branches.since}</span>
        </div>
      </section>

      <section className="section section-blue club">
        <div className="club-grid">
          <div className="club-card" aria-hidden="true">
            <img src="/brand/logo-white.png" alt="" />
            <span className="club-name">{t.club.card}</span>
            <strong>{t.club.pts}</strong>
            <span className="club-free">{t.club.free}</span>
          </div>
          <div>
            <h2 className="display">{t.loyalty.title}</h2>
            <p className="lead">{t.loyalty.text}</p>
            <ul className="rules">{t.loyalty.rules.map((r, i) => <li key={i}>{r}</li>)}</ul>
            <p><Link className="btn btn-white" href={`/${locale}/loyalty`}>{t.loyalty.cta}</Link></p>
          </div>
        </div>
      </section>

      <section className="section insta">
        <div className="insta-head">
          <h2 className="display" dir="ltr">@qashtotahaifa</h2>
          <p className="lead">{t.insta.text}</p>
          <a className="btn" href={INSTAGRAM_URL} target="_blank" rel="noopener">{t.insta.cta}</a>
        </div>
        <div className="insta-grid">
          {INSTA_PHOTOS.map((id) => {
            const it = items.find((i) => i.id === id);
            return it ? (
              <a key={id} href={INSTAGRAM_URL} target="_blank" rel="noopener" aria-label={itemName(it, locale)}>
                <Photo path={it.photo} alt={itemName(it, locale)} />
              </a>
            ) : null;
          })}
        </div>
      </section>

      <section id="visit" className="section section-ice">
        <h2 className="display">{t.branches.title}</h2>
        <div className="split">
          <div className="branch">
            <div className="branch-top">
              <h3>{t.branches.city}</h3>
              <OpenNow open={t.branches.open} closed={t.branches.closed} />
            </div>
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
            <p className="actions visit-actions">
              <a className="btn" href={MAPS_URL} target="_blank" rel="noopener" aria-label={t.visit.map}>{t.visit.mapShort}</a>
              <a className="btn btn-waze" href={WAZE_URL} target="_blank" rel="noopener" aria-label={t.visit.waze}>Waze</a>
              <a className="btn btn-ghost" href={ORDER_URL} target="_blank" rel="noopener">{t.nav.order}</a>
            </p>
          </div>
          <iframe
            className="map"
            title={t.visit.address}
            loading="lazy"
            src={"https://www.google.com/maps?q=" + encodeURIComponent("Derech Ha'atzma'ut 78, Haifa") + "&output=embed"}
          />
        </div>
      </section>
    </main>
  );
}
