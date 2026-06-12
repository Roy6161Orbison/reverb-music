import { sanityClient } from '@/lib/sanity'
import { ARTICLES_QUERY, UPCOMING_EVENTS_QUERY } from '@/lib/queries'
import HomeClient from '@/components/HomeClient'
import UpcomingEvents from '@/components/UpcomingEvents'

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
    const now = new Date().toISOString()
    ;[articles, events] = await Promise.all([
      sanityClient.fetch(ARTICLES_QUERY),
      sanityClient.fetch(UPCOMING_EVENTS_QUERY, { now }),
    ])
  } catch (error) {
    console.error('Failed to fetch:', error)
  }

  return (
    <>
      <HomeClient articles={articles} />
      <div className="max-w-6xl mx-auto px-6">
        <UpcomingEvents events={events} />
      </div>
    </>
  )
}