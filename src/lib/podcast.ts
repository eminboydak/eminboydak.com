import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n';

export type Show = CollectionEntry<'showsTr'> | CollectionEntry<'showsEn'>;
export type Episode = CollectionEntry<'episodesTr'> | CollectionEntry<'episodesEn'>;

function names(locale: Locale) {
  return {
    shows: locale === 'tr' ? ('showsTr' as const) : ('showsEn' as const),
    episodes: locale === 'tr' ? ('episodesTr' as const) : ('episodesEn' as const),
  };
}

export async function getShows(locale: Locale): Promise<Show[]> {
  return getCollection(names(locale).shows);
}

export async function getEpisodes(locale: Locale, showId: string): Promise<Episode[]> {
  const all = await getCollection(names(locale).episodes);
  return all
    .filter((e) => e.data.show === showId)
    .sort((a, b) => a.data.number - b.data.number);
}
