<h1 align=center>Edu-metaverse | Academic Blog</h1>

This is a Next.js blog template focused on education and metaverse technologies. It is based on the [hugo-ladder-theme](https://github.com/guangzhengli/hugo-theme-ladder).

## Local Development

```bash
npm install
npm run dev
```

## Deployment

Clone or fork this repository, modify the configuration as needed, and deploy it on [Vercel](https://vercel.com).

All default deployment configurations are sufficient; no special configuration is needed.

# Blog Configuration

## 1. How to Write Blog Posts

Blog posts should be placed in the `src/content/blog` directory as markdown or mdx files.

The following metadata fields can be configured:

- `title`: Blog post title
- `date`: Publication date
- `updated`: Update date
- `keywords`: Keywords for SEO optimization
- `featured`: Whether to display on the homepage
- `summary`: Blog post summary

## 2. Academic Publications

### 2.1 Adding Publications Manually

Academic publications should be placed in the `src/content/publications` directory as markdown files with the following metadata:

```markdown
---
title: "Your Publication Title"
authors: [
  "Last, First",
  "Last, First",
  "Last, First"
]
year: 2023
journal: "Journal or Conference Name"
abstract: "Your abstract text..."
featured: false
doi: "10.1000/journal.paper.id"
url: "https://link-to-publication.com"
keywords: [
  "Keyword 1",
  "Keyword 2", 
  "Keyword 3"
]
---
```

### 2.2 Batch Import from BibTeX

For easy management of your academic publications, you can import them from a BibTeX file:

1. Create a BibTeX file (e.g., `publications.bib`) with your publications
2. Run the import script:

```bash
npm run import-publications
```

This will automatically create markdown files for all publications in your BibTeX file.

#### BibTeX Format Example

```bibtex
@article{author2023title,
  title={Title of the Publication},
  author={Author, First and Second, Author},
  journal={Journal Name},
  year={2023},
  volume={42},
  number={3},
  pages={100--115},
  doi={10.1000/journal.paper.id},
  abstract={Abstract text goes here...},
  keywords={Keyword 1, Keyword 2, Keyword 3}
}
```

### 2.3 Adding Images to Publications

To add images to publications, add the following fields to the frontmatter:

```markdown
image: "/images/publications/your-image.jpg"
imageCaption: "Figure 1: Description of the image"
imageWidth: 1280
imageHeight: 720
imageAspectRatio: "16:9"
```

Place the image files in the `/public/images/publications/` directory.

## 3. Site Configuration

All site configuration is centralized in the `src/lib/config.ts` file, which has these benefits:

1. Centralized management: All configuration in one file for easy maintenance
2. Type safety: TypeScript provides type checking and auto-completion
3. Reusability: Avoid duplicate configuration scattered across files
4. Consistency: Ensure all parts of the site use the same configuration values

### 3.1 Basic Site Configuration

```typescript
site: {
  title: "Your Blog Title",
  name: "Your Blog Name",
  description: "Blog Description",
  keywords: ["Keyword1", "Keyword2"],
  url: "https://your-domain.com",
  baseUrl: "https://your-domain.com",
  image: "https://your-domain.com/og-image.png",
  favicon: {
    ico: "/favicon.ico",
    png: "/favicon.png",
    svg: "/favicon.svg",
    appleTouchIcon: "/favicon.png",
  },
  manifest: "/site.webmanifest",
}
```

These settings are used for:
- Basic site information
- SEO optimization
- Browser tab icons
- Social media previews

### 3.2 Author Information

```typescript
author: {
  name: "Your Name",
  email: "your-email@example.com",
  bio: "Personal bio",
}
```

Author information is used in:
- Homepage display
- RSS feed information
- Blog post author details

### 3.3 Social Media Links

```typescript
social: {
  github: "https://github.com/your-username",
  x: "https://x.com/your-username",
  buyMeACoffee: "https://www.buymeacoffee.com/your-username",
}
```

These links will appear in:
- Homepage social media link section
- Navigation bar social media icons

### 3.4 Navigation Menu

```typescript
navigation: {
  main: [
    { 
      title: "Academic Publications", 
      href: "/publications",
    },
    { 
      title: "Articles", 
      href: "/blog",
    },
    // You can add more navigation items
  ],
}
```

This configures the site's navigation menu with:
- Regular links
- Dropdown menus with sub-items

## 4. Generating RSS Feeds and Sitemaps

To generate RSS feeds:

```bash
npm run generate-rss
```

To generate a sitemap:

```bash
npm run generate-sitemap
```
