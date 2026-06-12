import {defineArrayMember, defineField, defineType} from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Us',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'About Us',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Main Photo',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: '代替テキスト (alt)',
          type: 'string',
        }),
      ],
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
      ],
    }),
  ],
  preview: {
    select: {title: 'title', media: 'image'},
    prepare({title, media}) {
      return {title: title || 'About Us', media}
    },
  },
})
