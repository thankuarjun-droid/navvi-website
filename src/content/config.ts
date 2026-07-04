import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    category: z.string(),
    featured: z.boolean().default(false),
    image: z.string().optional(),
    readTime: z.string().optional()
  })
});

export const collections = { blog };