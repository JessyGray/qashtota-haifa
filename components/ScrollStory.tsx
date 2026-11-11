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

// Phone frames are the 16:9 video padded to 9:16 with smeared edges. Only rows 300..876 of the
// 720x1280 frame are real footage, so on phones we draw that band across the full width at 40%
// height and fade its edges into the page instead of stretching the smear over the screen.
const BAND = { y: 300, h: 576 };
function band(ctx: CanvasRenderingContext2D, img: HTMLImageElement) {
  if (!img.complete || !img.naturalWidth) return false;
  const { width: cw, height: ch } = ctx.canvas;
  const k = img.naturalHeight / 1280;
  const h = (cw * BAND.h) / img.naturalWidth;
  const top = ch * 0.4 - h / 2;
  ctx.drawImage(img, 0, BAND.y * k, img.naturalWidth, BAND.h * k, 0, top, cw, h);
  ctx.globalCompositeOperation = "destination-in";
  const v = ctx.createLinearGradient(0, top, 0, top + h);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(0.14, "#000");
  v.addColorStop(0.86, "#000");
  v.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, cw, ch);
  const hz = ctx.createLinearGradient(0, 0, cw, 0);
  hz.addColorStop(0, "rgba(0,0,0,0)");
  hz.addColorStop(0.08, "#000");
  hz.addColorStop(0.92, "#000");
  hz.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = hz;
  ctx.fillRect(0, 0, cw, ch);
  ctx.globalCompositeOperation = "source-over";
  return true;
}

// Where the dessert sits for each scene: 1 = right half, -1 = left half (physical sides, same in RTL).
const sideOf = (i: number) => (i % 2 === 0 ? 1 : -1);
const ease = (t: number) => t * t * (3 - 2 * t);

// Pose of the dessert for a scroll position f (0..scenes-1). At the top the video fills the
// screen as before. During the first scene the background melts into the page colour and the
// dessert comes forward and grows, then it glides from one half to the other between scenes.
function pose(f: number, n: number) {
  const a = Math.floor(f);
  const b = Math.min(a + 1, n - 1);
  const t = ease(Math.min(1, Math.max(0, (f - a - 0.3) / 0.4)));
  const x = sideOf(a) + (sideOf(b) - sideOf(a)) * t;
  const intro = ease(Math.min(1, f / 0.6));
  return { x: x * intro, scale: 1 + 0.14 * intro, reveal: intro };
}

type Cta = { href: string; label: string; external?: boolean };

export default function ScrollStory({ scenes, hint, ctas = [] }: { scenes: Scene[]; hint: string; ctas?: Cta[] }) {
  const wrap = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [hasMedia, setHasMedia] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    const cv = canvas.current;
    if (!el || !cv || !asset("/")) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    // Same breakpoint as the portrait layout in globals.css.
    const mobile = window.matchMedia("(max-width: 760px), (orientation: portrait) and (max-width: 1100px)").matches;
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
        const paint = mobile ? band : cover;
        for (let d = 0; d < count && !drawn; d++) {
          drawn = (target - d >= 0 && paint(ctx, frames[target - d])) || (target + d < count && paint(ctx, frames[target + d]));
        }
      } else {
        const x = progress * (stills.length - 1);
        const a = Math.floor(x);
        const b = Math.min(a + 1, stills.length - 1);
        drawn = cover(ctx, stills[a]);
        if (b !== a) cover(ctx, stills[b], x - a);
      }
      if (drawn) setHasMedia(true);
      const f = progress * (scenes.length - 1);
      const p = pose(f, scenes.length);
      const amp = mobile ? 0.12 : 0.22; // share of viewport width
      cv.style.transform = `translate3d(${(p.x * amp * 100).toFixed(2)}vw,0,0) scale(${p.scale.toFixed(3)})`;
      // The mask starts far larger than the screen (no visible edge) and closes around the dessert.
      const st = stage.current;
      if (st) st.style.setProperty("--reveal", p.reveal.toFixed(3));
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
      <div ref={stage} className={`story-stage ${hasMedia ? "has-media" : ""}`}>
        <span className="story-word" aria-hidden="true">QASHTOTA</span>
        <canvas ref={canvas} aria-hidden="true" />
        {scenes.map((s, i) => (
          <div key={i} className={`story-copy ${sideOf(i) > 0 ? "text-left" : "text-right"} ${i === active ? "on" : ""}`} aria-hidden={i !== active}>
            <span className="story-step">{String(i + 1).padStart(2, "0")}</span>
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
        <span className={`story-hint ${active ? "gone" : ""}`}>{hint} ↓</span>
      </div>
    </section>
  );
}
