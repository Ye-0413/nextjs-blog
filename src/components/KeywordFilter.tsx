'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface KeywordFilterProps {
  allKeywords: string[];
}

export default function KeywordFilter({ allKeywords }: KeywordFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  // Use refs to track state changes and avoid loops
  const isInitialMount = useRef(true);
  const previousKeywords = useRef<string[]>([]);
  const updatingFromUrl = useRef(false);
  const currentSelectedKeywords = useRef<string[]>([]);
  // Store current search params string for dependency tracking
  const searchParamsString = searchParams.toString();
  
  // Keep ref updated with latest state
  useEffect(() => {
    currentSelectedKeywords.current = selectedKeywords;
  }, [selectedKeywords]);
  
  // Initialize selected keywords from URL params
  useEffect(() => {
    const keywordsParam = searchParams.get('keywords');
    
    // Only update if the keywords have changed
    const newKeywords = keywordsParam ? keywordsParam.split(',') : [];
    const currentKeywordsString = newKeywords.sort().join(',');
    const selectedKeywordsString = currentSelectedKeywords.current.sort().join(',');
    
    if (currentKeywordsString !== selectedKeywordsString) {
      updatingFromUrl.current = true;
      setSelectedKeywords(newKeywords);
    }
  }, [searchParamsString]); // Remove selectedKeywords dependency

  // Memoize the URL update function to avoid recreating it
  const updateUrl = useCallback((keywords: string[]) => {
    const params = new URLSearchParams(searchParamsString);
    
    if (keywords.length > 0) {
      params.set('keywords', keywords.join(','));
    } else {
      params.delete('keywords');
    }
    
    const newUrl = `${pathname}?${params.toString()}`;
    router.replace(newUrl);
  }, [pathname, router, searchParamsString]);

  // Update URL whenever selectedKeywords changes, but only if not updating from URL
  useEffect(() => {
    // Skip the first render
    if (isInitialMount.current) {
      isInitialMount.current = false;
      previousKeywords.current = selectedKeywords;
      return;
    }
    
    // Skip if we're currently updating from URL params
    if (updatingFromUrl.current) {
      updatingFromUrl.current = false;
      previousKeywords.current = selectedKeywords;
      return;
    }
    
    // Skip if keywords haven't actually changed (prevents loops)
    const prevKeywordsString = previousKeywords.current.sort().join(',');
    const currentKeywordsString = selectedKeywords.sort().join(',');
    
    if (prevKeywordsString === currentKeywordsString) {
      return;
    }
    
    // Update URL
    updateUrl(selectedKeywords);
    previousKeywords.current = selectedKeywords;
  }, [selectedKeywords, updateUrl]);

  // Toggle keyword selection
  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords(prev => 
      prev.includes(keyword)
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  // Clear all selected keywords
  const clearFilters = () => {
    setSelectedKeywords([]);
  };

  if (allKeywords.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-medium">Filter by keyword</h2>
        {selectedKeywords.length > 0 && (
          <button 
            onClick={clearFilters}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Clear filters
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {allKeywords.map(keyword => (
          <button
            key={keyword}
            onClick={() => toggleKeyword(keyword)}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              selectedKeywords.includes(keyword)
                ? 'bg-primary text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            {keyword}
          </button>
        ))}
      </div>
    </div>
  );
} 