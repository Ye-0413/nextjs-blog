import { type Metadata } from "next";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: `Recent News | ${config.site.title}`,
  description: `Latest news and updates from ${config.site.title}`,
  keywords: `news, updates, announcements, ${config.site.title}`,
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 