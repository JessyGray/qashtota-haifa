import menu from "@/data/menu.json";
import type { Locale } from "./i18n";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://qashtota-haifa.vercel.app";
export const INSTAGRAM_URL = "https://www.instagram.com/qashtotahaifa/";
// Haat has no public link yet, so ordering goes to Instagram until NEXT_PUBLIC_ORDER_URL is set.
export const ORDER_URL = process.env.NEXT_PUBLIC_ORDER_URL || INSTAGRAM_URL;
export const PHONE = "+972529090978";
// Waze opens straight into navigation to the shop.
export const WAZE_URL = "https://waze.com/ul?navigate=yes&q=" + encodeURIComponent("Derech Ha'atzma'ut 78, Haifa");
export const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Derech Ha'atzma'ut 78, Haifa");

// Generated photos and frame sequences live in Vercel Blob; this is its public base URL.
const ASSET_BASE = (process.env.NEXT_PUBLIC_ASSET_BASE || "").replace(/\/$/, "");
export const asset = (path: string) => (ASSET_BASE ? ASSET_BASE + path : "");

export type Item = (typeof menu.items)[number];
export type Category = (typeof menu.categories)[number];
export const items: Item[] = menu.items.filter((i) => i.active);
export const categories: Category[] = menu.categories;
export const itemName = (i: Item | Category, l: Locale) => i.name[l] || i.name.en;
export const price = (n: number) => "₪" + (Number.isInteger(n) ? n : n.toFixed(2));
export const SIGNATURE = ["M03", "M12", "M11", "M14"];
