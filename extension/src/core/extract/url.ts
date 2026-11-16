/** Prefers the page's canonical URL (strips tracking params) when it stays on the same site. */
export function productUrl(doc: Document, pageUrl: string): string {
  const page = new URL(pageUrl);
  page.hash = "";
  const href = doc.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href;
  try {
    if (href && new URL(href).hostname === page.hostname) return href;
  } catch {
    /* fall through to the page URL */
  }
  return page.href;
}
