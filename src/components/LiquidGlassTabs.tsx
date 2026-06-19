'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'

interface Tab {
  id: string
  label: string
}

interface LiquidGlassTabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export default function LiquidGlassTabs({
  tabs,
  activeTab,
  onTabChange,
}: LiquidGlassTabsProps) {
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: string; width: string }>({
    left: '0',
    width: '0',
  })
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const updateIndicator = useCallback(() => {
    const activeTabElement = tabRefs.current[activeTab]
    if (activeTabElement) {
      const { offsetLeft, offsetWidth } = activeTabElement
      setIndicatorStyle({
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`,
      })
    }
  }, [activeTab])

  useEffect(() => {
    updateIndicator()
  }, [updateIndicator])

  useEffect(() => {
    window.addEventListener('resize', updateIndicator)
    return () => window.removeEventListener('resize', updateIndicator)
  }, [updateIndicator])

  return (
    <>
      {/* SVG Gooey Filter */}
      <svg
        className="absolute w-0 h-0"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
      >
        <defs>
          <filter id="gooey-reverb">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* Tab Container with Gooey Filter */}
      <div
        className="relative flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2.5 sm:gap-y-3 pb-2"
        style={{ filter: 'url(#gooey-reverb)' }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            ref={(el) => {
              if (el) tabRefs.current[tab.id] = el
            }}
            onClick={() => onTabChange(tab.id)}
            className={`font-label text-[0.65rem] sm:text-[0.7rem] tracking-widest uppercase transition-colors duration-200 relative z-10 ${
              activeTab === tab.id ? 'text-black font-bold' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}

        {/* Animated Gooey Indicator */}
        <div
          className="absolute bottom-0 h-0.5 bg-orange-700 transition-all duration-300 ease-out"
          style={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
            filter: 'drop-shadow(0 0 3px rgba(200, 80, 31, 0.4))',
          }}
        />
      </div>
    </>
  )
}
