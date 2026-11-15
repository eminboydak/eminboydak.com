import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const postSchema = z
  .object({
    title: z.string(),
    publishDate: z.coerce.date(),
    description: z.string(),
    tags: z.array(z.string()),
    series: z.string().optional(),
    part: z.number().optional(),
  })
  .refine((d) => (d.series === undefined) === (d.part === undefined), {
    message: 'series and part must be provided together',
  });

const seriesSchema = z.object({
  title: z.string(),
  description: z.string(),
});

const seriesTr = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/series/tr' }),
  schema: seriesSchema,
});

const seriesEn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/series/en' }),
  schema: seriesSchema,
});

const postsTr = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts/tr' }),
  schema: postSchema,
});

const postsEn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts/en' }),
  schema: postSchema,
});

export const collections = { postsTr, postsEn, seriesTr, seriesEn };
