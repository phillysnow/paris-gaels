import { redirectToPreviewURL } from "@prismicio/next";

import { linkResolver } from "@/prismicio";
import { createClient } from "@/prismicio";

export async function GET(request) {
	const client = createClient({ fetchOptions: { cache: "no-store" } });
	return redirectToPreviewURL({
		request,
		client,
		linkResolver,
	});
}
