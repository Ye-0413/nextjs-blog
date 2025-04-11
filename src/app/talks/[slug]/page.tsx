import { allTalks } from "@/lib/talk-data"
import { notFound } from "next/navigation"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import SpotlightCard from "@/components/SpotlightCard"

interface TalkPageProps {
  params: {
    slug: string
  }
}

export default function TalkPage({ params }: TalkPageProps) {
  const talk = allTalks.find((talk) => talk.slug === params.slug)

  if (!talk) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/talks">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Talks
          </Button>
        </Link>
      </div>

      <SpotlightCard 
        className="p-8 transition-all hover:shadow-md" 
        lightModeSpotlightColor="rgba(125, 98, 222, 0.15)"
        darkModeSpotlightColor="rgba(125, 98, 222, 0.25)"
      >
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {talk.title}
            </h1>
            <span className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              {formatDate(talk.date)} • {talk.event}
              {talk.location && ` • ${talk.location}`}
            </span>
          </div>

          {talk.coverImage && (
            <div className="relative w-full h-96">
              <Image
                src={talk.coverImage}
                alt={talk.title}
                fill
                className="object-cover rounded-md"
              />
            </div>
          )}
          
          <div className="prose dark:prose-invert max-w-none">
            <MDXRemote
              source={talk.content}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                },
              }}
            />
          </div>

          {(talk.videoUrl || talk.slidesUrl) && (
            <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {talk.videoUrl && (
                <Button asChild>
                  <Link href={talk.videoUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Watch Video
                  </Link>
                </Button>
              )}
              {talk.slidesUrl && (
                <Button asChild variant="outline">
                  <Link href={talk.slidesUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Slides
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </SpotlightCard>
    </div>
  )
} 