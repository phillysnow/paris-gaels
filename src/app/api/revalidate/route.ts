import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest): Promise<Response> {
	const secret = new URL(request.url).searchParams.get("secret");
	if (!secret || secret !== process.env.PRISMIC_REVALIDATE_SECRET) {
		return Response.json({ message: "Unauthorized" }, { status: 401 });
	}

	revalidateTag("prismic");

	return Response.json({ revalidated: true, tag: "prismic" });
}
