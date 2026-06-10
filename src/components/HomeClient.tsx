'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'
import { urlFor } from '@/lib/sanity'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

type Article = {
  _id: string
  slug: { current: string }
  title: string
  type: 'review' | 'feature' | 'interview' | 'news'
  publishedAt: string
  excerpt: string
  score?: { overall: number }
  artist?: string
  featured?: boolean
  image?: {
    asset: {
      _ref: string
    }
    hotspot?: any
  }
}

export default function HomeClient({ articles }: { articles: Article[] }) {
  const [activeTab, setActiveTab] = useState<string>('all')
  const [gridKey, setGridKey] = useState(0)
  const [fading, setFading] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  const mainArticle = articles.find(a => a.featured) || articles[0]

  const filteredArticles = activeTab === 'all'
    ? articles.filter(a => a._id !== mainArticle._id)
    : articles.filter(a => a.type === activeTab && a._id !== mainArticle._id)

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'review', label: 'Reviews' },
    { id: 'feature', label: 'Features' },
    { id: 'interview', label: 'Interviews' },
  ]

  const handleTabChange = (tabId: string) => {
    if (tabId === activeTab) return
    setFading(true)
    setTimeout(() => {
      setActiveTab(tabId)
      setGridKey(k => k + 1)
      setFading(false)
    }, 180)
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="max-w-6xl mx-auto px-6">
        {mainArticle && (
          <section className="py-12 border-b border-gray-200 anim-fade-in-up">
            <Link href={`/article/${mainArticle.slug.current}`}>
              <article className="cursor-pointer group">
                {mainArticle.image && (
                  <div className="mb-6 overflow-hidden rounded-lg anim-fade-in anim-delay-1">
                    <img
                      src={urlFor(mainArticle.image).width(800).height(500).url()}
                      alt={mainArticle.title}
                      className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <p className="text-xs tracking-widest uppercase text-gray-500 mb-3">
                  {mainArticle.type === 'review' ? 'Review' : mainArticle.type === 'interview' ? 'Interview' : mainArticle.type === 'feature' ? 'Feature' : mainArticle.type}
                  <span className="mx-2">•</span>
                  {new Date(mainArticle.publishedAt).toLocaleDateString('ja-JP')}
                </p>
                <h2 className="font-serif text-4xl mb-4 leading-tight group-hover:text-orange-700 transition-colors duration-300">
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

        <div className="py-8 border-b border-gray-200 anim-fade-in anim-delay-2">
          <div className="flex gap-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`text-sm tracking-widest uppercase transition-all duration-200 ${
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

        <section className="py-12">
          <div
            ref={gridRef}
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-[180ms] ${
              fading ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {filteredArticles.map((article, index) => (
              <div
                key={`${gridKey}-${article._id}`}
                className="anim-fade-in-up"
                style={{ animationDelay: `${Math.min(index * 70, 350)}ms` }}
              >
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/article/${article.slug.current}`}>
      <article className="cursor-pointer group transition-transform duration-300 hover:-translate-y-1">
        {article.image && (
          <div className="mb-3 overflow-hidden rounded-lg">
            <img
              src={urlFor(article.image).width(400).height(250).url()}
              alt={article.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        <p className="text-xs tracking-widest uppercase text-gray-500 mb-2">
          {article.type === 'review' ? 'Review' : article.type === 'interview' ? 'Interview' : article.type === 'feature' ? 'Feature' : article.type}
        </p>
        <h3 className="font-serif text-xl mb-2 leading-tight group-hover:text-orange-700 transition-colors duration-300">
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
