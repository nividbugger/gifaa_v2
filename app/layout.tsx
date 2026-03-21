import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import AnnouncementBanner from "@/components/layout/AnnouncementBanner";

export const metadata: Metadata = {
  title: {
    default: "Gifaa – India's Premier Gift Registry Platform",
    template: "%s – Gifaa",
  },
  description: "Create beautiful gift registries for weddings, baby showers, housewarmings, and more. No duplicates. No confusion. Just joy.",
  metadataBase: new URL("https://gifaa.in"),
  openGraph: {
    siteName: "Gifaa",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <AnnouncementBanner />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
