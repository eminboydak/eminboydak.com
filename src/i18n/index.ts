import { tr, type Dictionary } from './tr';
import { en } from './en';

export const dictionaries = { tr, en } as const;
export type Locale = keyof typeof dictionaries;

export const SITE_URL = 'https://eminboydak.com';
export const FAVICON_VERSION = '3';

/** Determine the active locale from the current pathname. */
export function getLocale(pathname: string): Locale {
  return pathname.startsWith('/en') ? 'en' : 'tr';
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** Build a locale-prefixed path. `/` → `/en`, `/blog` → `/en/blog`. */
export function localePath(locale: Locale, path: string): string {
  if (locale === 'tr') return path;
  if (path === '/') return '/en';
  return `/en${path}`;
}

/** Strip the locale prefix from a pathname, leaving the route. */
export function stripLocale(pathname: string): string {
  const stripped = pathname.replace(/^\/en/, '');
  return stripped === '' ? '/' : stripped;
}
