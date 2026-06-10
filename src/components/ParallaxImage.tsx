'use client'

import { useEffect, useRef, useState } from 'react'

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
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = ref.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const vh = window.innerHeight
        const center = rect.top + rect.height / 2
        // -1 (element below viewport) → 1 (above viewport)
        const progress = (center - vh / 2) / (vh / 2 + rect.height / 2)
        setOffset(progress * strength)
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [strength])

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover will-change-transform"
        style={{ transform: `translate3d(0, ${offset}px, 0) scale(1.12)` }}
      />
    </div>
  )
}
