import { sanityClient } from '@/lib/sanity'
import { ARTICLES_QUERY } from '@/lib/queries'
import HomeClient from '@/components/HomeClient'

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

export default async function Home() {
  let articles: Article[] = []

  try {
    articles = await sanityClient.fetch(ARTICLES_QUERY)
  } catch (error) {
    console.error('Failed to fetch articles:', error)
  }

  return <HomeClient articles={articles} />
}