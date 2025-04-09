"use client";

import { allBlogs } from "content-collections";
import Link from "next/link";
import count from 'word-count'
import { config } from "@/lib/config";
import Particles from "@/components/Particles";
import TextPressure from "@/components/TextPressure";
import { useState, useEffect } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  
  // Hydration fix for server/client mismatch with WebGL content
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const blogs = allBlogs
    .filter((blog: any) => blog.featured === true)
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
      
      <div className="relative max-w-3xl mx-auto px-4 py-10 z-10">
        {/* Introduction with TextPressure title */}
        <div className="mb-16 space-y-4 bg-card-bg dark:bg-card-bg backdrop-blur-sm p-6 rounded-lg shadow-sm">
          <div className="h-16 mb-4 px-3">
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
                minFontSize={12}
              />
            )}
          </div>
          <p className="text-md text-gray-600 dark:text-gray-300">{config.author.bio}</p>
          
          {/* Social Links */}
          <div className="flex space-x-2 text-gray-600 dark:text-gray-300">
            <Link href={config.social.buyMeACoffee} className="underline underline-offset-4">Support</Link>
            <span>·</span>
            <Link href={config.social.x} className="underline underline-offset-4">X</Link>
            <span>·</span>
            <Link href={config.social.github} className="underline underline-offset-4">GitHub</Link>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Featured Articles</h2>
          <div className="space-y-4">
            {blogs.map((blog: any) => (
              <article key={blog.slug} className="bg-card-bg dark:bg-card-bg backdrop-blur-sm rounded-lg shadow-sm p-4 transition-all hover:bg-card-bg-hover hover:dark:bg-card-bg-hover hover:shadow-md">
                <Link href={`/blog/${blog.slug}`}>
                  <div className="flex flex-col space-y-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <h2 className="text-xl font-semibold hover:underline text-gray-900 dark:text-white">
                        {blog.title}
                      </h2>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(blog.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })} · {count(blog.content)} words
                      </span>
                    </div>
                    <p className="text-gray-600 line-clamp-2">
                      {blog.summary}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
