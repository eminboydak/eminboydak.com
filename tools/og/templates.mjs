// OG templates — all colors come from tokens.mjs (single source).
// Direction: V2 "Gradient Depth" — chosen by the user (2026-11-18).
// Feedback rules: no frames, no small monogram badge, no "emin boydak" text,
// typographic apostrophe (’), story = cover + short invite only (no platforms,
// no subtitle, no domain) with an empty bottom zone for the link sticker.
// Story uses absolute positioning — satori's flex flow clipped the footer group.
import { OG_TOKENS as T, OG_SIZES as S } from './tokens.mjs';

// Straight ' renders as an odd tick in display type — always use typographic ’.
const smart = (s) => String(s).replace(/'/g, '\u2019');

// Cinzel renders lowercase as capital forms — but with English i→I rules.
// Pre-uppercase with Turkish casing (i→İ, ı→I) so the dotted İ glyph is used.
const upper = (s, locale) =>
  locale === 'tr' ? s.replace(/i/g, 'İ').replace(/ı/g, 'I').toUpperCase() : s.toUpperCase();

const titleSize = (n) => (n > 70 ? 46 : n > 48 ? 56 : n > 30 ? 66 : 76);
const storyTitleSize = (n) => (n > 60 ? 60 : n > 36 ? 70 : 80);

const COVER =
  'data:image/jpeg;base64,' +
  (await import('node:fs')).readFileSync(
    new URL('../../public/images/seyir-defteri-cover.jpg', import.meta.url),
  ).toString('base64');

/**1200×630 share card (LinkedIn / X / OG). */
export function cardTemplate({ kicker, title, cover = false, domain = 'eminboydak.com', locale = 'tr' }) {
  const watermark = cover
    ? null
    : {
        type: 'div',
        style: {
          position: 'absolute',
          right: -70,
          bottom: -190,
          fontFamily: 'Cinzel',
          fontWeight: 700,
          fontSize: 640,
          lineHeight: 1,
          color: T.gold,
          opacity: 0.07,
        },
        children: 'E',
      };

  const media = cover
    ? {
        type: 'img',
        src: COVER,
        style: { position: 'absolute', top: 115, right: 90, width: 400, height: 400, objectFit: 'cover', border: `2px solid ${T.goldDim}` },
      }
    : null;

  return {
    type: 'div',
    style: {
      width: S.width,
      height: S.height,
      position: 'relative',
      backgroundColor: T.ink,
      fontFamily: 'Inter',
      overflow: 'hidden',
      backgroundImage: `linear-gradient(115deg, ${T.ink} 42%, ${T.glow} 100%)`,
    },
    children: [
      watermark,
      media,
      { type: 'div', style: { position: 'absolute', top: 60, left: 64, fontFamily: 'Inter', fontWeight: 600, fontSize: 22, letterSpacing: 5, color: T.gold }, children: smart(kicker) },
      {
        type: 'div',
        style: {
          position: 'absolute',
          top: cover ? 210 : 168,
          left: 64,
          width: cover ? 560 : 780,
          fontFamily: 'Cinzel',
          fontWeight: 600,
          fontSize: cover ? 58 : titleSize(title.length),
          lineHeight: 1.18,
          color: T.text,
          wordBreak: 'break-word',
        },
        children: smart(upper(title, locale)),
      },
      {
        type: 'div',
        style: { position: 'absolute', bottom: 64, left: 64, display: 'flex', flexDirection: 'column', gap: 16 },
        children: [
          { type: 'div', style: { width: 120, height: 5, backgroundColor: T.gold } },
          { type: 'div', style: { fontFamily: 'Inter', fontWeight: 400, fontSize: 24, color: T.muted }, children: smart(domain) },
        ],
      },
    ].filter(Boolean),
  };
}

/**1080×1920 Instagram story — minimal: kicker + title + hero cover + invite.
 *  No platforms, no subtitle, no domain. Bottom ~470px stays EMPTY for the
 *  tappable link sticker the user adds in Instagram. */
export function storyTemplate({ kicker, title, invite, locale = 'tr' }) {
  const W = S.storyWidth;
  return {
    type: 'div',
    style: {
      width: W,
      height: S.storyHeight,
      position: 'relative',
      backgroundColor: T.ink,
      fontFamily: 'Inter',
      overflow: 'hidden',
      backgroundImage: `linear-gradient(165deg, ${T.ink} 55%, ${T.glow} 100%)`,
    },
    children: [
      // oversized monogram watermark (brand as design element)
      { type: 'div', style: { position: 'absolute', right: -160, top: 980, fontFamily: 'Cinzel', fontWeight: 700, fontSize: 760, lineHeight: 1, color: T.gold, opacity: 0.07 }, children: 'E' },
      { type: 'div', style: { position: 'absolute', top: 330, left: 80, right: 80, textAlign: 'center', fontFamily: 'Inter', fontWeight: 600, fontSize: 27, letterSpacing: 6, color: T.gold }, children: smart(kicker) },
      {
        type: 'div',
        style: { position: 'absolute', top: 430, left: 76, right: 76, textAlign: 'center', fontFamily: 'Cinzel', fontWeight: 600, fontSize: storyTitleSize(title.length), lineHeight: 1.2, color: T.text, wordBreak: 'break-word' },
        children: smart(upper(title, locale)),
      },
      // hero cover, centered
      { type: 'img', src: COVER, style: { position: 'absolute', top: 800, left: 320, width: 440, height: 440, objectFit: 'cover', border: `2px solid ${T.goldDim}` } },
      // short invitation (invite, not a description)
      {
        type: 'div',
        style: { position: 'absolute', top: 1310, left: 100, right: 100, textAlign: 'center', fontFamily: 'Inter', fontWeight: 400, fontSize: 32, lineHeight: 1.5, color: T.text },
        children: smart(invite),
      },
      // ← bottom ~470px (y1450+) intentionally EMPTY: link sticker goes here
    ],
  };
}
