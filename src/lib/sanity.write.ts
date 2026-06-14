import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../../sanity/env'

// 書き込み権限を持つトークンが必要
// Vercelの環境変数に SANITY_WRITE_TOKEN を設定してください
const token = process.env.SANITY_WRITE_TOKEN

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // 書き込み時は最新データを取得するためCDNをオフにする
  token,
})
