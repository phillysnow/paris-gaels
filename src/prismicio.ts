import { createClient as baseCreateClient } from "@prismicio/client";
import type { ClientConfig, Route, LinkResolverFunction } from "@prismicio/client";
import { enableAutoPreviews } from "@prismicio/next";
import sm from "../slicemachine.config.json";

export const repositoryName: string =
  process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || sm.repositoryName;

export const routes: Route[] = [
  { type: "landing_page", uid: "home", path: "/:lang" },
  { type: "article", path: "/:lang/:uid" },
];

export const linkResolver: LinkResolverFunction = (doc) => doc.url ?? "/";

export const createClient = (config: ClientConfig = {}) => {
  const client = baseCreateClient(repositoryName, {
    routes,
    fetchOptions:
      process.env.NODE_ENV === "production"
        ? { next: { tags: ["prismic"] }, cache: "force-cache" }
        : { next: { revalidate: 5 } },
    ...config,
  });

  enableAutoPreviews({ client });

  return client;
};
