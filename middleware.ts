import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale } from "./lib/i18n";

function pick(header: string | null) {
  for (const part of (header || "").split(",")) {
    const code = part.split(";")[0].trim().slice(0, 2).toLowerCase();
    if (code === "iw") return "he";
    if (isLocale(code)) return code;
  }
  return defaultLocale;
}

export function middleware(req: NextRequest) {
  const first = req.nextUrl.pathname.split("/")[1];
  if (isLocale(first)) return;
  const url = req.nextUrl.clone();
  url.pathname = `/${pick(req.headers.get("accept-language"))}${req.nextUrl.pathname === "/" ? "" : req.nextUrl.pathname}`;
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/((?!api|_next|brand|menu-img|favicon|robots.txt|sitemap.xml|.*\\..*).*)"] };
