const testimonials = [
  {
    quote: "Gifaa made our wedding gifting so simple. No complicated portals—our guests just used our UPI link and the money was in our account instantly.",
    author: "Meera & Arjun",
    location: "Mumbai, 2023",
  },
  {
    quote: "I love that there's no middleman. When my friend bought a gift, it was shipped directly from the store to my house. Everything was so transparent.",
    author: "Priya Sharma",
    location: "Delhi, 2024",
  },
  {
    quote: "Adding items from different boutiques was a breeze. It's the most modern, direct tool for organizing gifts I've ever used.",
    author: "Vikram Rao",
    location: "Bangalore, 2023",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 px-6 md:px-8 bg-surface">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-[#79590f] font-semibold uppercase tracking-[0.2em] mb-4 text-xs font-sans">
            Real Feedback
          </span>
          <h2 className="text-4xl font-serif text-[#093a6f]">Direct &amp; Personal</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {testimonials.map((t, i) => (
            <div key={i} className="space-y-6">
              <div className="text-[#79590f] opacity-40">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "48px", fontVariationSettings: "'FILL' 1" }}
                >
                  format_quote
                </span>
              </div>
              <p className="text-lg font-serif italic text-[#093a6f] leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <h5 className="font-bold text-[#093a6f] font-serif">{t.author}</h5>
                <p className="text-xs text-on-surface-variant font-sans uppercase tracking-widest">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
