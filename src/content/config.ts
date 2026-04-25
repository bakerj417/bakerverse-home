import { defineCollection, z } from 'astro:content';

const rarity = z.enum([
  'common',
  'uncommon',
  'rare',
  'epic',
  'legendary',
  'artifact',
]);

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    rarity: rarity.default('rare'),
    year: z.number(),
    status: z
      .enum(['shipped', 'active', 'archived', 'wip', 'upcoming', 'paused'])
      .default('shipped'),
    stack: z.array(z.string()).default([]),
    repoUrl: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
    cover: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(100),
    summary: z.string(),
  }),
});

const work = defineCollection({
  type: 'content',
  schema: z.object({
    role: z.string(),
    company: z.string(),
    companyUrl: z.string().url().optional(),
    start: z.string(),
    end: z.string().optional(),
    active: z.boolean().default(false),
    concurrent: z.boolean().default(false),
    location: z.string().optional(),
    teaser: z.string(),
    stack: z.array(z.string()).default([]),
    outcomes: z.array(z.string()).default([]),
    order: z.number().default(100),
  }),
});

export const collections = { projects, work };
