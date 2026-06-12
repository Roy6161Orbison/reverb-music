import type { Metadata } from 'next'
import { cache } from 'react'
import { sanityClient } from '@/lib/sanity'
import { ARTICLE_BY_SLUG_QUERY } from '@/lib/queries'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ReadingProgress from '@/components/ReadingProgress'
import ScoreCounter from '@/components/ScoreCounter'
import Reveal from '@/components/Reveal'
import ParallaxImage from '@/components/ParallaxImage'
import { SITE_NAME, SITE_URL } from '@/lib/site'

// 埋め込みURLを iframe 用の埋め込みURLに変換（YouTube / Spotify / Apple Music 対応）
function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`
    }
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const id = u.searchParams.get('v')
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
    if (host === 'open.spotify.com') {
      return `https://open.spotify.com/embed${u.pathname}`
    }
    if (host === 'music.apple.com') {
      return `https://embed.music.apple.com${u.pathname}${u.search}`
    }
    return null
  } catch {
    return null
  }
}

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

// generateMetadata と本体の二重取得を防ぐためキャッシュ
const getArticle = cache(async (slug: string): Promise<Article | null> => {
  try {
    return await sanityClient.fetch(ARTICLE_BY_SLUG_QUERY, { slug })
  } catch (error) {
    console.error('Failed to fetch article:', error)
    return null
  }
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    return { title: '記事が見つかりません' }
  }

  const ogImage = article.image
    ? urlFor(article.image).width(1200).height(630).fit('crop').url()
    : undefined

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/article/${slug}` },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.excerpt,
      url: `${SITE_URL}/article/${slug}`,
      publishedTime: article.publishedAt,
      images: ogImage
        ? [{ url: ogImage, width: 1200, height: 630, alt: article.title }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}

export default async function ArticlePage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  // params を await で取得
  const { slug } = await params

  const article = await getArticle(slug)

  if (!article) {
    return <div className="text-center py-12">記事が見つかりません</div>
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    image: article.image
      ? urlFor(article.image).width(1200).height(630).fit('crop').url()
      : undefined,
    author: article.artist ? { '@type': 'Person', name: article.artist } : undefined,
    publisher: { '@type': 'Organization', name: SITE_NAME },
    mainEntityOfPage: `${SITE_URL}/article/${slug}`,
  }

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadingProgress />
      <Header />

      <article className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 mb-8 inline-block anim-fade-in transition-colors">
          ← ホームに戻る
        </Link>

        {/* 記事のメタ情報 */}
        <p className="font-label text-[0.65rem] tracking-widest uppercase text-gray-500 mb-4 anim-fade-in-up">
          {article.type === 'music' ? 'Music' : article.type === 'film' ? 'Film' : article.type === 'interview' ? 'Interview' : article.type === 'feature' ? 'Feature' : article.type === 'essay' ? 'Essay' : article.type}
          <span className="mx-2">•</span>
          {new Date(article.publishedAt).toLocaleDateString('ja-JP')}
        </p>

        {/* タイトル */}
        <Reveal as="h1" className="text-reveal font-serif text-5xl mb-4 leading-tight" delay={80}>
          <span>{article.title}</span>
        </Reveal>

        {/* アーティスト */}
        {article.artist && (
          <p className="text-xl text-gray-600 mb-6 anim-fade-in-up anim-delay-2">{article.artist}</p>
        )}

        {/* スコア */}
        {article.score && (
          <div className="flex items-baseline gap-4 mb-8 anim-fade-in-up anim-delay-2">
            <span className="font-serif text-6xl text-orange-700">
              <ScoreCounter value={article.score.overall} />
            </span>
            <p className="font-label text-[0.6rem] uppercase tracking-widest text-gray-600">Overall score</p>
          </div>
        )}

        {/* カバー画像（パララックス） */}
        {article.image && (
          <Reveal className="img-reveal mb-8 overflow-hidden rounded-lg" delay={120}>
            <ParallaxImage
              src={urlFor(article.image).width(1000).height(620).url()}
              alt={article.title}
              className="h-96 rounded-lg"
            />
          </Reveal>
        )}

        {/* 本文 */}
        <div className="article-body prose prose-lg max-w-none mb-12 text-gray-900">
          {article.body && article.body.length > 0 ? (
            article.body.map((block: any, idx: number) => {
              if (block._type === 'block') {
                return (
                  <Reveal key={idx} as="p" className="reveal text-base leading-8 text-gray-800 mb-6">
                    {block.children?.map((child: any) => child.text).join('')}
                  </Reveal>
                )
              }
              if (block._type === 'image' && block.asset) {
                return (
                  <Reveal key={idx} as="figure" className="reveal my-8">
                    <img
                      src={urlFor(block).width(1000).url()}
                      alt={block.alt || ''}
                      className="w-full rounded-lg"
                    />
                    {block.caption && (
                      <figcaption className="mt-2 text-center text-sm text-gray-500">
                        {block.caption}
                      </figcaption>
                    )}
                  </Reveal>
                )
              }
              if (block._type === 'embed' && block.url) {
                const embed = toEmbedUrl(block.url)
                return (
                  <Reveal key={idx} as="figure" className="reveal my-8">
                    {embed ? (
                      <div className="overflow-hidden rounded-lg" style={{ aspectRatio: '16 / 9' }}>
                        <iframe
                          src={embed}
                          className="h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <a href={block.url} target="_blank" rel="noopener noreferrer" className="text-orange-700 underline">
                        {block.url}
                      </a>
                    )}
                    {block.caption && (
                      <figcaption className="mt-2 text-center text-sm text-gray-500">
                        {block.caption}
                      </figcaption>
                    )}
                  </Reveal>
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
