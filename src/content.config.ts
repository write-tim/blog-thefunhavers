import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    coverImage: z.string().optional(),
    category: z.string().default('life'),
    author: z.string().default('Timothy Johnson'),
    mathjax: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const trips = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/trips' }),
  schema: z.object({
    title: z.string(),
    place: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    heroImage: z.string(),
    gallery: z.array(z.string()).default([]),
    circlePhotos: z.array(z.string()).default([]),
    highlights: z.array(z.string()).default([]),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    greeting: z.string().default("Hello, we're"),
    firstName: z.string().default('The'),
    lastName: z.string().default('Funhavers'),
    typingRoles: z.array(z.string()).default([]),
    bio: z.string().optional(),
    description: z.string().optional(),
    avatar: z.string().optional(),
  }),
});

export const collections = { blog, trips, pages };

