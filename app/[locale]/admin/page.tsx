import { notFound } from "next/navigation";
import { dict, isLocale } from "@/lib/i18n";
import Admin from "@/components/Admin";

export const metadata = { robots: { index: false } };

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = dict[locale].admin;
  return (
    <main className="page">
      <section className="section narrow">
        <h1>{t.title}</h1>
        <Admin notReady={t.notReady} />
      </section>
    </main>
  );
}
