export const ARTICLES_QUERY = `
  *[_type == "article" && published == true] | order(publishedAt desc) [0..9] {
    _id,
    slug,
    title,
    type,
    reviewCategory,
    score,
    coverImage,
    excerpt,
    publishedAt,
    author-> {
      name
    },
    mainArtist-> {
      name,
      slug
    }
  }
`

export const ARTICLE_BY_SLUG_QUERY = `
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    type,
    reviewCategory,
    score,
    body,
    coverImage,
    publishedAt,
    author-> {
      name,
      slug,
      bio
    },
    mainArtist-> {
      _id,
      name,
      slug
    },
    mainAlbum-> {
      _id,
      title,
      slug,
      releaseDate
    },
    tags[]-> {
      _id,
      name,
      slug
    },
    relatedArticles[]-> {
      _id,
      title,
      slug
    }
  }
`

export const ARTIST_BY_SLUG_QUERY = `
  *[_type == "artist" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    bio,
    country,
    formedYear,
    profileImage
  }
`

export const ARTIST_ARTICLES_QUERY = `
  *[_type == "article" && mainArtist._ref == $artistId && published == true] | order(publishedAt desc) {
    _id,
    title,
    slug,
    type,
    score,
    publishedAt
  }
`
