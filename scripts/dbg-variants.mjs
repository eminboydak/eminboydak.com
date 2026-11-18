
import satori from 'satori';
import { ogFonts } from '../tools/og/fonts.mjs';
import { OG_TOKENS as T } from '../tools/og/tokens.mjs';
const toS = (n) => { if (!n || typeof n !== 'object') return n; const { type, style, children, ...rest } = n; const props = { ...rest }; if (style !== undefined) props.style = style; if (children !== undefined) props.children = Array.isArray(children) ? children.map(toS) : toS(children); return { type, props }; };
const child = { type: 'div', style: { position: 'absolute', top: 148, left: 64, color: '#e5e5e5', fontSize: 96 }, children: 'Merhaba' };

const cases = {
  base: { width: 1200, height: 630, position: 'relative', backgroundColor: T.ink },
  overflow: { width: 1200, height: 630, position: 'relative', backgroundColor: T.ink, overflow: 'hidden' },
  gradient: { width: 1200, height: 630, position: 'relative', backgroundColor: T.ink, backgroundImage: `radial-gradient(120% 90% at 85% 110%, ${T.glow} 0%, rgba(0,0,0,0) 55%)` },
  gradientOnly: { width: 1200, height: 630, position: 'relative', backgroundImage: `radial-gradient(120% 90% at 85% 110%, ${T.glow} 0%, rgba(0,0,0,0) 55%)` },
};
for (const [name, style] of Object.entries(cases)) {
  try {
    const svg = await satori(toS({ type: 'div', style, children: [child] }), { width: 1200, height: 630, fonts: ogFonts() });
    const paths = (svg.match(/<path/g) || []).length;
    console.log(name, '-> len', svg.length, 'paths', paths, paths >= 1 ? 'OK' : 'BOS!');
  } catch (e) {
    console.log(name, '-> THROW:', String(e).slice(0, 140));
  }
}
