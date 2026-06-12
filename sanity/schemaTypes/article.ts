import {defineArrayMember, defineField, defineType} from 'sanity'

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
      of: [
        defineArrayMember({type: 'block'}),
        defineArrayMember({
          type: 'image',
          title: '画像',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: '代替テキスト (alt)',
              type: 'string',
            }),
            defineField({
              name: 'caption',
              title: 'キャプション',
              type: 'string',
            }),
          ],
        }),
        defineArrayMember({
          type: 'object',
          name: 'embed',
          title: '埋め込み (YouTube / Spotify など)',
          fields: [
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'caption',
              title: 'キャプション',
              type: 'string',
            }),
          ],
          preview: {
            select: {title: 'url', subtitle: 'caption'},
            prepare({title, subtitle}) {
              return {title: subtitle || '埋め込み', subtitle: title}
            },
          },
        }),
      ],
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
          {title: 'Music', value: 'music'},
          {title: 'Films', value: 'film'},
          {title: 'Feature', value: 'feature'},
          {title: 'Interview', value: 'interview'},
          {title: 'Essay', value: 'essay'},
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
