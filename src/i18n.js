import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

/**
 * A record of locales mapped to a version displayed in URLs. The first entry is
 * used as the default locale.
 */
// TODO: Update this object with your website's supported locales. Keys
// should be the locale IDs registered in your Prismic repository, and values
// should be the string that appears in the URL.
const LOCALES = {
  "en-gb": "en",
  "fr-fr": "fr",
};

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Maps a Prismic repository locale id to the first URL path segment. */
export function urlSegmentForPrismicLang(prismicLang) {
  return LOCALES[prismicLang];
}

/**
 * Rewrites Prismic-resolved paths that use repository locale ids (e.g. /en-gb/...)
 * to public URL segments (e.g. /en/...).
 */
export function rewriteLocaleInPath(path) {
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

/**
 * Prismic's `url` for documents uses repository locale ids in the path (`/en-gb/...`).
 * The Next app only serves short segments (`/en/...`). Use this for card links, same as
 * `getLocales`.
 *
 * @param {string | null | undefined} url
 * @returns {string}
 */
export function prismicDocumentHrefForApp(url) {
  if (!url || typeof url !== "string") return "#";
  const rewritten = rewriteLocaleInPath(url);
  if (!rewritten || typeof rewritten !== "string") return "#";
  return rewritten;
}

function rewriteLocalePathname(pathname) {
  for (const [prismicLang, segment] of Object.entries(LOCALES)) {
    const re = new RegExp(`^/${escapeRegExp(prismicLang)}(?=/|$)`, "i");
    if (re.test(pathname)) {
      return pathname.replace(re, `/${segment}`);
    }
  }
  return pathname;
}

/**
 * Permanent redirect from legacy locale-prefixed URLs (/en-gb/, /fr-fr/) to short segments.
 */
export function redirectLegacyLocalePrefix(request) {
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

/** Recover from broken redirects where `${undefined}` became the literal path segment "undefined". */
function stripBrokenUndefinedSegments(pathname) {
  const segments = pathname.split("/").filter(Boolean);
  while (segments[0] === "undefined") {
    segments.shift();
  }
  return segments.length ? `/${segments.join("/")}` : "/";
}

/** First URL segment for locale-prefixed paths (never rely on loose object lookup alone). */
function defaultLocaleSegment() {
  const firstKey = Object.keys(LOCALES)[0];
  return LOCALES[firstKey];
}

/** Creates a redirect with an auto-detected locale prepended to the URL. */
export function createLocaleRedirect(request) {
  const headers = {
    "accept-language": request.headers.get("accept-language"),
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

/** Determines if a pathname has a locale as its first segment. */
export function pathnameHasLocale(request) {
  const first = request.nextUrl.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  if (!first) return false;
  return Object.values(LOCALES).some((segment) => segment.toLowerCase() === first);
}

/**
 * Returns the Prismic locale id for a URL segment (e.g. params.lang).
 * Returns `undefined` if the segment is not in the master list.
 * Matching is case-insensitive so `en-GB` and `en-gb` both resolve.
 */
export function reverseLocaleLookup(locale) {
  if (!locale) return undefined;
  const normalized = String(locale).toLowerCase();
  for (const key in LOCALES) {
    if (LOCALES[key].toLowerCase() === normalized) {
      return key;
    }
  }
}

/**
 * `lang` in Content API queries must be a repository locale id (e.g. en-gb), not the public
 * path segment (en). Accepts either when resolving from slice `context.lang`.
 *
 * @param {string | null | undefined} raw
 * @returns {string | undefined}
 */
export function prismicLocaleForQuery(raw) {
  if (raw == null || raw === "") return undefined;
  if (raw === "en-gb" || raw === "fr-fr") return raw;
  return reverseLocaleLookup(String(raw).toLowerCase());
}