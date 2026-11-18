import satori from 'satori';
import { ogFonts } from '../tools/og/fonts.mjs';
import { cardTemplate, storyTemplate } from '../tools/og/templates.mjs';

function toS(node) {
  if (!node || typeof node !== 'object') return node;
  const { type, style, children, ...rest } = node;
  const props = { ...rest };
  if (style !== undefined) props.style = style;
  if (children !== undefined)
    props.children = Array.isArray(children) ? children.map(toS) : toS(children);
  return { type, props };
}

const svg = await satori(
  toS(cardTemplate({ kicker: 'BLOG YAZISI', title: 'Biz de bağlam toplayan bir mekanizma mıyız?', cover: false })),
  { width: 1200, height: 630, fonts: ogFonts() },
);
console.log('svg len:', svg.length);
for (const t of ['emin boydak', 'eminboydak.com', 'BLOG YAZISI']) {
  console.log(JSON.stringify(t), '->', svg.includes(t));
}
const ys = [...svg.matchAll(/<text[^>]*\sy="([0-9.]+)"/g)].map((m) => parseFloat(m[1]));
console.log('text y max:', Math.max(...ys).toFixed(0), '/630');

const ssvg = await satori(
  toS(storyTemplate({ kicker: 'TEST', title: '#1 Ajanlar', sub: 'alt metin' })),
  { width: 1080, height: 1920, fonts: ogFonts() },
);
for (const t of ['Spotify', 'link profilde', 'eminboydak.com']) {
  console.log('story', JSON.stringify(t), '->', ssvg.includes(t));
}
const sys = [...ssvg.matchAll(/<text[^>]*\sy="([0-9.]+)"/g)].map((m) => parseFloat(m[1]));
console.log('story text y max:', Math.max(...sys).toFixed(0), '/1920');
