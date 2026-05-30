/**
 * Homepage FAQ content — single source of truth.
 *
 * Shared between the visual <FAQsSection /> (client, accordion UI) and the
 * server-rendered FAQPage JSON-LD on the homepage. Keeping one array here
 * guarantees the structured data always matches the visible copy, which is a
 * Google Rich Results requirement.
 */
export interface FAQ {
  question: string;
  answer: string;
}

export const homepageFaqs: FAQ[] = [
  {
    question: "How does Gifaa prevent duplicate gifts?",
    answer:
      "When a guest marks a gift as purchased, it's immediately updated across all devices in real-time. Other guests will see the item as 'Purchased' and can choose from remaining available gifts. This ensures every gift is unique and appreciated.",
  },
  {
    question: "How do UPI cash funds work?",
    answer:
      "Cash funds let guests contribute any amount toward your goals — like a honeymoon fund or home deposit. Guests can scan your UPI QR code or use your UPI ID directly. You'll receive instant notifications when contributions are made, along with any personal messages from your guests.",
  },
  {
    question: "Can I keep my registry private?",
    answer:
      "Absolutely! You have full control over your registry's visibility. 'Public' registries can be discovered via search, while 'Private' registries are only accessible via direct link sharing. Either way, guests never need to create an account to view or gift from your registry.",
  },
  {
    question: "How does the gifting process work for guests?",
    answer:
      "Guests can browse your registry, select a gift, and click 'Gift This Item' to be redirected to the original store to complete the purchase. Before leaving, they'll see your shipping address and can optionally leave a personal message. Once purchased, they simply mark it as gifted to update your registry.",
  },
  {
    question: "Which online stores can I add gifts from?",
    answer:
      "You can add gifts from virtually any Indian online store — Amazon India, Flipkart, Myntra, Nykaa, Fabindia, Tanishq, Urban Ladder, and more. Simply paste the product URL and we'll automatically fetch the product details for you.",
  },
  {
    question: "Is there any cost to create a registry?",
    answer:
      "Creating a registry on Gifaa is completely free. There are no hidden fees, no commissions on gifts, and no premium tiers. We believe everyone deserves a beautiful, stress-free gifting experience.",
  },
];
