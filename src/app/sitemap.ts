import type { MetadataRoute } from 'next'
import { sanityClient } from '@/lib/sanity'
import { SITE_URL } from '@/lib/site'

export const revalidate = 3600

type SitemapArticle = {
  slug: { current: string }
  publishedAt: string
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let articles: SitemapArticle[] = []

  try {
    articles = await sanityClient.fetch(
      `*[_type == "article" && defined(slug.current)]{ slug, publishedAt }`,
    )
  } catch (error) {
    console.error('Failed to fetch articles for sitemap:', error)
  }

  const articleUrls: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/article/${article.slug.current}`,
    lastModified: article.publishedAt ? new Date(article.publishedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...articleUrls,
  ]
}
