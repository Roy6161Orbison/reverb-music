'use client'

import React, { useRef, useEffect, useCallback, useState } from 'react'

interface Tab {
  id: string
  label: string
}

interface LiquidGlassTabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

type IndicatorStyle = {
  left: number
  width: number
  height: number
  top: number
}

export default function LiquidGlassTabs({
  tabs,
  activeTab,
  onTabChange,
}: LiquidGlassTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [indicatorStyle, setIndicatorStyle] = useState<IndicatorStyle>({
    left: 0,
    width: 0,
    height: 0,
    top: 0,
  })
  const [ready, setReady] = useState(false)

  const updateIndicator = useCallback(() => {
    const container = containerRef.current
    const activeTabElement = tabRefs.current[activeTab]
    if (!container || !activeTabElement) return

    const containerRect = container.getBoundingClientRect()
    const tabRect = activeTabElement.getBoundingClientRect()

    setIndicatorStyle({
      left: tabRect.left - containerRect.left,
      width: tabRect.width,
      height: tabRect.height,
      top: tabRect.top - containerRect.top,
    })
    setReady(true)
  }, [activeTab])

  useEffect(() => {
    updateIndicator()
  }, [updateIndicator, tabs])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver(updateIndicator)
    observer.observe(container)
    window.addEventListener('resize', updateIndicator)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateIndicator)
    }
  }, [updateIndicator])

  return (
    <div className="liquid-glass-tabs-scroll">
      <div ref={containerRef} className="liquid-glass-tabs">
        <div
          className={`liquid-glass-indicator ${ready ? 'liquid-glass-indicator--ready' : ''}`}
          style={{
            transform: `translate3d(${indicatorStyle.left}px, ${indicatorStyle.top}px, 0)`,
            width: indicatorStyle.width,
            height: indicatorStyle.height,
          }}
          aria-hidden
        >
          <span className="liquid-glass-indicator__shine" />
        </div>

        {tabs.map((tab) => (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[tab.id] = el
            }}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`liquid-glass-tab ${
              activeTab === tab.id ? 'liquid-glass-tab--active' : ''
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
