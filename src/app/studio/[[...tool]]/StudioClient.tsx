'use client'
import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity/sanity.config'

export default function StudioClient() {
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
        /* Studio ページでグレイン入りベージュ背景を非表示にする */
        .bg-gradient-motion,
        .bg-grain {
          display: none !important;
        }
        body {
          background: #fff !important;
        }
      `}</style>
      <NextStudio config={config} />
    </>
  )
}
