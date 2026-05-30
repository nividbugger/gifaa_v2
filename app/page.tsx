import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import HeroSection from "@/components/landing/HeroSection";
import OccasionsSection from "@/components/landing/OccasionsSection";
import WhyGifaaSection from "@/components/landing/WhyGifaaSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import WorksWithSection from "@/components/landing/WorksWithSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import FAQsSection from "@/components/landing/FAQsSection";
import RegistryGuideSection from "@/components/landing/RegistryGuideSection";
import RegistryCrossLinks from "@/components/landing/RegistryCrossLinks";
import Footer from "@/components/layout/Footer";
import RevealWrapper from "@/components/layout/RevealWrapper";
import { homepageFaqs } from "@/lib/faqs";

// Existing WebApplication schema — retained per the SEO brief.
const webApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Gifaa",
  url: "https://gifaa.in",
  description: "India's premier gift registry platform. Create beautiful gift registries for weddings, baby showers, housewarmings, and more.",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  author: { "@type": "Organization", name: "Gifaa", url: "https://gifaa.in" },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Gifaa",
  url: "https://gifaa.in",
  logo: "https://gifaa.in/gifaa-logo.png",
  description:
    "India's gift registry platform for weddings, baby showers, housewarmings, anniversaries and celebrations.",
};

// WebSite schema with a SearchAction — the /search route is a real, working
// site search (Supabase-backed), so the SearchAction target is legitimate.
const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Gifaa",
  url: "https://gifaa.in",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://gifaa.in/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

// FAQPage schema generated from the actual, visible homepage FAQs so the
// structured data always matches on-page content (a Rich Results requirement).
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: homepageFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export const metadata: Metadata = {
  title:
    "Wedding Gift Registry India | Baby Shower, Housewarming & Anniversary Registries | Gifaa",
  description:
    "Create wedding gift registries, baby shower registries, housewarming registries, anniversary registries and more. Share one link and receive gifts directly from any store.",
  alternates: { canonical: "https://gifaa.in" },
  openGraph: {
    title:
      "Wedding Gift Registry India | Baby Shower, Housewarming & Anniversary Registries | Gifaa",
    description:
      "Create wedding gift registries, baby shower registries, housewarming registries, anniversary registries and more.",
    url: "https://gifaa.in",
    images: [{ url: "https://gifaa.in/lovable-uploads/2906e693-4dd1-4514-8524-e5acfd185f93.png" }],
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Header />
      <main>
        <HeroSection />
        <RevealWrapper delay={0}>
          <HowItWorksSection />
        </RevealWrapper>
        <RevealWrapper delay={0}>
          <OccasionsSection />
        </RevealWrapper>
        <RevealWrapper delay={0}>
          <WhyGifaaSection />
        </RevealWrapper>
        <RevealWrapper delay={0}>
          <TestimonialsSection />
        </RevealWrapper>
        <RevealWrapper delay={0}>
          <WorksWithSection />
        </RevealWrapper>
        <RevealWrapper delay={0}>
          <RegistryGuideSection />
        </RevealWrapper>
        <RevealWrapper delay={0}>
          <FAQsSection />
        </RevealWrapper>
        <RevealWrapper delay={0}>
          <RegistryCrossLinks />
        </RevealWrapper>
      </main>
      <Footer />
    </div>
  );
}
