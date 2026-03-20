"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Heart, ExternalLink, Check, Gift, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const sampleRegistry = {
  title: "Nivedhitaa & Shreyas",
  occasion: "wedding",
  description:
    "We're so excited to begin this new chapter together! Your presence at our celebration is the greatest gift of all. If you'd like to bless us with something special, we've curated a collection of items we'd love to receive.",
  eventDate: "2026-03-15",
  eventLocation: "Chennai, Tamil Nadu",
  headerImage:
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=600&fit=crop&q=80",
  personalMessage: "With love and gratitude, we can't wait to celebrate with you! 💕",
};

const sampleGifts = [
  {
    id: "1",
    name: "Le Creuset Dutch Oven",
    price: 28500,
    image: "https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400&h=400&fit=crop&q=80",
    isPurchased: false,
    store: "Amazon",
  },
  {
    id: "2",
    name: "Dyson V15 Vacuum",
    price: 62990,
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&h=400&fit=crop&q=80",
    isPurchased: true,
    purchasedBy: "Aunty Meera",
    store: "Flipkart",
  },
  {
    id: "3",
    name: "Nespresso Coffee Machine",
    price: 15999,
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=400&fit=crop&q=80",
    isPurchased: false,
    store: "Nykaa",
  },
  {
    id: "4",
    name: "Egyptian Cotton Bedding Set",
    price: 12500,
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop&q=80",
    isPurchased: true,
    purchasedBy: "Rajan Uncle",
    store: "Fabindia",
  },
  {
    id: "5",
    name: "Philips Air Fryer XXL",
    price: 18999,
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=400&fit=crop&q=80",
    isPurchased: false,
    store: "Amazon",
  },
  {
    id: "6",
    name: "Handcrafted Brass Urli",
    price: 4500,
    image: "https://images.unsplash.com/photo-1567538096621-38d2284b23ff?w=400&h=400&fit=crop&q=80",
    isPurchased: false,
    store: "Tanishq",
  },
];

const sampleCashFunds = [
  {
    id: "1",
    name: "Honeymoon Fund 🌴",
    description: "Help us create unforgettable memories in the Maldives!",
    targetAmount: 200000,
    currentAmount: 85000,
  },
  {
    id: "2",
    name: "New Home Essentials 🏠",
    description: "Contributions toward furnishing our first home together.",
    targetAmount: 150000,
    currentAmount: 42000,
  },
];

export default function SampleRegistryPage() {
  const [filter, setFilter] = useState<"all" | "available" | "purchased">("all");

  const filteredGifts = sampleGifts.filter((gift) => {
    if (filter === "available") return !gift.isPurchased;
    if (filter === "purchased") return gift.isPurchased;
    return true;
  });

  const purchasedCount = sampleGifts.filter((g) => g.isPurchased).length;
  const giftProgress = (purchasedCount / sampleGifts.length) * 100;

  return (
    <div className="min-h-screen bg-ivory">
      {/* Sample Banner */}
      <div className="bg-royal text-ivory py-3 px-6 text-center">
        <p className="text-sm">
          ✨ This is a <strong>sample registry</strong> to show you what guests will see.{" "}
          <Link href="/signup" className="underline hover:text-gold transition-colors">
            Create your own registry →
          </Link>
        </p>
      </div>

      {/* Back Button */}
      <div className="container mx-auto px-6 py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-charcoal-light hover:text-royal transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="h-[300px] md:h-[400px] overflow-hidden">
          <img
            src={sampleRegistry.headerImage}
            alt="Wedding celebration"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="container mx-auto max-w-4xl">
            <Badge className="bg-gold/90 text-charcoal mb-3 capitalize">
              {sampleRegistry.occasion}
            </Badge>
            <h1 className="font-serif text-3xl md:text-5xl font-semibold text-ivory mb-3">
              {sampleRegistry.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-ivory/80 text-sm">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                March 15, 2026
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {sampleRegistry.eventLocation}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-6xl px-6 py-10">
        {/* Personal Message */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gold/10 shadow-soft mb-10 text-center max-w-3xl mx-auto">
          <Heart className="w-8 h-8 text-gold mx-auto mb-4" />
          <p className="text-charcoal-light leading-relaxed mb-4">{sampleRegistry.description}</p>
          <p className="text-charcoal font-medium italic">{sampleRegistry.personalMessage}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Gift List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-5 border border-gold/10 shadow-soft mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-gold" />
                  <span className="font-medium text-charcoal">Gift Progress</span>
                </div>
                <span className="text-sm text-charcoal-light">
                  {purchasedCount} of {sampleGifts.length} gifts purchased
                </span>
              </div>
              <Progress value={giftProgress} className="h-2" />
            </div>

            <div className="flex gap-2 mb-6">
              {(["all", "available", "purchased"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filter === f
                      ? "bg-royal text-ivory"
                      : "bg-white text-charcoal-light border border-gold/20 hover:border-gold"
                  }`}
                >
                  {f === "all" ? "All Gifts" : f === "available" ? "Available" : "Purchased"}
                </button>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {filteredGifts.map((gift) => (
                <div
                  key={gift.id}
                  className={`bg-white rounded-xl overflow-hidden border shadow-soft transition-all ${
                    gift.isPurchased
                      ? "border-success/30 opacity-75"
                      : "border-gold/10 hover:border-gold/30 hover:shadow-elevated"
                  }`}
                >
                  <div className="relative h-48">
                    <img src={gift.image} alt={gift.name} className="w-full h-full object-cover" />
                    {gift.isPurchased && (
                      <div className="absolute inset-0 bg-charcoal/40 flex items-center justify-center">
                        <div className="bg-success text-white px-4 py-2 rounded-full flex items-center gap-2">
                          <Check className="w-4 h-4" />
                          Purchased by {gift.purchasedBy}
                        </div>
                      </div>
                    )}
                    <Badge className="absolute top-3 right-3 bg-white/90 text-charcoal text-xs">
                      {gift.store}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-charcoal mb-1">{gift.name}</h3>
                    <p className="text-royal font-semibold mb-3">
                      ₹{gift.price.toLocaleString("en-IN")}
                    </p>
                    {!gift.isPurchased && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button variant="royal" size="sm" className="flex-1">
                          <Gift className="w-4 h-4 mr-1" />
                          Gift This
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cash Funds Sidebar */}
          <div className="space-y-6">
            <h3 className="font-serif text-xl font-semibold text-charcoal flex items-center gap-2">
              <Wallet className="w-5 h-5 text-gold" />
              Cash Funds
            </h3>

            {sampleCashFunds.map((fund) => {
              const progress = (fund.currentAmount / fund.targetAmount) * 100;
              return (
                <div key={fund.id} className="bg-white rounded-xl p-5 border border-gold/10 shadow-soft">
                  <h4 className="font-medium text-charcoal mb-2">{fund.name}</h4>
                  <p className="text-sm text-charcoal-light mb-4">{fund.description}</p>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-charcoal-light">Raised</span>
                      <span className="font-medium text-charcoal">
                        ₹{fund.currentAmount.toLocaleString("en-IN")} of ₹
                        {fund.targetAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  <Button variant="royal" size="sm" className="w-full">
                    Contribute via UPI
                  </Button>
                </div>
              );
            })}

            <div className="bg-ivory rounded-xl p-5 border border-gold/10">
              <p className="text-sm text-charcoal-light text-center">
                💡 Contributions are made directly via UPI. Safe, secure, and instant.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="bg-royal py-12 mt-10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-ivory mb-4">
            Ready to create your own registry?
          </h2>
          <p className="text-ivory/80 mb-6">It takes less than a minute to get started.</p>
          <Link href="/signup">
            <Button variant="hero" size="lg">Create Your Registry</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
