import { config, collection, fields } from '@keystatic/core';
import { wrapper, block } from '@keystatic/core/content-components';

const isProd = import.meta.env.PROD;

export default config({
  storage: isProd
    ? { kind: 'github', repo: 'ericlewan/portfolio', branch: 'main' }
    : { kind: 'local' },

  ui: {
    brand: { name: 'yaroslav.design' },
  },

  collections: {
    blog: collection({
      label: 'Blog Posts',
      slugField: 'slug',
      path: 'src/content/blog/*',
      format: { contentField: 'body' },
      schema: {
        slug: fields.slug({ name: { label: 'Slug' } }),
        title: fields.text({ label: 'Title', description: 'HTML allowed, e.g. Title<br /><em>italic</em>' }),
        date: fields.date({ label: 'Date' }),
        description: fields.text({ label: 'Description' }),
        body: fields.mdx({ label: 'Body' }),
      },
    }),

    'case-studies': collection({
      label: 'Case Studies',
      slugField: 'slug',
      path: 'src/content/case-studies/*',
      format: { contentField: 'body', extension: 'mdx' },
      schema: {
        slug: fields.slug({ name: { label: 'Slug' } }),
        title: fields.text({ label: 'Title', description: 'HTML allowed, e.g. First part<br /><em>italic part</em>' }),
        eyebrow: fields.text({ label: 'Eyebrow', description: 'e.g. Quidget · 2024' }),
        company: fields.text({ label: 'Company' }),
        companyUrl: fields.url({ label: 'Company URL', validation: { isRequired: false } }),
        role: fields.text({ label: 'Role' }),
        timeline: fields.text({ label: 'Timeline' }),
        intro: fields.text({ label: 'Intro', multiline: true }),
        heroImage: fields.text({ label: 'Hero Image' }),
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
        cardImage: fields.text({ label: 'Card Image (home page)' }),
        cardImageAlt: fields.text({ label: 'Card Image Alt' }),
        cardBg: fields.select({
          label: 'Card Background (home page)',
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Headway', value: 'headway' },
            { label: 'Blue', value: 'blue' },
            { label: 'Dark', value: 'dark' },
            { label: 'Dark Green', value: 'dark-green' },
          ],
          defaultValue: 'light',
        }),
        description: fields.text({ label: 'Description (SEO)', multiline: true }),
        copyright: fields.checkbox({ label: 'Copyright notice', defaultValue: false }),
        wip: fields.checkbox({ label: 'Work in progress (locks card on home page)', defaultValue: false }),
        order: fields.integer({ label: 'Sort order' }),
        nextProject: fields.ignored(),
        body: fields.mdx({
          label: 'Body',
          components: {
            // wrapper() produces kind:'wrapper' — Keystatic uses this to correctly
            // register the ProseMirror node type for a block that wraps child content.
            // The old component() API didn't set kind, causing the createAndFill crash.
            // Child content (the text between tags) is implicit in wrapper — no fields.child() needed.
            Section: wrapper({
              label: 'Section',
              schema: {
                heading: fields.text({ label: 'Heading' }),
                noPaddingTop: fields.checkbox({ label: 'No top padding', defaultValue: false }),
              },
            }),
            // block() produces kind:'block' — for self-closing block elements with no children
            ImageBlock: block({
              label: 'Image Block',
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
