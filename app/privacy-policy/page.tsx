import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Gifaa",
  description: "Gifaa's privacy policy — how we collect, use, and protect your personal information.",
  alternates: { canonical: "https://gifaa.in/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="text-4xl font-serif font-bold text-royal mb-2">Privacy Policy</h1>
          <p className="text-charcoal-light text-sm mb-10">
            Welcome to Gifaa (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;). We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform, website, and services.
          </p>

          <div className="prose prose-lg max-w-none space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-xl font-serif font-semibold text-royal mb-3">1. Information We Collect</h2>

              <h3 className="text-lg font-serif font-medium text-royal mt-4 mb-2">a. Information You Provide</h3>
              <p className="text-charcoal leading-relaxed mb-3">We may collect the following personal information:</p>
              <ul className="space-y-2 ml-6">
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>Name, email address, and phone number</span>
                </li>
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>Account login credentials</span>
                </li>
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>Event details (wedding, baby shower, etc.)</span>
                </li>
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>UPI ID or payment-related identifiers</span>
                </li>
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>Wishlist or registry details</span>
                </li>
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>Communication data (messages, support queries)</span>
                </li>
              </ul>

              <h3 className="text-lg font-serif font-medium text-royal mt-6 mb-2">b. Information Collected Automatically</h3>
              <p className="text-charcoal leading-relaxed mb-3">When you use our platform, we may collect:</p>
              <ul className="space-y-2 ml-6">
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>IP address and device information</span>
                </li>
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>Browser type and usage behavior</span>
                </li>
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>Cookies and tracking data</span>
                </li>
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>Pages visited and interaction data</span>
                </li>
              </ul>
              <p className="text-charcoal-light text-sm mt-3 italic">
                Such automatic data collection is standard for improving services and analytics.
              </p>

              <h3 className="text-lg font-serif font-medium text-royal mt-6 mb-2">c. Third-Party Data</h3>
              <p className="text-charcoal leading-relaxed mb-3">We may receive information when:</p>
              <ul className="space-y-2 ml-6">
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>You link external product URLs (e.g., Amazon, Tata Cliq)</span>
                </li>
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>You use third-party logins or integrations</span>
                </li>
              </ul>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl font-serif font-semibold text-royal mb-3">2. How We Use Your Information</h2>
              <p className="text-charcoal leading-relaxed mb-3">We use your data to:</p>
              <ul className="space-y-2 ml-6">
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>Create and manage your account</span>
                </li>
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>Enable gift registry functionality</span>
                </li>
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>Facilitate direct UPI transactions between users</span>
                </li>
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>Improve platform performance and user experience</span>
                </li>
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>Communicate updates, offers, and support responses</span>
                </li>
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>Prevent fraud and ensure platform security</span>
                </li>
              </ul>
              <p className="text-charcoal-light text-sm mt-3 italic">
                We may also use aggregated (non-identifiable) data for analytics and improvements.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl font-serif font-semibold text-royal mb-3">3. Payments &amp; Financial Information</h2>
              <ul className="space-y-2 ml-6">
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>Gifaa does not store sensitive financial data like bank passwords or full payment credentials.</span>
                </li>
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>UPI transactions are processed directly between users and payment providers.</span>
                </li>
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>We may store limited identifiers (like UPI ID) to enable transactions.</span>
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl font-serif font-semibold text-royal mb-3">4. Sharing of Information</h2>
              <p className="text-charcoal leading-relaxed mb-3">
                <strong>We do not sell your personal data.</strong>
              </p>
              <p className="text-charcoal leading-relaxed mb-3">We may share your data with:</p>
              <ul className="space-y-2 ml-6">
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>Service providers (hosting, analytics, communication tools)</span>
                </li>
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>Payment and UPI partners</span>
                </li>
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>Legal authorities if required by law</span>
                </li>
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>Business transfers (e.g., merger or acquisition)</span>
                </li>
              </ul>
              <p className="text-charcoal-light text-sm mt-3 italic">
                Third parties are only given access necessary to perform their services.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xl font-serif font-semibold text-royal mb-3">5. Cookies &amp; Tracking Technologies</h2>
              <p className="text-charcoal leading-relaxed mb-3">We use cookies and similar technologies to:</p>
              <ul className="space-y-2 ml-6">
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>Remember user preferences</span>
                </li>
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>Improve functionality and personalization</span>
                </li>
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>Analyze usage trends</span>
                </li>
              </ul>
              <p className="text-charcoal leading-relaxed mt-3">
                You can control cookies via your browser settings.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-xl font-serif font-semibold text-royal mb-3">6. Data Retention</h2>
              <p className="text-charcoal leading-relaxed mb-3">We retain your data:</p>
              <ul className="space-y-2 ml-6">
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>As long as your account is active</span>
                </li>
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>As needed to provide services</span>
                </li>
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>To comply with legal obligations</span>
                </li>
              </ul>
              <p className="text-charcoal leading-relaxed mt-3">
                Some anonymized data may be retained for analytics.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-xl font-serif font-semibold text-royal mb-3">7. Data Security</h2>
              <p className="text-charcoal leading-relaxed mb-3">
                We implement appropriate technical and organizational measures to:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>Protect against unauthorized access</span>
                </li>
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>Prevent data loss or misuse</span>
                </li>
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>Ensure secure transactions</span>
                </li>
              </ul>
              <p className="text-charcoal leading-relaxed mt-3">
                However, no system is completely secure.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-xl font-serif font-semibold text-royal mb-3">8. Your Rights</h2>
              <p className="text-charcoal leading-relaxed mb-3">Depending on applicable laws, you may:</p>
              <ul className="space-y-2 ml-6">
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>Access your personal data</span>
                </li>
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>Correct or update your data</span>
                </li>
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>Request deletion of your data</span>
                </li>
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>Withdraw consent for processing</span>
                </li>
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>Opt out of marketing communications</span>
                </li>
              </ul>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-xl font-serif font-semibold text-royal mb-3">9. Third-Party Links</h2>
              <p className="text-charcoal leading-relaxed">
                Gifaa allows linking to external product websites. We are not responsible for the privacy practices of those third-party platforms. Please review their policies separately.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-xl font-serif font-semibold text-royal mb-3">10. Children&apos;s Privacy</h2>
              <p className="text-charcoal leading-relaxed">
                Our services are not intended for individuals under 18. We do not knowingly collect data from minors.
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-xl font-serif font-semibold text-royal mb-3">11. Changes to This Policy</h2>
              <p className="text-charcoal leading-relaxed">
                We may update this Privacy Policy from time to time. Updates will be posted on this page with a revised effective date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif font-semibold text-royal mb-3">Contact Us</h2>
              <p className="text-charcoal leading-relaxed">
                If you have questions about this Privacy Policy, reach out to us:
              </p>
              <div className="bg-white rounded-xl border border-gold/10 p-5 mt-3">
                <p className="text-charcoal text-sm"><strong>Gifaa</strong></p>
                <p className="text-charcoal text-sm">Email: <a href="mailto:letsgifaa@gmail.com" className="text-royal underline underline-offset-2 hover:text-gold transition-colors">letsgifaa@gmail.com</a></p>
                <p className="text-charcoal text-sm">WhatsApp: <a href="https://wa.me/919916311133" className="text-royal underline underline-offset-2 hover:text-gold transition-colors" target="_blank" rel="noopener noreferrer">+91 99163 11133</a></p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
