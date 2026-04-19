import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog – Gift Registry Tips, Guides & Trends | Gifaa",
  description:
    "Explore expert guides on gift registries, wedding planning tips, and gifting trends in India. Everything you need to make celebrations more thoughtful.",
  alternates: { canonical: "https://gifaa.in/blog" },
  openGraph: {
    title: "Blog – Gift Registry Tips, Guides & Trends | Gifaa",
    description:
      "Explore expert guides on gift registries, wedding planning tips, and gifting trends in India.",
    url: "https://gifaa.in/blog",
    images: [
      {
        url: "https://gifaa.in/lovable-uploads/2906e693-4dd1-4514-8524-e5acfd185f93.png",
      },
    ],
  },
};

const blogPosts = [
  {
    slug: "wedding-gift-registry-india-guide",
    title: "Wedding Gift Registry in India: The Ultimate Guide for Modern Couples (2026)",
    excerpt:
      "Everything Indian couples need to know about creating a wedding gift registry — from avoiding duplicates to accepting UPI contributions.",
    category: "Wedding",
    date: "April 5, 2026",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=500&fit=crop&q=80",
  },
  {
    slug: "gift-registries-replacing-traditional-gifting",
    title: "7 Reasons Why Gift Registries Are Replacing Traditional Gifting in India",
    excerpt:
      "From UPI payments to WhatsApp sharing — discover the cultural shift from obligation-based gifting to intentional gifting.",
    category: "Trends",
    date: "April 10, 2026",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&h=500&fit=crop&q=80",
  },
  {
    slug: "perfect-gift-registry",
    title: "How to Create the Perfect Gift Registry for Any Occasion",
    excerpt:
      "A step-by-step guide to building gift registries for weddings, baby showers, housewarmings, and more. Includes tips on cash funds and sharing.",
    category: "Guide",
    date: "April 15, 2026",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&h=500&fit=crop&q=80",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Page header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-gold/10 text-gold rounded-full text-xs font-medium tracking-wide mb-4">
              GIFAA BLOG
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-royal mb-4">
              Tips, Guides & Gifting Trends
            </h1>
            <p className="text-charcoal-light text-lg max-w-2xl mx-auto">
              Everything you need to make every celebration more thoughtful, organized, and joyful.
            </p>
          </div>

          {/* Featured post (first one) */}
          <Link href={`/blog/${blogPosts[0].slug}`} className="block group mb-12">
            <div className="bg-white rounded-2xl border border-gold/10 overflow-hidden hover:shadow-elegant transition-all duration-300 hover:border-gold/30">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-auto overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={blogPosts[0].image}
                    alt={blogPosts[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-gold/90 text-white rounded-full text-xs font-medium">
                    Featured
                  </span>
                </div>
                <div className="p-8 lg:p-10 flex flex-col justify-center">
                  <span className="inline-block px-3 py-1 bg-gold/10 text-gold rounded-full text-xs font-medium mb-4 w-fit">
                    {blogPosts[0].category}
                  </span>
                  <h2 className="text-2xl lg:text-3xl font-serif font-bold text-royal mb-3 group-hover:text-royal-light transition-colors">
                    {blogPosts[0].title}
                  </h2>
                  <p className="text-charcoal-light leading-relaxed mb-4">
                    {blogPosts[0].excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-charcoal-light mb-6">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> {blogPosts[0].date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {blogPosts[0].readTime}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-2 text-royal font-medium text-sm group-hover:gap-3 transition-all">
                    Read Article <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Other posts grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts.slice(1).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                <div className="bg-white rounded-2xl border border-gold/10 overflow-hidden hover:shadow-elegant transition-all duration-300 hover:border-gold/30 h-full">
                  <div className="relative h-52 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 bg-gold/10 text-gold rounded-full text-xs font-medium mb-3">
                      {post.category}
                    </span>
                    <h2 className="text-xl font-serif font-semibold text-royal mb-2 group-hover:text-royal-light transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-charcoal-light text-sm leading-relaxed mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-charcoal-light">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {post.readTime}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-royal font-medium text-sm group-hover:gap-2 transition-all">
                        Read <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
