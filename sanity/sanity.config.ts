import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {article} from './schemaTypes/article'

export default defineConfig({
  name: 'reverb-music',
  title: 'Reverb / 残響',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '941ja3ai',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/studio',
  plugins: [structureTool(), visionTool()],
  schema: {
    types: [article],
  },
})