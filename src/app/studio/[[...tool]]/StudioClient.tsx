'use client'
import { NextStudio } from 'next-sanity/studio'
import { useEffect, useState } from 'react'
import config from '../../../../sanity/sanity.config'

export default function StudioClient() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Studio 本体 (#sanity) が描画されたらローディングを消す
    const check = () => {
      const root = document.getElementById('sanity')
      if (root && root.childElementCount > 0) {
        setLoading(false)
        return true
      }
      return false
    }

    if (check()) return

    const observer = new MutationObserver(() => {
      if (check()) observer.disconnect()
    })
    observer.observe(document.body, { childList: true, subtree: true })

    // フォールバック: 最大10秒で強制的に非表示
    const timeout = setTimeout(() => {
      setLoading(false)
      observer.disconnect()
    }, 10000)

    return () => {
      observer.disconnect()
      clearTimeout(timeout)
    }
  }, [])

  return (
    <>
      {/* Sanity Studio 内のアニメーション・トランジションを無効化 */}
      <style jsx global>{`
        #sanity *,
        #sanity *::before,
        #sanity *::after {
          animation: none !important;
          transition: none !important;
        }
        body {
          background: #fff !important;
        }
        @keyframes studio-spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      {loading && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            background: '#fff',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              border: '3px solid #e2e2e2',
              borderTopColor: '#101112',
              borderRadius: '50%',
              animation: 'studio-spin 0.8s linear infinite',
            }}
          />
          <span style={{ fontSize: '14px', color: '#6b7280' }}>
            エディタを読み込んでいます…
          </span>
        </div>
      )}

      <NextStudio config={config} />
    </>
  )
}
