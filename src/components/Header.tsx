'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export default function Header({ animateTitle = false }: { animateTitle?: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // sfTitleアニメーション完了後にwill-changeを解除してGPUレイヤーを解放
  useEffect(() => {
    if (!animateTitle) return
    const el = titleRef.current
    if (!el) return
    const onEnd = () => el.setAttribute('data-anim-done', '')
    el.addEventListener('animationend', onEnd, { once: true })
    return () => el.removeEventListener('animationend', onEnd)
  }, [animateTitle])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 md:py-5 flex items-center justify-between">
        <Link href="/">
          <h1 ref={titleRef} className={`text-sm sm:text-base md:text-lg uppercase tracking-widest${animateTitle ? ' sf-title' : ''}`} style={{ fontFamily: "'Orbitron', sans-serif" }}>{`Somethin' Else`}</h1>
        </Link>
        <nav className="flex gap-5 font-label text-[0.6rem] sm:text-[0.65rem] uppercase">
          <Link href="/about" className="nav-link hover:text-orange-700 transition-colors">About Us</Link>
        </nav>
      </div>
    </header>
  )
}
