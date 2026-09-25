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
  schema: z
    .object({
      // Home page fields
      greeting: z.string().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      typingRoles: z.array(z.string()).default([]),
      bio: z.string().optional(),
      description: z.string().optional(),
      avatar: z.string().optional(),

      // Work page fields
      title: z.string().optional(),
      name: z.string().optional(),
      currentRole: z.string().optional(),
      currentCompany: z.string().optional(),
      location: z.string().optional(),
      experience: z
        .array(
          z.object({
            role: z.string(),
            company: z.string(),
            companyUrl: z.string().optional(),
            location: z.string().default('Remote'),
            start: z.string(),
            end: z.string(),
            current: z.boolean().optional(),
            summary: z.string().default(''),
            bullets: z.array(z.string()).default([]),
            badges: z.array(z.string()).default([]),
          })
        )
        .optional(),
      earlierRoles: z
        .array(
          z.object({
            role: z.string(),
            company: z.string(),
            start: z.string(),
            end: z.string(),
          })
        )
        .optional(),
      education: z
        .array(
          z.object({
            degree: z.string(),
            field: z.string(),
            school: z.string(),
            start: z.string(),
            end: z.string(),
          })
        )
        .optional(),
      skillGroups: z
        .array(
          z.object({
            title: z.string(),
            skills: z.array(z.string()).default([]),
          })
        )
        .optional(),
    }),
});

export const collections = { blog, trips, pages };

