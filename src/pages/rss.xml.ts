import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { tr } from '../i18n/tr';
import { SITE_URL } from '../i18n';

export async function GET() {
  const posts = await getCollection('postsTr');
  const sorted = [...posts].sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf(),
  );

  return rss({
    title: `emin boydak — ${tr.meta.blog}`,
    description: tr.meta.blogDescription,
    site: SITE_URL,
    items: sorted.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishDate,
      description: post.data.description,
      link: `/blog/${post.id}`,
    })),
  });
}
