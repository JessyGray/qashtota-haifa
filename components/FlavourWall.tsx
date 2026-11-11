"use client";
import { useEffect, useRef } from "react";
import { dict, type Locale } from "@/lib/i18n";
import { itemName, ORDER_URL, price, type Item } from "@/lib/site";
import Photo from "./Photo";

// Same breakpoint as the touch fallback in globals.css (max-width: 899px or no hover).
const PIN_MQ = "(min-width: 900px) and (hover: hover)";

// Big flavour photos in one row. On wide screens the section pins and vertical scroll slides
// the row sideways (towards the reading direction). On touch screens it is a plain swipe row.
export default function FlavourWall({ items, locale, title, text, more }: { items: Item[]; locale: Locale; title: string; text: string; more: { href: string; label: string } }) {
  const wrap = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    const tr = track.current;
    if (!el || !tr) return;
    const pin = window.matchMedia(PIN_MQ);
    const dir = getComputedStyle(el).direction === "rtl" ? 1 : -1;
    let dist = 0;
    let raf = 0;

    // Measure once per resize: section height = one screen plus the sideways distance.
    const measure = () => {
      tr.style.transform = "";
      if (!pin.matches) { el.style.height = ""; dist = 0; return; }
      dist = Math.max(0, tr.scrollWidth - tr.clientWidth);
      el.style.height = `${window.innerHeight + dist}px`;
      slide();
    };
    const slide = () => {
      raf = 0;
      if (!dist) return;
      const p = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / dist));
      tr.style.transform = `translate3d(${(dir * p * dist).toFixed(1)}px,0,0)`;
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(slide); };
    // Keyboard: when a card off screen gets focus, scroll the page to where that card is visible.
    const onFocus = (e: FocusEvent) => {
      if (!dist || !(e.target instanceof HTMLElement)) return;
      const card = e.target.closest<HTMLElement>(".wall-item, .wall-more");
      if (!card) return;
      const offset = dir < 0 ? card.offsetLeft : tr.scrollWidth - card.offsetLeft - card.offsetWidth;
      const p = Math.min(1, Math.max(0, (offset - tr.clientWidth / 3) / dist));
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + p * dist });
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    pin.addEventListener("change", measure);
    el.addEventListener("focusin", onFocus);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      pin.removeEventListener("change", measure);
      el.removeEventListener("focusin", onFocus);
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
              <a key={i.id} className="wall-item" href={ORDER_URL} target="_blank" rel="noopener" aria-label={`${name}, ${price(i.price)}. ${dict[locale].menu.order}`}>
                <Photo path={i.photo} alt="" />
                <strong className="wall-price" dir="ltr">{price(i.price)}</strong>
                <div className="wall-meta"><h3>{name}</h3></div>
              </a>
            );
          })}
          <a className="wall-more" href={more.href}>{more.label}</a>
        </div>
      </div>
    </section>
  );
}
