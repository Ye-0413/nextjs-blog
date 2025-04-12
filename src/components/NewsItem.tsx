"use client";

import React from "react";
import { format } from "date-fns";
import Link from "next/link";

interface NewsItemProps {
  title: string;
  date: string;
  slug: string;
  content: string;
  authors?: string[];
}

const NewsItem: React.FC<NewsItemProps> = ({
  title,
  date,
  slug,
  content,
  authors,
}) => {
  return (
    <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <article className="flex flex-col h-full">
        <div className="flex-1">
          <div className="flex flex-col justify-between">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 break-words">
              {title}
            </h3>
            <time
              dateTime={date}
              className="text-sm text-gray-500 dark:text-gray-400 mb-3"
            >
              {format(new Date(date), "MMMM d, yyyy")}
            </time>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 line-clamp-3 break-words">
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </div>

        <div className="mt-auto pt-3">
          <Link
            href={`/news#${format(new Date(date), "MMMM-yyyy").toLowerCase()}`}
            className="text-blue-600 dark:text-blue-400 text-sm font-semibold hover:underline"
          >
            Read more
          </Link>
        </div>
      </article>
    </div>
  );
};

export default NewsItem; 