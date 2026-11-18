// satori (JSX-like object → SVG) + resvg (SVG → PNG). No browser needed.
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { ogFonts } from './fonts.mjs';
import { OG_SIZES as S } from './tokens.mjs';

// Our templates use the compact { type, style, children } shape; satori walks
// { type, props: { style, children } }. Convert recursively.
function toSatori(node) {
  if (node === null || node === undefined || typeof node !== 'object') return node;
  const { type, style, children, ...rest } = node;
  const props = { ...rest };
  if (style !== undefined) props.style = style;
  if (children !== undefined) {
    props.children = Array.isArray(children) ? children.map(toSatori) : toSatori(children);
  }
  return { type, props };
}

export async function renderPng(node, width, height) {
  const svg = await satori(toSatori(node), { width, height, fonts: ogFonts() });
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: width } });
  const png = resvg.render().asPng();
  // PNG IHDR sanity: width/height at bytes16-24
  const w = png.readUInt32BE(16);
  const h = png.readUInt32BE(20);
  if (w !== width || h !== height) {
    throw new Error(`OG size mismatch: expected ${width}×${height}, got ${w}×${h}`);
  }
  return png;
}

export const cardSize = [S.width, S.height];
export const storySize = [S.storyWidth, S.storyHeight];
