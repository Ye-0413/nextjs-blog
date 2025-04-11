"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import SpotlightCard from "@/components/SpotlightCard";
import { Clock, MapPin, Calendar } from "lucide-react";
import Link from "next/link";
import { getEmbedUrl, getTalk } from "@/lib/client-utils";
import { Talk } from '@/lib/talk-data';
import ReactMarkdown from "react-markdown";

interface TalkContentProps {
  slug: string;
}

export default function TalkContent({ slug }: TalkContentProps) {
  const [mounted, setMounted] = useState(false);
  const [talk, setTalk] = useState<Talk | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    setMounted(true);
    
    // Fetch talk data from static JSON
    getTalk(slug)
      .then(data => {
        if (!data) {
          throw new Error(`Talk not found: ${slug}`);
        }
        setTalk(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading talk:', error);
        setError(error.message);
        setLoading(false);
      });
  }, [slug]);
  
  if (!mounted) return null;
  
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link 
            href="/talks" 
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to Talks
          </Link>
        </div>
        <div className="py-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">Loading talk...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!talk) {
    notFound();
  }

  const embedUrl = getEmbedUrl(talk.videoUrl);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link 
          href="/talks" 
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          ← Back to Talks
        </Link>
      </div>
      
      <div className="space-y-12">
        {/* Talk Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{talk.title}</h1>
          
          {/* Talk details/meta */}
          <div className="flex flex-wrap gap-4 mb-6 text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(talk.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            {talk.duration && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{talk.duration}</span>
              </div>
            )}
            {talk.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{talk.location}</span>
              </div>
            )}
          </div>
          
          {/* Description */}
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
            {talk.description}
          </p>
        </div>
        
        {/* Video Embed */}
        <SpotlightCard className="overflow-hidden">
          <div className="relative pt-[56.25%] w-full">
            <iframe 
              src={embedUrl}
              className="absolute top-0 left-0 w-full h-full"
              title={talk.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </SpotlightCard>
        
        {/* Content Section */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <ReactMarkdown>{talk.content}</ReactMarkdown>
        </div>
        
        {/* Tags Section */}
        {talk.keywords && talk.keywords.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Related Topics</h2>
            <div className="flex flex-wrap gap-2">
              {talk.keywords.map((keyword) => (
                <Link 
                  key={keyword}
                  href={`/keywords/${keyword.toLowerCase()}`}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full text-sm"
                >
                  {keyword}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 