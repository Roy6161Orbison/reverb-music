export interface Article {
  _id: string
  slug: { current: string }
  title: string | { ja?: string; en?: string }
  subtitle?: string | { ja?: string; en?: string }
  type: 'review' | 'essay' | 'interview' | 'list' | 'news'
  reviewCategory?: 'new_release' | 'classic' | 'dig'
  score?: {
    overall: number
    breakdown?: {
      composition?: number
      production?: number
      originality?: number
      context?: number
    }
  }
  coverImage?: {
    asset: { _id: string; url: string }
  }
  excerpt?: string | { ja?: string; en?: string }
  publishedAt: string
  author?: { name: string | { ja?: string; en?: string }; slug?: { current: string } }
  mainArtist?: { name: string | { ja?: string; en?: string }; slug: { current: string } }
  mainAlbum?: { title: string | { ja?: string; en?: string }; slug: { current: string } }
  body?: any[]
  tags?: Tag[]
  relatedArticles?: Article[]
}

export interface Tag {
  _id: string
  name: string | { ja?: string; en?: string }
  slug: { current: string }
  type: 'genre' | 'mood' | 'theme' | 'era' | 'region'
}

export interface Artist {
  _id: string
  name: string | { ja?: string; en?: string }
  slug: { current: string }
  bio?: string | { ja?: string; en?: string }
  country?: string
  formedYear?: number
  profileImage?: { asset: { _id: string; url: string } }
}
