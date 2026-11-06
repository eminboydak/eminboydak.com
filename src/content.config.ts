import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const postSchema = z.object({
  title: z.string(),
  publishDate: z.coerce.date(),
  description: z.string(),
  tags: z.array(z.string()),
});

const postsTr = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts/tr' }),
  schema: postSchema,
});

const postsEn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts/en' }),
  schema: postSchema,
});

export const collections = { postsTr, postsEn };
