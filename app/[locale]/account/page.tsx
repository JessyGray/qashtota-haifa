import { notFound } from "next/navigation";
import { dict, isLocale } from "@/lib/i18n";
import Account from "@/components/Account";

export const metadata = { robots: { index: false } };

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = dict[locale].account;
  return (
    <main className="page">
      <section className="section narrow">
        <h1>{t.title}</h1>
        <Account t={t} />
      </section>
    </main>
  );
}
