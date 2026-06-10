import { Image } from 'expo-image'
import { useLocalSearchParams } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { Colors, serifFont } from '@/constants/theme'
import { ARTICLE_BY_SLUG_QUERY } from '@/lib/queries'
import { sanityFetch, urlFor } from '@/lib/sanity'
import { Article, formatDate, typeLabel } from '@/lib/types'

export default function ArticleScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    sanityFetch<Article | null>(ARTICLE_BY_SLUG_QUERY, { slug })
      .then(setArticle)
      .catch((e) => console.error('Failed to fetch article:', e))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.accent} />
      </View>
    )
  }

  if (!article) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>記事が見つかりません</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.meta}>
        {typeLabel(article.type).toUpperCase()} ・ {formatDate(article.publishedAt)}
      </Text>

      <Text style={styles.title}>{article.title}</Text>

      {article.artist && <Text style={styles.artist}>{article.artist}</Text>}

      {article.score && (
        <View style={styles.scoreRow}>
          <Text style={styles.score}>{article.score.overall}</Text>
          <Text style={styles.scoreLabel}>OVERALL SCORE</Text>
        </View>
      )}

      {article.image && (
        <Image
          source={urlFor(article.image).width(800).height(500).url()}
          style={styles.image}
          contentFit="cover"
        />
      )}

      {article.body && article.body.length > 0 ? (
        article.body.map((block: any, idx: number) => {
          if (block._type === 'block') {
            return (
              <Text key={idx} style={styles.paragraph}>
                {block.children?.map((child: any) => child.text).join('')}
              </Text>
            )
          }
          if (block._type === 'image' && block.asset) {
            return (
              <View key={idx} style={styles.embedBlock}>
                <Image
                  source={urlFor(block).width(1000).url()}
                  style={styles.bodyImage}
                  contentFit="cover"
                />
                {block.caption && (
                  <Text style={styles.caption}>{block.caption}</Text>
                )}
              </View>
            )
          }
          if (block._type === 'embed' && block.url) {
            return (
              <Pressable
                key={idx}
                style={styles.embedBlock}
                onPress={() => WebBrowser.openBrowserAsync(block.url)}
              >
                <View style={styles.embedButton}>
                  <Text style={styles.embedButtonText}>
                    ▶ {block.caption || '動画・音源を開く'}
                  </Text>
                </View>
              </Pressable>
            )
          }
          return null
        })
      ) : (
        <Text style={styles.notFound}>[記事本文がまだありません]</Text>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    paddingBottom: 64,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bg,
  },
  notFound: {
    color: Colors.muted,
  },
  meta: {
    fontSize: 11,
    letterSpacing: 2,
    color: Colors.muted,
    marginBottom: 16,
  },
  title: {
    fontFamily: serifFont,
    fontSize: 32,
    lineHeight: 44,
    color: Colors.text,
    marginBottom: 12,
  },
  artist: {
    fontSize: 18,
    color: Colors.muted,
    marginBottom: 16,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
    marginBottom: 24,
  },
  score: {
    fontFamily: serifFont,
    fontSize: 48,
    color: Colors.accent,
  },
  scoreLabel: {
    fontSize: 10,
    letterSpacing: 2,
    color: Colors.muted,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    marginBottom: 24,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 30,
    color: '#222222',
    marginBottom: 20,
  },
  embedBlock: {
    marginBottom: 24,
  },
  bodyImage: {
    width: '100%',
    height: 220,
    borderRadius: 8,
  },
  caption: {
    marginTop: 8,
    fontSize: 13,
    color: Colors.muted,
    textAlign: 'center',
  },
  embedButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  embedButtonText: {
    fontSize: 15,
    color: Colors.accent,
    fontWeight: '600',
  },
})
