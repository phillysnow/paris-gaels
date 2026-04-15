import type { PrismicDocument } from "@prismicio/client";
import type { PrismicMigrationDocument } from "@prismicio/client";
import type { MigrationState } from "./migrationState.js";
import { singletonKey, stateKey } from "./migrationState.js";

/**
 * Minimal resolver per migration-runner spec. Extend when Link / content
 * relationships between migrated documents are required.
 */
export function createReferenceResolver(
	_migration: PrismicMigrationDocument<PrismicDocument>[],
	_state: MigrationState,
) {
	return function resolveLinkedDocument(
		targetType: string,
		lang: string,
		uid: string,
	): PrismicMigrationDocument<PrismicDocument> | null {
		const key = stateKey(targetType, lang, uid);
		const entry = _state.documents[key];
		if (entry?.prismicId) {
			return {
				document: {
					id: entry.prismicId,
					type: targetType,
					lang,
					uid,
					data: {} as never,
				},
			} as unknown as PrismicMigrationDocument<PrismicDocument>;
		}
		return null;
	};
}

export function resolveSingletonId(state: MigrationState, type: string): string | undefined {
	return state.documents[singletonKey(type)]?.prismicId;
}
