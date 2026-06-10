'use client'

import { useEffect, useRef, useState } from 'react'

export default function ScoreCounter({ value }: { value: number }) {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef<number>()

  useEffect(() => {
    const duration = 1100
    const start = performance.now()

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      // easeOutExpo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      setDisplay(Math.round(eased * value * 10) / 10)
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [value])

  return <>{Number.isInteger(value) ? Math.round(display) : display.toFixed(1)}</>
}
