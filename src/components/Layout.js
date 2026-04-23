import { Header } from "./Header";

export function Layout({
  locales,
  settings,
  sectionNavItems = [],
  basePath = "",
  children,
}) {
  return (
    <div className="text-pg-ink">
      <Header
        locales={locales}
        settings={settings}
        sectionNavItems={sectionNavItems}
        basePath={basePath}
      />
      <main>{children}</main>
    </div>
  );
}