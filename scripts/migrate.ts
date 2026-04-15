#!/usr/bin/env node
/**
 * WordPress (WXR) → Prismic migration runner.
 * @see migration/migration-plan.md, migration/migration-script.md
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
	createMigration,
	createWriteClient,
	type Migration,
	type PrismicMigrationDocument,
} from "@prismicio/client";
import type { AllDocumentTypes } from "../prismicio-types.js";
import { convertWpPostToArticle } from "./converters/articleFromWp.js";
import { convertWpPageToLanding } from "./converters/landingPageFromWp.js";
import type { WpConvertContext } from "./converters/wpConvertContext.js";
import { convertChannelToSiteSettings } from "./converters/siteSettingsFromWp.js";
import type { WpItem } from "./converters/wpTypes.js";
import { sortByRepositoryMasterLocaleFirst } from "./lib/lang.js";
import {
	backupState,
	loadState,
	saveState,
	singletonKey,
	stateKey,
	type MigrationState,
} from "./lib/migrationState.js";
import { pllGroupSlug } from "./lib/wxr.js";
import {
	buildAttachmentIndex,
	siteOriginFromChannel,
} from "./lib/wpAttachments.js";
import { loadChannel, loadWxItems, type WpChannel } from "./lib/wxr.js";

const rootDir = join(fileURLToPath(new URL(".", import.meta.url)), "..");

type CliMode = "dry" | "test" | "full" | "batch" | "retry";
type ContentType = "site_settings" | "landing_page" | "article" | "all";

function parseArgs(argv: string[]): Record<string, string> {
	const out: Record<string, string> = {};
	for (const a of argv) {
		if (!a.startsWith("--")) continue;
		const body = a.slice(2);
		const eq = body.indexOf("=");
		if (eq === -1) out[body] = "true";
		else out[body.slice(0, eq)] = body.slice(eq + 1);
	}
	return out;
}

function repositoryName(): string {
	if (process.env.PRISMIC_REPOSITORY?.trim())
		return process.env.PRISMIC_REPOSITORY.trim();
	const raw = readFileSync(join(rootDir, "slicemachine.config.json"), "utf8");
	const j = JSON.parse(raw) as { repositoryName?: string };
	if (!j.repositoryName) throw new Error("slicemachine.config.json missing repositoryName");
	return j.repositoryName;
}

function wxrPath(): string {
	return (
		process.env.WXR_PATH?.trim() ||
		join(rootDir, "export/wordpress/parisgaelsgaa.WordPress.2026-04-14.xml")
	);
}

function writeToken(): string {
	const t =
		process.env.PRISMIC_WRITE_TOKEN?.trim() ||
		process.env.PRISMIC_MIGRATION_WRITE_TOKEN?.trim();
	if (!t) {
		throw new Error(
			"Set PRISMIC_WRITE_TOKEN or PRISMIC_MIGRATION_WRITE_TOKEN for API-backed modes.",
		);
	}
	return t;
}

function publishedPages(items: WpItem[]): WpItem[] {
	return items.filter((i) => i.postType === "page" && i.status === "publish");
}

function publishedPosts(items: WpItem[]): WpItem[] {
	return items.filter((i) => i.postType === "post" && i.status === "publish");
}

function groupByTranslation<T extends WpItem>(
	items: T[],
	masterLocale: string,
): T[][] {
	const map = new Map<string, T[]>();
	for (const item of items) {
		const k = pllGroupSlug(item) ?? `__solo_${item.postId}`;
		if (!map.has(k)) map.set(k, []);
		map.get(k)!.push(item);
	}
	return [...map.values()].map((g) =>
		[...g].sort((a, b) =>
			sortByRepositoryMasterLocaleFirst(
				a as WpItem,
				b as WpItem,
				masterLocale,
			),
		),
	);
}

type DryIssue = { level: "error" | "warn"; message: string; ref?: string };

function dryValidateSiteSettings(channel: WpChannel): DryIssue[] {
	const issues: DryIssue[] = [];
	if (!channel.title?.trim()) {
		issues.push({ level: "warn", message: "WXR channel title is empty" });
	}
	return issues;
}

function dryValidateUidDocuments(
	type: string,
	label: string,
	entries: { key: string; uid: string; lang: string; ref: string }[],
): DryIssue[] {
	const issues: DryIssue[] = [];
	const seen = new Map<string, string>();
	for (const e of entries) {
		if (!e.uid?.trim()) {
			issues.push({
				level: "error",
				message: `${label}: empty uid`,
				ref: e.ref,
			});
		}
		const dupKey = `${type}:${e.lang}:${e.uid}`;
		if (seen.has(dupKey)) {
			issues.push({
				level: "error",
				message: `${label}: duplicate uid+lang (${e.uid} / ${e.lang})`,
				ref: e.ref,
			});
		}
		seen.set(dupKey, e.ref);
	}
	return issues;
}

function docStateKeyFromMigrationDoc(
	doc: PrismicMigrationDocument<AllDocumentTypes>["document"],
): string {
	const d = doc as { type: string; lang: string; uid?: string };
	if (typeof d.uid === "string" && d.uid.length > 0) {
		return stateKey(d.type, d.lang, d.uid);
	}
	return singletonKey(d.type);
}

function persistIdsFromMigration(
	state: MigrationState,
	migration: Migration<AllDocumentTypes>,
): void {
	for (const md of migration._documents) {
		const id = md.document.id;
		if (!id) continue;
		const key = docStateKeyFromMigrationDoc(md.document);
		const prev = state.documents[key] ?? { status: "ok" as const };
		state.documents[key] = {
			...prev,
			prismicId: id,
			status: "ok",
		};
	}
}

function markFailed(
	state: MigrationState,
	key: string,
	err: unknown,
	sourceKey?: string,
): void {
	const msg = err instanceof Error ? err.message : String(err);
	state.documents[key] = {
		...(state.documents[key] ?? {}),
		status: "failed",
		lastError: msg,
		sourceKey,
	};
}

async function runMigrateWithStatePersistence(
	writeClient: ReturnType<typeof createWriteClient<AllDocumentTypes>>,
	migration: Migration<AllDocumentTypes>,
	state: MigrationState,
): Promise<void> {
	try {
		await writeClient.migrate(migration, {
			reporter: (ev) => {
				if (ev.type === "documents:creating") {
					const d = ev.data.document.document;
					const label =
						"uid" in d && d.uid
							? `${d.type} ${d.lang} ${d.uid}`
							: `${d.type} ${d.lang}`;
					console.log(
						`  Creating ${ev.data.current}/${ev.data.total}: ${label}`,
					);
				}
				if (ev.type === "documents:updating") {
					const d = ev.data.document.document;
					const label =
						"uid" in d && d.uid
							? `${d.type} ${d.lang} ${d.uid}`
							: `${d.type} ${d.lang}`;
					console.log(
						`  Updating ${ev.data.current}/${ev.data.total}: ${label}`,
					);
				}
			},
		});
	} finally {
		persistIdsFromMigration(state, migration);
		saveState(state);
	}
}

function landingDryEntries(items: WpItem[]) {
	return publishedPages(items).map((item) => {
		const { pending } = convertWpPageToLanding(item);
		return {
			key: stateKey("landing_page", pending.lang, pending.uid),
			uid: pending.uid,
			lang: pending.lang,
			ref: `page:${item.postId}:${pending.uid}`,
		};
	});
}

function articleDryEntries(items: WpItem[]) {
	return publishedPosts(items).map((item) => {
		const { pending } = convertWpPostToArticle(item);
		return {
			key: stateKey("article", pending.lang, pending.uid),
			uid: pending.uid,
			lang: pending.lang,
			ref: `post:${item.postId}:${pending.uid}`,
		};
	});
}

function uidFilter(uidsRaw: string | undefined): Set<string> | null {
	if (!uidsRaw?.trim()) return null;
	return new Set(
		uidsRaw
			.split(",")
			.map((s) => s.trim())
			.filter(Boolean),
	);
}

function dryRun(
	mode: CliMode,
	type: ContentType,
	items: WpItem[],
	channel: WpChannel,
	uidsFilter: Set<string> | null,
): boolean {
	console.log(`\n=== Dry run (${type}) ===\n`);
	let ok = true;
	const runOne = (t: Exclude<ContentType, "all">) => {
		if (t === "site_settings") {
			const issues = dryValidateSiteSettings(channel);
			convertChannelToSiteSettings(channel);
			for (const i of issues) {
				console.log(`[${i.level}] ${i.message}`);
				if (i.level === "error") ok = false;
			}
			console.log("site_settings: converter ok (1 logical document)\n");
			return;
		}
		if (t === "landing_page") {
			let pages = publishedPages(items);
			if (uidsFilter) {
				pages = pages.filter((p) => uidsFilter.has(p.postName.trim()));
			}
			const issues = dryValidateUidDocuments(
				"landing_page",
				"Landing page",
				landingDryEntries(pages),
			);
			for (const p of pages) {
				const { pending } = convertWpPageToLanding(p);
				if (!pending.data.slices?.length) {
					issues.push({
						level: "error",
						message: "Missing slices",
						ref: p.postId,
					});
				}
			}
			for (const i of issues) {
				console.log(`[${i.level}] ${i.message}${i.ref ? ` (${i.ref})` : ""}`);
				if (i.level === "error") ok = false;
			}
			console.log(`landing_page: ${pages.length} documents validated\n`);
			return;
		}
		let posts = publishedPosts(items);
		if (uidsFilter) {
			posts = posts.filter((p) => uidsFilter.has(p.postName.trim()));
		}
		const issues = dryValidateUidDocuments(
			"article",
			"Article",
			articleDryEntries(posts),
		);
		for (const p of posts) {
			const { pending } = convertWpPostToArticle(p);
			if (!pending.data.publication_date) {
				issues.push({
					level: "error",
					message: "Missing publication_date",
					ref: p.postId,
				});
			}
			if (!pending.data.slices?.length) {
				issues.push({
					level: "error",
					message: "Missing slices",
					ref: p.postId,
				});
			}
		}
		for (const i of issues) {
			console.log(`[${i.level}] ${i.message}${i.ref ? ` (${i.ref})` : ""}`);
			if (i.level === "error") ok = false;
		}
		console.log(`article: ${posts.length} documents validated\n`);
	};

	if (type === "all") {
		runOne("site_settings");
		runOne("landing_page");
		runOne("article");
	} else {
		runOne(type);
	}

	if (!ok) console.error("Dry validation failed.\n");
	else console.log("Dry validation passed.\n");
	if (mode !== "dry" && !ok) process.exitCode = 1;
	return ok;
}

async function migrateSiteSettings(
	state: MigrationState,
	channel: WpChannel,
): Promise<void> {
	const lang = process.env.PRISMIC_LANG_FR ?? "fr-fr";
	const { pending, title } = convertChannelToSiteSettings(channel, lang);
	const key = singletonKey("site_settings");
	const migration = createMigration() as Migration<AllDocumentTypes>;
	const existingId = state.documents[key]?.prismicId;
	if (existingId) {
		migration.updateDocument(
			{ ...pending, id: existingId } as AllDocumentTypes,
			title,
		);
	} else {
		migration.createDocument(pending as never, title);
	}
	const client = createWriteClient<AllDocumentTypes>(repositoryName(), {
		writeToken: writeToken(),
	});
	try {
		await runMigrateWithStatePersistence(client, migration, state);
	} catch (e) {
		markFailed(state, key, e, "wxr:channel");
		saveState(state);
		throw e;
	}
}

async function migrateLandingPages(
	mode: Exclude<CliMode, "dry">,
	state: MigrationState,
	items: WpItem[],
	uidsFilter: Set<string> | null,
	channel: WpChannel,
): Promise<void> {
	let pages = publishedPages(items);
	if (mode === "test" && uidsFilter) {
		pages = pages.filter((p) => uidsFilter.has(p.postName.trim()));
	}
	const client = createWriteClient<AllDocumentTypes>(repositoryName(), {
		writeToken: writeToken(),
	});
	const masterLocale = (await client.getRepository()).languages[0].id;

	const migration = createMigration() as Migration<AllDocumentTypes>;
	const attachmentById = buildAttachmentIndex(items);
	const siteOrigin = siteOriginFromChannel(channel.link);
	const ctx: WpConvertContext = { migration, attachmentById, siteOrigin };
	const groups = groupByTranslation(pages, masterLocale);

	for (const group of groups) {
		let masterMd: PrismicMigrationDocument<AllDocumentTypes> | undefined;
		for (const item of group) {
			const { pending, title } = convertWpPageToLanding(item, ctx);
			const key = stateKey("landing_page", pending.lang, pending.uid);
			const existingId = state.documents[key]?.prismicId;
			let md: PrismicMigrationDocument<AllDocumentTypes>;
			if (existingId) {
				md = migration.updateDocument(
					{ ...pending, id: existingId } as AllDocumentTypes,
					title,
				);
			} else if (masterMd) {
				md = migration.createDocument(pending as never, title, {
					masterLanguageDocument: masterMd,
				});
			} else {
				md = migration.createDocument(pending as never, title);
			}
			if (!masterMd) masterMd = md;
		}
	}

	try {
		await runMigrateWithStatePersistence(client, migration, state);
	} catch (e) {
		console.error("Migration API error (landing_page batch):", e);
		if (e && typeof e === "object" && "response" in e) {
			const res = (e as { response?: { details?: unknown } }).response;
			if (res?.details)
				console.error("Prismic details:", JSON.stringify(res.details, null, 2));
		}
		throw e;
	}
}

async function migrateArticles(
	mode: Exclude<CliMode, "dry">,
	state: MigrationState,
	items: WpItem[],
	uidsFilter: Set<string> | null,
	channel: WpChannel,
): Promise<void> {
	let posts = publishedPosts(items);
	if (mode === "test" && uidsFilter) {
		posts = posts.filter((p) => uidsFilter.has(p.postName.trim()));
	}
	const client = createWriteClient<AllDocumentTypes>(repositoryName(), {
		writeToken: writeToken(),
	});
	const masterLocale = (await client.getRepository()).languages[0].id;

	const migration = createMigration() as Migration<AllDocumentTypes>;
	const attachmentById = buildAttachmentIndex(items);
	const siteOrigin = siteOriginFromChannel(channel.link);
	const ctx: WpConvertContext = { migration, attachmentById, siteOrigin };
	const groups = groupByTranslation(posts, masterLocale);

	for (const group of groups) {
		let masterMd: PrismicMigrationDocument<AllDocumentTypes> | undefined;
		for (const item of group) {
			const { pending, title } = convertWpPostToArticle(item, ctx);
			const key = stateKey("article", pending.lang, pending.uid);
			const existingId = state.documents[key]?.prismicId;
			let md: PrismicMigrationDocument<AllDocumentTypes>;
			if (existingId) {
				md = migration.updateDocument(
					{ ...pending, id: existingId } as AllDocumentTypes,
					title,
				);
			} else if (masterMd) {
				md = migration.createDocument(pending as never, title, {
					masterLanguageDocument: masterMd,
				});
			} else {
				md = migration.createDocument(pending as never, title);
			}
			if (!masterMd) masterMd = md;
		}
	}

	try {
		await runMigrateWithStatePersistence(client, migration, state);
	} catch (e) {
		console.error("Migration API error (article batch):", e);
		throw e;
	}
}

function printFailureSummary(state: MigrationState): void {
	const failed = Object.entries(state.documents).filter(
		([, v]) => v.status === "failed",
	);
	if (!failed.length) return;
	console.log("\n--- Failed documents ---\n");
	const byMsg = new Map<string, string[]>();
	for (const [k, v] of failed) {
		const msg = v.lastError ?? "unknown";
		if (!byMsg.has(msg)) byMsg.set(msg, []);
		byMsg.get(msg)!.push(k);
	}
	for (const [msg, keys] of byMsg) {
		console.log(`${msg}`);
		for (const k of keys) console.log(`  - ${k}`);
	}
}

async function runRetry(
	state: MigrationState,
	items: WpItem[],
	channel: WpChannel,
): Promise<void> {
	const migration = createMigration() as Migration<AllDocumentTypes>;
	const attachmentById = buildAttachmentIndex(items);
	const siteOrigin = siteOriginFromChannel(channel.link);
	const ctx: WpConvertContext = { migration, attachmentById, siteOrigin };
	for (const [key, doc] of Object.entries(state.documents)) {
		if (doc.status !== "failed" || !doc.sourceKey) continue;
		const m = /^wp:(post|page):(.+)$/.exec(doc.sourceKey);
		if (!m) continue;
		const postId = m[2];
		const item = items.find((i) => i.postId === postId);
		if (!item) {
			console.warn(`Retry: source not found for ${key} (${doc.sourceKey})`);
			continue;
		}
		if (m[1] === "page") {
			const { pending, title } = convertWpPageToLanding(item, ctx);
			const k = stateKey("landing_page", pending.lang, pending.uid);
			const existingId = state.documents[k]?.prismicId;
			try {
				if (existingId) {
					migration.updateDocument(
						{ ...pending, id: existingId } as AllDocumentTypes,
						title,
					);
				} else {
					migration.createDocument(pending as never, title);
				}
			} catch (e) {
				markFailed(state, k, e, doc.sourceKey);
			}
		} else {
			const { pending, title } = convertWpPostToArticle(item, ctx);
			const k = stateKey("article", pending.lang, pending.uid);
			const existingId = state.documents[k]?.prismicId;
			try {
				if (existingId) {
					migration.updateDocument(
						{ ...pending, id: existingId } as AllDocumentTypes,
						title,
					);
				} else {
					migration.createDocument(pending as never, title);
				}
			} catch (e) {
				markFailed(state, k, e, doc.sourceKey);
			}
		}
	}
	const client = createWriteClient<AllDocumentTypes>(repositoryName(), {
		writeToken: writeToken(),
	});
	await runMigrateWithStatePersistence(client, migration, state);
}

async function main(): Promise<void> {
	const args = parseArgs(process.argv.slice(2));
	const mode = (args.mode ?? "dry") as CliMode;
	const type = (args.type ?? "all") as ContentType;
	const uidsFilter = uidFilter(args.uids);

	const validModes: CliMode[] = ["dry", "test", "full", "batch", "retry"];
	if (!validModes.includes(mode)) {
		console.error(`Unknown mode: ${mode}`);
		process.exitCode = 1;
		return;
	}
	const validTypes: ContentType[] = [
		"site_settings",
		"landing_page",
		"article",
		"all",
	];
	if (!validTypes.includes(type)) {
		console.error(`Unknown type: ${type}`);
		process.exitCode = 1;
		return;
	}

	const path = wxrPath();
	console.log(`WXR: ${path}`);
	const channel = loadChannel(path);
	const items = loadWxItems(path);

	if (mode === "dry") {
		dryRun(mode, type, items, channel, uidsFilter);
		return;
	}

	if (mode === "test" && !uidsFilter?.size && type !== "site_settings") {
		console.error("test mode requires --uids=slug1,slug2 (or use type=site_settings)");
		process.exitCode = 1;
		return;
	}

	backupState();
	let state = loadState();

	if (mode === "retry") {
		await runRetry(state, items, channel);
		printFailureSummary(state);
		return;
	}

	const runType = async (t: Exclude<ContentType, "all">) => {
		if (t === "site_settings") await migrateSiteSettings(state, channel);
		if (t === "landing_page")
			await migrateLandingPages(mode, state, items, uidsFilter, channel);
		if (t === "article")
			await migrateArticles(mode, state, items, uidsFilter, channel);
		state = loadState();
		if (
			(mode === "full" || mode === "batch") &&
			!state.completedTypes.includes(t)
		) {
			state.completedTypes.push(t);
			saveState(state);
		}
	};

	try {
		if (type === "all" || type === "site_settings") {
			if (!dryRun("dry", "site_settings", items, channel, null)) process.exit(1);
		}
		if (type === "all" || type === "site_settings") {
			await runType("site_settings");
		}

		if (type === "all" || type === "landing_page") {
			if (!dryRun("dry", "landing_page", items, channel, uidsFilter))
				process.exit(1);
		}
		if (type === "all" || type === "landing_page") {
			await runType("landing_page");
		}

		if (type === "all" || type === "article") {
			if (!dryRun("dry", "article", items, channel, uidsFilter)) process.exit(1);
		}
		if (type === "all" || type === "article") {
			await runType("article");
		}

		printFailureSummary(state);
	} catch (e) {
		console.error(e);
		process.exitCode = 1;
	}
}

main();
