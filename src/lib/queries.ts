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