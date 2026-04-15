import { getSlices, SliceSimulator } from "@prismicio/next";
import { SliceZone } from "@prismicio/react";

import { components } from "@/slices";
import type { SliceZoneContext } from "@/slices/slice-context";

type PageProps = {
	searchParams: Promise<{ state?: string | string[] }>;
};

export default async function SliceSimulatorPage({ searchParams }: PageProps) {
	const sp = await searchParams;
	const state = typeof sp.state === "string" ? sp.state : undefined;
	const slices = getSlices(state);
	const context: SliceZoneContext = { lang: "fr-fr" };

	return (
		<SliceSimulator>
			<SliceZone slices={slices} components={components} context={context} />
		</SliceSimulator>
	);
}
