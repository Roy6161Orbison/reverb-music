import { Image } from 'expo-image'
import { Link } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Colors, serifFont } from '@/constants/theme'
import { ARTICLES_QUERY } from '@/lib/queries'
import { sanityFetch, urlFor } from '@/lib/sanity'
import { Article, formatDate, typeLabel } from '@/lib/types'

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'review', label: 'Reviews' },
  { id: 'feature', label: 'Features' },
  { id: 'interview', label: 'Interviews' },
]

export default function HomeScreen() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('all')

  const load = useCallback(async () => {
    try {
      setError(null)
      setArticles(await sanityFetch<Article[]>(ARTICLES_QUERY))
    } catch (e) {
      console.error('Failed to fetch articles:', e)
      setError('記事の取得に失敗しました')
    }
  }, [])

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [load])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await load()
    setRefreshing(false)
  }, [load])

  const mainArticle = articles.find((a) => a.featured) || articles[0]

  // メイン記事以外の記事でフィルタリング
  const filteredArticles =
    activeTab === 'all'
      ? articles.filter((a) => a._id !== mainArticle?._id)
      : articles.filter((a) => a.type === activeTab && a._id !== mainArticle?._id)

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.masthead}>
        <Text style={styles.mastheadTitle}>Somethin' Else</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.accent} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredArticles}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListHeaderComponent={
            <>
              {mainArticle && <FeaturedArticle article={mainArticle} />}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.tabRow}
                contentContainerStyle={styles.tabRowContent}
              >
                {tabs.map((tab) => (
                  <Pressable key={tab.id} onPress={() => setActiveTab(tab.id)}>
                    <Text
                      style={[
                        styles.tabLabel,
                        activeTab === tab.id && styles.tabLabelActive,
                      ]}
                    >
                      {tab.label.toUpperCase()}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </>
          }
          renderItem={({ item }) => <ArticleCard article={item} />}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  )
}

function FeaturedArticle({ article }: { article: Article }) {
  return (
    <Link href={`/article/${article.slug.current}`} asChild>
      <Pressable style={styles.featured}>
        {article.image && (
          <Image
            source={urlFor(article.image).width(800).height(500).url()}
            style={styles.featuredImage}
            contentFit="cover"
          />
        )}
        <Text style={styles.meta}>
          {typeLabel(article.type).toUpperCase()} ・ {formatDate(article.publishedAt)}
        </Text>
        <Text style={styles.featuredTitle}>{article.title}</Text>
        {article.artist && <Text style={styles.artist}>{article.artist}</Text>}
        <Text style={styles.excerpt}>{article.excerpt}</Text>
        {article.score && (
          <Text style={styles.featuredScore}>{article.score.overall}</Text>
        )}
      </Pressable>
    </Link>
  )
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/article/${article.slug.current}`} asChild>
      <Pressable style={styles.card}>
        {article.image && (
          <Image
            source={urlFor(article.image).width(400).height(250).url()}
            style={styles.cardImage}
            contentFit="cover"
          />
        )}
        <Text style={styles.meta}>{typeLabel(article.type).toUpperCase()}</Text>
        <Text style={styles.cardTitle}>{article.title}</Text>
        {article.artist && <Text style={styles.cardArtist}>{article.artist}</Text>}
        <Text style={styles.cardExcerpt} numberOfLines={3}>
          {article.excerpt}
        </Text>
        {article.score && (
          <Text style={styles.cardScore}>{article.score.overall}</Text>
        )}
      </Pressable>
    </Link>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  masthead: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  mastheadTitle: {
    fontFamily: serifFont,
    fontSize: 24,
    color: Colors.text,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: Colors.muted,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  featured: {
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  featuredImage: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    marginBottom: 16,
  },
  meta: {
    fontSize: 11,
    letterSpacing: 2,
    color: Colors.muted,
    marginBottom: 8,
  },
  featuredTitle: {
    fontFamily: serifFont,
    fontSize: 28,
    lineHeight: 38,
    color: Colors.text,
    marginBottom: 8,
  },
  artist: {
    fontSize: 16,
    color: Colors.muted,
    marginBottom: 8,
  },
  excerpt: {
    fontSize: 15,
    lineHeight: 24,
    color: '#333333',
  },
  featuredScore: {
    fontFamily: serifFont,
    fontSize: 24,
    color: Colors.accent,
    marginTop: 12,
  },
  tabRow: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabRowContent: {
    gap: 24,
    paddingVertical: 16,
  },
  tabLabel: {
    fontSize: 12,
    letterSpacing: 2,
    color: Colors.muted,
    paddingBottom: 4,
  },
  tabLabelActive: {
    color: Colors.text,
    fontWeight: '600',
    borderBottomWidth: 2,
    borderBottomColor: Colors.accent,
  },
  card: {
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  cardImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
  },
  cardTitle: {
    fontFamily: serifFont,
    fontSize: 20,
    lineHeight: 28,
    color: Colors.text,
    marginBottom: 4,
  },
  cardArtist: {
    fontSize: 14,
    color: Colors.muted,
    marginBottom: 4,
  },
  cardExcerpt: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333333',
  },
  cardScore: {
    fontFamily: serifFont,
    fontSize: 18,
    color: Colors.accent,
    marginTop: 8,
  },
})
