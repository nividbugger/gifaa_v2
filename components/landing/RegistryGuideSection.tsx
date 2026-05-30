import Link from "next/link";

/**
 * Long-form, crawlable SEO content for the homepage (Phase 3 of the SEO brief).
 *
 * This is a SERVER component (no "use client") so the full ~1,700 words ship in
 * the initial HTML — no hydration required for Google to read it. Content is
 * plain semantic HTML (h2/h3/p) and is NOT hidden behind tabs or accordions,
 * which keeps every keyword and internal link visible to crawlers.
 */
const RegistryGuideSection = () => {
  return (
    <section
      id="registry-guide"
      aria-labelledby="registry-guide-heading"
      className="py-24 px-6 md:px-8 bg-surface"
    >
      <div className="max-w-screen-md mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block text-[#79590f] font-semibold uppercase tracking-[0.2em] mb-4 text-xs font-sans">
            The Complete Guide
          </span>
          <h2
            id="registry-guide-heading"
            className="text-3xl md:text-4xl font-serif font-semibold text-[#093a6f]"
          >
            Your Guide to Gift Registries in India
          </h2>
        </div>

        <article className="space-y-12 font-sans text-on-surface-variant leading-relaxed text-base md:text-lg">
          {/* ── What is a Gift Registry? ── */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif text-[#093a6f]">What is a Gift Registry?</h3>
            <p>
              A <strong>gift registry</strong> is a curated wishlist that lets you tell friends and
              family exactly which gifts you would love to receive for a special occasion. Instead of
              leaving loved ones guessing — and instead of ending up with three identical mixer
              grinders — a registry brings everything you actually want into one shareable link.
              Gifaa is India&apos;s gift registry platform built for weddings, baby showers,
              housewarmings, anniversaries, birthdays and every other celebration that deserves
              thoughtful gifting.
            </p>
            <p>
              The idea is simple. You add products you genuinely need from any online store —
              Amazon India, Flipkart, Nykaa, Fabindia, Pepperfry, Tata CLiQ or a small local
              boutique — by pasting the product link. Gifaa fetches the details automatically and
              builds a beautiful page around them. You then share a single link over WhatsApp,
              email or your invitation. Guests open it, pick a gift within their budget, and buy it
              directly from the store. The moment a gift is reserved, it disappears from everyone
              else&apos;s view, so duplicates simply never happen.
            </p>
            <p>
              Unlike a traditional wishlist, a modern <strong>gift registry in India</strong> also
              supports cash gifting. With Gifaa you can add a UPI-powered cash fund — a honeymoon
              fund, a home-deposit fund or a fund for a big-ticket appliance — and guests contribute
              any amount instantly via UPI. You receive a notification, an optional message, and the
              money lands directly in your account. No middlemen, no commissions, and no awkward
              envelopes.
            </p>
          </div>

          {/* ── How Wedding Registries Work in India ── */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif text-[#093a6f]">
              How Wedding Registries Work in India
            </h3>
            <p>
              Wedding gifting in India has always been deeply personal — but also deeply
              unpredictable. Between large guest lists, far-flung relatives, and the cultural
              hesitation around asking for specific gifts, couples often receive a flood of items
              they did not need. A <Link href="/wedding-gift-registry" className="text-[#79590f] underline underline-offset-2 hover:text-[#093a6f]">wedding gift registry</Link>{" "}
              solves this gracefully by making your preferences clear without anyone having to ask.
            </p>
            <p>
              Setting up a wedding registry on Gifaa takes minutes. You choose your occasion, add the
              gifts and funds you want — from cookware and home décor to a honeymoon fund — and set
              your registry to public or private. Public registries can be discovered through search,
              while private registries are visible only to people who have your link. Either way,
              guests never need to create an account to browse or gift.
            </p>
            <p>
              On the wedding day and after, the experience stays organised. Physical gifts ship
              directly from the store to your address, so there is nothing to carry home from the
              venue. Cash contributions arrive instantly through UPI. Because every purchase updates
              the registry in real time, you always know what has been gifted, by whom, and what is
              still available — which also makes writing thank-you notes effortless.
            </p>
          </div>

          {/* ── Why Use a Wedding Gift Registry? ── */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif text-[#093a6f]">
              Why Use a Wedding Gift Registry?
            </h3>
            <p>
              The biggest reason to use a <strong>wedding gift registry</strong> is certainty —
              for you and your guests. Guests genuinely want to give something you will love, and a
              registry removes all the guesswork. They can shop within their own budget, see exactly
              what is still needed, and feel confident their gift will be appreciated rather than
              quietly returned.
            </p>
            <p>
              For couples, the benefits compound. You avoid duplicates entirely. You receive gifts
              that fit your home and your life rather than well-meaning surprises. You can include a{" "}
              <strong>honeymoon fund</strong> for couples who already share a home and would rather
              experience than accumulate. And you keep everything — physical gifts, cash funds and
              guest messages — in one elegant dashboard instead of scattered across chats and
              payment apps.
            </p>
            <p>
              There is also a financial advantage worth naming. Gifaa charges no setup fee and takes
              no commission on gifts or cash contributions. Guests buy directly from the retailer or
              send funds straight to your UPI, so the full value reaches you. A registry is not about
              asking for more — it is about making the generosity people already intend to show land
              exactly where it matters.
            </p>
          </div>

          {/* ── Gift Registry Ideas for Indian Couples ── */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif text-[#093a6f]">
              Gift Registry Ideas for Indian Couples
            </h3>
            <p>
              Not sure what to add? Start with the rhythms of an Indian home. Kitchen and dining
              essentials are perennial favourites — a quality mixer grinder, pressure cookers,
              non-stick cookware, a dinner set, and a good water purifier. For the living space,
              think home décor, curtains, bedsheets and bath linen, or statement pieces from brands
              like Fabindia and Pepperfry.
            </p>
            <p>
              Modern couples increasingly mix experiences with things. A{" "}
              <strong>honeymoon fund</strong> lets guests contribute toward flights and stays, while
              a home-deposit or appliance fund helps with the bigger milestones of setting up
              together. Smart-home devices, premium kitchen appliances, and travel gear are popular
              high-value additions that several guests can contribute toward as a group.
            </p>
            <p>
              Gifaa is not just for weddings. Create a{" "}
              <Link href="/baby-shower-gift-registry" className="text-[#79590f] underline underline-offset-2 hover:text-[#093a6f]">baby shower registry</Link>{" "}
              for nursery essentials, a{" "}
              <Link href="/housewarming-gift-registry" className="text-[#79590f] underline underline-offset-2 hover:text-[#093a6f]">housewarming registry</Link>{" "}
              for a new home, an{" "}
              <Link href="/anniversary-gift-registry" className="text-[#79590f] underline underline-offset-2 hover:text-[#093a6f]">anniversary registry</Link>{" "}
              to mark years of love, or a{" "}
              <Link href="/birthday-gift-registry" className="text-[#79590f] underline underline-offset-2 hover:text-[#093a6f]">birthday registry</Link>{" "}
              so friends gift exactly what you want. Whatever the celebration, the principle is the
              same: share one link, skip the duplicates, and receive gifts that truly matter.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
};

export default RegistryGuideSection;
