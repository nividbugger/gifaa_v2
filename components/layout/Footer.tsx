"use client";

import { useState } from "react";
import { Mail, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <footer className="bg-charcoal py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <a href="/" className="flex items-center mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="Gifaa" className="h-9 w-auto" src="/gifaa-logo-light.png" />
            </a>
            <p className="text-ivory/50 text-sm leading-relaxed">
              India&apos;s premier gift registry platform. Making every celebration
              more thoughtful, organized, and joyful.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-gold mb-4">Product</h4>
            <ul className="space-y-3">
              {["How It Works", "Occasions", "Features", "Pricing"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-ivory/50 hover:text-gold transition-colors duration-200 text-sm">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-gold mb-4">Company</h4>
            <ul className="space-y-3">
              {["About Us", "Blog", "Careers"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-ivory/50 hover:text-gold transition-colors duration-200 text-sm">{item}</a>
                </li>
              ))}
              <li className="relative">
                <button
                  onClick={() => setIsContactOpen(!isContactOpen)}
                  className="flex items-center gap-1 text-ivory/50 hover:text-gold transition-colors duration-200 text-sm"
                >
                  Contact Us
                  {isContactOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                {isContactOpen && (
                  <div className="absolute left-0 top-full mt-2 bg-charcoal-light rounded-lg shadow-xl border border-ivory/10 p-3 min-w-[220px] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <a href="mailto:letsgifaa@gmail.com" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-ivory/5 transition-colors group">
                      <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                        <Mail className="w-4 h-4 text-gold" />
                      </div>
                      <div>
                        <p className="text-ivory text-sm font-medium">Email</p>
                        <p className="text-ivory/50 text-xs">letsgifaa@gmail.com</p>
                      </div>
                    </a>
                    <a href="https://wa.me/919916311133" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-ivory/5 transition-colors group mt-1">
                      <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                        <MessageCircle className="w-4 h-4 text-success" />
                      </div>
                      <div>
                        <p className="text-ivory text-sm font-medium">WhatsApp</p>
                        <p className="text-ivory/50 text-xs">+91 99163 11133</p>
                      </div>
                    </a>
                  </div>
                )}
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-gold mb-4">Legal</h4>
            <ul className="space-y-3">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-ivory/50 hover:text-gold transition-colors duration-200 text-sm">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-ivory/10 space-y-4">
          <p className="text-ivory/30 text-xs text-center leading-relaxed italic">
            All trademarks and logos are the property of their respective owners. Their use does not imply any affiliation or endorsement.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-ivory/40 text-sm">© {currentYear} Gifaa. All rights reserved.</p>
            <p className="text-ivory/40 text-sm">Made with <span className="text-gold">♥</span> in India</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
