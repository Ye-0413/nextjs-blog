'use client';

import { allBlogs } from "content-collections";
import Link from "next/link";
import count from 'word-count'
import { config } from "@/lib/config";
import { useSearchParams } from "next/navigation";
import KeywordFilter from "@/components/KeywordFilter";
import { useEffect, useState, useMemo } from "react";

export default function BlogPage() {
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

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Keyword filter component */}
      <KeywordFilter allKeywords={allKeywords} />
      
      {/* Blog listing */}
      <div className="space-y-8">
        {filteredBlogs.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-lg text-gray-600">No blogs found matching the selected keywords.</p>
          </div>
        ) : (
          filteredBlogs.map((blog: any) => (
            <article 
              key={blog.slug} 
              className="pb-6 border-b"
            >
              <Link href={`/blog/${blog.slug}`} className="block mb-3">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold underline underline-offset-4">
                      {blog.title}
                    </h2>
                    <span className="text-sm text-gray-500">
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
          ))
        )}
      </div>
    </div>
  );
}


