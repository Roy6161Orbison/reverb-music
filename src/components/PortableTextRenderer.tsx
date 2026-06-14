'use client'

import Image from 'next/image'
import { PortableText, type PortableTextReactComponents } from '@portabletext/react'
import { urlFor } from '@/lib/sanity'
import Reveal from '@/components/Reveal'

// 埋め込みURLを iframe 用の埋め込みURLに変換（YouTube / Spotify / Apple Music 対応）
function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`
    }
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const id = u.searchParams.get('v')
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
    if (host === 'open.spotify.com') {
      return `https://open.spotify.com/embed${u.pathname}`
    }
    if (host === 'music.apple.com') {
      return `https://embed.music.apple.com${u.pathname}${u.search}`
    }
    return null
  } catch {
    return null
  }
}

const components = {
  types: {
    image: ({value}: any) => {
      if (!value?.asset) return null
      return (
        <Reveal as="figure" className="reveal my-6 sm:my-8">
          <Image
            src={urlFor(value).width(1600).quality(90).auto('format').url()}
            alt={value.alt || ''}
            width={1600}
            height={1000}
            loading="lazy"
            className="w-full rounded-lg"
          />
          {value.caption && (
            <figcaption className="mt-2 text-center text-xs sm:text-sm text-gray-500">
              {value.caption}
            </figcaption>
          )}
        </Reveal>
      )
    },
    embed: ({value}: any) => {
      if (!value?.url) return null
      const embed = toEmbedUrl(value.url)
      return (
        <Reveal as="figure" className="reveal my-6 sm:my-8">
          {embed ? (
            <div className="overflow-hidden rounded-lg" style={{ aspectRatio: '16 / 9' }}>
              <iframe
                src={embed}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <a href={value.url} target="_blank" rel="noopener noreferrer" className="text-orange-700 underline">
              {value.url}
            </a>
          )}
          {value.caption && (
            <figcaption className="mt-2 text-center text-xs sm:text-sm text-gray-500">
              {value.caption}
            </figcaption>
          )}
        </Reveal>
      )
    },
  },
  marks: {
    link: ({value, children}: any) => {
      const target = value?.blank ? '_blank' : undefined
      const rel = value?.blank ? 'noopener noreferrer' : undefined
      return (
        <a href={value?.href} target={target} rel={rel} className="text-orange-700 underline hover:text-orange-800 transition-colors">
          {children}
        </a>
      )
    },
    underline: ({children}: any) => (
      <u className="underline">{children}</u>
    ),
    code: ({children}: any) => (
      <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-sm text-gray-800">
        {children}
      </code>
    ),
  },
  block: {
    normal: ({children}: any) => (
      <Reveal as="p" className="reveal text-[0.95rem] sm:text-base leading-7 sm:leading-8 text-gray-800 mb-5 sm:mb-6">
        {children}
      </Reveal>
    ),
    h1: ({children}: any) => (
      <Reveal as="h1" className="reveal font-serif text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 mt-8 sm:mt-10 leading-tight">
        {children}
      </Reveal>
    ),
    h2: ({children}: any) => (
      <Reveal as="h2" className="reveal font-serif text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-5 mt-6 sm:mt-8 leading-tight">
        {children}
      </Reveal>
    ),
    h3: ({children}: any) => (
      <Reveal as="h3" className="reveal font-serif text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-4 mt-5 sm:mt-6 leading-tight">
        {children}
      </Reveal>
    ),
    blockquote: ({children}: any) => (
      <Reveal as="blockquote" className="reveal border-l-4 border-orange-700 pl-4 sm:pl-6 italic text-gray-700 my-5 sm:my-6">
        {children}
      </Reveal>
    ),
  },
  list: {
    bullet: ({children}: any) => (
      <Reveal as="ul" className="reveal list-disc list-inside mb-5 sm:mb-6 space-y-2">
        {children}
      </Reveal>
    ),
    number: ({children}: any) => (
      <Reveal as="ol" className="reveal list-decimal list-inside mb-5 sm:mb-6 space-y-2">
        {children}
      </Reveal>
    ),
  },
  listItem: {
    bullet: ({children}: any) => <li className="text-[0.95rem] sm:text-base text-gray-800">{children}</li>,
    number: ({children}: any) => <li className="text-[0.95rem] sm:text-base text-gray-800">{children}</li>,
  },
}

export default function PortableTextRenderer({value}: {value: any}) {
  return (
    <PortableText value={value} components={components} />
  )
}
