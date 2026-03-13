import { config, collection, fields, component } from '@keystatic/core';

const isProd = import.meta.env.PROD;

export default config({
  storage: isProd
    ? { kind: 'github', repo: 'ericlewan/portfolio' }
    : { kind: 'local' },

  ui: {
    brand: { name: 'yaroslav.design' },
  },

  collections: {
    blog: collection({
      label: 'Blog Posts',
      slugField: 'title',
      path: 'src/content/blog/*',
      // Blog posts are .md files, not .mdx — must specify extension
      format: { contentField: 'body', extension: 'md' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        date: fields.date({ label: 'Date' }),
        description: fields.text({ label: 'Description' }),
        body: fields.mdx({ label: 'Body' }),
      },
    }),

    'case-studies': collection({
      label: 'Case Studies',
      slugField: 'company',
      path: 'src/content/case-studies/*',
      format: { contentField: 'body' },
      schema: {
        title: fields.text({ label: 'Title', description: 'HTML allowed, e.g. First part<br /><em>italic part</em>' }),
        eyebrow: fields.text({ label: 'Eyebrow', description: 'e.g. Quidget · 2024' }),
        company: fields.slug({ name: { label: 'Company' } }),
        companyUrl: fields.url({ label: 'Company URL', validation: { isRequired: false } }),
        role: fields.text({ label: 'Role' }),
        timeline: fields.text({ label: 'Timeline' }),
        intro: fields.text({ label: 'Intro', multiline: true }),
        heroImage: fields.image({
          label: 'Hero Image',
          directory: 'public/Images/uploads',
          publicPath: '/Images/uploads/',
        }),
        heroImageAlt: fields.text({ label: 'Hero Image Alt' }),
        heroBg: fields.select({
          label: 'Hero Background',
          options: [
            { label: 'Pale', value: 'pale' },
            { label: 'Dark', value: 'dark' },
            { label: 'Headway', value: 'headway' },
            { label: 'Blue', value: 'blue' },
            { label: 'Dark Green', value: 'dark-green' },
          ],
          defaultValue: 'pale',
        }),
        description: fields.text({ label: 'Description (SEO)', multiline: true }),
        copyright: fields.checkbox({ label: 'Copyright notice', defaultValue: false }),
        wip: fields.checkbox({ label: 'Work in progress (locks card on home page)', defaultValue: false }),
        order: fields.integer({ label: 'Sort order' }),
        nextProject: fields.ignored(),
        body: fields.mdx({
          label: 'Body',
          components: {
            Section: component({
              label: 'Section',
              // preview is required by Keystatic to initialise the ProseMirror schema.
              // Returning the children element renders block content inline.
              preview: (props) => props.fields.children.element,
              schema: {
                heading: fields.text({ label: 'Heading' }),
                noPaddingTop: fields.checkbox({ label: 'No top padding', defaultValue: false }),
                children: fields.child({ kind: 'block', placeholder: 'Content…' }),
              },
            }),
            ImageBlock: component({
              label: 'Image Block',
              // preview is required; null is valid (no interactive preview in editor)
              preview: () => null,
              schema: {
                src: fields.text({ label: 'Image path' }),
                alt: fields.text({ label: 'Alt text' }),
                bg: fields.select({
                  label: 'Background',
                  options: [
                    { label: 'Pale', value: 'pale' },
                    { label: 'Blue', value: 'blue' },
                    { label: 'Dark', value: 'dark' },
                  ],
                  defaultValue: 'pale',
                }),
                caption: fields.text({ label: 'Caption', multiline: true }),
              },
            }),
          },
        }),
      },
    }),
  },
});
