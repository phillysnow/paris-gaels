import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import type { NextRequest } from "next/server";

const LOCALES: Record<string, string> = {
  "en-gb": "en",
  "fr-fr": "fr",
};

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function urlSegmentForPrismicLang(prismicLang: string): string | undefined {
  return LOCALES[prismicLang];
}

export function rewriteLocaleInPath(path: string): string {
  if (!path || typeof path !== "string") return path;
  try {
    if (/^https?:\/\//i.test(path)) {
      const u = new URL(path);
      u.pathname = rewriteLocalePathname(u.pathname);
      return u.toString();
    }
    return rewriteLocalePathname(path);
  } catch {
    return path;
  }
}

export function prismicDocumentHrefForApp(url: string | null | undefined): string {
  if (!url || typeof url !== "string") return "#";
  const rewritten = rewriteLocaleInPath(url);
  if (!rewritten || typeof rewritten !== "string") return "#";
  return rewritten;
}

function rewriteLocalePathname(pathname: string): string {
  for (const [prismicLang, segment] of Object.entries(LOCALES)) {
    const re = new RegExp(`^/${escapeRegExp(prismicLang)}(?=/|$)`, "i");
    if (re.test(pathname)) {
      return pathname.replace(re, `/${segment}`);
    }
  }
  return pathname;
}

export function redirectLegacyLocalePrefix(request: NextRequest): Response | null {
  const pathname = request.nextUrl.pathname;
  const first = pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  if (!first) return null;

  for (const prismicLang of Object.keys(LOCALES)) {
    if (prismicLang.toLowerCase() !== first) continue;
    const segment = LOCALES[prismicLang];
    if (segment === prismicLang) continue;
    request.nextUrl.pathname = pathname.replace(
      new RegExp(`^/${escapeRegExp(prismicLang)}(?=/|$)`, "i"),
      `/${segment}`,
    );
    return Response.redirect(request.nextUrl, 308);
  }
  return null;
}

function stripBrokenUndefinedSegments(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  while (segments[0] === "undefined") {
    segments.shift();
  }
  return segments.length ? `/${segments.join("/")}` : "/";
}

function defaultLocaleSegment(): string {
  const firstKey = Object.keys(LOCALES)[0];
  return LOCALES[firstKey];
}

export function createLocaleRedirect(request: NextRequest): Response {
  const headers = {
    "accept-language": request.headers.get("accept-language") ?? undefined,
  };
  const languages = new Negotiator({ headers }).languages();
  const localeKeys = Object.keys(LOCALES);

  let matchedKey = localeKeys[0];
  try {
    matchedKey = match(languages, localeKeys, localeKeys[0]);
  } catch {
    matchedKey = localeKeys[0];
  }

  const prefix = LOCALES[matchedKey];
  const safePrefix =
    typeof prefix === "string" && prefix.length > 0 ? prefix : defaultLocaleSegment();

  const cleaned = stripBrokenUndefinedSegments(request.nextUrl.pathname);
  request.nextUrl.pathname = `/${safePrefix}${cleaned === "/" ? "" : cleaned}`;
  if (request.nextUrl.pathname === "") request.nextUrl.pathname = "/";

  return Response.redirect(request.nextUrl);
}

export function pathnameHasLocale(request: NextRequest): boolean {
  const first = request.nextUrl.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  if (!first) return false;
  return Object.values(LOCALES).some((segment) => segment.toLowerCase() === first);
}

export function reverseLocaleLookup(locale: string | null | undefined): string | undefined {
  if (!locale) return undefined;
  const normalized = String(locale).toLowerCase();
  for (const key in LOCALES) {
    if (LOCALES[key].toLowerCase() === normalized) {
      return key;
    }
  }
}

export function prismicLocaleForQuery(raw: string | null | undefined): string | undefined {
  if (raw == null || raw === "") return undefined;
  if (Object.hasOwn(LOCALES, raw)) return raw;
  return reverseLocaleLookup(String(raw).toLowerCase());
}
