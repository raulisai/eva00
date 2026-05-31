type PageInjectorProps = {
  reloadKey?: number;
  url: string;
};

export function createProxyUrl(url: string, reloadKey = 0) {
  if (!url) {
    return "";
  }

  const params = new URLSearchParams({
    url,
    v: String(reloadKey),
  });

  return `/api/proxy?${params.toString()}`;
}

export function PageInjector({ reloadKey = 0, url }: PageInjectorProps) {
  // MVP: only prepares the iframe URL.
  // Future phase: connect this boundary to Playwright, HTML rewriting, script injection,
  // DOM event capture, and EVA-controlled browser actions.
  return createProxyUrl(url, reloadKey);
}
