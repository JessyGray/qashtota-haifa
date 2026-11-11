"use client";
import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/site";

type Scene = { title: string; text: string };

const SEQ_DESKTOP = Number(process.env.NEXT_PUBLIC_SEQ_DESKTOP || 0);
const SEQ_MOBILE = Number(process.env.NEXT_PUBLIC_SEQ_MOBILE || 0);
const pad = (n: number) => String(n).padStart(4, "0");

function load(src: string) {
  const img = new Image();
  img.decoding = "async";
  img.src = src;
  return img;
}

// Draws an image to fill the canvas like object-fit: cover.
function cover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, alpha = 1) {
  if (!img.complete || !img.naturalWidth) return false;
  const { width: cw, height: ch } = ctx.canvas;
  const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
  const w = img.naturalWidth * s;
  const h = img.naturalHeight * s;
  ctx.globalAlpha = alpha;
  ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
  ctx.globalAlpha = 1;
  return true;
}

export default function ScrollStory({ scenes, hint }: { scenes: Scene[]; hint: string }) {
  const wrap = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(0);
  const [hasMedia, setHasMedia] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    const cv = canvas.current;
    if (!el || !cv || !asset("/")) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const mobile = window.matchMedia("(max-width: 760px)").matches;
    const count = mobile ? SEQ_MOBILE : SEQ_DESKTOP;
    const dir = mobile ? "m" : "d";
    const frames = Array.from({ length: count }, (_, i) => load(asset(`/seq/${dir}/${pad(i + 1)}.webp`)));
    const stills = count ? [] : scenes.map((_, i) => load(asset(`/story/${mobile ? "m" : "d"}/k${i + 1}.webp`)));

    let progress = 0;
    let raf = 0;

    const draw = () => {
      raf = 0;
      ctx.clearRect(0, 0, cv.width, cv.height);
      let drawn = false;
      if (count) {
        // Use the nearest frame that has loaded, so fast scrolling never shows a blank canvas.
        const target = Math.round(progress * (count - 1));
        for (let d = 0; d < count && !drawn; d++) {
          drawn = (target - d >= 0 && cover(ctx, frames[target - d])) || (target + d < count && cover(ctx, frames[target + d]));
        }
      } else {
        const x = progress * (stills.length - 1);
        const a = Math.floor(x);
        const b = Math.min(a + 1, stills.length - 1);
        drawn = cover(ctx, stills[a]);
        if (b !== a) cover(ctx, stills[b], x - a);
      }
      if (drawn) setHasMedia(true);
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(draw); };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(cv.clientWidth * dpr);
      cv.height = Math.round(cv.clientHeight * dpr);
      schedule();
    };
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      progress = Math.min(1, Math.max(0, -r.top / (total || 1)));
      setActive(Math.min(scenes.length - 1, Math.round(progress * (scenes.length - 1))));
      schedule();
    };

    [...frames, ...stills].forEach((img) => img.addEventListener("load", schedule, { once: true }));
    resize();
    onScroll();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [scenes]);

  // Without JS or media the text still steps through the scenes.
  useEffect(() => {
    if (asset("/")) return;
    const el = wrap.current;
    if (!el) return;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / (r.height - window.innerHeight || 1)));
      setActive(Math.min(scenes.length - 1, Math.round(p * (scenes.length - 1))));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scenes]);

  return (
    <section ref={wrap} className="story-scroll" style={{ height: `${scenes.length * 100}vh` }}>
      <div className={`story-stage ${hasMedia ? "has-media" : ""}`}>
        <canvas ref={canvas} aria-hidden="true" />
        <div className="story-shade" />
        {scenes.map((s, i) => (
          <div key={i} className={`story-copy ${i === active ? "on" : ""}`} aria-hidden={i !== active}>
            {i === 0 ? <h1>{s.title}</h1> : <h2>{s.title}</h2>}
            <p>{s.text}</p>
          </div>
        ))}
        <ol className="story-dots" aria-hidden="true">
          {scenes.map((_, i) => <li key={i} className={i === active ? "on" : ""} />)}
        </ol>
        <span className={`story-hint ${active ? "gone" : ""}`}>{hint} ↓</span>
      </div>
    </section>
  );
}
