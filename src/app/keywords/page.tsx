import { allBlogs, allPublications } from "content-collections";
import Link from "next/link";
import { Metadata } from "next";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: `Keywords | ${config.site.title}`,
  description: `Browse all keywords used across blogs and publications on ${config.site.title}`,
  keywords: `keywords, tags, categories, ${config.site.title}`,
};

interface KeywordCount {
  keyword: string;
  count: number;
  blogs: number;
  publications: number;
}

interface KeywordItem {
  source: 'blog' | 'publication';
  keyword: string;
}

export default function KeywordsPage() {
  // Extract all keywords from blogs
  const blogKeywords = allBlogs.flatMap((blog) => 
    blog.keywords ? blog.keywords.map((k: string) => ({ source: 'blog' as const, keyword: k })) : []
  );
  
  // Extract all keywords from publications
  const publicationKeywords = allPublications.flatMap((pub) => 
    pub.keywords ? pub.keywords.map((k: string) => ({ source: 'publication' as const, keyword: k })) : []
  );
  
  // Combine all keywords
  const allKeywords: KeywordItem[] = [...blogKeywords, ...publicationKeywords];
  
  // Count occurrences and group by keyword
  const keywordCounts: KeywordCount[] = [];
  const keywordMap = new Map<string, KeywordCount>();
  
  allKeywords.forEach(({ keyword, source }) => {
    if (!keywordMap.has(keyword)) {
      keywordMap.set(keyword, { 
        keyword, 
        count: 1, 
        blogs: source === 'blog' ? 1 : 0,
        publications: source === 'publication' ? 1 : 0
      });
    } else {
      const entry = keywordMap.get(keyword)!;
      entry.count += 1;
      if (source === 'blog') entry.blogs += 1;
      if (source === 'publication') entry.publications += 1;
    }
  });
  
  // Convert map to array and sort by count (descending)
  const sortedKeywords = Array.from(keywordMap.values())
    .sort((a, b) => b.count - a.count);
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Keywords</h1>
      <p className="text-gray-600 mb-8">
        Browse all {sortedKeywords.length} keywords used across blogs and publications.
        Click on any keyword to see all content tagged with it.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedKeywords.map(({ keyword, count, blogs, publications }) => (
          <Link
            key={keyword}
            href={`/keywords/${encodeURIComponent(keyword)}`}
            className="flex flex-col p-4 border rounded-lg hover:shadow-md transition-shadow"
          >
            <span className="text-lg font-medium">{keyword}</span>
            <div className="mt-2 text-sm text-gray-600">
              <span className="font-medium text-primary">{count}</span> items
              {blogs > 0 && publications > 0 && (
                <span> ({blogs} blog{blogs !== 1 ? 's' : ''}, {publications} publication{publications !== 1 ? 's' : ''})</span>
              )}
              {blogs > 0 && publications === 0 && (
                <span> ({blogs} blog{blogs !== 1 ? 's' : ''})</span>
              )}
              {publications > 0 && blogs === 0 && (
                <span> ({publications} publication{publications !== 1 ? 's' : ''})</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 