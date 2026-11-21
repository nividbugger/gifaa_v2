// Rules every catalog entry must satisfy. Enforced when the page is built (resolveSections throws),
// so a bad link can never ship, and covered by tests. Dependency-free on purpose.

import type { CatalogSection } from "./catalog";

export const AMAZON_AFFILIATE_TAG = "gifaa04-21";
export const AMAZON_SECTION_ID = "amazon";

/** Returns human-readable problems; an empty list means the catalog is valid. */
export function findCatalogProblems(sections: readonly CatalogSection[], isAmazon: (url: string) => boolean): string[] {
  const problems: string[] = [];
  const seen = new Set<string>();

  for (const section of sections) {
    for (const { url } of section.items) {
      const where = `[${section.id}] ${url}`;

      let parsed: URL;
      try {
        parsed = new URL(url);
      } catch {
        problems.push(`${where}: not a valid URL`);
        continue;
      }
      if (parsed.protocol !== "https:") problems.push(`${where}: must be an https link`);
      if (seen.has(url)) problems.push(`${where}: listed more than once`);
      seen.add(url);

      const amazon = isAmazon(url);
      if (amazon && section.id !== AMAZON_SECTION_ID) problems.push(`${where}: Amazon links belong in the "${AMAZON_SECTION_ID}" section`);
      if (!amazon && section.id === AMAZON_SECTION_ID) problems.push(`${where}: only Amazon links belong in the "${AMAZON_SECTION_ID}" section`);

      if (amazon) {
        if (parsed.searchParams.get("tag") !== AMAZON_AFFILIATE_TAG) problems.push(`${where}: Amazon links must include tag=${AMAZON_AFFILIATE_TAG}`);
        if (!parsed.searchParams.get("linkId")) problems.push(`${where}: Amazon links must include linkId=...`);
      }
    }
  }
  return problems;
}
