import { defineCollection, z } from 'astro:content';

const caseStudies = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    eyebrow: z.string(),
    company: z.string(),
    companyUrl: z.string().optional(),
    role: z.string(),
    timeline: z.string(),
    intro: z.string(),
    heroImage: z.string(),
    heroImageAlt: z.string(),
    heroBg: z.string(),
    description: z.string(),
    copyright: z.boolean().default(false),
    wip: z.boolean().default(false),
    nextProject: z.object({
      href: z.string(),
      title: z.string(),
    }).optional(),
    order: z.number(),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    description: z.string(),
  }),
});

export const collections = {
  'case-studies': caseStudies,
  blog,
};
