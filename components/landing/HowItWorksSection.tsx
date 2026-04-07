const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 px-6 md:px-8 bg-surface-container-low">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-serif text-[#093a6f] mb-6">Simple &amp; Direct</h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto font-sans">
            A streamlined tool for modern celebrations. No fees, no fuss, just gifts.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-10 rounded-2xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-[#093a6f]/5 rounded-full flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-[#093a6f]" style={{ fontSize: "32px" }}>add_shopping_cart</span>
            </div>
            <h3 className="text-2xl font-serif text-[#093a6f] mb-4">1. Add</h3>
            <p className="text-on-surface-variant font-sans leading-relaxed">
              Instantly add any product from any store. Simply paste a link or browse our curated collections to build your list.
            </p>
          </div>

          <div className="bg-white p-10 rounded-2xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-[#79590f]/5 rounded-full flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-[#79590f]" style={{ fontSize: "32px" }}>send</span>
            </div>
            <h3 className="text-2xl font-serif text-[#093a6f] mb-4">2. Send</h3>
            <p className="text-on-surface-variant font-sans leading-relaxed">
              Share your private link with loved ones. They see exactly what you want, with direct links to buy or contribute.
            </p>
          </div>

          <div className="bg-white p-10 rounded-2xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-[#093a6f]/5 rounded-full flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-[#093a6f]" style={{ fontSize: "32px" }}>account_balance_wallet</span>
            </div>
            <h3 className="text-2xl font-serif text-[#093a6f] mb-4">3. Own</h3>
            <p className="text-on-surface-variant font-sans leading-relaxed">
              Gifts are shipped straight to your address, or funds land directly in your bank via UPI. It&apos;s yours instantly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
