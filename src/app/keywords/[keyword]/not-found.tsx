import Link from "next/link";

export default function KeywordNotFound() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 text-center">
      <h1 className="text-3xl font-bold mb-4">No matching content found</h1>
      <p className="text-gray-600 mb-8">
        We couldn't find any publications or articles with this keyword.
      </p>
      <Link 
        href="/"
        className="inline-flex bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        Return to home
      </Link>
    </div>
  );
} 