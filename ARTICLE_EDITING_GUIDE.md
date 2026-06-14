# Sanity Content Lake SDK を使った記事編集ガイド

## 概要

このガイドでは、Sanity Content Lake SDK（`@sanity/client`）を使用して、スマートフォンから記事を編集できる仕組みを実装しました。Studio の重い UI を介さず、軽量な編集フォームで素早く記事を更新できます。

## 実装内容

### 1. 書き込み権限を持つ Sanity クライアント

**ファイル**: `src/lib/sanity.write.ts`

```typescript
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../../sanity/env'

const token = process.env.SANITY_WRITE_TOKEN

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // 書き込み時は最新データを取得するためCDNをオフ
  token,
})
```

**重要**: `SANITY_WRITE_TOKEN` 環境変数を設定する必要があります。

### 2. API ルート（記事更新エンドポイント）

**ファイル**: `src/app/api/articles/[id]/route.ts`

#### GET リクエスト
特定の記事データを取得します。

```bash
curl https://reverb-music.vercel.app/api/articles/[記事ID]
```

#### PATCH リクエスト
記事を更新します。

```bash
curl -X PATCH https://reverb-music.vercel.app/api/articles/[記事ID] \
  -H "Content-Type: application/json" \
  -d '{
    "title": "新しいタイトル",
    "excerpt": "新しい抜粋"
  }'
```

**レスポンス例**:
```json
{
  "success": true,
  "data": {
    "_id": "記事ID",
    "_type": "article",
    "title": "新しいタイトル",
    "excerpt": "新しい抜粋",
    "_updatedAt": "2026-06-14T..."
  }
}
```

### 3. 軽量編集インターフェース

**ファイル**: `src/app/edit/[id]/EditForm.tsx`

スマートフォンから快適に編集できるシンプルなフォーム UI を提供します。

#### アクセス方法

開発環境では、記事一覧や記事詳細ページに「編集」リンクが表示されます：

- **ホームページ**: 記事カードに「Edit」リンク
- **記事詳細ページ**: 右上に「Edit Article」リンク

本番環境（`NODE_ENV === 'production'`）では表示されません。

#### URL パターン

```
/edit/[記事ID]
```

例：`https://reverb-music.vercel.app/edit/19ea6d41-5e01-404e-be6c-a431ce6459ef`

## セットアップ手順

### 1. Sanity API トークンの発行

1. [Sanity Manage](https://www.sanity.io/manage) にログイン
2. プロジェクト設定 → API → Tokens
3. 新しいトークンを作成
   - **名前**: `write-token` など
   - **権限**: `Editor` （読み書き両方）
4. トークンをコピー

### 2. Vercel 環境変数の設定

Vercel ダッシュボードで以下の環境変数を設定：

```
SANITY_WRITE_TOKEN=<コピーしたトークン>
```

**設定方法**:
1. Vercel プロジェクト → Settings → Environment Variables
2. `SANITY_WRITE_TOKEN` を追加
3. 本番環境（Production）に設定
4. デプロイを再実行

### 3. ローカル開発環境での設定

`.env.local` ファイルに追加：

```env
SANITY_WRITE_TOKEN=<コピーしたトークン>
```

## 使用例

### React コンポーネント内での使用

```typescript
import { writeClient } from '@/lib/sanity.write'

// 記事を更新
const updateArticle = async (id: string, updates: any) => {
  const result = await writeClient
    .patch(id)
    .set(updates)
    .commit()
  
  return result
}

// 使用例
await updateArticle('19ea6d41-5e01-404e-be6c-a431ce6459ef', {
  title: 'New Title',
  excerpt: 'New excerpt'
})
```

### API ルートでの使用

```typescript
// PATCH /api/articles/[id]
const result = await writeClient
  .patch(id)
  .set({
    title: body.title,
    excerpt: body.excerpt,
  })
  .commit()
```

## セキュリティに関する注意

### 現在の実装

現在の実装は**簡易的**です。以下の改善を推奨します：

#### 1. 認証の追加

NextAuth.js などを使用して、ログイン機能を追加してください：

```typescript
import { auth } from '@/auth'

export async function PATCH(request: Request, { params }: any) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // 以下、更新処理
}
```

#### 2. CORS の設定

Sanity 側で CORS を適切に設定してください：

1. Sanity Manage → API → CORS Origins
2. 許可するオリジンを追加：
   - 開発: `http://localhost:3000`
   - 本番: `https://reverb-music.vercel.app`

#### 3. トークンの権限制限

Sanity トークンは以下の権限に制限することを推奨：

- `documents.read` - ドキュメント読み取り
- `documents.write` - ドキュメント書き込み
- **ただし、特定のスキーマ（`article` など）のみに制限**

## トラブルシューティング

### 403 Forbidden エラー

**原因**: CORS 設定が正しくない、またはトークンの権限不足

**対処法**:
1. Sanity Manage で CORS Origins を確認
2. トークンの権限を確認
3. ブラウザのキャッシュをクリア

### 401 Unauthorized エラー

**原因**: `SANITY_WRITE_TOKEN` が設定されていない

**対処法**:
1. Vercel 環境変数を確認
2. `.env.local` を確認（ローカル開発時）
3. デプロイを再実行

### 記事が保存されない

**原因**: ネットワーク接続の問題またはタイムアウト

**対処法**:
1. ブラウザの開発者ツール（Network タブ）でエラーを確認
2. Wi-Fi 接続を確認
3. 大きなデータを編集していないか確認

## 今後の拡張

### 1. リッチテキスト編集

現在はタイトルと抜粋のみですが、以下を追加可能：

```typescript
// body フィールド（ポータブルテキスト）の更新
await writeClient
  .patch(id)
  .set({
    body: portableTextData,
  })
  .commit()
```

### 2. 画像アップロード

```typescript
// 画像をアップロード
const imageAsset = await writeClient.assets.upload('image', imageFile)

// 記事に設定
await writeClient
  .patch(id)
  .set({
    image: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: imageAsset._id,
      },
    },
  })
  .commit()
```

### 3. 複数フィールドの編集

```typescript
await writeClient
  .patch(id)
  .set({
    title: body.title,
    excerpt: body.excerpt,
    featured: body.featured,
    type: body.type,
    artist: body.artist,
    score: body.score,
  })
  .commit()
```

### 4. モバイルアプリからのアクセス

`mobile/` ディレクトリの Expo アプリから、同じ API ルートを呼び出すことで、ネイティブアプリからも編集可能：

```typescript
// mobile/app/(tabs)/edit.tsx
const updateArticle = async (id: string, updates: any) => {
  const response = await fetch(
    `${SITE_URL}/api/articles/${id}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    }
  )
  return response.json()
}
```

## 参考リソース

- [Sanity Client Documentation](https://www.sanity.io/docs/client)
- [Content Lake API](https://www.sanity.io/docs/content-lake)
- [Sanity Patch API](https://www.sanity.io/docs/patch-api)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

**最終更新**: 2026年6月14日
**バージョン**: 1.0.0
