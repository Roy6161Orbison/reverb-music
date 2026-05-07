import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Reverb / 残響',
  description: '音楽を文化として読む、少し意地悪で優しいガイド',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  )
}
