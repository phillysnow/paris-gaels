import { redirectToPreviewURL } from "@prismicio/next";
import type { NextRequest } from "next/server";

import { linkResolver, createClient } from "@/prismicio";

export async function GET(request: NextRequest): Promise<Response> {
	const client = createClient({ fetchOptions: { cache: "no-store" } });
	return redirectToPreviewURL({
		request,
		client,
		linkResolver,
	});
}
