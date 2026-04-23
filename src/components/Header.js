import * as prismic from "@prismicio/client";
import Link from "next/link";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";

import { Bounded } from "./Bounded";

const localeLabels = {
  "en-gb": "🇮🇪",
  "fr-fr": "🇫🇷",
};

/** Primary + in-page nav — club ink + red accents */
const navLinkClass =
  "font-display inline-flex items-center whitespace-nowrap rounded-md px-2.5 py-2 text-[0.8125rem] font-bold leading-none tracking-wide text-pg-ink antialiased ring-1 ring-transparent transition-[color,box-shadow,ring-color] duration-200 hover:bg-pg-red/8 hover:text-pg-ink hover:shadow-[0_6px_22px_-10px_rgba(229,45,47,0.35)] hover:ring-pg-red/40 md:text-[0.9375rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pg-red";

export function Header({
  locales = [],
  settings,
  sectionNavItems = [],
  basePath = "",
}) {
  const primaryNav = settings?.data?.primary_navigation;
  const hasSectionLinks = sectionNavItems.length > 0 && Boolean(basePath);
  const hasPrimaryLinks = Boolean(primaryNav?.length);

  return (
    <header className="w-full border-b border-slate-200/90 bg-white shadow-sm shadow-slate-900/5">
      <Bounded yPadding="sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-6">
          <div className="flex shrink-0 justify-center md:justify-start">
            <PrismicNextLink
              href="/"
              className="inline-block outline-offset-4 focus-visible:rounded-sm"
            >
              <span className="sr-only">Go to homepage</span>
              {settings && prismic.isFilled.image(settings.data.header_banner) && (
                <PrismicNextImage
                  field={settings.data.header_banner}
                  alt=""
                  className="max-h-14 w-auto max-w-[min(100%,12rem)] object-contain md:max-h-16"
                />
              )}
            </PrismicNextLink>
          </div>

          <div className="flex min-w-0 flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-end sm:gap-6 lg:gap-8">
            {(hasSectionLinks || hasPrimaryLinks) && (
              <nav
                aria-label="Main navigation"
                className="flex min-w-0 flex-wrap items-center justify-center gap-x-1.5 gap-y-2 sm:justify-end md:gap-x-2"
              >
                {hasSectionLinks ? (
                  <ul className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-2 sm:justify-end md:gap-x-2">
                    {sectionNavItems.map(({ anchor }) => (
                      <li key={anchor}>
                        <Link
                          href={`${basePath}#${anchor}`}
                          className={navLinkClass}
                        >
                          {anchor}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {hasSectionLinks && hasPrimaryLinks ? (
                  <span
                    className="hidden h-8 w-px shrink-0 bg-pg-royal/25 sm:block"
                    aria-hidden="true"
                  />
                ) : null}

                {hasPrimaryLinks ? (
                  <ul className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-2 sm:justify-end md:gap-x-2">
                    {primaryNav.map((item) => (
                      <li key={item.text}>
                        <PrismicNextLink
                          field={item.url}
                          className={navLinkClass}
                        >
                          {item.text}
                        </PrismicNextLink>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </nav>
            )}

            {locales.length > 0 ? (
              <div className="flex items-center justify-center sm:justify-end">
                <div
                  className="inline-flex items-center rounded-full border border-slate-200/90 bg-white p-0.5"
                  role="group"
                  aria-label="Language"
                >
                  <ul className="flex items-center gap-0.5">
                    {locales.map((locale) => (
                      <li key={locale.lang}>
                        <PrismicNextLink
                          href={locale.url}
                          aria-label={`Change language to ${locale.lang_name}`}
                          className="flex h-9 min-w-[2.25rem] items-center justify-center rounded-full px-2 text-base leading-none text-pg-ink transition hover:bg-pg-red/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pg-red"
                        >
                          {localeLabels[locale.lang] || locale.lang}
                        </PrismicNextLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </Bounded>
    </header>
  );
}
