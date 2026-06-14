import { NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity.write'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // セキュリティ上の配慮: 実際の運用ではここで認証（NextAuthなど）をチェックすべきです
    // 今回は簡易的な実装として進めます

    const result = await writeClient
      .patch(id)
      .set({
        title: body.title,
        excerpt: body.excerpt,
        // 必要に応じて他のフィールドも追加
      })
      .commit()

    return NextResponse.json({ success: true, data: result })
  } catch (error: any) {
    console.error('Update error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const article = await writeClient.fetch(`*[_id == $id][0]`, { id })
    
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    return NextResponse.json(article)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
