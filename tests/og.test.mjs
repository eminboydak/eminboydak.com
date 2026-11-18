import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// Rule: tools/og/*.mjs + scripts/gen-og.mjs may not hardcode colors — tokens.mjs is the only source.
test('OG: no color literals outside tokens.mjs', () => {
  const files = [
    ...readdirSync(join(ROOT, 'tools/og')).filter((f) => f.endsWith('.mjs')),
    'gen-og.mjs',
  ].map((f) => (f === 'gen-og.mjs' ? join(ROOT, 'scripts', f) : join(ROOT, 'tools/og', f)));
  const hex = /#[0-9a-fA-F]{6}\b/;
  for (const file of files) {
    if (file.endsWith('tokens.mjs')) continue;
    const src = readFileSync(file, 'utf8');
    assert.ok(!hex.test(src), `${file}: color literal found — use OG_TOKENS`);
  }
});

// Rule: vendored faces + template text must cover Turkish glyphs (tofu guard).
test('OG: tokens expose the theme and fonts are vendored', async () => {
  const { OG_TOKENS, OG_SIZES } = await import('../tools/og/tokens.mjs');
  assert.equal(OG_TOKENS.gold, '#eed49f');
  assert.equal(OG_SIZES.width, 1200);
  assert.equal(OG_SIZES.storyWidth, 1080);
  const { ogFonts, REQUIRED_GLYPHS } = await import('../tools/og/fonts.mjs');
  assert.ok(ogFonts().length >= 4, 'fonts missing');
  assert.ok(REQUIRED_GLYPHS.includes('İ') && REQUIRED_GLYPHS.includes('ş'), 'TR glyph list incomplete');
});

// Smoke: render a small card through satori+resvg with Turkish text.
test('OG: pipeline renders a Turkish card end-to-end', async () => {
  const { cardTemplate } = await import('../tools/og/templates.mjs');
  const { renderPng, cardSize } = await import('../tools/og/render.mjs');
  const png = await renderPng(
    cardTemplate({ kicker: 'PODCAST', title: 'Ajanlar, bağlam ve bir kuru üzüm', cover: false }),
    ...cardSize,
  );
  assert.ok(png.length > 5000, 'png too small');
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630); // IHDR height is at bytes20-23
});
