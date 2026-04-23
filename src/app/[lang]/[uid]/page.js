import { SliceZone } from "@prismicio/react";
import * as prismic from "@prismicio/client";
import { cache } from "react";
import { notFound } from "next/navigation";

import { getLocales } from "@/lib/getLocales";
import { reverseLocaleLookup, urlSegmentForPrismicLang } from "@/i18n";
import { createClient } from "@/prismicio";

import { Layout } from "@/components/Layout";
import { navItemsFromSlices } from "@/lib/sectionNavFromSlices";
import { components } from "@/slices";

const loadArticle = cache(async (uid, lang) => {
  const prismicLang = reverseLocaleLookup(lang);
  if (!prismicLang) return null;

  const client = createClient();
  try {
    return await client.getByUID("article", uid, { lang: prismicLang });
  } catch {
    return null;
  }
});

/**
 * @returns {Promise<import("next").Metadata>}
 */
export async function generateMetadata({ params }) {
  const { uid, lang } = await params;
  const page = await loadArticle(uid, lang);
  if (!page) {
    return { title: "Not found" };
  }

  return {
    title: prismic.asText(page.data.title),
  };
}

export default async function Page({ params }) {
  const { uid, lang } = await params;
  const page = await loadArticle(uid, lang);
  if (!page) notFound();

  const client = createClient();
  const prismicLang = reverseLocaleLookup(lang);

  const settings = await client
    .getSingle("site_settings", { lang: prismicLang })
    .catch(() => null);

  const allLocales = await getLocales(page, client);
  const locales = allLocales.slice(1);
  const sectionNavItems = navItemsFromSlices(page.data.slices);
  const basePath = `/${lang}/${uid}`;
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

  const articles = await client.getAllByType("article", {
    lang: "*",
    filters: [prismic.filter.not("my.article.uid", "home")],
  });

  return articles
    .map((article) => {
      const lang = urlSegmentForPrismicLang(article.lang);
      if (!lang) return null;
      return {
        uid: article.uid,
        lang,
      };
    })
    .filter(Boolean);
}