import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { config } from "@/lib/config";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Analytics } from "@/components/analytics";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Navbar } from "@/components/Navbar";
import ParticlesBackground from "@/components/ParticlesBackground";

// Load Inter font
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Update the navigation items
const navItems = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/publications", label: "Publications" },
];

export const metadata: Metadata = {
  title: config.site.title,
  description: config.site.description,
  keywords: config.site.keywords,
  metadataBase: config.seo.metadataBase,
  alternates: config.seo.alternates,
  icons: [
    { rel: "icon", url: config.site.favicon.png, sizes: "48x48", type: "image/png" },
    { rel: "icon", url: config.site.favicon.svg, type: "image/svg+xml" },
    { rel: "apple-touch-icon", url: config.site.favicon.appleTouchIcon, sizes: "180x180" },
  ],
  openGraph: {
    url: config.site.url,
    type: config.seo.openGraph.type,
    title: config.site.title,
    description: config.site.description,
    images: [
      { url: config.site.image }
    ]
  },
  twitter: {
    site: config.site.url,
    card: config.seo.twitter.card,
    title: config.site.title,
    description: config.site.description,
    images: [
      { url: config.site.image }
    ]
  },
  manifest: config.site.manifest,
  appleWebApp: {
    title: config.site.title,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-lite-webfont@1.1.0/style.css" />
        <style>
          {`
            body {
              font-family: "LXGW WenKai Lite", sans-serif;
            }
          `}
        </style>
        <link rel="alternate" type="application/rss+xml" title="RSS" href="/rss.xml" />
        <link rel="alternate" type="application/atom+xml" title="Atom" href="/atom.xml" />
        <link rel="alternate" type="application/json" title="JSON" href="/feed.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-w-md overflow-x-hidden flex flex-col min-h-screen">
        <ThemeProvider>
          <div className="relative min-h-screen">
            <ParticlesBackground />
            <div className="relative z-10">
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
            </div>
          </div>
          <footer className="py-6 mt-12 border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-6xl mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm">
              © 2025 Ye Jia. All rights reserved.
            </div>
          </footer>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
