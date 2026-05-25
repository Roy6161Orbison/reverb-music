import {defineField, defineType} from 'sanity'

export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured (メインに表示)',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
    }),
    defineField({
      name: 'image',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: 'Review', value: 'review'},
          {title: 'Feature', value: 'feature'},
          {title: 'Interview', value: 'interview'},
          {title: 'News', value: 'news'},
        ],
      },
    }),
    defineField({
      name: 'artist',
      title: 'Artist',
      type: 'string',
    }),
    defineField({
      name: 'score',
      title: 'Score',
      type: 'object',
      fields: [
        defineField({
          name: 'overall',
          title: 'Overall',
          type: 'number',
        }),
      ],
    }),
  ],
})
