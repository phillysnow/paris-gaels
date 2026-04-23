import { getSlices, SliceSimulator } from "@prismicio/next";
import { SliceZone } from "@prismicio/react";

import { components } from "@/slices";

export default async function SliceSimulatorPage({ searchParams }) {
	const sp = await searchParams;
	const state = typeof sp.state === "string" ? sp.state : undefined;
	const slices = getSlices(state);
	const context = { lang: "fr-fr" };

	return (
		<SliceSimulator>
			<SliceZone slices={slices} components={components} context={context} />
		</SliceSimulator>
	);
}
