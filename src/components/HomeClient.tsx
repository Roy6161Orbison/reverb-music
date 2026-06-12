'use client'

import Link from 'next/link'
import { useState, useRef, useEffect, useCallback } from 'react'
import { urlFor } from '@/lib/sanity'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Reveal from '@/components/Reveal'
import UpcomingEvents from '@/components/UpcomingEvents'

type Article = {
  _id: string
  slug: { current: string }
  title: string
  type: 'music' | 'film' | 'feature' | 'interview' | 'essay' | 'news' | 'review'
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

const typeLabel = (type: string) =>
  type === 'music' ? 'Music'
    : type === 'film' ? 'Film'
    : type === 'interview' ? 'Interview'
    : type === 'feature' ? 'Feature'
    : type === 'essay' ? 'Essay'
    : type

type Event = {
  _id: string
  artist: string
  venue: string
  city?: string
  date: string
  ticketUrl?: string
  image?: { asset: { _ref: string } }
  featured?: boolean
}

export default function HomeClient({ articles, events = [] }: { articles: Article[], events?: Event[] }) {
  const [activeTab, setActiveTab] = useState<string>('all')
  const [gridKey, setGridKey] = useState(0)
  const [fading, setFading] = useState(false)

  const hasEvents = events.length > 0
  const mainArticle = articles.find(a => a.featured) || articles[0]

  const gridTab = activeTab === 'events' ? 'all' : activeTab
  const filteredArticles = gridTab === 'all'
    ? articles.filter(a => a._id !== mainArticle._id)
    : articles.filter(a => a.type === gridTab && a._id !== mainArticle._id)

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'music', label: 'Music' },
    { id: 'film', label: 'Films' },
    { id: 'feature', label: 'Features' },
    { id: 'essay', label: 'Essays' },
    { id: 'interview', label: 'Interviews' },
  ]

  // --- Sliding tab indicator ---
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [indicator, setIndicator] = useState({ left: 0, top: 0, width: 0 })

  const updateIndicator = useCallback(() => {
    const btn = tabRefs.current[activeTab]
    if (!btn) return
    setIndicator({
      left: btn.offsetLeft,
      top: btn.offsetTop + btn.offsetHeight,
      width: btn.offsetWidth,
    })
  }, [activeTab])

  useEffect(() => {
    updateIndicator()
  }, [updateIndicator])

  useEffect(() => {
    window.addEventListener('resize', updateIndicator)
    return () => window.removeEventListener('resize', updateIndicator)
  }, [updateIndicator])

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

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {mainArticle && (
          <section className="py-7 sm:py-10 md:py-12 border-b border-gray-200">
            <div className={hasEvents ? 'grid lg:grid-cols-3 gap-8 lg:gap-10' : ''}>
              <Link
                href={`/article/${mainArticle.slug.current}`}
                className={hasEvents ? 'lg:col-span-2' : 'block'}
              >
                <article className="cursor-pointer group">
                  {mainArticle.image && (
                    <Reveal className="img-reveal mb-4 sm:mb-6 overflow-hidden rounded-lg">
                      <img
                        src={urlFor(mainArticle.image).width(1600).height(1000).quality(90).auto('format').url()}
                        alt={mainArticle.title}
                        className="w-full h-52 sm:h-72 md:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </Reveal>
                  )}
                  <Reveal className="reveal" delay={80}>
                    <p className="font-label text-[0.6rem] sm:text-[0.65rem] tracking-widest uppercase text-gray-500 mb-2 sm:mb-3">
                      {typeLabel(mainArticle.type)}
                      <span className="mx-2">•</span>
                      {new Date(mainArticle.publishedAt).toLocaleDateString('ja-JP')}
                    </p>
                  </Reveal>
                  <Reveal
                    as="h2"
                    className="text-reveal font-serif text-2xl sm:text-3xl lg:text-4xl mb-3 sm:mb-4 leading-tight group-hover:text-orange-700 transition-colors duration-300"
                    delay={140}
                  >
                    <span>{mainArticle.title}</span>
                  </Reveal>
                  <Reveal className="reveal" delay={220}>
                    {mainArticle.artist && (
                      <p className="text-base sm:text-lg text-gray-600 mb-2 sm:mb-3">{mainArticle.artist}</p>
                    )}
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-2xl line-clamp-3 sm:line-clamp-none">
                      {mainArticle.excerpt}
                    </p>
                    {mainArticle.score && (
                      <p className="font-serif text-xl sm:text-2xl text-orange-700 mt-3 sm:mt-4">
                        {mainArticle.score.overall}
                      </p>
                    )}
                  </Reveal>
                </article>
              </Link>

              {/* Web版: Featured記事の右にイベント */}
              {hasEvents && (
                <div className="hidden lg:block lg:col-span-1">
                  <UpcomingEvents events={events} variant="sidebar" />
                </div>
              )}
            </div>
          </section>
        )}

        {/* タブ行 */}
        <div className="py-5 sm:py-7 border-b border-gray-200">
          <div className="relative flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2.5 sm:gap-y-3 pb-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                ref={(el) => { tabRefs.current[tab.id] = el }}
                onClick={() => handleTabChange(tab.id)}
                className={`font-label text-[0.65rem] sm:text-[0.7rem] tracking-widest uppercase transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'text-black font-bold'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}

            {/* スマホ版: Interviewsの右に Upcoming Events */}
            {hasEvents && (
              <button
                ref={(el) => { tabRefs.current['events'] = el }}
                onClick={() => handleTabChange('events')}
                className={`lg:hidden font-label text-[0.65rem] sm:text-[0.7rem] tracking-widest uppercase transition-colors duration-200 ${
                  activeTab === 'events'
                    ? 'text-orange-700 font-bold'
                    : 'text-orange-700/70 hover:text-orange-700'
                }`}
              >
                Events
              </button>
            )}

            <span
              className="tab-indicator"
              style={{ left: indicator.left, top: indicator.top, width: indicator.width }}
            />
          </div>
        </div>

        <section className="py-7 sm:py-10 md:py-12">
          {/* スマホ版: Upcoming Events タブ選択時はイベント一覧を表示 */}
          {activeTab === 'events' && (
            <div className="lg:hidden">
              <UpcomingEvents events={events} variant="full" />
            </div>
          )}

          {/* 記事グリッド */}
          <div
            className={`${activeTab === 'events' ? 'hidden lg:block' : 'block'} transition-opacity duration-[180ms] ${
              fading ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7 lg:gap-8">
              {filteredArticles.map((article, index) => (
                <Reveal
                  key={`${gridKey}-${article._id}`}
                  className="reveal"
                  delay={Math.min(index * 55, 275)}
                >
                  <ArticleCard article={article} />
                </Reveal>
              ))}
            </div>
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
      <article className="cursor-pointer group">
        {article.image && (
          <div className="mb-3 overflow-hidden rounded-lg">
            <img
              src={urlFor(article.image).width(800).height(500).quality(85).auto('format').url()}
              alt={article.title}
              className="w-full h-44 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        )}
        <p className="font-label text-[0.6rem] tracking-widest uppercase text-gray-500 mb-1.5 sm:mb-2">
          {typeLabel(article.type)}
        </p>
        <h3 className="font-serif text-lg sm:text-xl mb-1.5 sm:mb-2 leading-snug group-hover:text-orange-700 transition-colors duration-300">
          {article.title}
        </h3>
        {article.artist && (
          <p className="text-xs sm:text-sm text-gray-600 mb-1.5 sm:mb-2">{article.artist}</p>
        )}
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed line-clamp-3">{article.excerpt}</p>
        {article.score && (
          <p className="font-serif text-base sm:text-lg text-orange-700 mt-2">{article.score.overall}</p>
        )}
      </article>
    </Link>
  )
}
