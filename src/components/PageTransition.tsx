'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

/**
 * ページ遷移時にアナログ信号風（スキャンライン＋横揺れ＋ロールバンド）の
 * オーバーレイを一瞬走らせる。pathname の変化を遷移の合図に使う。
 */
export default function PageTransition() {
  const pathname = usePathname()
  const [playing, setPlaying] = useState(false)
  const isFirst = useRef(true)

  useEffect(() => {
    // 初回ロードでは再生しない
    if (isFirst.current) {
      isFirst.current = false
      return
    }
    setPlaying(false)
    // 直前の再生をリセットしてからアニメーションを再起動
    const raf = requestAnimationFrame(() => setPlaying(true))
    const done = setTimeout(() => setPlaying(false), 700)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(done)
    }
  }, [pathname])

  return (
    <div
      className={`page-transition${playing ? ' is-playing' : ''}`}
      aria-hidden="true"
    >
      <div className="pt-scan" />
      <div className="pt-roll" />
    </div>
  )
}
