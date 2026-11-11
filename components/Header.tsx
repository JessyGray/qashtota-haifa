import Link from "next/link";
import { dict, localeNames, locales, type Locale } from "@/lib/i18n";
import { ORDER_URL } from "@/lib/site";
import HeaderHide from "./HeaderHide";

export default function Header({ locale }: { locale: Locale }) {
  const t = dict[locale].nav;
  return (
    <header className="header">
      <HeaderHide />
      <Link href={`/${locale}`} className="logo" aria-label="Qashtota Haifa">
        <img src="/brand/logo-white.png" alt="قشطوطة" width={140} height={52} />
      </Link>
      <nav className="nav">
        <Link href={`/${locale}/menu`}>{t.menu}</Link>
        <Link className="wide" href={`/${locale}#story`}>{t.story}</Link>
        <Link href={`/${locale}/loyalty`}>{t.loyalty}</Link>
        <Link className="wide" href={`/${locale}#visit`}>{t.visit}</Link>
      </nav>
      <div className="header-end">
        <details className="lang">
          <summary>{locale.toUpperCase()}</summary>
          <div>
            {locales.map((l) => (
              <Link key={l} href={`/${l}`} lang={l} aria-current={l === locale ? "true" : undefined}>
                {localeNames[l]}
              </Link>
            ))}
          </div>
        </details>
        <a className="btn btn-small" href={ORDER_URL} target="_blank" rel="noopener">{t.order}</a>
      </div>
    </header>
  );
}
