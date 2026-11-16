import { extractProduct } from "@/core/extract";
import { productUrl } from "@/core/extract/url";

// Injected on demand by the popup (activeTab), never on page load — so we hold no broad host access.
export default defineContentScript({
  // Empty on purpose: injected via activeTab at runtime, and any pattern here would be added to host_permissions.
  matches: [],
  registration: "runtime",
  main() {
    return { ...extractProduct(document, location.href), url: productUrl(document, location.href) };
  },
});
