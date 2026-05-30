"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { homepageFaqs as faqs } from "@/lib/faqs";

export default function FAQsSection() {
  return (
    <section id="faqs" className="py-20 md:py-24 bg-surface-container-low">
      <div className="container mx-auto max-w-3xl px-6">
        <div className="text-center mb-12">
          <span className="inline-block text-[#79590f] text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-sans">FAQs</span>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-[#093a6f] mb-4">Common Questions</h2>
          <p className="text-on-surface-variant text-lg font-sans">Everything you need to know about creating your perfect registry.</p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-surface rounded-xl border border-outline-variant/20 px-6 data-[state=open]:border-[#79590f]/30 transition-all"
            >
              <AccordionTrigger className="text-left font-medium text-on-surface hover:text-[#093a6f] hover:no-underline py-5 font-sans">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-on-surface-variant leading-relaxed pb-5 font-sans">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
