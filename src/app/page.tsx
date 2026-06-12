import { sanityClient } from '@/lib/sanity'
import { ARTICLES_QUERY, UPCOMING_EVENTS_QUERY } from '@/lib/queries'
import HomeClient from '@/components/HomeClient'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site'

export const revalidate = 60

type Article = {
  _id: string
  slug: { current: string }
  title: string
  type: 'review' | 'feature' | 'interview' | 'news'
  publishedAt: string
  excerpt: string
  score?: { overall: number }
  artist?: string
}

type Event = {
  _id: string
  artist: string
  venue: string
  city?: string
  date: string
  ticketUrl?: string
  image?: { asset: { _ref: string } }
  featured?: boolean
}

export default async function Home() {
  let articles: Article[] = []
  let events: Event[] = []

  try {
    // 今日の0時(UTC)以降を「これからのイベント」として扱う
    const startOfToday = new Date()
    startOfToday.setUTCHours(0, 0, 0, 0)
    const now = startOfToday.toISOString()
    ;[articles, events] = await Promise.all([
      sanityClient.fetch(ARTICLES_QUERY),
      sanityClient.fetch(UPCOMING_EVENTS_QUERY, { now }),
    ])
  } catch (error) {
    console.error('Failed to fetch:', error)
  }

  // WebSite + Organization の構造化データ（検索エンジン向け）
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      inLanguage: 'ja',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient articles={articles} events={events} />
    </>
  )
}