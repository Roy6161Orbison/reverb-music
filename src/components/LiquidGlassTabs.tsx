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

        {/* Animated Liquid Glass Indicator */}
        <div
          className="absolute bottom-0 h-1 transition-all duration-300 ease-out"
          style={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
            background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0.2) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '4px',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1), inset 0 1px 2px rgba(255, 255, 255, 0.5)',
          }}
        />
      </div>
    </>
  )
}
