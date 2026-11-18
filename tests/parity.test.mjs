import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Minimal frontmatter parser: `key: value`, quoted values, and `|-` block scalars. */
function frontmatter(path) {
  const raw = readFileSync(path, 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!m) throw new Error(`no frontmatter: ${path}`);
  const out = {};
  const lines = m[1].split('\n');
  for (let i = 0; i < lines.length; i++) {
    const km = lines[i].match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (!km) continue;
    const [, key, rest] = km;
    if (rest === '|-' || rest === '|') {
      const block = [];
      while (i + 1 < lines.length && /^(\s+|\t)/.test(lines[i + 1])) {
        block.push(lines[++i].trim());
      }
      out[key] = block.join(' ');
    } else {
      out[key] = rest.replace(/^["']|["']$/g, '');
    }
  }
  return out;
}

function list(dir) {
  const abs = join(ROOT, dir);
  if (!existsSync(abs)) return [];
  return readdirSync(abs).filter((f) => f.endsWith('.md')).sort();
}

function ids(dir) {
  return list(dir).map((f) => f.replace(/\.md$/, ''));
}

function read(rel) {
  return readFileSync(join(ROOT, rel), 'utf8');
}

const LOCALES = ['tr', 'en'];

// ---------------------------------------------------------------- content parity

for (const kind of ['shows', 'episodes']) {
  test(`${kind}: TR and EN have the same files`, () => {
    const tr = ids(`src/content/${kind}/tr`);
    const en = ids(`src/content/${kind}/en`);
    assert.deepEqual(tr, en, `${kind}: locale file sets differ`);
    assert.ok(tr.length > 0, `${kind}: no files found`);
  });
}

test('shows: shared link fields are identical across locales', () => {
  for (const id of ids('src/content/shows/tr')) {
    const tr = frontmatter(join(ROOT, 'src/content/shows/tr', `${id}.md`));
    const en = frontmatter(join(ROOT, 'src/content/shows/en', `${id}.md`));
    for (const key of ['rss', 'youtube', 'spotify', 'apple']) {
      assert.equal(tr[key], en[key], `show ${id}: "${key}" differs between locales`);
    }
    assert.ok(tr.title && en.title, `show ${id}: title missing`);
    assert.ok(tr.description && en.description, `show ${id}: description missing`);
  }
});

test('episodes: numbering, duration and links match across locales', () => {
  for (const id of ids('src/content/episodes/tr')) {
    const tr = frontmatter(join(ROOT, 'src/content/episodes/tr', `${id}.md`));
    const en = frontmatter(join(ROOT, 'src/content/episodes/en', `${id}.md`));
    for (const key of ['show', 'number', 'duration', 'spotifyUrl', 'youtubeId']) {
      assert.equal(tr[key], en[key], `episode ${id}: "${key}" differs between locales`);
    }
    assert.ok(tr.description && en.description, `episode ${id}: description missing`);
    assert.match(tr.duration ?? '', /^\d{2}:\d{2}$/, `episode ${id}: duration must be HH:MM`);
    assert.match(tr.spotifyUrl ?? '', /^https:\/\//, `episode ${id}: spotifyUrl must be https`);
  }
});

test('blog: every podcast-tagged post exists in both locales', () => {
  const tagged = (loc) =>
    list(`src/content/posts/${loc}`).filter((f) =>
      frontmatter(join(ROOT, `src/content/posts/${loc}`, f)).tags?.includes('podcast'),
    );
  const trTagged = tagged('tr');
  const enTagged = tagged('en');
  assert.ok(trTagged.length > 0, 'no podcast-tagged TR posts');
  assert.ok(enTagged.length > 0, 'no podcast-tagged EN posts');
  // pairing rule: equal publishDate sets between locales for podcast-tagged posts
  const dates = (fs, loc) =>
    fs.map((f) => frontmatter(join(ROOT, `src/content/posts/${loc}`, f)).publishDate).sort();
  assert.deepEqual(dates(trTagged, 'tr'), dates(enTagged, 'en'), 'podcast posts: publishDate sets differ');
});

// ---------------------------------------------------------------- template parity

const TEMPLATE_RULES = [
  ['show artwork', 'w-56 h-56'],
  ['centered artwork', 'mx-auto'],
  ['episode description NOT rendered on show page', 'set:html={ep.data.description}'],
  ['play triangle fixed', 'points="6,3 21,12 6,21"'],
  ['broken triangle absent', 'points="6321212119"'], // must NOT appear (checked inversely below)
  ['rss button', 'show.data.rss'],
  ['apple button', 'show.data.apple'],
  ['date parsing', 'new Date(ep.data.publishDate)'],
];

for (const loc of LOCALES) {
  const slugPath = loc === 'tr' ? 'src/pages/podcast/[slug].astro' : 'src/pages/en/podcast/[slug].astro';
  const indexPath = loc === 'tr' ? 'src/pages/podcast/index.astro' : 'src/pages/en/podcast/index.astro';

  test(`templates(${loc}): show page carries every parity feature`, () => {
    const src = read(slugPath);
    for (const [name, needle] of TEMPLATE_RULES) {
      if (name === 'broken triangle absent' || name.includes('NOT rendered')) {
        assert.ok(!src.includes(needle), `${slugPath}: ${name} — found ${needle}`);
      } else {
        assert.ok(src.includes(needle), `${slugPath}: missing ${name} (${needle})`);
      }
    }
  });

  test(`templates(${loc}): index page has artwork and subscribe buttons`, () => {
    const src = read(indexPath);
    assert.ok(src.includes('seyir-defteri-cover.jpg'), `${indexPath}: missing artwork`);
    assert.ok(src.includes('s.data.rss'), `${indexPath}: missing rss button`);
    assert.ok(src.includes('s.data.apple'), `${indexPath}: missing apple button`);
    assert.ok(!src.includes('points="6321212119"'), `${indexPath}: broken polygon present`);
  });
}

test('templates: both blog locales render the podcast CTA for podcast-tagged posts', () => {
  for (const p of ['src/pages/blog/[slug].astro', 'src/pages/en/blog/[slug].astro']) {
    const src = read(p);
    assert.ok(src.includes('PodcastCTA'), `${p}: missing PodcastCTA import/usage`);
    assert.ok(src.includes("tags?.includes('podcast')"), `${p}: CTA not gated by podcast tag`);
  }
});

test('templates: TR and EN show pages define the same feature set', () => {
  const tr = read('src/pages/podcast/[slug].astro');
  const en = read('src/pages/en/podcast/[slug].astro');
  const features = TEMPLATE_RULES.filter(([, n]) => n !== 'points="6321212119"').map(([, n]) => n);
  for (const f of features) {
    assert.equal(tr.includes(f), en.includes(f), `feature "${f}" present in only one locale`);
  }
});
