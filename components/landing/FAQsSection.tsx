"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does Gifaa prevent duplicate gifts?",
    answer: "When a guest marks a gift as purchased, it's immediately updated across all devices in real-time. Other guests will see the item as 'Purchased' and can choose from remaining available gifts. This ensures every gift is unique and appreciated.",
  },
  {
    question: "How do UPI cash funds work?",
    answer: "Cash funds let guests contribute any amount toward your goals — like a honeymoon fund or home deposit. Guests can scan your UPI QR code or use your UPI ID directly. You'll receive instant notifications when contributions are made, along with any personal messages from your guests.",
  },
  {
    question: "Can I keep my registry private?",
    answer: "Absolutely! You have full control over your registry's visibility. 'Public' registries can be discovered via search, while 'Private' registries are only accessible via direct link sharing. Either way, guests never need to create an account to view or gift from your registry.",
  },
  {
    question: "How does the gifting process work for guests?",
    answer: "Guests can browse your registry, select a gift, and click 'Gift This Item' to be redirected to the original store to complete the purchase. Before leaving, they'll see your shipping address and can optionally leave a personal message. Once purchased, they simply mark it as gifted to update your registry.",
  },
  {
    question: "Which online stores can I add gifts from?",
    answer: "You can add gifts from virtually any Indian online store — Amazon India, Flipkart, Myntra, Nykaa, Fabindia, Tanishq, Urban Ladder, and more. Simply paste the product URL and we'll automatically fetch the product details for you.",
  },
  {
    question: "Is there any cost to create a registry?",
    answer: "Creating a registry on Gifaa is completely free. There are no hidden fees, no commissions on gifts, and no premium tiers. We believe everyone deserves a beautiful, stress-free gifting experience.",
  },
];

export default function FAQsSection() {
  return (
    <section id="faqs" className="py-20 md:py-24 bg-ivory-warm">
      <div className="container mx-auto max-w-3xl px-6">
        <div className="text-center mb-12 animate-fade-up">
          <span className="inline-block text-gold text-sm font-semibold tracking-wider uppercase mb-4">FAQs</span>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-charcoal mb-4">Common Questions</h2>
          <p className="text-charcoal-light text-lg">Everything you need to know about creating your perfect registry.</p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white rounded-xl border border-gold/10 px-6 shadow-soft data-[state=open]:border-gold/30 data-[state=open]:shadow-elevated transition-all animate-fade-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <AccordionTrigger className="text-left font-medium text-charcoal hover:text-royal hover:no-underline py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-charcoal-light leading-relaxed pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
