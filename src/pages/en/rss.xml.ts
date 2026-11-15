import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { en } from '../../i18n/en';
import { SITE_URL } from '../../i18n';

export async function GET() {
  const posts = await getCollection('postsEn');
  const sorted = [...posts].sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf(),
  );

  return rss({
    title: `emin boydak — ${en.meta.blog}`,
    description: en.meta.blogDescription,
    site: SITE_URL,
    items: sorted.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishDate,
      description: post.data.description,
      link: `/en/blog/${post.id}`,
    })),
  });
}
