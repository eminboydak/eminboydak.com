// One-off: render3 design directions for the OG card + story so the user can pick.
// Output: scratch/ogv-{1,2,3}-card.png + ogv-{1,2,3}-story.png
// Colors come from tokens.mjs (single source) — this file adds NO hex literals.
import { writeFileSync, mkdirSync } from 'node:fs';
import { OG_TOKENS as T, OG_SIZES as S } from '../tools/og/tokens.mjs';
import { ogFonts } from '../tools/og/fonts.mjs';
import { renderPng, cardSize, storySize } from '../tools/og/render.mjs';

const OUT = '/Users/emin/.hermes/profiles/emin/cache/scratch';
mkdirSync(OUT, { recursive: true });

const COVER =
  'data:image/jpeg;base64,' +
  (await import('node:fs')).readFileSync(
    new URL('../public/images/seyir-defteri-cover.jpg', import.meta.url),
  ).toString('base64');

const BLOG = { kicker: 'BLOG YAZISI · 18 KASIM 2026', title: 'Biz de bağlam toplayan bir mekanizma mıyız?' };
const STORY = {
  kicker: "EMIN'IN SEYIR DEFTERI · YENİ BÖLÜM",
  title: '#1 Ajanlar, bağlam ve bir kuru üzüm',
  sub: 'Bir yapay zekâ ajanı, bir hafıza hatası, bir gözlemci meselesi… ve sonunda mango aromalı bir kuru üzüm.',
};

const toS = (n) => {
  if (!n || typeof n !== 'object') return n;
  const { type, style, children, ...rest } = n;
  const props = { ...rest };
  if (style !== undefined) props.style = style;
  if (children !== undefined) props.children = Array.isArray(children) ? children.map(toS) : toS(children);
  return { type, props };
};

// ───────────────────────── V1 · Editorial Type (type-led, gallery "strong typeface" pattern)
function v1Card() {
  return {
    type: 'div',
    style: {
      width: S.width, height: S.height, position: 'relative', backgroundColor: T.ink,
      fontFamily: 'Inter', overflow: 'hidden',
      backgroundImage: `radial-gradient(120% 90% at 85% 110%, ${T.glow} 0%, rgba(0,0,0,0) 55%)`,
    },
    children: [
      // inset hairline frame (premium print feel)
      { type: 'div', style: { position: 'absolute', top: 22, left: 22, right: 22, bottom: 22, border: `1px solid ${T.goldDim}` } },
      // top row
      { type: 'div', style: { position: 'absolute', top: 56, left: 64, fontFamily: 'Inter', fontWeight: 600, fontSize: 22, letterSpacing: 5, color: T.gold }, children: BLOG.kicker },
      { type: 'div', style: { position: 'absolute', top: 56, right: 64, fontFamily: 'Inter', fontWeight: 400, fontSize: 22, color: T.muted }, children: 'eminboydak.com' },
      // THE type moment
      {
        type: 'div',
        style: {
          position: 'absolute', top: 148, left: 64, width: 1010,
          fontFamily: 'Cinzel', fontWeight: 600, fontSize: 96, lineHeight: 1.14, color: T.text, wordBreak: 'break-word',
        },
        children: BLOG.title,
      },
      // bottom
      { type: 'div', style: { position: 'absolute', bottom: 64, left: 64, width: 120, height: 5, backgroundColor: T.gold } },
      { type: 'div', style: { position: 'absolute', bottom: 56, left: 64 + 150, fontFamily: 'Inter', fontWeight: 600, fontSize: 30, color: T.text }, children: 'emin boydak' },
      { type: 'div', style: { position: 'absolute', bottom: 56, right: 64, fontFamily: 'Inter', fontWeight: 400, fontSize: 24, color: T.muted }, children: 'yazıyı oku →' },
    ],
  };
}

function v1Story() {
  return {
    type: 'div',
    style: {
      width: S.storyWidth, height: S.storyHeight, position: 'relative', backgroundColor: T.ink,
      fontFamily: 'Inter', overflow: 'hidden',
      backgroundImage: `radial-gradient(110% 60% at 50% 108%, ${T.glow} 0%, rgba(0,0,0,0) 60%)`,
    },
    children: [
      { type: 'div', style: { position: 'absolute', top: 250, left: 30, right: 30, bottom: 340, border: `1px solid ${T.goldDim}` } },
      { type: 'div', style: { position: 'absolute', top: 320, left: 80, right: 80, textAlign: 'center', fontFamily: 'Inter', fontWeight: 600, fontSize: 26, letterSpacing: 6, color: T.gold }, children: STORY.kicker },
      {
        type: 'div',
        style: { position: 'absolute', top: 470, left: 76, right: 76, textAlign: 'center', fontFamily: 'Cinzel', fontWeight: 600, fontSize: 84, lineHeight: 1.2, color: T.text, wordBreak: 'break-word' },
        children: STORY.title,
      },
      { type: 'img', src: COVER, style: { position: 'absolute', top: 900, left: 330, width: 420, height: 420, objectFit: 'cover', border: `2px solid ${T.goldDim}` } },
      { type: 'div', style: { position: 'absolute', top: 1390, left: 110, right: 110, textAlign: 'center', fontFamily: 'Inter', fontWeight: 400, fontSize: 32, lineHeight: 1.5, color: T.muted }, children: STORY.sub },
      { type: 'div', style: { position: 'absolute', bottom: 400, left: 470, width: 140, height: 5, backgroundColor: T.gold } },
      { type: 'div', style: { position: 'absolute', bottom: 320, left: 80, right: 80, textAlign: 'center', fontFamily: 'Inter', fontWeight: 600, fontSize: 32, color: T.gold }, children: 'Spotify · YouTube · Apple Podcasts' },
      { type: 'div', style: { position: 'absolute', bottom: 268, left: 80, right: 80, textAlign: 'center', fontFamily: 'Inter', fontWeight: 400, fontSize: 28, color: T.muted }, children: 'link profilde · eminboydak.com' },
    ],
  };
}

// ───────────────────────── V2 · Gradient Depth + monogram watermark
function v2Card() {
  return {
    type: 'div',
    style: {
      width: S.width, height: S.height, position: 'relative', backgroundColor: T.ink,
      fontFamily: 'Inter', overflow: 'hidden',
      backgroundImage: `linear-gradient(115deg, ${T.ink} 42%, ${T.glow} 100%)`,
    },
    children: [
      // oversized monogram watermark (brand as design element)
      { type: 'div', style: { position: 'absolute', right: -70, bottom: -190, fontFamily: 'Cinzel', fontWeight: 700, fontSize: 640, lineHeight: 1, color: T.gold, opacity: 0.07 }, children: 'E' },
      { type: 'div', style: { position: 'absolute', top: 60, left: 64, fontFamily: 'Inter', fontWeight: 600, fontSize: 22, letterSpacing: 5, color: T.gold }, children: BLOG.kicker },
      {
        type: 'div',
        style: { position: 'absolute', top: 168, left: 64, width: 760, fontFamily: 'Cinzel', fontWeight: 600, fontSize: 78, lineHeight: 1.18, color: T.text, wordBreak: 'break-word' },
        children: BLOG.title,
      },
      { type: 'div', style: { position: 'absolute', bottom: 64, left: 64, display: 'flex', flexDirection: 'column', gap: 16 },
        children: [
          { type: 'div', style: { width: 120, height: 5, backgroundColor: T.gold } },
          { type: 'div', style: { display: 'flex', gap: 24, alignItems: 'baseline' },
            children: [
              { type: 'div', style: { fontFamily: 'Inter', fontWeight: 600, fontSize: 30, color: T.text }, children: 'emin boydak' },
              { type: 'div', style: { fontFamily: 'Inter', fontWeight: 400, fontSize: 24, color: T.muted }, children: 'eminboydak.com' },
            ] },
        ] },
      { type: 'div', style: { position: 'absolute', top: 60, right: 64, width: 64, height: 64, border: `2px solid ${T.goldDim}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cinzel', fontWeight: 700, fontSize: 34, color: T.gold }, children: 'E' },
    ],
  };
}

function v2Story() {
  return {
    type: 'div',
    style: {
      width: S.storyWidth, height: S.storyHeight, position: 'relative', backgroundColor: T.ink,
      fontFamily: 'Inter', overflow: 'hidden',
      backgroundImage: `linear-gradient(165deg, ${T.ink} 55%, ${T.glow} 100%)`,
    },
    children: [
      { type: 'div', style: { position: 'absolute', right: -160, top: 980, fontFamily: 'Cinzel', fontWeight: 700, fontSize: 760, lineHeight: 1, color: T.gold, opacity: 0.07 }, children: 'E' },
      { type: 'div', style: { position: 'absolute', top: 330, left: 80, right: 80, textAlign: 'center', fontFamily: 'Inter', fontWeight: 600, fontSize: 26, letterSpacing: 6, color: T.gold }, children: STORY.kicker },
      { type: 'div', style: { position: 'absolute', top: 430, left: 76, right: 76, textAlign: 'center', fontFamily: 'Cinzel', fontWeight: 600, fontSize: 76, lineHeight: 1.2, color: T.text, wordBreak: 'break-word' }, children: STORY.title },
      { type: 'img', src: COVER, style: { position: 'absolute', top: 880, left: 340, width: 400, height: 400, objectFit: 'cover', border: `2px solid ${T.goldDim}` } },
      { type: 'div', style: { position: 'absolute', top: 1370, left: 110, right: 110, textAlign: 'center', fontFamily: 'Inter', fontWeight: 400, fontSize: 31, lineHeight: 1.5, color: T.muted }, children: STORY.sub },
      { type: 'div', style: { position: 'absolute', bottom: 350, left: 470, width: 140, height: 5, backgroundColor: T.gold } },
      { type: 'div', style: { position: 'absolute', bottom: 272, left: 80, right: 80, textAlign: 'center', fontFamily: 'Inter', fontWeight: 600, fontSize: 32, color: T.gold }, children: 'Spotify · YouTube · Apple Podcasts' },
      { type: 'div', style: { position: 'absolute', bottom: 268, left: 80, right: 80, textAlign: 'center', opacity: 0 }, children: '.' },
      { type: 'div', style: { position: 'absolute', bottom: 220, left: 80, right: 80, textAlign: 'center', fontFamily: 'Inter', fontWeight: 400, fontSize: 28, color: T.muted }, children: 'link profilde · eminboydak.com' },
    ],
  };
}

// ───────────────────────── V3 · Cinematic cover hero
function v3Card() {
  return {
    type: 'div',
    style: {
      width: S.width, height: S.height, position: 'relative', backgroundColor: T.ink,
      fontFamily: 'Inter', overflow: 'hidden',
      backgroundImage: `radial-gradient(75% 120% at 78% 50%, ${T.glow} 0%, rgba(0,0,0,0) 62%)`,
    },
    children: [
      // letterbox hairlines (cinematic)
      { type: 'div', style: { position: 'absolute', top: 40, left: 0, right: 0, height: 1, backgroundColor: T.goldDim } },
      { type: 'div', style: { position: 'absolute', bottom: 40, left: 0, right: 0, height: 1, backgroundColor: T.goldDim } },
      // hero cover with glow + shadow
      {
        type: 'img', src: COVER,
        style: { position: 'absolute', top: 115, right: 90, width: 400, height: 400, objectFit: 'cover', border: `2px solid ${T.goldDim}` },
      },
      { type: 'div', style: { position: 'absolute', top: 128, left: 72, fontFamily: 'Inter', fontWeight: 600, fontSize: 22, letterSpacing: 5, color: T.gold }, children: BLOG.kicker },
      {
        type: 'div',
        style: { position: 'absolute', top: 210, left: 72, width: 560, fontFamily: 'Cinzel', fontWeight: 600, fontSize: 64, lineHeight: 1.2, color: T.text, wordBreak: 'break-word' },
        children: BLOG.title,
      },
      { type: 'div', style: { position: 'absolute', bottom: 84, left: 72, display: 'flex', gap: 28, alignItems: 'baseline' },
        children: [
          { type: 'div', style: { fontFamily: 'Inter', fontWeight: 600, fontSize: 28, color: T.text }, children: 'emin boydak' },
          { type: 'div', style: { fontFamily: 'Inter', fontWeight: 400, fontSize: 24, color: T.muted }, children: 'eminboydak.com · blog' },
        ] },
    ],
  };
}

function v3Story() {
  return {
    type: 'div',
    style: {
      width: S.storyWidth, height: S.storyHeight, position: 'relative', backgroundColor: T.ink,
      fontFamily: 'Inter', overflow: 'hidden',
      backgroundImage: `radial-gradient(90% 55% at 50% 46%, ${T.glow} 0%, rgba(0,0,0,0) 65%)`,
    },
    children: [
      { type: 'div', style: { position: 'absolute', top: 250, left: 0, right: 0, height: 1, backgroundColor: T.goldDim } },
      { type: 'div', style: { position: 'absolute', bottom: 250, left: 0, right: 0, height: 1, backgroundColor: T.goldDim } },
      { type: 'div', style: { position: 'absolute', top: 330, left: 80, right: 80, textAlign: 'center', fontFamily: 'Inter', fontWeight: 600, fontSize: 26, letterSpacing: 6, color: T.gold }, children: STORY.kicker },
      { type: 'img', src: COVER, style: { position: 'absolute', top: 470, left: 290, width: 500, height: 500, objectFit: 'cover', border: `3px solid ${T.gold}` } },
      { type: 'div', style: { position: 'absolute', top: 1060, left: 76, right: 76, textAlign: 'center', fontFamily: 'Cinzel', fontWeight: 600, fontSize: 68, lineHeight: 1.22, color: T.text, wordBreak: 'break-word' }, children: STORY.title },
      { type: 'div', style: { position: 'absolute', top: 1360, left: 110, right: 110, textAlign: 'center', fontFamily: 'Inter', fontWeight: 400, fontSize: 30, lineHeight: 1.5, color: T.muted }, children: STORY.sub },
      { type: 'div', style: { position: 'absolute', bottom: 320, left: 80, right: 80, textAlign: 'center', fontFamily: 'Inter', fontWeight: 600, fontSize: 32, color: T.gold }, children: 'Spotify · YouTube · Apple Podcasts' },
      { type: 'div', style: { position: 'absolute', bottom: 268, left: 80, right: 80, textAlign: 'center', fontFamily: 'Inter', fontWeight: 400, fontSize: 28, color: T.muted }, children: 'link profilde · eminboydak.com' },
    ],
  };
}

const jobs = [
  ['ogv-1-card.png', v1Card(), cardSize],
  ['ogv-2-card.png', v2Card(), cardSize],
  ['ogv-3-card.png', v3Card(), cardSize],
  ['ogv-1-story.png', v1Story(), storySize],
  ['ogv-2-story.png', v2Story(), storySize],
  ['ogv-3-story.png', v3Story(), storySize],
];
for (const [name, node, [w, h]] of jobs) {
  const png = await renderPng(node, w, h); // renderPng applies toS internally — do NOT double-convert
  writeFileSync(`${OUT}/${name}`, png);
  console.log('✓', name, `${w}×${h}`, png.length, 'bytes');
}
