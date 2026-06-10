export type Article = {
  _id: string
  slug: { current: string }
  title: string
  type: 'review' | 'feature' | 'interview' | 'news'
  publishedAt: string
  excerpt: string
  body?: any[]
  score?: { overall: number }
  artist?: string
  featured?: boolean
  image?: {
    asset: { _ref: string }
    hotspot?: any
  }
}

export function typeLabel(type: Article['type']): string {
  switch (type) {
    case 'review':
      return 'Review'
    case 'feature':
      return 'Feature'
    case 'interview':
      return 'Interview'
    case 'news':
      return 'News'
    default:
      return type
  }
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ja-JP')
}
