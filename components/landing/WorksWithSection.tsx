const brands = ["Amazon", "Tata Cliq", "Westside", "Nykaa", "FabIndia", "Ellementry", "Pepperfry", "Flipkart", "Myntra"];

const pressLogos = ["VOGUE INDIA", "BRIDES TODAY", "ARCHITECTURAL DIGEST", "YOURSTORY", "ELLE DECOR"];

export default function WorksWithSection() {
  return (
    <>
      {/* Brand infinite scroll banner */}
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

      {/* Trust signals / press logos */}
      <section className="py-16 px-6 md:px-8 border-b border-outline-variant/5">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 opacity-60 hover:opacity-100 transition-opacity duration-500 text-center md:text-left">
          {pressLogos.map((logo) => (
            <span key={logo} className="text-lg font-serif font-bold text-[#093a6f] uppercase tracking-wider">
              {logo}
            </span>
          ))}
        </div>
      </section>
    </>
  );
}
