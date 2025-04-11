import Link from "next/link";

export default function KeywordNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Keyword Not Found</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        We couldn't find any content with the specified keyword.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link 
          href="/keywords"
          className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          View All Keywords
        </Link>
        <Link 
          href="/"
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
} 