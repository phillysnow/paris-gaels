import { PrismicNextLink } from "@prismicio/next";
import { PrismicRichText as BasePrismicRichText } from "@prismicio/react";
import type { JSXMapSerializer, PrismicRichTextProps } from "@prismicio/react";

const defaultComponents: JSXMapSerializer = {
  paragraph: ({ children }) => <p className="mb-7 last:mb-0">{children}</p>,
  oList: ({ children }) => (
    <ol className="mb-7 pl-4 last:mb-0 md:pl-6">{children}</ol>
  ),
  oListItem: ({ children }) => (
    <li className="mb-1 list-decimal pl-1 last:mb-0 md:pl-2">{children}</li>
  ),
  list: ({ children }) => (
    <ul className="mb-7 pl-4 last:mb-0 md:pl-6">{children}</ul>
  ),
  listItem: ({ children }) => (
    <li className="mb-1 list-disc pl-1 last:mb-0 md:pl-2">{children}</li>
  ),
  preformatted: ({ children }) => (
    <pre className="mb-7 rounded-sm border border-pg-card-border bg-pg-surface-blue p-4 text-sm text-pg-ink last:mb-0 md:p-8 md:text-lg">
      <code>{children}</code>
    </pre>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  hyperlink: ({ children, node }) => (
    <PrismicNextLink
      field={node.data}
      className="underline decoration-1 underline-offset-2"
    >
      {children}
    </PrismicNextLink>
  ),
};

type Props = PrismicRichTextProps & { components?: JSXMapSerializer };

export function PrismicRichText({ components, ...props }: Props) {
  return (
    <BasePrismicRichText
      components={{ ...defaultComponents, ...components }}
      {...props}
    />
  );
}
