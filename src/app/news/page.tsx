"use client";

import { allNews } from "content-collections";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { format } from 'date-fns';
import SpotlightCard from "@/components/SpotlightCard";

export default function NewsPage() {
  const [mounted, setMounted] = useState(false);
  
  // Hydration fix for server/client mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sort news by date (newest first)
  const sortedNews = useMemo(() => {
    return [...allNews].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, []);

  // Group news by month
  const newsByMonth = useMemo(() => {
    const groupedByMonth: Record<string, typeof allNews> = {};
    
    sortedNews.forEach(news => {
      const date = new Date(news.date);
      const monthKey = format(date, 'MMMM yyyy');
      
      if (!groupedByMonth[monthKey]) {
        groupedByMonth[monthKey] = [];
      }
      groupedByMonth[monthKey].push(news);
    });
    
    // Get month keys in chronological order (newest first)
    return Object.entries(groupedByMonth)
      .sort(([monthA], [monthB]) => {
        const dateA = new Date(monthA);
        const dateB = new Date(monthB);
        return dateB.getTime() - dateA.getTime();
      })
      .map(([month, items]) => ({
        month,
        items
      }));
  }, [sortedNews]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Recent News</h1>
      
      <div className="space-y-16">
        {newsByMonth.map(({ month, items }) => (
          <section key={month} className="scroll-mt-16" id={month.replace(/\s+/g, '-').toLowerCase()}>
            <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
              {month}
            </h2>
            
            <div className="space-y-6">
              {items.map((newsItem) => (
                <SpotlightCard 
                  key={newsItem.slug} 
                  className="p-4 transition-all hover:shadow-md w-full"
                  lightModeSpotlightColor="rgba(93, 140, 179, 0.15)"
                  darkModeSpotlightColor="rgba(93, 140, 179, 0.25)"
                >
                  <article className="flex flex-col">
                    <div className="flex-1">
                      <div className="flex flex-col justify-between">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {newsItem.title}
                        </h3>
                        <time 
                          dateTime={newsItem.date} 
                          className="text-sm text-gray-500 dark:text-gray-400 mb-3"
                        >
                          {format(new Date(newsItem.date), 'MMMM d, yyyy')}
                        </time>
                      </div>
                      
                      <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                        <div dangerouslySetInnerHTML={{ __html: newsItem.content }} />
                      </div>
                    </div>
                    
                    {newsItem.authors && newsItem.authors.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300">
                        By: {newsItem.authors.join(', ')}
                      </div>
                    )}
                  </article>
                </SpotlightCard>
              ))}
            </div>
          </section>
        ))}
      </div>
      
      {/* Month navigation */}
      {newsByMonth.length > 3 && (
        <div className="sticky bottom-6 mt-8">
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg mx-auto w-fit">
            <div className="flex flex-wrap gap-2 justify-center">
              {newsByMonth.map(({ month }) => (
                <a 
                  key={month}
                  href={`#${month.replace(/\s+/g, '-').toLowerCase()}`}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-sm font-medium transition-colors"
                >
                  {month}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 