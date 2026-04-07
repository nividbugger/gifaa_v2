import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import HeroSection from "@/components/landing/HeroSection";
import OccasionsSection from "@/components/landing/OccasionsSection";
import WhyGifaaSection from "@/components/landing/WhyGifaaSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import WorksWithSection from "@/components/landing/WorksWithSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import FAQsSection from "@/components/landing/FAQsSection";
import Footer from "@/components/layout/Footer";
import RevealWrapper from "@/components/layout/RevealWrapper";

const homepageJsonLd = {
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

export const metadata: Metadata = {
  title: "Gifaa – India's Premier Gift Registry Platform",
  description: "Create beautiful gift registries for weddings, baby showers, housewarmings, and more. No duplicates. No confusion. Just joy.",
  alternates: { canonical: "https://gifaa.in" },
  openGraph: {
    title: "Gifaa – India's Premier Gift Registry Platform",
    description: "Create beautiful gift registries for weddings, baby showers, housewarmings, and more. No duplicates. No confusion. Just joy.",
    url: "https://gifaa.in",
    images: [{ url: "https://gifaa.in/lovable-uploads/2906e693-4dd1-4514-8524-e5acfd185f93.png" }],
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageJsonLd) }}
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
          <FAQsSection />
        </RevealWrapper>
      </main>
      <Footer />
    </div>
  );
}
