const brands = ["Amazon", "Tata Cliq", "Westside", "Nykaa", "FabIndia", "Ellementry", "Pepperfry", "Flipkart", "Myntra"];

export default function WorksWithSection() {
  return (
    <section className="py-12 bg-surface-container-low border-y border-outline-variant/10 overflow-hidden">
      <div className="flex whitespace-nowrap animate-infinite-scroll">
        {[brands, brands].map((set, idx) => (
          <div key={idx} className="flex items-center gap-24 px-12 shrink-0">
            {set.map((brand) => (
              <span key={brand} className="text-2xl font-serif font-bold text-[#093a6f]/40 uppercase tracking-[0.2em]">
                {brand}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
