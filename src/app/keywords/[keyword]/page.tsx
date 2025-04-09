import { allPublications, allBlogs } from "content-collections";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

interface KeywordPageProps {
  params: {
    keyword: string;
  };
}

export function generateStaticParams() {
  const keywords = new Set<string>();
  
  // Collect all unique keywords from publications and blogs
  allPublications.forEach((pub) => {
    pub.keywords?.forEach((keyword) => keywords.add(keyword));
  });
  
  allBlogs.forEach((blog) => {
    blog.keywords?.forEach((keyword) => keywords.add(keyword));
  });
  
  return Array.from(keywords).map((keyword) => ({
    keyword: encodeURIComponent(keyword),
  }));
}

export default function KeywordPage({ params }: KeywordPageProps) {
  const keyword = decodeURIComponent(params.keyword);
  
  // Filter publications and blogs by the keyword
  const matchingPublications = allPublications.filter((pub) => 
    pub.keywords?.includes(keyword)
  ).sort((a, b) => b.year - a.year);
  
  const matchingBlogs = allBlogs.filter((blog) => 
    blog.keywords?.includes(keyword)
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // If no matching content is found, return 404
  if (matchingPublications.length === 0 && matchingBlogs.length === 0) {
    notFound();
  }
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Content tagged with "{keyword}"</h1>
      
      {matchingPublications.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Publications</h2>
          <div className="space-y-8">
            {matchingPublications.map((pub) => (
              <div key={pub.slug} className="border-b pb-6">
                <Link href={`/publications#${pub.slug}`} className="group">
                  <h3 className="text-xl font-medium mb-2 group-hover:text-blue-600 transition-colors">{pub.title}</h3>
                </Link>
                <p className="text-gray-700 mb-2">
                  {pub.authors.join(", ")}
                </p>
                <p className="text-gray-600 italic">
                  {pub.journal} ({pub.year})
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {matchingBlogs.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Articles</h2>
          <div className="space-y-6">
            {matchingBlogs.map((blog) => (
              <div key={blog.slug} className="border-b pb-6">
                <Link href={`/blog/${blog.slug}`} className="group">
                  <h3 className="text-xl font-medium mb-2 group-hover:text-blue-600 transition-colors">{blog.title}</h3>
                </Link>
                <p className="text-gray-600">
                  {new Date(blog.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                {blog.summary && (
                  <p className="text-gray-700 mt-2">{blog.summary}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 