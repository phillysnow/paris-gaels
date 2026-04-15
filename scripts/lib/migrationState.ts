import {
	copyFileSync,
	existsSync,
	mkdirSync,
	readFileSync,
	writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = join(fileURLToPath(new URL(".", import.meta.url)), "..", "..");
const stateFile = join(rootDir, "migration", "migration-state.json");

export type MigrationStateDoc = {
	prismicId?: string;
	status: "pending" | "ok" | "failed";
	lastError?: string;
	sourceKey?: string;
};

export type MigrationState = {
	version: 1;
	documents: Record<string, MigrationStateDoc>;
	completedTypes: string[];
	deferred: { id: string; description: string }[];
};

export function statePath(): string {
	return stateFile;
}

export function defaultState(): MigrationState {
	return {
		version: 1,
		documents: {},
		completedTypes: [],
		deferred: [],
	};
}

export function loadState(): MigrationState {
	const p = statePath();
	if (!existsSync(p)) return defaultState();
	try {
		const raw = readFileSync(p, "utf8");
		return JSON.parse(raw) as MigrationState;
	} catch {
		return defaultState();
	}
}

export function saveState(state: MigrationState): void {
	mkdirSync(dirname(statePath()), { recursive: true });
	writeFileSync(statePath(), JSON.stringify(state, null, 2), "utf8");
}

export function backupState(): void {
	const p = statePath();
	if (!existsSync(p)) return;
	const stamp = new Date().toISOString().replace(/[:.]/g, "-");
	copyFileSync(p, `${p}.${stamp}.bak.json`);
}

export function stateKey(type: string, lang: string, uid: string): string {
	return `${type}:${lang}:${uid}`;
}

export function singletonKey(type: string): string {
	return `${type}::__singleton__`;
}
