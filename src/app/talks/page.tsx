import { allTalks } from "@/lib/talk-data"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import Image from "next/image"
import SpotlightCard from "@/components/SpotlightCard"
import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TalksPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Talks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allTalks.map((talk) => (
          <SpotlightCard 
            key={talk.slug} 
            className="p-4 transition-all hover:shadow-md h-full" 
            lightModeSpotlightColor="rgba(125, 98, 222, 0.15)"
            darkModeSpotlightColor="rgba(125, 98, 222, 0.25)"
          >
            <div className="flex flex-col space-y-2 h-full">
              <Link href={`/talks/${talk.slug}`} className="flex-grow">
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <h2 className="text-xl font-semibold hover:underline text-gray-900 dark:text-white mb-2">
                      {talk.title}
                    </h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      {formatDate(talk.date)} • {talk.event}
                    </span>
                  </div>
                  {talk.coverImage && (
                    <div className="relative w-full aspect-video mb-4">
                      <Image
                        src={talk.coverImage}
                        alt={talk.title}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  )}
                  <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                    {talk.summary}
                  </p>
                </div>
              </Link>
              {talk.videoUrl && (
                <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="link"
                    className="p-0 h-auto text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    asChild
                  >
                    <Link href={talk.videoUrl} target="_blank" rel="noopener noreferrer">
                      <span className="flex items-center gap-1">
                        <span>Watch on Bilibili</span>
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </SpotlightCard>
        ))}
      </div>
    </div>
  )
} 