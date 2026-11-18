#!/usr/bin/env node
// Post-build OG generator (stancona OG-GENERATOR-001 pattern).
// The rendered <head> is the single source of truth: every page advertises its
// og:image target; we scan dist HTML and render exactly those cards (plus the
// global og.png fallback and explicit story assets).
import { readdirSync, readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cardTemplate, storyTemplate } from '../tools/og/templates.mjs';
import { renderPng, cardSize, storySize } from '../tools/og/render.mjs';

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const SITE = 'https://eminboydak.com';

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}

const meta = (html, re) => (html.match(re) || [])[1]?.trim();
// Astro escapes ' " & in <title>; decode before rendering (otherwise the
// literal &#39; shows up on the card — the "broken character" bug).
const decodeEntities = (s) =>
  s
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

let rendered = 0;
const failures = [];

for (const file of walk(DIST)) {
  const html = readFileSync(file, 'utf8');
  const ogImage = meta(html, /<meta property="og:image" content="([^"]+)"/);
  if (!ogImage || !ogImage.includes('/og/')) continue; // only our generated targets

  const title = meta(html, /<title>([^<]+)<\/title>/);
  if (!title || title === '404') {
    failures.push(`${relative(DIST, file)}: missing/invalid <title>`);
    continue;
  }

  const path = ogImage.replace(SITE, '');
  const locale = path.includes('/en/') ? 'en' : 'tr';
  const kind = path.includes('/blog/') ? 'blog' : path.includes('/podcast/') ? 'podcast' : 'home';
  const kicker =
    kind === 'blog' ? (locale === 'tr' ? 'BLOG YAZISI' : 'BLOG POST') : kind === 'podcast' ? 'PODCAST' : locale === 'tr' ? 'KİŞİSEL SİTE' : 'PERSONAL SITE';

  const pageName = decodeEntities(title.replace(/ · emin boydak$/, ''));
  const node = cardTemplate({ kicker, title: pageName, cover: kind === 'podcast', locale });
  const [w, h] = cardSize;
  const png = await renderPng(node, w, h);

  const target = join(DIST, path.replace(/^\//, ''));
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, png);
  rendered++;
  console.log(`og ✓ ${path} (${w}×${h})`);
}

// Global og.png fallback (stale-proof: regenerated on every build)
const homeNode = cardTemplate({
  kicker: 'SİSTEM MÜHENDİSİ',
  title: 'emin boydak',
  cover: false,
});
writeFileSync(join(DIST, 'og.png'), await renderPng(homeNode, ...cardSize));
console.log('og ✓ /og.png (global fallback)');

// Explicit story assets (Instagram) — episode-level, not advertised in <head>
const stories = [
  {
    file: 'story-ep1.png',
    kicker: "EMİN’İN SEYİR DEFTERİ · YENİ BÖLÜM",
    title: '#1 Ajanlar, bağlam ve bir kuru üzüm',
    invite: 'Aklıma estikçe kayıt aldığım bir seyir defteri tutmaya başladım. İlk bölümü yayınladım, dinlemek istersen beklerim.',
  },
];
for (const s of stories) {
  const png = await renderPng(storyTemplate({ ...s, locale: 'tr' }), ...storySize);
  const target = join(DIST, 'share', s.file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, png);
  console.log(`story ✓ /share/${s.file} (${storySize.join('×')})`);
}

if (failures.length) {
  console.error('OG generation failed:\n - ' + failures.join('\n - '));
  process.exit(1);
}
console.log(`OG done: ${rendered} page card(s) + og.png + ${stories.length} story`);
