import { createImageUrlBuilder } from '@sanity/image-url'

const projectId = process.env.EXPO_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.EXPO_PUBLIC_SANITY_DATASET!
const apiVersion = process.env.EXPO_PUBLIC_SANITY_API_VERSION!

export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  const search = new URLSearchParams({ query })
  for (const [key, value] of Object.entries(params)) {
    search.set(`$${key}`, JSON.stringify(value))
  }
  const url = `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}?${search}`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Sanity request failed: ${res.status}`)
  }
  const { result } = await res.json()
  return result as T
}

const builder = createImageUrlBuilder({ projectId, dataset })

export const urlFor = (source: any) => builder.image(source)
