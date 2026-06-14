/**
 * Studio-specific layout that bypasses the main site's heavy animations and styling.
 * This layout is applied only to routes under /studio to ensure optimal performance
 * for the Sanity Studio editor.
 */

import type { Metadata } from 'next'
import './studio.css'

export const metadata: Metadata = {
  title: 'Sanity Studio',
  robots: {
    index: false,
    follow: false,
  },
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  )
}
