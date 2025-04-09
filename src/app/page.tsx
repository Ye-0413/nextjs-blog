"use client";

import { allBlogs, allPublications } from "content-collections";
import Link from "next/link";
import count from 'word-count'
import { config } from "@/lib/config";
import Particles from "@/components/Particles";
import TextPressure from "@/components/TextPressure";
import SpotlightCard from "@/components/SpotlightCard";
import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  
  // Hydration fix for server/client mismatch with WebGL content
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const blogs = allBlogs
    .filter((blog: any) => blog.featured === true)
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const featuredPublications = allPublications
    .filter((pub: any) => pub.featured === true)
    .sort((a: any, b: any) => b.year - a.year);

  return (
    <div className="relative min-h-screen">
      {/* Particles background effect */}
      {mounted && (
        <Particles 
          particleCount={150}
          particleColors={["#5d8cb3", "#4ac29a", "#7d62de"]}
          particleSpread={8}
          speed={0.05}
          particleBaseSize={120}
          moveParticlesOnHover={true}
          particleHoverFactor={0.5}
          alphaParticles={true}
          sizeRandomness={0.8}
        />
      )}
      
      <div className="relative max-w-6xl mx-auto px-4 py-10 z-10">
        {/* Introduction with TextPressure title */}
        <SpotlightCard 
          className="mb-16 p-8"
          lightModeSpotlightColor="rgba(79, 70, 229, 0.1)"
          darkModeSpotlightColor="rgba(79, 70, 229, 0.2)"
        >
          <div className="space-y-6">
            {/* Increased height container for title */}
            <div className="h-24 mb-8 px-3">
              {mounted && (
                <TextPressure 
                  text={config.site.title}
                  textColor="var(--text-primary)"
                  strokeColor="#4338ca"
                  fontFamily="var(--font-inter)"
                  fontUrl=""
                  stroke={true}
                  width={false}
                  weight={true}
                  minFontSize={16}
                />
              )}
            </div>
            
            {/* Descriptive text with more bottom margin */}
            <div className="mt-4">
              <p className="text-lg text-gray-600 dark:text-gray-300">{config.author.bio}</p>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-2 text-gray-600 dark:text-gray-300 mt-4">
              <Link href={config.social.buyMeACoffee} className="underline underline-offset-4">Support</Link>
              <span>·</span>
              <Link href={config.social.x} className="underline underline-offset-4">X</Link>
              <span>·</span>
              <Link href={config.social.github} className="underline underline-offset-4">GitHub</Link>
            </div>
          </div>
        </SpotlightCard>

        {/* Featured Articles Section */}
        <div className="space-y-6 mb-16">
          <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Featured Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog: any) => (
              <SpotlightCard 
                key={blog.slug} 
                className="p-4 transition-all hover:shadow-md h-full" 
                lightModeSpotlightColor="rgba(93, 140, 179, 0.15)"
                darkModeSpotlightColor="rgba(93, 140, 179, 0.25)"
              >
                <Link href={`/blog/${blog.slug}`} className="block h-full">
                  <div className="flex flex-col space-y-2 h-full">
                    <div className="flex flex-col justify-between">
                      <h2 className="text-xl font-semibold hover:underline text-gray-900 dark:text-white mb-2">
                        {blog.title}
                      </h2>
                      <span className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        {new Date(blog.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })} · {count(blog.content)} words
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-3 flex-grow">
                      {blog.summary}
                    </p>
                  </div>
                </Link>
              </SpotlightCard>
            ))}
          </div>
        </div>

        {/* Featured Publications Section */}
        {featuredPublications.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Featured Publications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPublications.map((pub: any) => (
                <SpotlightCard 
                  key={pub.slug} 
                  className="p-4 transition-all hover:shadow-md h-full" 
                  lightModeSpotlightColor="rgba(74, 194, 154, 0.15)"
                  darkModeSpotlightColor="rgba(74, 194, 154, 0.25)"
                >
                  <div className="flex flex-col space-y-2 h-full">
                    <div className="flex flex-col justify-between">
                      <Link href={`/publications#${pub.slug}`} className="block">
                        <h2 className="text-xl font-semibold hover:underline text-gray-900 dark:text-white mb-2">
                          {pub.title}
                        </h2>
                      </Link>
                      <div className="flex flex-col space-y-1 mb-3">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {pub.authors.join(", ")}
                        </span>
                        <span className="text-sm italic text-gray-600 dark:text-gray-400">
                          {pub.journal} ({pub.year})
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-3 flex-grow">
                      {pub.abstract}
                    </p>
                    <div className="flex gap-4 mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <Link
                        href={`/publications#${pub.slug}`}
                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium"
                      >
                        View Details
                      </Link>
                      {pub.doi && (
                        <a
                          href={`https://doi.org/${pub.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium"
                        >
                          <span>Read Paper</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </SpotlightCard>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Link 
                href="/publications" 
                className="inline-flex items-center px-6 py-3 text-base font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm"
              >
                View All Publications
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
