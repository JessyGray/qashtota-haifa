"use client";
import { useState } from "react";
import { asset } from "@/lib/site";

// Shows a generated photo from the asset store, or a soft brand placeholder if it is missing.
export default function Photo({ path, alt, className }: { path: string; alt: string; className?: string }) {
  const src = asset(path);
  const [ok, setOk] = useState(Boolean(src));
  return (
    <div className={`photo ${className || ""}`}>
      {ok ? <img src={src} alt={alt} loading="lazy" onError={() => setOk(false)} /> : <span aria-hidden="true">قشطوطة</span>}
    </div>
  );
}
