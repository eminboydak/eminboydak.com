// OG design tokens — SINGLE SOURCE OF TRUTH (stancona OG-GENERATOR-001 pattern).
// Tests assert no other OG file hardcodes colors.
export const OG_TOKENS = {
  ink: '#0d0d0d', // onyx page background
  surface: '#161616', // card surface
  line: '#262626', // hairline borders
  gold: '#eed49f', // brand primary
  text: '#e5e5e5', // primary text
  muted: '#8f8f8f', // secondary text
  glow: '#1c1608', // warm dark gold-brown for gradient depth
  goldDim: 'rgba(238,212,159,0.35)', // hairlines / subtle frames
};

export const OG_FACES = {
  display: 'Cinzel', // headings / monogram
  body: 'Inter', // UI + body
};

export const OG_SIZES = {
  width: 1200,
  height: 630,
  storyWidth: 1080,
  storyHeight: 1920,
  storySafeTop: 260, // Instagram story UI safe areas
  storySafeBottom: 360,
};
