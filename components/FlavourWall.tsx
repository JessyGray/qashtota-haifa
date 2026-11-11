"use client";
import { useEffect, useRef } from "react";
import type { Locale } from "@/lib/i18n";
import { dict } from "@/lib/i18n";
import { itemName, ORDER_URL, price, type Item } from "@/lib/site";
import Photo from "./Photo";

// Big flavour photos in one row. On wide screens the section pins and vertical scroll slides
// the row sideways (towards the reading direction). On touch screens it is a plain swipe row.
export default function FlavourWall({ items, locale, title, text, more }: { items: Item[]; locale: Locale; title: string; text: string; more: { href: string; label: string } }) {
  const wrap = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const t = dict[locale].menu;

  useEffect(() => {
    const el = wrap.current;
    const tr = track.current;
    if (!el || !tr) return;
    const wide = window.matchMedia("(min-width: 900px) and (hover: hover)");
    let raf = 0;
    const update = () => {
      raf = 0;
      if (!wide.matches) {
        el.style.height = "";
        tr.style.transform = "";
        return;
      }
      const dist = Math.max(0, tr.scrollWidth - tr.clientWidth);
      // Section height = one screen for the pinned view plus the sideways distance.
      el.style.height = `${window.innerHeight + dist}px`;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / (dist || 1)));
      const dir = getComputedStyle(el).direction === "rtl" ? 1 : -1;
      tr.style.transform = `translate3d(${(dir * p * dist).toFixed(1)}px,0,0)`;
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    wide.addEventListener("change", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      wide.removeEventListener("change", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={wrap} className="wall">
      <div className="wall-pin">
        <div className="wall-head">
          <h2 className="display">{title}</h2>
          <p className="lead">{text}</p>
        </div>
        <div ref={track} className="wall-track">
          {items.map((i) => {
            const name = itemName(i, locale);
            return (
              <article key={i.id} className="wall-item">
                <Photo path={i.photo} alt={name} />
                <div className="wall-meta">
                  <h3>{name}</h3>
                  <strong dir="ltr">{price(i.price)}</strong>
                </div>
                <a className="btn btn-small" href={ORDER_URL} target="_blank" rel="noopener">{t.order}</a>
              </article>
            );
          })}
          <a className="wall-more" href={more.href}>{more.label}</a>
        </div>
      </div>
    </section>
  );
}
