#!/usr/bin/env node
// Regenerates sitemap.xml by walking the repo. Run after adding or removing a
// page: `node scripts/sitemap-build.mjs`.
//
// kohlhofer.com is served by several repos — this one at the root, plus
// separate Pages repos mounted at /books/, /Crossings/, /midiVol/ and
// /volBar/. Google sees one site, but this generator only knows about the
// files here, so anything from another repo has to be listed by hand in
// EXTRA_URLS below or left out deliberately (see EXCLUDE notes).

import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://kohlhofer.com';

// Directories that never contain indexable pages.
const SKIP_DIRS = new Set([
  '.git', '.github', 'node_modules', 'scripts', 'src',
  'css', 'js', 'images', 'fonts', 'webfonts', 'photos',
]);

// Pages that exist but should not be advertised. Both are "Moved" stubs —
// noindex + canonical + meta refresh — and listing a noindexed URL in the
// sitemap trips "Submitted URL marked noindex" in Search Console.
const EXCLUDE = new Set([
  '/building/',   // → /leading/
  '/photos',      // → fewer.photos/u/alex
]);

// Error pages, in either form — `404.html` and `404/index.html` both occur
// here, so match the segment rather than listing every spelling.
const EXCLUDE_PATTERN = /(^|\/)404\/?$/;

// Sub-repo paths deliberately left out for now:
//   /books/      — 380 thin author pages, 6k impressions but ~6 clicks
//   /Crossings/  — low traffic, owned by its own repo
//   /midiVol/, /volBar/ — retired; they serve a canonical to fieldbw.com
//
// /hex-map/ MUST stay listed. It is the highest-traffic page on the domain and
// it is served by github.com/kohlhofer/hex-map, so the walk above cannot see
// it. It was previously a static copy committed here; that copy was deleted in
// June 2026, Google crawled a 404 on 2026-07-05, dropped the page, and it
// earned nothing for six weeks. Removing this entry would start that again.
// Bump lastmod when that repo ships a change worth recrawling.
const EXTRA_URLS = [
  { path: '/hex-map/', lastmod: '2026-08-03' },
];

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (SKIP_DIRS.has(entry)) continue;
      walk(full, out);
    } else if (entry.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

/** `about.html` → `/about`, `leading/index.html` → `/leading/`. */
function toUrlPath(file) {
  const rel = relative(ROOT, file).split('\\').join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  return `/${rel.replace(/\.html$/, '')}`;
}

// Last commit that touched the file, so lastmod reflects reality rather than
// whenever the generator happened to run.
function lastModified(file) {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', file], {
      cwd: ROOT,
      encoding: 'utf8',
    }).trim();
    if (out) return out;
  } catch {
    // Not committed yet — fall through to mtime.
  }
  return statSync(file).mtime.toISOString().slice(0, 10);
}

const pages = walk(ROOT)
  .map((file) => ({ path: toUrlPath(file), lastmod: lastModified(file) }))
  .filter((p) => !EXCLUDE.has(p.path) && !EXCLUDE_PATTERN.test(p.path))
  .concat(EXTRA_URLS)
  .sort((a, b) => (a.path === '/' ? -1 : b.path === '/' ? 1 : a.path.localeCompare(b.path)));

const body = pages
  .map(
    (p) =>
      `  <url>\n    <loc>${ORIGIN}${p.path}</loc>\n    <lastmod>${p.lastmod}</lastmod>\n  </url>`
  )
  .join('\n');

writeFileSync(
  join(ROOT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
);

console.log(`sitemap.xml — ${pages.length} URLs`);
