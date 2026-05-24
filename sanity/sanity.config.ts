import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

const projectId = '941ja3ai'
const dataset = 'production'

export default defineConfig({
  name: 'reverb-music',
  title: 'Reverb / 残響',
  projectId: projectId,
  dataset: dataset,
  basePath: '/studio',
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
})