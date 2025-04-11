'use client';

import { allBlogs } from "content-collections";
import Link from "next/link";
import count from 'word-count'
import { config } from "@/lib/config";
import { useSearchParams } from "next/navigation";
import KeywordFilter from "@/components/KeywordFilter";
import { useEffect, useState, useMemo, Suspense } from "react";

function BlogContent() {
  const searchParams = useSearchParams();
  const [filteredBlogs, setFilteredBlogs] = useState<any[]>([]);
  
  // Extract all unique keywords from blogs
  const allKeywords = Array.from(
    new Set(
      allBlogs.flatMap((blog: any) => blog.keywords || [])
    )
  ).sort();
  
  // Memoize the active keywords to prevent recreation on each render
  const activeKeywords = useMemo(() => {
    const keywordsParam = searchParams.get('keywords');
    return keywordsParam ? keywordsParam.split(',') : [];
  }, [searchParams]);
  
  // Filter blogs based on selected keywords
  useEffect(() => {
    // Using a functional update to avoid any stale dependencies
    setFilteredBlogs(() => {
      if (activeKeywords.length === 0) {
        // No filters, show all blogs sorted by date
        return [...allBlogs].sort((a: any, b: any) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      } else {
        // Filter blogs that have at least one of the selected keywords
        return [...allBlogs]
          .filter((blog: any) => 
            blog.keywords && 
            blog.keywords.some((keyword: string) => 
              activeKeywords.includes(keyword)
            )
          )
          .sort((a: any, b: any) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
      }
    });
  }, [activeKeywords]);

  // Group blogs by year
  const blogsByYear = useMemo(() => {
    const groupedByYear: Record<string, typeof filteredBlogs> = {};
    
    filteredBlogs.forEach(blog => {
      const year = new Date(blog.date).getFullYear().toString();
      if (!groupedByYear[year]) {
        groupedByYear[year] = [];
      }
      groupedByYear[year].push(blog);
    });
    
    // Sort years in descending order
    return Object.entries(groupedByYear)
      .sort(([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA))
      .map(([year, blogs]) => ({
        year: parseInt(year),
        blogs
      }));
  }, [filteredBlogs]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Keyword filter component */}
      <KeywordFilter allKeywords={allKeywords} />
      
      {/* Blog listing */}
      {filteredBlogs.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-lg text-gray-600">No blogs found matching the selected keywords.</p>
        </div>
      ) : (
        <div className="space-y-16 mt-8">
          {blogsByYear.map(({ year, blogs }) => (
            <section key={year} className="scroll-mt-16" id={`year-${year}`}>
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                {year}
              </h2>
              
              <div className="space-y-8">
                {blogs.map((blog: any) => (
                  <article 
                    key={blog.slug} 
                    className="pb-6 border-b border-gray-100 dark:border-gray-800"
                  >
                    <Link href={`/blog/${blog.slug}`} className="block mb-3">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-semibold underline underline-offset-4">
                            {blog.title}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {new Date(blog.date).toLocaleDateString('en-US', {
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

                    {blog.keywords && blog.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {blog.keywords.map((keyword: string) => (
                          <Link 
                            key={keyword} 
                            href={`/keywords/${encodeURIComponent(keyword)}`}
                            className={`px-3 py-1 rounded-md text-sm transition-colors ${
                              activeKeywords.includes(keyword)
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                            }`}
                          >
                            {keyword}
                          </Link>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
      
      {/* Year navigation */}
      {blogsByYear.length > 3 && (
        <div className="sticky bottom-6 mt-8">
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg mx-auto w-fit">
            <div className="flex flex-wrap gap-2 justify-center">
              {blogsByYear.map(({ year }) => (
                <a 
                  key={year}
                  href={`#year-${year}`}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-sm font-medium transition-colors"
                >
                  {year}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-8">Loading blogs...</div>}>
      <BlogContent />
    </Suspense>
  );
}


