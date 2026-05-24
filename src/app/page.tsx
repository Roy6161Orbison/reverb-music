'use client'

import { sanityClient } from '@/lib/sanity'
import { ARTICLES_QUERY } from '@/lib/queries'
import Link from 'next/link'
import { useEffect, useState } from 'react'

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
]

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

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([])
  const [activeTab, setActiveTab] = useState<string>('all')

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await sanityClient.fetch(ARTICLES_QUERY)
        setArticles(data.length > 0 ? data : MOCK_ARTICLES)
      } catch (error) {
        console.error('Failed to fetch articles:', error)
        setArticles(MOCK_ARTICLES)
      }
    }
    fetchArticles()
  }, [])

  // メイン記事（最新）
  const mainArticle = articles[0]

  // タブでフィルタリング
  const filteredArticles = activeTab === 'all' 
    ? articles.slice(1)
    : articles.slice(1).filter(a => a.type === activeTab)

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'review', label: 'Reviews' },
    { id: 'feature', label: 'Features' },
    { id: 'interview', label: 'Interviews' },
  ]

  return (
    <main className="min-h-screen bg-white">
      {/* ヘッダー */}
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/">
            <h1 className="font-serif text-2xl tracking-tight">Reverb</h1>
          </Link>
          <nav className="hidden md:flex gap-6 text-xs tracking-widest uppercase">
            <Link href="/" className="hover:text-orange-700">Home</Link>
            <Link href="#" className="hover:text-orange-700">About</Link>
            <Link href="#" className="hover:text-orange-700">Archive</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6">
        {/* メイン記事 */}
        {mainArticle && (
          <section className="py-12 border-b border-gray-200">
            <Link href={`/article/${mainArticle.slug.current}`}>
              <article className="cursor-pointer group">
                <p className="text-xs tracking-widest uppercase text-gray-500 mb-3">
                  {mainArticle.type === 'review' ? 'Review' : mainArticle.type === 'interview' ? 'Interview' : mainArticle.type === 'feature' ? 'Feature' : mainArticle.type}
                  <span className="mx-2">•</span>
                  {new Date(mainArticle.publishedAt).toLocaleDateString('ja-JP')}
                </p>
                <h2 className="font-serif text-4xl mb-4 leading-tight group-hover:text-orange-700 transition-colors">
                  {mainArticle.title}
                </h2>
                {mainArticle.artist && <p className="text-lg text-gray-600 mb-3">{mainArticle.artist}</p>}
                <p className="text-base text-gray-700 leading-relaxed max-w-2xl">{mainArticle.excerpt}</p>
                {mainArticle.score && (
                  <p className="font-serif text-2xl text-orange-700 mt-4">{mainArticle.score.overall}</p>
                )}
              </article>
            </Link>
          </section>
        )}

        {/* タブ */}
        <div className="py-8 border-b border-gray-200">
          <div className="flex gap-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-sm tracking-widest uppercase transition-colors ${
                  activeTab === tab.id
                    ? 'text-black font-semibold border-b-2 border-orange-700 pb-2'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* グリッド表示 */}
        <section className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map(article => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        </section>
      </div>

      {/* フッター */}
      <footer className="border-t border-gray-200 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="font-serif text-base mb-1">Reverb / 残響</p>
          <p className="text-xs text-gray-500 tracking-widest uppercase">
            音楽を文化として読む
          </p>
        </div>
      </footer>
    </main>
  )
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/article/${article.slug.current}`}>
      <article className="cursor-pointer group">
        <p className="text-xs tracking-widest uppercase text-gray-500 mb-2">
          {article.type === 'review' ? 'Review' : article.type === 'interview' ? 'Interview' : article.type === 'feature' ? 'Feature' : article.type}
        </p>
        <h3 className="font-serif text-xl mb-2 leading-tight group-hover:text-orange-700 transition-colors">
          {article.title}
        </h3>
        {article.artist && <p className="text-sm text-gray-600 mb-2">{article.artist}</p>}
        <p className="text-sm text-gray-700 leading-relaxed">{article.excerpt}</p>
        {article.score && (
          <p className="font-serif text-lg text-orange-700 mt-2">{article.score.overall}</p>
        )}
      </article>
    </Link>
  )
}
