import { sanityClient } from '@/lib/sanity'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site'

export const revalidate = 3600

type FeedArticle = {
  title: string
  slug: { current: string }
  excerpt?: string
  publishedAt: string
}

const escapeXml = (str: string) =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

export async function GET() {
  let articles: FeedArticle[] = []

  try {
    articles = await sanityClient.fetch(
      `*[_type == "article" && defined(slug.current)] | order(publishedAt desc) [0...20] {
        title, slug, excerpt, publishedAt
      }`,
    )
  } catch (error) {
    console.error('Failed to fetch articles for RSS feed:', error)
  }

  const items = articles
    .map((article) => {
      const url = `${SITE_URL}/article/${article.slug.current}`
      return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      ${article.excerpt ? `<description>${escapeXml(article.excerpt)}</description>` : ''}
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>ja</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  })
}
