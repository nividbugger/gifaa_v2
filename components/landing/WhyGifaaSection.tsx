"use client";

import { useRouter } from "next/navigation";

const WhyGifaaSection = () => {
  const router = useRouter();

  return (
    <section className="py-24 px-6 md:px-8 bg-[#093a6f] overflow-hidden relative">
      {/* Decorative skewed accent */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#79590f]/10 -skew-x-12 transform translate-x-20 pointer-events-none" />

      <div className="max-w-screen-xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: headline + features */}
          <div>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-8 leading-tight">
              Your Wishlist,{" "}
              <br />
              <span className="text-[#ebc16f] italic">Zero Middlemen.</span>
            </h2>

            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="shrink-0 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#ebc16f]">link</span>
                </div>
                <div>
                  <h4 className="text-xl font-serif text-white mb-2">Universal Cart</h4>
                  <p className="text-[#a7c8ff] font-sans leading-relaxed">
                    Found something on Amazon, Tata Cliq, or a small boutique? Just paste the URL. Your guests buy it directly for you.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="shrink-0 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#ebc16f]">currency_rupee</span>
                </div>
                <div>
                  <h4 className="text-xl font-serif text-white mb-2">Direct UPI Settlement</h4>
                  <p className="text-[#a7c8ff] font-sans leading-relaxed">
                    No holding periods. When guests contribute cash, it goes directly to your UPI ID. Instant, secure, and personal.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: demo widget */}
          <div className="bg-white/5 backdrop-blur-md p-2 rounded-3xl border border-white/10 shadow-2xl">
            <div className="bg-surface p-8 rounded-2xl">
              <div className="mb-6">
                <label className="block text-[#79590f] font-semibold mb-2 text-[11px] uppercase tracking-widest font-sans">
                  Paste Product Link
                </label>
                <div className="flex gap-2">
                  <input
                    className="flex-1 bg-surface-container-low border border-outline-variant/20 rounded-lg font-sans text-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#79590f]/20 text-on-surface"
                    placeholder="https://store.com/product/..."
                    type="text"
                    readOnly
                  />
                  <button
                    onClick={() => router.push("/create-registry")}
                    className="bg-[#093a6f] text-white px-5 py-3 rounded-lg font-medium text-sm hover:bg-[#0d4a8a] transition-colors"
                  >
                    Add Item
                  </button>
                </div>
              </div>

              <div className="border-t border-outline-variant/10 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-serif text-[#093a6f] font-bold">Quick Gift Fund</h5>
                  <span className="material-symbols-outlined text-[#79590f]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    diamond
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <button className="py-3 border border-outline-variant/20 rounded-lg text-on-surface hover:bg-surface-container transition-colors text-sm font-sans">
                    ₹5,000
                  </button>
                  <button className="py-3 border border-[#79590f] bg-[#79590f]/5 rounded-lg text-[#79590f] font-bold text-sm font-sans">
                    ₹10,000
                  </button>
                  <button className="py-3 border border-outline-variant/20 rounded-lg text-on-surface hover:bg-surface-container transition-colors text-sm font-sans">
                    Custom
                  </button>
                </div>

                <div className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded flex items-center justify-center shadow-sm">
                      <span className="text-[10px] font-black text-blue-900 italic">UPI</span>
                    </div>
                    <span className="text-xs font-medium text-on-surface-variant font-sans">Instant Direct Settlement</span>
                  </div>
                  <span className="material-symbols-outlined text-green-600" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified_user
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyGifaaSection;
