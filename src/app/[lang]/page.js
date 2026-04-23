import { SliceZone } from "@prismicio/react";
import * as prismic from "@prismicio/client";

import { getLocales } from "@/lib/getLocales";
import { reverseLocaleLookup, urlSegmentForPrismicLang } from "@/i18n";
import { createClient } from "@/prismicio";

import { Layout } from "@/components/Layout";
import { navItemsFromSlices } from "@/lib/sectionNavFromSlices";
import { components } from "@/slices";


/**
 * @returns {Promise<import("next").Metadata>}
 */
export async function generateMetadata({ params }) {
  const { lang } = await params;
  const client = createClient();
  const prismicLang = reverseLocaleLookup(lang);
  const page = await client.getByUID("landing_page", "home", {
    lang: prismicLang ?? lang,
  });

  return {
    title: prismic.asText(page.data.title),
  };
}

export default async function Page({ params }) {
  const { lang } = await params;
  const client = createClient();

  const prismicLang = reverseLocaleLookup(lang);

  const [page, settings] = await Promise.all([
    client.getByUID("landing_page", "home", {
      lang: prismicLang,
    }),
    client.getSingle("site_settings", { lang: prismicLang }).catch(() => null),
  ]);

  const allLocales = await getLocales(page, client);
  const locales = allLocales.slice(1);
  const sectionNavItems = navItemsFromSlices(page.data.slices);
  const basePath = `/${lang}`;
  const sliceContext = { lang: prismicLang ?? page.lang };

  return (
    <Layout
      locales={locales}
      settings={settings}
      sectionNavItems={sectionNavItems}
      basePath={basePath}
    >
      <SliceZone
        slices={page.data.slices}
        components={components}
        context={sliceContext}
      />
    </Layout>
  );
}

export async function generateStaticParams() {
  const client = createClient();

  const pages = await client.getAllByType("landing_page", {
    lang: "*",
    filters: [prismic.filter.at("my.landing_page.uid", "home")],
  });

  return pages
    .map((page) => {
      const lang = urlSegmentForPrismicLang(page.lang);
      if (!lang) return null;
      return { lang };
    })
    .filter(Boolean);
}