"use client";
import { useEffect } from "react";

// Slides the fixed header away while scrolling down and brings it back on the way up,
// so the story and the flavour wall get the whole screen.
export default function HeaderHide() {
  useEffect(() => {
    const h = document.querySelector<HTMLElement>(".header");
    if (!h) return;
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 6) return;
      const busy = h.contains(document.activeElement) || h.querySelector("details[open]");
      h.classList.toggle("header-away", y > last && y > 120 && !busy);
      last = y;
    };
    // Keyboard users tabbing into a hidden header get it back at once.
    const show = () => h.classList.remove("header-away");
    window.addEventListener("scroll", onScroll, { passive: true });
    h.addEventListener("focusin", show);
    return () => {
      window.removeEventListener("scroll", onScroll);
      h.removeEventListener("focusin", show);
    };
  }, []);
  return null;
}
