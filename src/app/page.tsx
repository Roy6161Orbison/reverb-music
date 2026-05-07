import { sanityClient } from '@/lib/sanity'
import { ARTICLES_QUERY } from '@/lib/queries'
import { Article } from '@/types'
import Link from 'next/link'

const MOCK_ARTICLES = [
  {
    _id: 'mock-1',
    slug: { current: 'midnight-dialogues' },
    title: 'Midnight Dialogues',
    type: 'review',
    publishedAt: '2024-12-15',
    excerpt: '内省と脆弱さの素晴らしい探求。プロダクションは精緻で、各ヴォーカルのニュアンスを輝かせる。',
    score: { overall: 7.8 },
    artist: 'Sound Weaver',
  },
  {
    _id: 'mock-2',
    slug: { current: 'live-at-venue-tokyo' },
    title: 'Live at Venue Tokyo',
    type: 'review',
    publishedAt: '2024-12-10',
    excerpt: '生のエネルギーと技巧が織りなす夜。',
    score: { overall: 8.1 },
    artist: 'Echo Chamber',
  },
  {
    _id: 'mock-3',
    slug: { current: 'whispered-static' },
    title: 'Whispered Static',
    type: 'review',
    publishedAt: '2024-12-05',
    excerpt: 'ノイズとメロディの境界線で踊る作品。',
    score: { overall: 7.2 },
    artist: 'Kira Nakamura',
  },
  {
    _id: 'mock-4',
    slug: { current: 'autumn-suite' },
    title: 'Autumn Suite',
    type: 'review',
    publishedAt: '2024-11-28',
    excerpt: '秋の物悲しさを音に閉じ込めた組曲。',
    score: { overall: 8.4 },
    artist: 'Mara Sōn',
  },
  {
    _id: 'mock-5',
    slug: { current: 'concrete-bloom' },
    title: 'Concrete Bloom',
    type: 'interview',
    publishedAt: '2024-11-20',
    excerpt: '都市と自然の両義性をテーマにした最新作。',
    artist: 'YUKI + GHOST',
  },
  {
    _id: 'mock-6',
    slug: { current: 'remembering-talk-talk' },
    title: 'Talk Talk を再評価する',
    type: 'feature',
    publishedAt: '2024-11-15',
    excerpt: '90年代に消えた英国の偉大なバンドが、なぜ今響くのか。',
    artist: 'Talk Talk',
  },
  {
    _id: 'mock-7',
    slug: { current: 'dig-fishmans' },
    title: '発掘：Fishmans『空中キャンプ』',
    type: 'review',
    publishedAt: '2024-11-08',
    excerpt: '日本のダブ・ポップが到達した極北。',
    score: { overall: 9.2 },
    artist: 'Fishmans',
  },
]

export default async function Home() {
  let articles: Article[] = []
  
  try {
    articles = await sanityClient.fetch(ARTICLES_QUERY)
  } catch (error) {
    console.error('Failed to fetch articles:', error)
  }

  const useArticles = articles.length > 0 ? articles : MOCK_ARTICLES as any

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/">
            <h1 className="font-serif text-2xl tracking-tight">Reverb</h1>
          </Link>
          <nav className="hidden md:flex gap-6 text-xs tracking-widest uppercase">
            <Link href="/reviews" className="hover:text-orange-700">Reviews</Link>
            <Link href="/features" className="hover:text-orange-700">Features</Link>
            <Link href="/interviews" className="hover:text-orange-700">Interviews</Link>
            <Link href="/news" className="hover:text-orange-700">News</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {useArticles.map((article: any) => (
            <ArticleItem key={article._id} article={article} />
          ))}
        </div>
      </div>

      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-serif text-base mb-1">Reverb / 残響</p>
          <p className="text-xs text-gray-500 tracking-widest uppercase">
            音楽を文化として読む
          </p>
        </div>
      </footer>
    </main>
  )
}

function ArticleItem({ article }: { article: any }) {
  const title = typeof article.title === 'string' ? article.title : (article.title?.ja || article.title?.en || 'Untitled')
  const excerpt = typeof article.excerpt === 'string' ? article.excerpt : (article.excerpt?.ja || article.excerpt?.en)
  
  return (
    <Link href={`/article/${article.slug.current}`}>
      <article className="cursor-pointer group pb-8 border-b border-gray-100">
        <p className="text-xs tracking-widest uppercase text-gray-500 mb-2">
          {article.type === 'review' ? 'Review' : article.type === 'interview' ? 'Interview' : article.type === 'feature' ? 'Feature' : article.type}
          <span className="mx-2">•</span>
          {new Date(article.publishedAt).toLocaleDateString('ja-JP')}
        </p>
        <h3 className="font-serif text-2xl mb-2 leading-tight group-hover:text-orange-700 transition-colors">
          {title}
        </h3>
        {article.artist && <p className="text-sm text-gray-600 mb-2">{article.artist}</p>}
        <p className="text-sm text-gray-700 leading-relaxed">{excerpt}</p>
        {article.score && (
          <p className="font-serif text-lg text-orange-700 mt-3">{article.score.overall}</p>
        )}
      </article>
    </Link>
  )
}
