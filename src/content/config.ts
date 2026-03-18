import { defineCollection, z } from 'astro:content';

const caseStudies = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    eyebrow: z.string().optional().default(''),
    company: z.string().optional().default(''),
    companyUrl: z.string().optional(),
    role: z.string().optional().default(''),
    timeline: z.string().optional().default(''),
    intro: z.string().optional().default(''),
    heroImage: z.string().optional().default(''),
    heroImageAlt: z.string().optional().default(''),
    heroBg: z.string().optional().default('pale'),
    cardImage: z.string().optional().default(''),
    cardImageAlt: z.string().optional().default(''),
    cardBg: z.string().optional().default('light'),
    description: z.string().optional().default(''),
    copyright: z.boolean().default(false),
    wip: z.boolean().default(false),
    nextProject: z.object({
      href: z.string(),
      title: z.string(),
    }).optional(),
    order: z.number().optional().default(99),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    description: z.string().optional().default(''),
  }),
});

export const collections = {
  'case-studies': caseStudies,
  blog,
};
