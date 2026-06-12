import { ImageResponse } from 'next/og'
import { SITE_NAME } from '@/lib/site'

// サイト全体のデフォルトOG画像（記事ページはカバー画像が優先される）
export const alt = SITE_NAME
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 72,
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
          }}
        >
          {`SOMETHIN' ELSE`}
        </div>
        <div
          style={{
            display: 'flex',
            width: 120,
            height: 4,
            backgroundColor: '#c2410c',
            marginTop: 36,
            marginBottom: 36,
          }}
        />
        <div
          style={{
            display: 'flex',
            fontSize: 26,
            color: '#9ca3af',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
          }}
        >
          Music · Films · Culture
        </div>
      </div>
    ),
    {
      ...size,
    },
  )
}
