"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/75 dark:border-gray-800 dark:bg-gray-950/75 backdrop-blur-lg">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-lg font-semibold text-gray-900 dark:text-white"
            >
              Home
            </Link>
            <div className="hidden md:flex md:items-center md:space-x-6">
              <Link
                href="/blog"
                className={`text-sm ${
                  isActive("/blog")
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                Blog
              </Link>
              <Link
                href="/publications"
                className={`text-sm ${
                  isActive("/publications")
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                Publications
              </Link>
              <Link
                href="/talks"
                className={`text-sm ${
                  isActive("/talks")
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                Talks
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
} 