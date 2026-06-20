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
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: string; width: string; bottom: string }>({
    left: '0',
    width: '0',
    bottom: '0',
  })
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const containerRef = useRef<HTMLDivElement>(null)

  const updateIndicator = useCallback(() => {
    const activeTabElement = tabRefs.current[activeTab]
    const container = containerRef.current
    if (activeTabElement && container) {
      const containerRect = container.getBoundingClientRect()
      const tabRect = activeTabElement.getBoundingClientRect()
      
      // コンテナ内での相対位置を計算
      const relativeLeft = tabRect.left - containerRect.left
      
      // ボタンの下からのオフセット（ボタン要素の下部からアンダーラインまでの距離）
      const bottomOffset = containerRect.bottom - tabRect.bottom
      
      setIndicatorStyle({
        left: `${relativeLeft}px`,
        width: `${tabRect.width}px`,
        bottom: `${bottomOffset}px`,
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
          className={`font-label text-[0.65rem] sm:text-[0.7rem] tracking-widest uppercase transition-colors duration-200 relative z-10 ${
            activeTab === tab.id ? 'text-black font-bold' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
        </button>
      ))}

      {/* Animated Underline Indicator - スライドするアンダーライン */}
      <div
        className="absolute h-0.5 bg-orange-700 transition-all duration-300 ease-out"
        style={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
          bottom: indicatorStyle.bottom,
        }}
      />
    </div>
  )
}
