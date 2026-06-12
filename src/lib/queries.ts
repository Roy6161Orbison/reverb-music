export const ARTICLES_QUERY = `
  *[_type == "article"] | order(publishedAt desc) {
    _id,
    slug,
    title,
    type,
    excerpt,
    publishedAt,
    artist,
    score,
    image,
    featured
  }
`

export const UPCOMING_EVENTS_QUERY = `
  *[_type == "event" && date >= $now] | order(date asc) [0...10] {
    _id,
    artist,
    venue,
    city,
    date,
    ticketUrl,
    image,
    featured
  }
`

export const ARTICLE_BY_SLUG_QUERY = `
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    type,
    excerpt,
    body,
    publishedAt,
    artist,
    score,
    image,
    featured
  }
`

export const ABOUT_QUERY = `
  *[_type == "aboutPage"][0] {
    _id,
    title,
    subtitle,
    image,
    body
  }
`