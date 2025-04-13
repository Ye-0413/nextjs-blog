"use client";

import { allBlogs, allPublications, allNews } from "content-collections";
import Link from "next/link";
import count from 'word-count';
import { config } from "@/lib/config";
import Particles from "@/components/Particles";
import TextPressure from "@/components/TextPressure";
import SpotlightCard from "@/components/SpotlightCard";
import { useState, useEffect, useMemo } from "react";
import { ExternalLink } from "lucide-react";
import { allTalks } from "@/lib/talk-data";
import Image from "next/image";
import NewsItem from "@/components/NewsItem";
import { gsap } from "gsap";
import { InfiniteScroll } from "@/components/InfiniteScroll";
import DecryptedText from "@/components/DecryptedText";
import CircularText from "@/components/CircularText";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  // State to track if device is mobile
  const [isMobile, setIsMobile] = useState(false);
  
  // Hydration fix for server/client mismatch with WebGL content
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check if device is mobile based on window width
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Set initial value
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener("resize", checkMobile);
    
    // Set mounted state for hydration
    setMounted(true);
    
    // Cleanup
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);
  
  const blogs = allBlogs
    .filter((blog: any) => blog.featured === true)
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const featuredPublications = allPublications
    .filter((pub: any) => pub.featured === true)
    .sort((a: any, b: any) => b.year - a.year);

  const featuredTalks = allTalks
    .filter((talk) => talk.featured === true)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
  // Get latest 6 news items for infinite scroll
  const latestNews = useMemo(() => {
    if (!mounted) return [];
    
    console.log("allNews content:", allNews);
    
    const newsItems = [...allNews]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6)
      .map(news => ({
        content: (
          <NewsItem
            key={news.slug}
            title={news.title}
            date={news.date}
            slug={news.slug}
            content={news.content}
            authors={news.authors}
          />
        )
      }));
      
    console.log("latestNews items:", newsItems.length);
    return newsItems;
  }, [mounted]);

  // Set scroll parameters directly in code - adjust these values as needed
  const SCROLL_SPEED = 0.8;  // Increase value for faster scrolling
  const SCROLL_DIRECTION: "up" | "down" = "down";
  const AUTO_PLAY = true;     // true for auto-scrolling, false to disable
  const PAUSE_ON_HOVER = true;

  return (
    <div className="relative min-h-screen">
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

        {/* Personal Section - Ye Jia */}
        <div className="mb-16">
          <SpotlightCard 
            className="p-6"
            lightModeSpotlightColor="rgba(25, 39, 114, 0.2)"
            darkModeSpotlightColor="rgba(25, 39, 114, 0.3)"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left column - Photo and name */}
              <div className="profile-container flex flex-col justify-center h-full">
                <div className="avatar-container">
                  <div className="avatar-ring">
                    <CircularText 
                      text="HCI * VR * METAVERSE * Education * AI *" 
                      className="text-emerald-600 dark:text-emerald-500 font-extrabold"
                      radius={130}
                      delay={0}
                      duration={30000}
                    />
                  </div>
                  <div className="relative w-48 h-48 overflow-hidden rounded-full border-2 border-emerald-100 dark:border-emerald-900 shadow-lg">
                    <Image
                      src="/images/personl/avatar.jpeg"
                      alt="Ye Jia"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
                
                <div className="profile-info">
                  <h2 className="text-gray-900 dark:text-white">Ye Jia</h2>
                  <div className="title text-gray-700 dark:text-gray-300">MPhil Student</div>
                  <div className="university text-gray-600 dark:text-gray-400">The Hong Kong Polytechnic University</div>
                </div>
                
                <div className="social-icons text-gray-600 dark:text-gray-400">
                  <Link href="mailto:ye.jia@connect.polyu.hk" aria-label="Email">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </Link>
                  <Link href="https://github.com/Ye-0413" aria-label="GitHub">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                  </Link>
                  <Link href="https://www.linkedin.com/in/yejia001/" aria-label="LinkedIn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </Link>
                  <Link href="https://scholar.google.com/citations?user=Dhz-nHEAAAAJ&hl=en" aria-label="Google Scholar">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z"></path>
                      <path d="M12 14l-6.16-3.422a12.083 12.083 0 0111.32-1.13c.535.194 1.055.426 1.559.694L12 14z"></path>
                      <path d="M5.176 10.578a12.13 12.13 0 015.64-6.855a12.13 12.13 0 015.845 6.498"></path>
                    </svg>
                  </Link>
                  <Link href="https://orcid.org/0000-0002-0457-8083" aria-label="ORCID">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v12" />
                      <path d="M9 6h.01" />
                      <path d="M9 12h3" />
                    </svg>
                  </Link>
                  <Link href="https://www.researchgate.net/" aria-label="ResearchGate">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M7.5 12h3v6" />
                      <path d="M7.5 9h.01" />
                      <path d="M13.5 9l3 9" />
                      <path d="M13.5 9l-3 9" />
                    </svg>
                  </Link>
                </div>
              </div>
              
              {/* Right column - About Me */}
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">About Me</h2>
                {mounted && (
                  <DecryptedText
                    text="Ye Jia is working toward his MPhil degree in the Department of Computing at Hong Kong Polytechnic University. His research interests include Virtual Reality, Metaverse Technology, and Extended Reality. He has authored and co-authored papers for the top-tire international conferences and journals, including the International Journal of Human-Computer Studies (IJHCS), IEEE Transactions on Learning Technologies (TLT), International Conference on Virtual Reality and 3D User Interfaces (IEEE VR), and the IEEE International Conference on Metaverse Computing, Networking, and Applications (MetaCom)."
                    className="text-gray-600 dark:text-gray-300"
                    parentClassName="mb-6 block"
                    encryptedClassName="text-gray-600 dark:text-gray-300 opacity-70"
                    speed={2}
                    sequential={true}
                    maxIterations={5}
                    animateOn="mount"
                    useOriginalCharsOnly={false}
                    revealDirection="start"
                    willChange={false}
                  />
                )}
                
                {/* Research Interests and Education in two columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Research Interests */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Research Interests</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                      <li>Virtual Reality</li>
                      <li>Metaverse Technology</li>
                      <li>Extended Reality</li>
                      <li>Human-Computer Interaction</li>
                    </ul>
                  </div>
                  
                  {/* Education */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Education</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                      <li>MPhil in Computer Science</li>
                      <li className="text-sm ml-5">The Hong Kong Polytechnic University</li>
                      <li>BEng in Robotics Engineering</li>
                      <li className="text-sm ml-5">Chongqing University of Arts and Sciences</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </SpotlightCard>
        </div>

        {/* News Section */}
        {mounted && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Latest Updates</h2>
            
            {allNews && allNews.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {[...allNews]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 6)
                  .map(news => (
                    <SpotlightCard 
                      key={news.slug}
                      className="p-4 transition-all hover:shadow-md"
                      lightModeSpotlightColor="rgba(93, 140, 179, 0.15)"
                      darkModeSpotlightColor="rgba(93, 140, 179, 0.25)"
                    >
                      <article className="flex flex-col">
                        <div className="flex-1">
                          <div className="flex flex-col justify-between">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                              {news.title}
                            </h3>
                            <time 
                              dateTime={news.date} 
                              className="text-sm text-gray-500 dark:text-gray-400 mb-3"
                            >
                              {new Date(news.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </time>
                          </div>
                          
                          <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                            <div dangerouslySetInnerHTML={{ __html: news.content }} />
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <Link
                            href={`/news#${new Date(news.date).toLocaleDateString('en-US', {month: 'long', year: 'numeric'}).toLowerCase().replace(' ', '-')}`}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                          >
                            Read more
                          </Link>
                        </div>
                      </article>
                    </SpotlightCard>
                  ))
                }
              </div>
            ) : (
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                <p className="text-gray-500 dark:text-gray-400">No news items available.</p>
              </div>
            )}
          </div>
        )}

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

        {/* Featured Talks Section */}
        {featuredTalks.length > 0 && (
          <div className="space-y-6 mt-16">
            <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Featured Talks</h2>
            <div className="grid grid-cols-1 gap-8">
              {featuredTalks.map((talk) => (
                <SpotlightCard 
                  key={talk.slug} 
                  className="p-6 transition-all hover:shadow-md" 
                  lightModeSpotlightColor="rgba(125, 98, 222, 0.15)"
                  darkModeSpotlightColor="rgba(125, 98, 222, 0.25)"
                >
                  <div className="flex flex-col gap-6">
                    {talk.coverImage && (
                      <div className="relative w-full aspect-video">
                        <Image
                          src={talk.coverImage}
                          alt={talk.title}
                          fill
                          className="object-cover rounded-lg"
                          priority
                        />
                      </div>
                    )}
                    <div className="flex flex-col justify-between">
                      <div>
                        <Link href={`/talks/${talk.slug}`}>
                          <h3 className="text-2xl font-semibold hover:underline text-gray-900 dark:text-white mb-3">
                            {talk.title}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                          <time dateTime={talk.date}>
                            {new Date(talk.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </time>
                          <span>•</span>
                          <span>{talk.event}</span>
                          {talk.location && (
                            <>
                              <span>•</span>
                              <span>{talk.location}</span>
                            </>
                          )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                          {talk.summary}
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <Link
                          href={`/talks/${talk.slug}`}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                        >
                          View Details
                        </Link>
                        {talk.videoUrl && (
                          <a
                            href={talk.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                          >
                            <span>Watch on Bilibili</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Link 
                href="/talks" 
                className="inline-flex items-center px-6 py-3 text-base font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm"
              >
                View All Talks
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
