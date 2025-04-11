import { defineCollection, defineConfig } from "@content-collections/core";

const blogs = defineCollection({
  name: "blogs",
  directory: "src/content/blog",
  include: "**/*.md",
  schema: (z) => ({
    title: z.string(),
    date: z.string(),
    updated: z.string().optional(),
    featured: z.boolean().optional().default(false),
    summary: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  }),
  transform: async (document) => {
    return {
      ...document,
      slug: `${document._meta.path}`,
    };
  },
});

const publications = defineCollection({
  name: "publications",
  directory: "src/content/publications",
  include: "**/*.md",
  schema: (z) => ({
    title: z.string(),
    authors: z.array(z.string()),
    year: z.number(),
    journal: z.string(),
    abstract: z.string().optional(),
    doi: z.string().optional(),
    url: z.string().optional(),
    volume: z.string().optional(),
    number: z.string().optional(),
    pages: z.string().optional(),
    featured: z.boolean().optional().default(false),
    image: z.string().optional(),
    imageCaption: z.string().optional(),
    imageWidth: z.number().optional(),
    imageHeight: z.number().optional(),
    imageAspectRatio: z.string().optional(), // e.g., "16:9", "4:3", "1:1"
    keywords: z.array(z.string()).optional(),
  }),
  transform: async (document) => {
    return {
      ...document,
      slug: `${document._meta.path}`,
    };
  },
});

const talks = defineCollection({
  name: "talks",
  directory: "src/content/talks",
  include: "**/index.md",
  schema: (z) => ({
    title: z.string(),
    date: z.string(),
    event: z.string(),
    location: z.string().optional(),
    featured: z.boolean().optional().default(false),
    summary: z.string(),
    coverImage: z.string().optional(),
    videoUrl: z.string().optional(),
    slidesUrl: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  }),
  transform: async (document) => {
    return {
      ...document,
      slug: document._meta.path.replace(/\/index$/, ''),
    };
  },
});

const news = defineCollection({
  name: "news",
  directory: "src/content/news",
  include: "**/index.md",
  schema: (z) => ({
    title: z.string(),
    date: z.string(),
    authors: z.array(z.string()).optional(),
    publication_types: z.array(z.string()).optional().nullable(),
  }),
  transform: async (document) => {
    return {
      ...document,
      slug: document._meta.path.replace(/\/index$/, ''),
      // Extract the date from the directory name (YYYYMMDD format)
      dateFormatted: document._meta.path.substring(0, 8),
      content: document.content || '',
    };
  },
});

export default defineConfig({
  collections: [blogs, publications, talks, news],
});
