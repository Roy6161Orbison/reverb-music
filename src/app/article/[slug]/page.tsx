import { sanityClient } from '@/lib/sanity'
import { ARTICLE_BY_SLUG_QUERY } from '@/lib/queries'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

type Article = {
  _id: string
  title: string
  slug: { current: string }
  type: string
  excerpt: string
  body: any[]
  publishedAt: string
  artist?: string
  score?: { overall: number }
  featured?: boolean
  image?: {
    asset: {
      _ref: string
    }
  }
}

export default async function ArticlePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  // params を await で取得
  const { slug } = await params
  
  let article: Article | null = null

  try {
    article = await sanityClient.fetch(ARTICLE_BY_SLUG_QUERY, { slug })
  } catch (error) {
    console.error('Failed to fetch article:', error)
    return <div className="text-center py-12">記事が見つかりません</div>
  }

  if (!article) {
    return <div className="text-center py-12">記事が見つかりません</div>
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <article className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 mb-8 inline-block">
          ← ホームに戻る
        </Link>

        {/* 記事のメタ情報 */}
        <p className="text-xs tracking-widest uppercase text-gray-500 mb-4">
          {article.type === 'review' ? 'Review' : article.type === 'interview' ? 'Interview' : article.type === 'feature' ? 'Feature' : article.type}
          <span className="mx-2">•</span>
          {new Date(article.publishedAt).toLocaleDateString('ja-JP')}
        </p>

        {/* タイトル */}
        <h1 className="font-serif text-5xl mb-4 leading-tight">{article.title}</h1>

        {/* アーティスト */}
        {article.artist && <p className="text-xl text-gray-600 mb-6">{article.artist}</p>}

        {/* スコア */}
        {article.score && (
          <div className="flex items-baseline gap-4 mb-8">
            <span className="font-serif text-6xl text-orange-700">{article.score.overall}</span>
            <p className="text-xs uppercase tracking-widest text-gray-600">Overall score</p>
          </div>
        )}

        {/* カバー画像 */}
        {article.image && (
          <div className="mb-8 overflow-hidden rounded-lg">
            <img
              src={urlFor(article.image).width(800).height(500).url()}
              alt={article.title}
              className="w-full h-96 object-cover"
            />
          </div>
        )}

        {/* 本文 */}
        <div className="prose prose-lg max-w-none mb-12 text-gray-900">
          {article.body && article.body.length > 0 ? (
            article.body.map((block: any, idx: number) => {
              if (block._type === 'block') {
                return (
                  <p key={idx} className="text-base leading-8 text-gray-800 mb-6">
                    {block.children?.map((child: any) => child.text).join('')}
                  </p>
                )
              }
              return null
            })
          ) : (
            <p className="text-gray-600">[記事本文がまだありません]</p>
          )}
        </div>
      </article>

      <Footer />
    </main>
  )
}
