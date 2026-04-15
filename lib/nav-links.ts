import { asLink, isFilled } from "@prismicio/client";
import type { SiteSettingsDocument } from "@/prismicio-types";
import { linkResolver } from "@/lib/linkResolver";

export type NavLinkItem = { href: string; label: string };

type RepeatableLinks = SiteSettingsDocument["data"]["primary_navigation"];

export function navLinksFromRepeatable(fields: RepeatableLinks): NavLinkItem[] {
	const out: NavLinkItem[] = [];
	for (const field of fields ?? []) {
		if (!isFilled.link(field)) continue;
		const href = asLink(field, { linkResolver }) ?? "#";
		const label = field.text?.trim() || href;
		out.push({ href, label });
	}
	return out;
}

export function fallbackNav(lang: "fr-fr" | "en-gb"): NavLinkItem[] {
	const base = lang === "en-gb" ? "/en" : "/";
	if (lang === "en-gb") {
		return [
			{ href: `${base}#hero`, label: "Home" },
			{ href: `${base}#about`, label: "About" },
			{ href: `${base}#sports`, label: "Sports" },
			{ href: `${base}#training`, label: "Training" },
			{ href: `${base}#news`, label: "News" },
			{ href: `${base}#join`, label: "Contact" },
		];
	}
	return [
		{ href: `${base}#hero`, label: "Accueil" },
		{ href: `${base}#about`, label: "À propos" },
		{ href: `${base}#sports`, label: "Sports" },
		{ href: `${base}#training`, label: "Entraînement" },
		{ href: `${base}#news`, label: "Actualités" },
		{ href: `${base}#join`, label: "Contact" },
	];
}
