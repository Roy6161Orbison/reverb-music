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
  const containerRef = useRef<HTMLDivElement>(null)

  const updateIndicator = useCallback(() => {
    const activeTabElement = tabRefs.current[activeTab]
    const container = containerRef.current
    if (activeTabElement && container) {
      const { offsetLeft, offsetWidth } = activeTabElement
      const containerRect = container.getBoundingClientRect()
      const tabRect = activeTabElement.getBoundingClientRect()
      
      // コンテナ内での相対位置を計算
      const relativeLeft = tabRect.left - containerRect.left
      
      setIndicatorStyle({
        left: `${relativeLeft}px`,
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
    <div 
      ref={containerRef}
      className="relative flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2.5 sm:gap-y-3 pb-2"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          ref={(el) => {
            if (el) tabRefs.current[tab.id] = el
          }}
          onClick={() => onTabChange(tab.id)}
          className={`font-label text-[0.65rem] sm:text-[0.7rem] tracking-widest uppercase transition-colors duration-200 relative z-10 pb-1 ${
            activeTab === tab.id ? 'text-black font-bold' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
          {/* 各タブの下に個別のアンダーライン */}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-700 transition-all duration-300 ease-out" />
          )}
        </button>
      ))}
    </div>
  )
}
