import type { Metadata } from 'next'
import { cache } from 'react'
import { sanityClient, urlFor } from '@/lib/sanity'
import { ABOUT_QUERY } from '@/lib/queries'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Reveal from '@/components/Reveal'
import { SITE_URL } from '@/lib/site'

export const revalidate = 60

type About = {
  _id: string
  title: string
  subtitle?: string
  image?: { asset: { _ref: string }; alt?: string }
  body?: any[]
}

const getAbout = cache(async (): Promise<About | null> => {
  try {
    return await sanityClient.fetch(ABOUT_QUERY)
  } catch (error) {
    console.error('Failed to fetch about page:', error)
    return null
  }
})

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAbout()
  const title = about?.title || 'About Us'

  const ogImage = about?.image
    ? urlFor(about.image).width(1200).height(630).fit('crop').url()
    : undefined

  return {
    title,
    description: about?.subtitle,
    alternates: { canonical: '/about' },
    openGraph: {
      type: 'website',
      title,
      description: about?.subtitle,
      url: `${SITE_URL}/about`,
      images: ogImage
        ? [{ url: ogImage, width: 1200, height: 630, alt: title }]
        : undefined,
    },
  }
}

export default async function AboutPage() {
  const about = await getAbout()

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-7 sm:py-10 md:py-12">
        {!about ? (
          <p className="text-gray-600 py-12 text-center">
            About Us ページがまだ設定されていません。Sanity Studio で「About Us」を作成してください。
          </p>
        ) : (
          <>
            <Reveal as="h1" className="text-reveal font-serif text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 leading-tight" delay={80}>
              <span>{about.title}</span>
            </Reveal>

            {about.subtitle && (
              <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8 anim-fade-in-up anim-delay-2">{about.subtitle}</p>
            )}

            {about.image && (
              <Reveal className="img-reveal mb-7 sm:mb-10 overflow-hidden rounded-lg" delay={120}>
                <img
                  src={urlFor(about.image).width(1000).height(620).url()}
                  alt={about.image.alt || about.title}
                  className="w-full h-56 sm:h-72 md:h-96 object-cover rounded-lg"
                />
              </Reveal>
            )}

            <div className="article-body prose prose-lg max-w-none text-gray-900">
              {about.body && about.body.length > 0 ? (
                about.body.map((block: any, idx: number) => {
                  if (block._type === 'block') {
                    return (
                      <Reveal key={idx} as="p" className="reveal text-[0.95rem] sm:text-base leading-7 sm:leading-8 text-gray-800 mb-5 sm:mb-6">
                        {block.children?.map((child: any) => child.text).join('')}
                      </Reveal>
                    )
                  }
                  if (block._type === 'image' && block.asset) {
                    return (
                      <Reveal key={idx} as="figure" className="reveal my-6 sm:my-8">
                        <img
                          src={urlFor(block).width(1000).url()}
                          alt={block.alt || ''}
                          className="w-full rounded-lg"
                        />
                        {block.caption && (
                          <figcaption className="mt-2 text-center text-xs sm:text-sm text-gray-500">
                            {block.caption}
                          </figcaption>
                        )}
                      </Reveal>
                    )
                  }
                  return null
                })
              ) : (
                <p className="text-gray-600">[本文がまだありません]</p>
              )}
            </div>
          </>
        )}
      </article>

      <Footer />
    </main>
  )
}
