import { sanityClient } from '@/lib/sanity'
import { ARTICLE_BY_SLUG_QUERY } from '@/lib/queries'
import { Article } from '@/types'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import Image from 'next/image'

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  let article: Article | null = null

  try {
    article = await sanityClient.fetch(ARTICLE_BY_SLUG_QUERY, { slug: params.slug })
  } catch (error) {
    console.error('Failed to fetch article:', error)
    return <div className="text-center py-12">記事が見つかりません</div>
  }

  if (!article) {
    return <div className="text-center py-12">記事が見つかりません</div>
  }

  const title = typeof article.title === 'string' ? article.title : (article.title?.ja || article.title?.en || 'Untitled')
  const imageUrl = article.coverImage?.asset ? urlFor(article.coverImage.asset).width(600).url() : null

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 mb-8 inline-block">
        ← Back to reviews
      </Link>

      {imageUrl && (
        <div className="w-full h-96 bg-gray-300 rounded-lg mb-8 overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            width={600}
            height={400}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {article.score && (
        <div className="flex items-baseline gap-4 mb-8">
          <span className="font-serif text-6xl text-orange-700">{article.score.overall}</span>
          <p className="text-xs uppercase tracking-widest text-gray-600">Overall score</p>
        </div>
      )}

      <h1 className="font-serif text-4xl mb-2 leading-tight text-black">{title}</h1>

      <p className="text-sm text-gray-600 mb-8">
        {typeof article.author?.name === 'string' 
          ? article.author.name 
          : (article.author?.name?.ja || 'Unknown')} • {new Date(article.publishedAt).toLocaleDateString('ja-JP')}
      </p>

      <div className="prose prose-sm max-w-none mb-12 text-gray-900">
        {article.body && article.body.length > 0 ? (
          article.body.map((block: any, idx: number) => {
            if (block._type === 'block') {
              return (
                <p key={idx} className="text-base leading-7 text-gray-900 mb-4">
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

      {article.tags && article.tags.length > 0 && (
        <div className="mb-8 pt-8 border-t border-gray-300">
          <div className="flex gap-2 flex-wrap">
            {article.tags.map((tag) => {
              const tagName = typeof tag.name === 'string' ? tag.name : (tag.name?.ja || tag.name?.en || 'Tag')
              return (
                <span key={tag._id} className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-md">
                  {tagName}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {article.relatedArticles && article.relatedArticles.length > 0 && (
        <div className="pt-8 border-t border-gray-300">
          <h3 className="font-serif text-base font-medium mb-4">関連記事</h3>
          <ul className="space-y-2 text-sm">
            {article.relatedArticles.map((related) => {
              const relatedTitle = typeof related.title === 'string' ? related.title : (related.title?.ja || related.title?.en || 'Untitled')
              return (
                <li key={related._id}>
                  <Link
                    href={`/article/${related.slug.current}`}
                    className="text-gray-900 hover:text-orange-700 underline"
                  >
                    {relatedTitle}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </main>
  )
}
