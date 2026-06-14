import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

const SINGLETON_TYPES = new Set(['aboutPage'])

export default defineConfig({
  name: 'reverb-music',
  title: 'Reverb / 残響',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '941ja3ai',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/studio',
  plugins: [
    structureTool({structure}),
    // Vision tool is only loaded in development to avoid production overhead
    ...(process.env.NODE_ENV === 'development' ? [visionTool()] : []),
  ],
  schema: {
    types: schemaTypes,
    // シングルトンは「新規作成」グローバルメニューから除外（1ページに固定）
    templates: (templates) =>
      templates.filter(({schemaType}) => !SINGLETON_TYPES.has(schemaType)),
  },
  document: {
    // シングルトンでは複製・削除アクションを無効化
    actions: (input, context) =>
      SINGLETON_TYPES.has(context.schemaType)
        ? input.filter(
            ({action}) =>
              action && ['publish', 'discardChanges', 'restore'].includes(action),
          )
        : input,
  },
})
