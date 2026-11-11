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

// Phone frames are the 16:9 video padded to 9:16 with smeared edges. Only rows 300..876 of the
// 720x1280 frame are real footage, so on phones we crop to that band.
const BAND = { y: 300, h: 576 };

// Draws the dessert frame into a box centred at (cx, cy) with width w, then fades the box edges
// into the page with an elliptical mask, so the dessert floats on the page colour.
function paint(ctx: CanvasRenderingContext2D, img: HTMLImageElement, cx: number, cy: number, w: number, portrait: boolean) {
  if (!img.complete || !img.naturalWidth) return false;
  const k = img.naturalHeight / 1280;
  const [sy, sh] = portrait ? [BAND.y * k, BAND.h * k] : [0, img.naturalHeight];
  const h = (w * sh) / img.naturalWidth;
  ctx.drawImage(img, 0, sy, img.naturalWidth, sh, cx - w / 2, cy - h / 2, w, h);
  ctx.save();
  ctx.globalCompositeOperation = "destination-in";
  ctx.translate(cx, cy);
  ctx.scale(w / 2, h / 2);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
  g.addColorStop(0, "#000");
  g.addColorStop(0.62, "#000");
  g.addColorStop(0.98, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(-20, -20, 40, 40);
  ctx.restore();
  return true;
}

// Where the dessert sits for each scene: 1 = right half, -1 = left half (physical sides, same in RTL).
const sideOf = (i: number) => (i % 2 === 0 ? 1 : -1);
const ease = (t: number) => t * t * (3 - 2 * t);

// Horizontal position (-1..1) of the dessert for a scroll position f (0..scenes-1).
// It holds still for most of a scene and glides to the other half between scenes.
function sideAt(f: number, n: number) {
  const a = Math.floor(f);
  const b = Math.min(a + 1, n - 1);
  const t = ease(Math.min(1, Math.max(0, (f - a - 0.3) / 0.4)));
  return sideOf(a) + (sideOf(b) - sideOf(a)) * t;
}

const PORTRAIT_MQ = "(max-width: 760px), (orientation: portrait) and (max-width: 1100px)";

type Cta = { href: string; label: string; external?: boolean };

export default function ScrollStory({ scenes, hint, ctas = [] }: { scenes: Scene[]; hint: string; ctas?: Cta[] }) {
  const wrap = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [hero, setHero] = useState(true);
  const [hasMedia, setHasMedia] = useState(false);
  const [portrait, setPortrait] = useState<boolean | null>(null);

  // Same breakpoint as the portrait layout in globals.css. Rotating a phone or tablet
  // switches frame set and layout, so the drawing effect below re-runs on change.
  useEffect(() => {
    const mq = window.matchMedia(PORTRAIT_MQ);
    const sync = () => setPortrait(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = wrap.current;
    const cv = canvas.current;
    if (!el || !cv || !asset("/") || portrait === null) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const mobile = portrait;
        const count = mobile ? SEQ_MOBILE : SEQ_DESKTOP;
    const dir = mobile ? "m" : "d";
    const frames = Array.from({ length: count }, (_, i) => load(asset(`/seq/${dir}/${pad(i + 1)}.webp`)));
    const stills = count ? [] : scenes.map((_, i) => load(asset(`/story/d/k${i + 1}.webp`)));

    let progress = 0;
    let raf = 0;

    const draw = () => {
      raf = 0;
      const { width: cw, height: ch } = cv;
      ctx.clearRect(0, 0, cw, ch);
      const f = progress * (scenes.length - 1);
      // At the very top the dessert sits centred in front of the big tagline. As soon as the
      // story starts it moves to one side and the copy appears on the other.
      const intro = ease(Math.min(1, f / 0.45));
      const x = sideAt(f, scenes.length) * intro;
      // Desktop: a bit more than half the width, in the half away from the text.
      // Phones: nearly full width in the upper part, text below.
      const big = Math.min(cw * 0.68, ch * 0.84 * (16 / 9));
      const small = Math.min(cw * 0.6, ch * 0.8 * (16 / 9));
      const w = mobile ? cw * 0.96 : big + (small - big) * intro;
      const cx = cw / 2 + x * (mobile ? cw * 0.03 : cw * 0.22);
      const cy = ch * (mobile ? 0.42 : 0.62 - 0.09 * intro);
      let drawn = false;
      if (count) {
        // Use the nearest frame that has loaded, so fast scrolling never shows a blank canvas.
        const target = Math.round(progress * (count - 1));
        for (let d = 0; d < count && !drawn; d++) {
          drawn = (target - d >= 0 && paint(ctx, frames[target - d], cx, cy, w, mobile)) || (target + d < count && paint(ctx, frames[target + d], cx, cy, w, mobile));
        }
      } else {
        drawn = paint(ctx, stills[Math.round(f)], cx, cy, w, false);
      }
      if (drawn) setHasMedia(true);
      // The big word behind drifts up and fades as the story moves on.
      stage.current?.style.setProperty("--intro", intro.toFixed(3));
      setHero(f < 0.18);
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

    const imgs = [...frames, ...stills];
    imgs.forEach((img) => img.addEventListener("load", schedule, { once: true }));
    resize();
    onScroll();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
      imgs.forEach((img) => img.removeEventListener("load", schedule));
    };
  }, [scenes, portrait]);

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
      <div ref={stage} className={`story-stage ${hasMedia ? "has-media" : ""}`}>
        {/* The shop's tagline in its own Arabic, set huge behind the dessert. Decorative. */}
        <span className="story-word" dir="rtl" lang="ar" aria-hidden="true">
          {["حلّو", "يا", "حلّو"].map((w, i) => <span key={i} style={{ animationDelay: `${0.15 + i * 0.12}s` }}>{w}</span>)}
        </span>
        <canvas ref={canvas} aria-hidden="true" />
        {scenes.map((s, i) => (
          <div key={i} className={`story-copy ${sideOf(i) > 0 ? "text-left" : "text-right"} ${i === active && !(hero && hasMedia) ? "on" : ""}`} aria-hidden={i !== active} inert={i !== active}>
            {i === 0 ? <h1>{s.title}</h1> : <h2>{s.title}</h2>}
            <p>{s.text}</p>
            {i === scenes.length - 1 && ctas.length > 0 && (
              <div className="story-cta">
                {ctas.map((c, k) => (
                  <a key={c.href} className={`btn ${k ? "btn-ghost" : ""}`} href={c.href} {...(c.external ? { target: "_blank", rel: "noopener" } : {})}>{c.label}</a>
                ))}
              </div>
            )}
          </div>
        ))}
        <ol className="story-dots" aria-hidden="true">
          {scenes.map((_, i) => <li key={i} className={i === active ? "on" : ""} />)}
        </ol>
        <span className={`story-hint ${active || !hero ? "gone" : ""}`}>{hint} ↓</span>
      </div>
    </section>
  );
}
