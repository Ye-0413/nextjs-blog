"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { allPublications } from "content-collections";
import * as Collapsible from "@radix-ui/react-collapsible";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";

export default function PublicationsPage() {
  const sortedPublications = allPublications.sort((a, b) => b.year - a.year);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (slug: string) => {
    setOpenItems(prev => ({
      ...prev,
      [slug]: !prev[slug]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">Academic Publications</h1>
      <div className="space-y-12">
        {sortedPublications.map((pub) => (
          <div key={pub.slug} className="border-b pb-8" id={pub.slug}>
            <div className="flex flex-col">
              <div className="flex items-start gap-2">
                <button 
                  onClick={() => toggleItem(pub.slug)}
                  className="p-1 mt-1 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                  aria-label={openItems[pub.slug] ? "Collapse details" : "Expand details"}
                >
                  {openItems[pub.slug] ? 
                    <ChevronDown className="w-5 h-5" /> : 
                    <ChevronRight className="w-5 h-5" />
                  }
                </button>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold">{pub.title}</h2>
                  <p className="text-gray-700 mt-1">
                    {pub.authors.join(", ")}
                  </p>
                  <p className="text-gray-600 italic mt-1">
                    {pub.journal} ({pub.year})
                  </p>
                </div>
              </div>

              <Collapsible.Root
                open={openItems[pub.slug] || false}
                onOpenChange={() => toggleItem(pub.slug)}
                className="mt-2 ml-7"
              >
                <AnimatePresence>
                  {openItems[pub.slug] && (
                    <Collapsible.Content forceMount>
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        {pub.image && (
                          <div className="my-4">
                            <div className="w-full mb-2">
                              <Image 
                                src={pub.image} 
                                alt={pub.imageCaption || pub.title}
                                width={pub.imageWidth || 1200}
                                height={pub.imageHeight || 600}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                priority
                                className="w-full h-auto rounded-lg object-contain max-h-[500px]"
                                style={{
                                  objectFit: 'contain',
                                  aspectRatio: pub.imageAspectRatio ? pub.imageAspectRatio.replace(':', '/') : '16/9',
                                }}
                              />
                            </div>
                            {pub.imageCaption && (
                              <p className="text-sm text-gray-500 italic text-center mt-2">
                                {pub.imageCaption}
                              </p>
                            )}
                          </div>
                        )}
                        
                        {pub.abstract && (
                          <div className="mb-4">
                            <h3 className="text-lg font-medium mb-2">Abstract</h3>
                            <p className="text-gray-800">{pub.abstract}</p>
                          </div>
                        )}

                        {pub.volume && (
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Volume:</span> {pub.volume}
                            {pub.number && <span>, Issue: {pub.number}</span>}
                            {pub.pages && <span>, Pages: {pub.pages}</span>}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {pub.keywords?.map((keyword) => (
                            <Link 
                              key={keyword} 
                              href={`/keywords/${encodeURIComponent(keyword)}`}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm transition-colors"
                            >
                              {keyword}
                            </Link>
                          ))}
                        </div>
                        <div className="flex gap-4 mt-4">
                          {pub.doi && (
                            <a
                              href={`https://doi.org/${pub.doi}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <span>View Publication</span>
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          {pub.url && (
                            <a
                              href={pub.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <span>Visit Website</span>
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </motion.div>
                    </Collapsible.Content>
                  )}
                </AnimatePresence>
              </Collapsible.Root>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 