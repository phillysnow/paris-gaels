import { cache } from "react";
import { SliceZone } from "@prismicio/react";
import * as prismic from "@prismicio/client";
import type { Metadata } from "next";

import { getLocales } from "@/lib/getLocales";
import { reverseLocaleLookup, urlSegmentForPrismicLang } from "@/i18n";
import { createClient } from "@/prismicio";

import { Layout } from "@/components/Layout";
import { navItemsFromSlices } from "@/lib/sectionNavFromSlices";
import { components } from "@/slices";

type PageProps = { params: Promise<{ lang: string }> };

const getHomePage = cache(async (prismicLang: string | undefined) => {
  const client = createClient();
  return client.getByUID("landing_page", "home", { lang: prismicLang });
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const prismicLang = reverseLocaleLookup(lang);
  const page = await getHomePage(prismicLang);

  return {
    title: page.data.meta_title ?? undefined,
  };
}

export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  const client = createClient();

  const prismicLang = reverseLocaleLookup(lang);

  const [page, settings] = await Promise.all([
    getHomePage(prismicLang),
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
      overlayOnHero
    >
      <SliceZone
        slices={page.data.slices}
        components={components}
        context={sliceContext}
      />
    </Layout>
  );
}

export async function generateStaticParams(): Promise<{ lang: string }[]> {
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
    .filter((item): item is { lang: string } => item !== null);
}
