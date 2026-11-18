// Vendored fonts for OG rendering (no network at build time).
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const FONTS_DIR = join(dirname(fileURLToPath(import.meta.url)), 'fonts');

const load = (name) => readFileSync(join(FONTS_DIR, name));

export function ogFonts() {
  return [
    { name: 'Cinzel', data: load('Cinzel-SemiBold.ttf'), weight: 600, style: 'normal' },
    { name: 'Cinzel', data: load('Cinzel-Bold.ttf'), weight: 700, style: 'normal' },
    { name: 'Inter', data: load('Inter-Regular.ttf'), weight: 400, style: 'normal' },
    { name: 'Inter', data: load('Inter-SemiBold.ttf'), weight: 600, style: 'normal' },
  ];
}

/** Turkish characters that must be covered by the vendored faces (tofu guard). */
export const REQUIRED_GLYPHS = 'ÇĞİÖŞÜçğıöşüâîû';
