import type { Locale } from "@/lib/i18n";
import { dict } from "@/lib/i18n";
import { itemName, ORDER_URL, price, type Item } from "@/lib/site";
import Photo from "./Photo";

export default function MenuCard({ item, locale }: { item: Item; locale: Locale }) {
  const t = dict[locale].menu;
  const name = itemName(item, locale);
  return (
    <article className="card">
      <Photo path={item.photo} alt={name} />
      <div className="card-body">
        <h3>{name}</h3>
        <div className="card-row">
          <strong dir="ltr">{price(item.price)}</strong>
          <span className="points">+{Math.floor(item.price)} {t.points}</span>
        </div>
        <a className="btn btn-ghost" href={ORDER_URL} target="_blank" rel="noopener">{t.order}</a>
      </div>
    </article>
  );
}
