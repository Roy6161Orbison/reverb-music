'use client'

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react'

type RevealProps = {
  children: ReactNode
  /** Element tag to render. Defaults to div. */
  as?: ElementType
  /** Visual variant class: 'reveal' (fade-up), 'img-reveal', or 'text-reveal'. */
  className?: string
  /** Stagger delay in ms. */
  delay?: number
  threshold?: number
  /** Reveal only once (default). If false, re-hides when out of view. */
  once?: boolean
  style?: CSSProperties
}

export default function Reveal({
  children,
  as,
  className = 'reveal',
  delay = 0,
  threshold = 0.15,
  once = true,
  style,
}: RevealProps) {
  const Tag = (as || 'div') as ElementType
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') {
      const id = requestAnimationFrame(() => setVisible(true))
      return () => cancelAnimationFrame(id)
    }

    // Above-the-fold elements: reveal immediately on mount so content is
    // never stuck hidden if the observer misses the initial intersection.
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0 && once) {
      const id = requestAnimationFrame(() => setVisible(true))
      return () => cancelAnimationFrame(id)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            setVisible(false)
          }
        })
      },
      { threshold, rootMargin: '0px 0px -10% 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, once])

  return (
    <Tag
      ref={ref}
      className={`${className}${visible ? ' is-visible' : ''}`}
      style={{ ...style, '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  )
}
