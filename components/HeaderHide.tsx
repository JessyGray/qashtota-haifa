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
      h.classList.toggle("header-away", y > last && y > 120 && !h.contains(document.activeElement));
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return null;
}
