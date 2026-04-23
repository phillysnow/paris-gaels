import {
  createLocaleRedirect,
  pathnameHasLocale,
  redirectLegacyLocalePrefix,
} from "@/i18n";

export async function middleware(request) {
  const legacy = redirectLegacyLocalePrefix(request);
  if (legacy) return legacy;

  if (!pathnameHasLocale(request)) {
    return createLocaleRedirect(request);
  }
}

export const config = {
  matcher: ["/((?!_next|api|slice-simulator|icon.svg).*)"],
};