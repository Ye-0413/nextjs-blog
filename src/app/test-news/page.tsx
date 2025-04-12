"use client";

import { allNews } from "content-collections";
import { useEffect, useState } from "react";

export default function TestNewsPage() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    console.log("News data:", allNews);
  }, []);
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">News Test Page</h1>
      
      {!mounted ? (
        <p>Loading...</p>
      ) : allNews && allNews.length > 0 ? (
        <div>
          <p className="mb-4">Found {allNews.length} news items:</p>
          <ul className="list-disc pl-5 space-y-2">
            {allNews.map((news) => (
              <li key={news.slug} className="mb-4 p-4 border rounded">
                <h3 className="font-semibold">{news.title}</h3>
                <p>Date: {news.date}</p>
                <p>Content length: {news.content?.length || 0} characters</p>
                {news.authors && news.authors.length > 0 && (
                  <p>Authors: {news.authors.join(", ")}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p>No news data found. There may be an issue with the content-collections integration.</p>
        </div>
      )}
    </div>
  );
} 