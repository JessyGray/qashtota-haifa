"use client";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { categories, itemName, items } from "@/lib/site";
import MenuCard from "./MenuCard";

export default function MenuBrowser({ locale, allLabel }: { locale: Locale; allLabel: string }) {
  const [cat, setCat] = useState<string>("all");
  const shown = cat === "all" ? items : items.filter((i) => i.category === cat);
  return (
    <>
      <div className="tabs" role="tablist">
        {[{ id: "all", label: allLabel }, ...categories.map((c) => ({ id: c.id, label: itemName(c, locale) }))].map((c) => (
          <button key={c.id} role="tab" aria-selected={cat === c.id} onClick={() => setCat(c.id)}>
            {c.label}
          </button>
        ))}
      </div>
      <div className="grid">
        {shown.map((i) => <MenuCard key={i.id} item={i} locale={locale} />)}
      </div>
    </>
  );
}
