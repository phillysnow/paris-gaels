import type * as prismic from "@prismicio/client";
import { rewriteLocaleInPath } from "@/i18n";

type LocaleDoc = prismic.PrismicDocument & { lang_name: string };

export async function getLocales(
  doc: prismic.PrismicDocument,
  client: prismic.Client,
): Promise<LocaleDoc[]> {
  const [repository, altDocs] = await Promise.all([
    client.getRepository(),
    doc.alternate_languages.length > 0
      ? client.getAllByIDs(
          doc.alternate_languages.map((altLang) => altLang.id),
          {
            lang: "*",
            fetch: `${doc.type}.__nonexistent-field__`,
          },
        )
      : Promise.resolve([]),
  ]);

  return [doc, ...altDocs].map((d) => {
    return {
      ...d,
      url: d.url ? rewriteLocaleInPath(d.url) : d.url,
      lang_name: repository.languages.find((lang) => lang.id === d.lang)!.name,
    };
  });
}
