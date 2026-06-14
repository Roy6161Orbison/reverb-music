'use client'

import { useEffect, useRef } from 'react'

export default function ScoreCounter({ value }: { value: number }) {
  const spanRef = useRef<HTMLSpanElement>(null)
  const rafRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const span = spanRef.current
    if (!span) return

    const duration = 1100
    const start = performance.now()
    const isInt = Number.isInteger(value)

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      // easeOutExpo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      const current = Math.round(eased * value * 10) / 10
      // setState を使わず DOM を直接書き換えることで再レンダリングを回避
      span.textContent = isInt ? String(Math.round(current)) : current.toFixed(1)
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [value])

  const isInt = Number.isInteger(value)
  return <span ref={spanRef}>{isInt ? '0' : '0.0'}</span>
}
