import type { NextRequest } from "next/server";

function normalizeProxyUrl(rawUrl: string) {
  const withProtocol = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
  const url = new URL(withProtocol);

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Unsupported protocol");
  }

  return url.toString();
}

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get("url")?.trim();

  if (!rawUrl) {
    return Response.json({ error: "Missing url query parameter" }, { status: 400 });
  }

  try {
    const url = normalizeProxyUrl(rawUrl);

    // MVP: redirect the iframe to the target URL.
    // Future phase: fetch HTML here, rewrite relative assets, handle CORS,
    // sanitize scripts, inject EVA controls, and connect Playwright/browser state.
    return Response.redirect(url, 307);
  } catch {
    return Response.json({ error: "Invalid url" }, { status: 400 });
  }
}
