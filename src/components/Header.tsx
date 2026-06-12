'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 border-b border-gray-200 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-sm shadow-sm' : 'bg-white'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/">
          <h1 className="font-serif text-2xl tracking-tight" style={{ fontWeight: 500 }}>{`Somethin' Else`}</h1>
        </Link>
        <nav className="hidden md:flex gap-6 font-label text-[0.65rem] uppercase">
          <Link href="/" className="nav-link hover:text-orange-700 transition-colors">Home</Link>
          <Link href="#" className="nav-link hover:text-orange-700 transition-colors">About</Link>
          <Link href="#" className="nav-link hover:text-orange-700 transition-colors">Archive</Link>
        </nav>
      </div>
    </header>
  )
}
