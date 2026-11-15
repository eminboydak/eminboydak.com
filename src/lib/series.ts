import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n';

type Post = CollectionEntry<'postsTr'> | CollectionEntry<'postsEn'>;
type Series = CollectionEntry<'seriesTr'> | CollectionEntry<'seriesEn'>;

export interface SeriesContext {
  series: Series;
  parts: Post[];
  index: number;
  prev?: Post;
  next?: Post;
}

/** Resolve the series a post belongs to, with ordered siblings. */
export async function getSeriesContext(locale: Locale, post: Post): Promise<SeriesContext | null> {
  const seriesId = post.data.series;
  if (!seriesId) return null;

  const [series, posts] = await Promise.all([
    getCollection(locale === 'tr' ? 'seriesTr' : 'seriesEn'),
    getCollection(locale === 'tr' ? 'postsTr' : 'postsEn'),
  ]);
  const entry = series.find((s) => s.id === seriesId);
  if (!entry) return null;

  const parts = posts
    .filter((p) => p.data.series === seriesId)
    .sort((a, b) => (a.data.part ?? 0) - (b.data.part ?? 0));
  const index = parts.findIndex((p) => p.id === post.id);

  return {
    series: entry,
    parts,
    index,
    prev: index > 0 ? parts[index - 1] : undefined,
    next: index >= 0 && index < parts.length - 1 ? parts[index + 1] : undefined,
  };
}

/** All series with their ordered parts — used by the series routes. */
export async function getAllSeries(locale: Locale): Promise<{ series: Series; parts: Post[] }[]> {
  const [series, posts] = await Promise.all([
    getCollection(locale === 'tr' ? 'seriesTr' : 'seriesEn'),
    getCollection(locale === 'tr' ? 'postsTr' : 'postsEn'),
  ]);
  return series.map((s) => ({
    series: s,
    parts: posts
      .filter((p) => p.data.series === s.id)
      .sort((a, b) => (a.data.part ?? 0) - (b.data.part ?? 0)),
  }));
}
