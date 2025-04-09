export const config = {
  site: {
    title: "Edu-metaverse",
    name: "Edu-metaverse",
    description: "Exploring the intersection of education and metaverse technology",
    keywords: ["Education", "Metaverse", "EdTech", "Academic Research", "Virtual Learning"],
    url: "https://xxx.com",
    baseUrl: "https://xxx.com",
    image: "https://xxx.com/og-image.png",
    favicon: {
      ico: "/favicon.ico",
      png: "/favicon.png",
      svg: "/favicon.svg",
      appleTouchIcon: "/favicon.png",
    },
    manifest: "/site.webmanifest",
    rss: {
      title: "Edu-metaverse",
      description: "Latest insights on Edu-Metaverse",
      feedLinks: {
        rss2: "/rss.xml",
        json: "/feed.json",
        atom: "/atom.xml",
      },
    },
  },
  author: {
    name: "Ye Jia",
    email: "academic-ye.jia@hotmail.com",
    bio: "Exploring the future of education in the metaverse",
  },
  social: {
    github: "https://github.com/xxx",
    x: "https://x.com/xxx",
    buyMeACoffee: "https://www.buymeacoffee.com/xxx",
  },
  giscus: {
    repo: "guangzhengli/hugo-ladder-exampleSite",
    repoId: "R_kgDOHyVOjg",
    categoryId: "DIC_kwDOHyVOjs4CQsH7",
  },
  navigation: {
    main: [
      { 
        title: "Publications", 
        href: "/publications",
      },
      {
        title: "Articles",
        href: "/blog",
      }
    ],
  },
  seo: {
    metadataBase: new URL("https://xxx.com"),
    alternates: {
      canonical: './',
    },
    openGraph: {
      type: "website" as const,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image" as const,
      creator: "@xxx",
    },
  },
};
