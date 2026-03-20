import { Shield, Smartphone, CreditCard, Link2, Eye, Bell } from "lucide-react";

const features = [
  { icon: Link2, title: "Any Store, Any Product", description: "Add gifts from Amazon, Flipkart, Nykaa, Fabindia—paste any URL and we'll do the rest." },
  { icon: CreditCard, title: "UPI-Ready Cash Funds", description: "Accept contributions directly via UPI. Perfect for honeymoon funds, house deposits, or any goal." },
  { icon: Shield, title: "No Duplicate Gifts", description: "Each item is marked as purchased in real-time. Your guests will always know what's available." },
  { icon: Eye, title: "Public or Private", description: "Make your registry searchable or keep it private—share only via direct link." },
  { icon: Bell, title: "Instant Notifications", description: "Get notified when someone contributes or purchases a gift. Never miss a moment of gratitude." },
  { icon: Smartphone, title: "Mobile-First Design", description: "Create, manage, and share your registry from any device. Beautiful on every screen." },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-royal relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(184,148,95,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(184,148,95,0.08),transparent_50%)]" />

      <div className="container relative mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-gold text-sm font-semibold tracking-wider uppercase mb-4">Features</span>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-ivory mb-4">Everything You Need</h2>
          <p className="text-ivory/70 text-lg">A complete gifting experience designed with Indian families in mind.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-8 rounded-2xl bg-ivory/5 border border-ivory/10 hover:bg-ivory/10 hover:border-gold/30 hover:-translate-y-1 transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-5 group-hover:bg-gold/20 group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-ivory mb-3">{feature.title}</h3>
              <p className="text-ivory/60 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
