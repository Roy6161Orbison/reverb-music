'use client'

import { useEffect, useRef } from 'react'

type ParallaxImageProps = {
  src: string
  alt: string
  /** Wrapper classes (set the visible frame height here, e.g. h-96). */
  className?: string
  /** Max parallax travel in px. */
  strength?: number
}

export default function ParallaxImage({
  src,
  alt,
  className = '',
  strength = 40,
}: ParallaxImageProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = wrapRef.current
        const img = imgRef.current
        if (!el || !img) return
        const rect = el.getBoundingClientRect()
        const vh = window.innerHeight
        const center = rect.top + rect.height / 2
        const progress = (center - vh / 2) / (vh / 2 + rect.height / 2)
        const offset = progress * strength
        // setState を使わず DOM を直接書き換えることで再レンダリングを回避
        img.style.transform = `translate3d(0, ${offset}px, 0) scale(1.12)`
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [strength])

  return (
    <div ref={wrapRef} className={`overflow-hidden ${className}`}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="w-full h-full object-cover will-change-transform"
        style={{ transform: 'translate3d(0, 0, 0) scale(1.12)' }}
      />
    </div>
  )
}
