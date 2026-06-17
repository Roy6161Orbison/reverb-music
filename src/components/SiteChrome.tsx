'use client'

import { usePathname } from 'next/navigation'
import PageTransition from '@/components/PageTransition'

/**
 * サイト共通の背景装飾（ドリフトするグラデーション＋フィルムグレイン）と
 * ページ遷移オーバーレイ。これらは Sanity Studio では不要なうえ、
 * 常時アニメーション／重い SVG ノイズフィルタが Studio の動作を重くするため、
 * /studio 配下では一切レンダリングしない。
 */
export default function SiteChrome() {
  const pathname = usePathname()
  if (pathname?.startsWith('/studio')) {
    return null
  }
  return (
    <>
      <div className="bg-gradient-motion" aria-hidden="true" />
      <div className="bg-grain" aria-hidden="true" />
      <PageTransition />
    </>
  )
}
