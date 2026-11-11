import Link from "next/link";
import { dict, type Locale } from "@/lib/i18n";
import { INSTAGRAM_URL, PHONE } from "@/lib/site";

export default function Footer({ locale }: { locale: Locale }) {
  const t = dict[locale];
  return (
    <footer className="footer">
      <img src="/brand/logo-white.png" alt="قشطوطة" width={120} height={45} />
      <p>{t.visit.address} · <a href={`tel:${PHONE}`} dir="ltr">{t.visit.phone}</a></p>
      <p>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener">Instagram @qashtotahaifa</a> ·{" "}
        <Link href={`/${locale}/account`}>{t.nav.account}</Link>
      </p>
      <p className="muted">{t.footer.source}</p>
      <p className="muted">© {new Date().getFullYear()} {t.footer.rights}</p>
    </footer>
  );
}
