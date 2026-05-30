import Link from "next/link";

/**
 * Crawlable cross-links between every registry landing page (SEO brief Phase 4).
 *
 * Server component — renders real <a href> anchors in the SSR HTML so Googlebot
 * can follow them and build crawl depth across all occasion pages. The
 * `currentHref` prop lets a page hide its own link so it never links to itself.
 */
const REGISTRY_LINKS = [
  { href: "/wedding-gift-registry", label: "Wedding Registry" },
  { href: "/baby-shower-gift-registry", label: "Baby Shower Registry" },
  { href: "/housewarming-gift-registry", label: "Housewarming Registry" },
  { href: "/anniversary-gift-registry", label: "Anniversary Registry" },
  { href: "/birthday-gift-registry", label: "Birthday Registry" },
];

interface RegistryCrossLinksProps {
  /** Hide the link that matches the current page (e.g. "/wedding-gift-registry"). */
  currentHref?: string;
  /** Optional heading override. */
  heading?: string;
}

const RegistryCrossLinks = ({
  currentHref,
  heading = "Explore More Gift Registries",
}: RegistryCrossLinksProps) => {
  const links = REGISTRY_LINKS.filter((l) => l.href !== currentHref);

  return (
    <section
      aria-labelledby="cross-links-heading"
      className="py-20 px-6 md:px-8 bg-surface-container-low"
    >
      <div className="max-w-screen-xl mx-auto text-center">
        <h2
          id="cross-links-heading"
          className="text-3xl font-serif text-[#093a6f] mb-3"
        >
          {heading}
        </h2>
        <p className="text-on-surface-variant font-sans mb-10 max-w-xl mx-auto">
          One platform for every celebration. Create a free registry for any occasion and share a
          single link.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-2 bg-white border border-outline-variant/20 hover:border-[#093a6f]/30 text-[#093a6f] font-medium font-sans px-6 py-3 rounded-full text-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              {link.label}
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                arrow_forward
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RegistryCrossLinks;
