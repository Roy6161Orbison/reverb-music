import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {article} from './schemaTypes/article'

export default defineConfig({
  name: 'reverb-music',
  title: 'Reverb / 残響',
  projectId: '941ja3ai',
  dataset: 'production',
  basePath: '/studio',
  plugins: [structureTool(), visionTool()],
  schema: {
    types: [article],
  },
})