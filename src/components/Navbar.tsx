"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
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
                href="/news"
                className={`text-sm ${
                  isActive("/news")
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                News
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
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {/* Mobile menu button */}
            <button 
              className="md:hidden rounded-md p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-6 h-6"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-2 px-4 space-y-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
            <Link
              href="/blog"
              className={`block py-2 text-base ${
                isActive("/blog")
                  ? "text-gray-900 dark:text-white font-medium"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/news"
              className={`block py-2 text-base ${
                isActive("/news")
                  ? "text-gray-900 dark:text-white font-medium"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              News
            </Link>
            <Link
              href="/publications"
              className={`block py-2 text-base ${
                isActive("/publications")
                  ? "text-gray-900 dark:text-white font-medium"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Publications
            </Link>
            <Link
              href="/talks"
              className={`block py-2 text-base ${
                isActive("/talks")
                  ? "text-gray-900 dark:text-white font-medium"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Talks
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
} 