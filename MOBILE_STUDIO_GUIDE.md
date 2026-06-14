# Sanity Studio モバイル対応ガイド

## 概要

Sanity Studioをスマートフォンから編集できるように設定しました。このドキュメントでは、設定内容と使用方法をまとめています。

## 現在の構成

### デプロイ構成
- **フロントエンド**: Next.js 16.2.5 + React 19.2.4
- **CMS**: Sanity v6.0.0
- **Studio**: Embedded Studio（`/studio` パスに組み込み）
- **ホスティング**: Vercel
- **デプロイURL**: `https://reverb-music.vercel.app`
- **Studio URL**: `https://reverb-music.vercel.app/studio`

### Sanity プロジェクト情報
- **Project ID**: `941ja3ai`
- **Dataset**: `production`
- **API Version**: `2026-05-07`

## 実施した設定

### 1. CORS（クロスオリジンリソース共有）設定
Sanity側に以下のオリジンを許可リストに追加しました：

| オリジン | 用途 |
|---------|------|
| `http://localhost:3000` | ローカル開発環境 |
| `https://reverb-music.vercel.app` | 本番環境（スマートフォン含む） |

**設定方法**: Sanity Manage（`https://www.sanity.io/manage`）→ プロジェクト設定 → API → CORS Origins

### 2. サイト情報の修正
`src/lib/site.ts` を更新し、SEOメタデータが正しいドメインを参照するようにしました：

```typescript
// 修正前
export const SITE_URL = 'https://somethinelse.vercel.app'
export const SITE_NAME = "Somethin' Else"

// 修正後
export const SITE_URL = 'https://reverb-music.vercel.app'
export const SITE_NAME = 'Reverb / 残響'
```

**影響範囲**:
- Open Graph メタデータ（SNS共有時の表示）
- Canonical URL（SEO）
- RSS Feed URL

### 3. モバイル対応メタデータ
`next-sanity/studio` から提供されるモバイル最適化済みのメタデータが自動的に適用されています：

- **Viewport**: モバイルデバイス向けに最適化
- **Touch Icons**: iOS/Android対応
- **Responsive Design**: タッチ操作に対応したUI

## スマートフォンからのアクセス方法

### 1. 基本的なアクセス
スマートフォンのブラウザで以下のURLにアクセスしてください：

```
https://reverb-music.vercel.app/studio
```

### 2. ログイン
初回アクセス時は Sanity の認証画面が表示されます。以下の認証方法が利用可能です：

- **Google アカウント**
- **GitHub アカウント**
- **Sanity アカウント**

### 3. 編集操作
Sanity Studio のモバイル UI は以下の操作に対応しています：

| 操作 | 説明 |
|------|------|
| **タップ** | ドキュメント/フィールドの選択 |
| **スワイプ** | パネルの切り替え |
| **ピンチズーム** | テキストの拡大・縮小（ブラウザ機能） |
| **長押し** | コンテキストメニューの表示 |

## トラブルシューティング

### 403 Forbidden エラーが表示される場合

**原因**: CORS設定が正しく反映されていない可能性があります。

**対処法**:
1. ブラウザのキャッシュをクリアしてください
2. 5分待機してから再度アクセスしてください
3. 別のブラウザで試してください

### ログインできない場合

**原因**: 認証トークンの有効期限切れまたはネットワーク接続の問題

**対処法**:
1. ブラウザの Cookie をクリアしてください
2. Wi-Fi に接続してから試してください
3. 別のデバイスで試してください

### 編集内容が保存されない場合

**原因**: ネットワーク接続の不安定性またはタイムアウト

**対処法**:
1. 安定した Wi-Fi 環境で作業してください
2. 大量の画像アップロードは避けてください
3. ブラウザの開発者ツールでネットワークエラーを確認してください

## ベストプラクティス

### スマートフォンでの編集時の推奨事項

1. **Wi-Fi 接続を使用**: 4G/5G よりも安定した接続が得られます
2. **大画面デバイスを優先**: タブレット（iPad など）での作業がより快適です
3. **複雑な編集は PC で実施**: 大量のテキスト入力や複数ドキュメントの同時編集は PC 推奨
4. **定期的に保存**: 長時間の作業中は定期的に変更を保存してください

### パフォーマンス最適化

- **画像サイズ**: 5MB 以下の画像をアップロードしてください
- **リッチテキスト**: 過度に複雑なフォーマットは避けてください
- **参照フィールド**: 参照先ドキュメントが多い場合は読み込みに時間がかかります

## 開発環境でのテスト

### ローカル開発環境でのモバイルテスト

1. **ローカルサーバーを起動**:
   ```bash
   npm run dev
   ```

2. **スマートフォンからアクセス**:
   - PC のローカル IP アドレスを確認: `ipconfig getifaddr en0` (Mac) または `ipconfig` (Windows)
   - スマートフォンで `http://<PC-IP>:3000/studio` にアクセス

### リモートデバッグ

Chrome DevTools を使用してリモートデバッグが可能です：

1. Android デバイスで USB デバッグを有効化
2. PC の Chrome で `chrome://inspect` を開く
3. デバイスを接続して検査

## 今後の改善予定

### 推奨される次のステップ

1. **Draft Mode の設定**: Visual Editing を有効化して、リアルタイムプレビューを実装
2. **Presentation Tool の設定**: Studio から直接フロントエンドをプレビュー
3. **Webhook の設定**: コンテンツ変更時に自動的にサイトを再ビルド
4. **API Token の管理**: 本番環境用の読み取り専用トークンを設定

## 参考リソース

- [Sanity Studio Documentation](https://www.sanity.io/docs/studio)
- [Next.js + Sanity Integration](https://www.sanity.io/docs/nextjs)
- [Sanity CORS Configuration](https://www.sanity.io/docs/cors)
- [next-sanity Package](https://github.com/sanity-io/next-sanity)

## サポート

問題が発生した場合は、以下の方法でサポートを受けることができます：

1. **Sanity Community**: https://slack.sanity.io/
2. **GitHub Issues**: https://github.com/Roy6161Orbison/reverb-music/issues
3. **Sanity Support**: https://www.sanity.io/support

---

**最終更新**: 2026年6月14日
**バージョン**: 1.0.0
