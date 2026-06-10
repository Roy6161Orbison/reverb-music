import { Platform } from 'react-native'

export const Colors = {
  bg: '#FFFFFF',
  text: '#111111',
  muted: '#666666',
  accent: '#C8501F',
  border: '#E5E5E5',
}

// 見出し用の明朝体（Webの Cormorant Garamond / Noto Serif JP に対応）
export const serifFont = Platform.select({
  ios: 'Hiragino Mincho ProN',
  android: 'serif',
  default: 'Georgia',
})
