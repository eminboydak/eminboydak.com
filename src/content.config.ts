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

const showSchema = z.object({
  title: z.string(),
  description: z.string(),
  youtube: z.string().url().optional(),
  spotify: z.string().url().optional(),
});

const episodeSchema = z.object({
  show: z.string(),
  title: z.string(),
  publishDate: z.coerce.date(),
  number: z.number(),
  duration: z.string().optional(),
  youtubeId: z.string().optional(),
  spotifyUrl: z.string().url().optional(),
});

const showsTr = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/shows/tr' }),
  schema: showSchema,
});
const showsEn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/shows/en' }),
  schema: showSchema,
});
const episodesTr = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/episodes/tr' }),
  schema: episodeSchema,
});
const episodesEn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/episodes/en' }),
  schema: episodeSchema,
});

export const collections = { postsTr, postsEn, seriesTr, seriesEn, showsTr, showsEn, episodesTr, episodesEn };
