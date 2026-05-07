import Link from 'next/link'
import { Article } from '@/types'
import { urlFor } from '@/lib/sanity'
import Image from 'next/image'

export default function ArticleCard({ article }: { article: Article }) {
  const title = typeof article.title === 'string' ? article.title : (article.title?.ja || article.title?.en || 'Untitled')
  const authorName = typeof article.author?.name === 'string' 
    ? article.author.name 
    : (article.author?.name?.ja || article.author?.name?.en || 'Unknown')
  
  const imageUrl = article.coverImage?.asset ? urlFor(article.coverImage.asset).width(300).height(300).url() : null

  return (
    <article className="pb-12 border-b border-ink/10 last:border-b-0">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {imageUrl && (
          <div className="md:col-span-1 order-2 md:order-1">
            <Link href={`/article/${article.slug.current}`}>
              <div className="aspect-square bg-ink/5 rounded-sm overflow-hidden group cursor-pointer">
                <Image
                  src={imageUrl}
                  alt={title}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                />
              </div>
            </Link>
          </div>
        )}

        <div className={`${imageUrl ? 'md:col-span-2' : ''} order-1 md:order-2`}>
          <Link href={`/article/${article.slug.current}`}>
            <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-4 text-ink hover:text-orange transition-colors font-light">
              {title}
            </h2>
          </Link>

          <div className="flex items-center gap-4 mb-4 text-xs text-ink/60 tracking-widest">
            <span>{authorName}</span>
            <span>•</span>
            <span>{new Date(article.publishedAt).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            {article.score && (
              <>
                <span>•</span>
                <span className="text-orange font-serif text-sm">{article.score.overall}</span>
              </>
            )}
          </div>

          <p className="text-base leading-relaxed text-ink/80 mb-6 font-light">
            {typeof article.excerpt === 'string' ? article.excerpt : (article.excerpt?.ja || article.excerpt?.en)}
          </p>

          {article.tags && article.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {article.tags.slice(0, 3).map((tag) => {
                const tagName = typeof tag.name === 'string' ? tag.name : (tag.name?.ja || tag.name?.en || 'Tag')
                return (
                  <span key={tag._id} className="text-xs text-ink/50 px-2 py-1 border border-ink/20 rounded-sm">
                    {tagName}
                  </span>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
