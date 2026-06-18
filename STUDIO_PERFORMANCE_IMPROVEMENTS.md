# Sanity Studio パフォーマンス改善ガイド

## 改善内容

このドキュメントは、Sanity Studio のパフォーマンス最適化のために実施された変更内容を説明しています。

### 1. Studio 専用レイアウトの実装 (`src/app/studio/layout.tsx`)

**問題点：**
- Studio ルート (`/studio`) がメインサイトのグローバルレイアウト (`src/app/layout.tsx`) を継承していた
- メインサイト用の重いアニメーションと背景効果が Studio にも適用されていた

**解決策：**
- Studio 専用のレイアウトファイルを作成
- Next.js の Route Groups 機能により、`/studio` 配下のみこのレイアウトを適用
- グローバルレイアウトの継承を回避

**効果：**
- ページ遷移アニメーション (`PageTransition`) の排除
- 不要なメタデータ設定の削除
- Studio に最適化されたシンプルな HTML 構造

### 2. Studio 専用 CSS の実装 (`src/app/studio/studio.css`)

**問題点：**
- グローバル CSS (`globals.css`) に複数の重いアニメーションが定義されていた
  - `bg-gradient-motion`: 32 秒のループアニメーション
  - `bg-grain`: 複雑な SVG ノイズフィルター
  - `page-transition`: ページ遷移時のスキャンライン効果
  - その他多数のアニメーション効果

**解決策：**
- Studio 専用の軽量 CSS を作成
- すべてのアニメーションと遷移を無効化
- `will-change` ヒントを削除してメモリ使用量を削減
- システムフォントのみを使用（Google Fonts の読み込みなし）

**効果：**
- GPU メモリ使用量の大幅削減
- CPU 使用率の低下
- ブラウザのレンダリング負荷の軽減

### 3. Sanity 設定の最適化 (`sanity/sanity.config.ts`)

**問題点：**
- Vision Tool がすべての環境で読み込まれていた
- 本番環境では不要な機能が含まれていた

**解決策：**
- Vision Tool を開発環境のみで読み込むように条件付け
- 本番環境でのバンドルサイズを削減

**効果：**
- 本番環境での JavaScript バンドルサイズ削減
- Studio の初期読み込み時間の短縮

## 実装方法

### ディレクトリ構造

```
src/app/
├── layout.tsx                    # メインサイト用（変更なし）
├── globals.css                   # メインサイト用（変更なし）
├── studio/
│   ├── layout.tsx               # ✨ 新規: Studio 専用レイアウト
│   ├── studio.css               # ✨ 新規: Studio 専用 CSS
│   └── [[...tool]]/
│       ├── page.tsx
│       └── StudioClient.tsx
```

### Next.js Route Groups の仕組み

Next.js 13+ の App Router では、同じレベルのレイアウトファイルが優先されます：

1. `/studio/layout.tsx` が存在する場合、`/studio/**` のすべてのルートはこのレイアウトを使用
2. `/layout.tsx` は `/studio` 以外のルートにのみ適用
3. これにより、Studio と メインサイトで異なるレイアウトを使用できます

## パフォーマンス改善の期待値

### CPU 使用率
- **改善前**: 20-40% (アニメーション実行中)
- **改善後**: 5-10% (アイドル状態)

### メモリ使用量
- **改善前**: 150-200 MB
- **改善後**: 80-120 MB

### 初期読み込み時間
- **改善前**: 3-5 秒
- **改善後**: 1-2 秒

## 検証方法

### ブラウザの DevTools を使用した確認

1. **Performance タブ**
   - Studio を開く
   - 記録開始 → ページをスクロール → 記録停止
   - フレームレート (FPS) が 60 に近いことを確認

2. **Performance Monitor**
   - Chrome DevTools → 3 ドット → More tools → Performance Monitor
   - CPU 使用率とメモリ使用量を監視

3. **Lighthouse**
   - Chrome DevTools → Lighthouse
   - Performance スコアの向上を確認

### コマンドラインでの確認

```bash
# 開発サーバーの起動
npm run dev

# ブラウザで確認
# http://localhost:3000/studio
```

## 追加の最適化案

### 将来的な改善

1. **Lazy Loading の導入**
   - Studio コンポーネントの遅延読み込み

2. **Code Splitting**
   - Vision Tool などのオプション機能を別バンドルに分割

3. **キャッシング戦略**
   - Service Worker による静的アセットのキャッシング

4. **CDN 配置**
   - Vercel Edge Network の活用

5. **スキーマの最適化**
   - 大規模なポータブルテキストフィールドの分割
   - 参照フィールドの遅延読み込み

## トラブルシューティング

### Studio が重い場合

1. **ブラウザキャッシュをクリア**
   ```bash
   # 開発サーバーを停止して再起動
   npm run dev
   ```

2. **DevTools で確認**
   - Network タブ: 大きなファイルがないか確認
   - Performance タブ: ボトルネックを特定

3. **ネットワーク接続を確認**
   - Sanity API への接続速度を確認
   - CDN の地理的位置を確認

## 参考資料

- [Next.js Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups)
- [Sanity Performance Guide](https://www.sanity.io/docs/performance)
- [Web Vitals](https://web.dev/vitals/)
- [CSS will-change Property](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change)
