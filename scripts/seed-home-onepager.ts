#!/usr/bin/env node
/**
 * Prepend default one-pager slices to `landing_page` **accueil** (fr-fr) and **home** (en-gb).
 * Requires `PRISMIC_WRITE_TOKEN` or `PRISMIC_MIGRATION_WRITE_TOKEN` and Slice models pushed to Prismic.
 *
 *   node --env-file=.env.local --import tsx ./scripts/seed-home-onepager.ts --dry
 *   node --env-file=.env.local --import tsx ./scripts/seed-home-onepager.ts --apply
 *   node --env-file=.env.local --import tsx ./scripts/seed-home-onepager.ts --apply --force
 *
 * `--force` prepends seed slices even if a Hero slice already exists.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
	createMigration,
	createWriteClient,
	type Migration,
} from "@prismicio/client";
import type { AllDocumentTypes } from "../prismicio-types.js";
import { createClient } from "../src/prismicio.js";
import { buildOnePagerSeedSlices } from "./lib/onepagerSeedSlices.js";

const rootDir = join(fileURLToPath(new URL(".", import.meta.url)), "..");

function repositoryName(): string {
	if (process.env.PRISMIC_REPOSITORY?.trim())
		return process.env.PRISMIC_REPOSITORY.trim();
	const raw = readFileSync(join(rootDir, "slicemachine.config.json"), "utf8");
	const j = JSON.parse(raw) as { repositoryName?: string };
	if (!j.repositoryName) throw new Error("slicemachine.config.json missing repositoryName");
	return j.repositoryName;
}

function writeToken(): string {
	const t =
		process.env.PRISMIC_WRITE_TOKEN?.trim() ||
		process.env.PRISMIC_MIGRATION_WRITE_TOKEN?.trim();
	if (!t) {
		throw new Error(
			"Set PRISMIC_WRITE_TOKEN or PRISMIC_MIGRATION_WRITE_TOKEN for --apply.",
		);
	}
	return t;
}

async function main(): Promise<void> {
	const dry = process.argv.includes("--dry");
	const apply = process.argv.includes("--apply");
	const force = process.argv.includes("--force");

	if (!dry && !apply) {
		console.error("Pass --dry (print only) or --apply (run migration).");
		process.exitCode = 1;
		return;
	}

	const read = createClient();
	const targets = [
		{ uid: "accueil" as const, lang: "fr-fr" as const },
		{ uid: "home" as const, lang: "en-gb" as const },
	];

	for (const { uid, lang } of targets) {
		const doc = await read.getByUID("landing_page", uid, { lang });
		const hasHero = doc.data.slices.some(
			(s: { slice_type: string }) => s.slice_type === "Hero",
		);
		if (hasHero && !force) {
			console.log(`[${uid} ${lang}] skipped: Hero slice already exists (use --force).`);
			continue;
		}

		const seed = buildOnePagerSeedSlices(lang);
		const nextSlices = [...seed, ...doc.data.slices];

		if (dry) {
			console.log(`[${uid} ${lang}] would prepend ${seed.length} slices (total ${nextSlices.length}).`);
			console.log(JSON.stringify(seed.map((s) => s.slice_type)));
			continue;
		}

		const migration = createMigration() as Migration<AllDocumentTypes>;
		const title = doc.data.meta_title?.trim() || uid;
		migration.updateDocument(
			{
				...doc,
				data: {
					...doc.data,
					slices: nextSlices,
				},
			} as AllDocumentTypes,
			title,
		);

		const write = createWriteClient<AllDocumentTypes>(repositoryName(), {
			writeToken: writeToken(),
		});
		await write.migrate(migration);
		console.log(`[${uid} ${lang}] updated (${nextSlices.length} slices).`);
	}
}

main().catch((e) => {
	console.error(e);
	process.exitCode = 1;
});
