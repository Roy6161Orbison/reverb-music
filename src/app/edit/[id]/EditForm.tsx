'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function EditForm({ id }: { id: string }) {
  const [article, setArticle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch(`/api/articles/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setArticle(data)
        setLoading(false)
      })
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: article.title,
          excerpt: article.excerpt,
        }),
      })

      const result = await res.json()
      if (result.success) {
        setMessage('保存しました！')
      } else {
        setMessage('エラー: ' + result.error)
      }
    } catch (err: any) {
      setMessage('エラーが発生しました')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-white">読み込み中...</div>

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-8 bg-black/80 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-8">記事を編集</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-400">タイトル</label>
          <input
            type="text"
            value={article.title || ''}
            onChange={(e) => setArticle({ ...article, title: e.target.value })}
            className="w-full bg-white/10 border border-white/20 rounded px-4 py-2 focus:outline-none focus:border-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-400">抜粋 (Excerpt)</label>
          <textarea
            value={article.excerpt || ''}
            onChange={(e) => setArticle({ ...article, excerpt: e.target.value })}
            rows={4}
            className="w-full bg-white/10 border border-white/20 rounded px-4 py-2 focus:outline-none focus:border-white"
          />
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-white text-black px-6 py-2 rounded font-bold disabled:opacity-50 hover:bg-gray-200 transition-colors"
          >
            {saving ? '保存中...' : '保存する'}
          </button>
          
          <button
            type="button"
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white transition-colors"
          >
            キャンセル
          </button>
        </div>

        {message && (
          <div className={`p-4 rounded ${message.includes('エラー') ? 'bg-red-900/50' : 'bg-green-900/50'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  )
}
