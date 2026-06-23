#!/usr/bin/env node
//
// Build /catalogue/ — a Penguin-classic-style reading collection — from the
// markdown sources in src/catalogue/. No dependencies.
//
//   node scripts/catalogue-build.mjs
//
// Sources:
//   src/catalogue/collection.md   front matter (title, epigraph, preface, contents)
//   src/catalogue/NN-slug.md       one short fiction each (# Title + prose)
//
// Output (committed; GitHub Pages serves it as-is, no CI build step):
//   catalogue/index.html           title page + preface + contents
//   catalogue/<slug>/index.html     one page per story, with prev/contents/next
//
// The page <head> mirrors the rest of the site: same strict CSP, the same
// inlined theme script (so the existing CSP sha256 hash stays valid), GA, and
// fonts. If you change the theme script, mirror js/theme.js and regenerate the
// hash with scripts/theme-hash.sh — here and on every other page.

import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(ROOT, 'src', 'catalogue')
const OUT = join(ROOT, 'catalogue')
const BASE = '/catalogue'               // URL base under the site root
const ORIGIN = 'https://kohlhofer.com'
const OG_IMAGE = `${ORIGIN}/images/og.png`

// ---------------------------------------------------------------------------
// Shared <head> pieces, copied verbatim from the other pages so the strict CSP
// (whose sha256 covers the theme script) stays valid. Do not edit in isolation.
// ---------------------------------------------------------------------------

const CSP = `default-src 'none'; style-src 'unsafe-inline'; img-src 'self' https://www.google-analytics.com https://www.googletagmanager.com; font-src 'self'; script-src 'self' 'sha256-1/5XL7CFoY1wvZP7Ua3RkWsX7uCebD/oBlQR+lLBEqE=' https://www.googletagmanager.com; connect-src https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com; base-uri 'self'; form-action 'none'`

const THEME_SCRIPT = `<script>(function(){try{var s=localStorage.getItem("theme");if(s==="dark"||s==="light")document.documentElement.setAttribute("data-theme",s)}catch(e){}function f(){var t=document.documentElement.getAttribute("data-theme");if(t==="dark"||t==="light")return t;return window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function w(){var b=document.querySelector(".theme-toggle");if(!b)return;var y=function(){b.setAttribute("aria-pressed",String(f()==="dark"))};y();b.addEventListener("click",function(){var n=f()==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",n);try{localStorage.setItem("theme",n)}catch(e){}y()})}if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",w)}else{w()}})();</script>`

const GA = `<script async src="https://www.googletagmanager.com/gtag/js?id=G-60NZPJR7DZ"></script>
  <script defer src="/js/analytics.js"></script>`

const THEME_TOGGLE = `<button type="button" class="theme-toggle" aria-label="Toggle dark mode" aria-pressed="false">
    <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
    <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2"/>
      <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  </button>`

const ARROW_RIGHT = `<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h13M12 5l7 7-7 7"/></svg>`
const ARROW_LEFT = `<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H6M12 5l-7 7 7 7"/></svg>`
// A story page's running head goes UP to the contents, not back — a list glyph,
// not a back-arrow, so the signifier matches the destination.
const CONTENTS_ICON = `<svg class="running-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h10"/></svg>`

// ---------------------------------------------------------------------------
// Styles — one block, inlined on every page (external CSS is blocked by the
// CSP). Two typefaces, Vignelli-style: Inter for the small tracked labels (the
// "cover" voice) and a system serif for the reading itself (the "interior").
// ---------------------------------------------------------------------------

const CSS = `
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 100 900;
      font-display: swap;
      src: url('/fonts/inter-variable.woff2') format('woff2');
    }

    :root {
      --bg: #f9f9f7;
      --fg: #1a1a17;
      --fg-muted: #6b6b66;
      --accent: #c8502d;
      --rule: color-mix(in srgb, var(--fg-muted) 28%, transparent);

      --serif: 'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, 'Times New Roman', serif;
      --sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

      --size-label: 0.75rem;
      --size-small: 0.8125rem;
      --size-body: 1.225rem;
      --measure: 34rem;
    }

    @media (prefers-color-scheme: dark) {
      :root:not([data-theme="light"]) {
        --bg: #14130f;
        --fg: #e9e7df;
        --fg-muted: #a6a39a;
        --accent: #ec8a5f;
      }
    }
    :root[data-theme="dark"] {
      --bg: #14130f;
      --fg: #e9e7df;
      --fg-muted: #a6a39a;
      --accent: #ec8a5f;
    }
    :root[data-theme="light"] {
      --bg: #f9f9f7;
      --fg: #1a1a17;
      --fg-muted: #6b6b66;
      --accent: #c8502d;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background-color: var(--bg);
      color: var(--fg);
      font-family: var(--serif);
      font-size: var(--size-body);
      line-height: 1.7;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
      font-kerning: normal;
      overflow-wrap: break-word;
      padding: clamp(2.5rem, 7vw, 5.5rem) clamp(1.25rem, 6vw, 2rem) 7rem;
    }

    .page { max-width: var(--measure); margin: 0 auto; }

    /* the small tracked labels — the "cover/spine" voice */
    .eyebrow, .running, .nav-label, .toc-num, .back {
      font-family: var(--sans);
      font-size: var(--size-label);
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }

    /* top-of-page link: Home on the title page, the collection on a story page */
    .running {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      color: var(--accent);
      text-decoration: none;
    }
    .running:hover .running-label { text-decoration: underline; text-underline-offset: 3px; }
    .running:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }
    .running .arrow, .running .running-icon { width: 0.95rem; height: 0.95rem; flex: none; }

    /* ---- title page ---- */
    .cover { margin-top: 3rem; }
    .cover .eyebrow { color: var(--accent); display: block; }
    .cover .band { width: 2.25rem; height: 3px; background: var(--accent); border-radius: 2px; margin-bottom: 1.25rem; }

    .title {
      margin-top: 0.9rem;
      font-size: clamp(2.4rem, 7vw, 3.6rem);
      font-weight: 600;
      letter-spacing: -0.02em;
      line-height: 1.04;
      text-wrap: balance;
    }
    .subtitle {
      margin-top: 0.85rem;
      font-style: italic;
      font-size: 1.25rem;
      color: var(--fg-muted);
    }

    .epigraph {
      margin-top: 2.75rem;
      padding-top: 2.25rem;
      border-top: 1px solid var(--rule);
      font-style: italic;
      line-height: 1.55;
      color: var(--fg);
    }
    .epigraph p { margin: 0; }
    .epigraph .attribution {
      margin-top: 0.9rem;
      font-style: normal;
      font-size: var(--size-small);
      color: var(--fg-muted);
    }

    .preface { margin-top: 3rem; }
    .preface .eyebrow { color: var(--fg-muted); display: block; margin-bottom: 0.9rem; }
    .preface p { margin-top: 1.4rem; }
    .preface p:first-of-type { margin-top: 0; }
    .preface .sign { margin-top: 1.9rem; font-style: italic; color: var(--fg-muted); }

    /* ---- contents ---- */
    .contents { margin-top: 3.5rem; padding-top: 2.25rem; border-top: 1px solid var(--rule); }
    .contents .eyebrow { color: var(--fg-muted); display: block; margin-bottom: 1.5rem; }
    .toc { list-style: none; }
    .toc li { padding: 0.95rem 0; border-top: 1px solid var(--rule); }
    .toc li:first-child { border-top: 0; }
    .toc a { text-decoration: none; color: var(--fg); display: grid; grid-template-columns: 2.4rem 1fr; column-gap: 0.6rem; align-items: baseline; }
    .toc-num { color: var(--fg-muted); font-size: 0.7rem; padding-top: 0.18rem; }
    .toc-title { font-size: 1.35rem; font-weight: 600; letter-spacing: -0.01em; line-height: 1.2; }
    .toc-blurb { grid-column: 2; margin-top: 0.3rem; font-style: italic; font-size: 1.0625rem; color: var(--fg-muted); line-height: 1.45; }
    .toc a .toc-num, .toc a .toc-title { transition: color 0.12s ease; }
    .toc a:hover .toc-title { color: var(--accent); }
    .toc a:hover .toc-num { color: var(--accent); }
    .toc a:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; border-radius: 2px; }

    /* ---- story page ---- */
    .story-head { margin-top: 2.75rem; }
    .story-num {
      font-family: var(--sans);
      font-size: var(--size-label);
      font-weight: 600;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--accent);
    }
    .story-title {
      margin-top: 0.7rem;
      font-size: clamp(2rem, 5.5vw, 2.9rem);
      font-weight: 600;
      letter-spacing: -0.02em;
      line-height: 1.08;
      text-wrap: balance;
    }
    .story-blurb {
      margin-top: 0.85rem;
      font-style: italic;
      font-size: 1.1875rem;
      color: var(--fg-muted);
      line-height: 1.45;
    }

    .prose { margin-top: 2.5rem; }
    .prose p { margin-top: 1.5rem; }
    .prose p:first-child { margin-top: 0; }
    .prose em { font-style: italic; }
    .prose strong { font-weight: 600; }

    /* drop cap on the opening paragraph — a classic-fiction flourish.
       Fallback (older browsers): a floated, manually-sized letter. Modern
       browsers use initial-letter, which sizes per-font so it stays aligned
       across the serif fallback chain. Weight is left to inherit (these serifs
       have no 600, so an explicit 600 would snap to bold and out-shout the h1). */
    .prose p.lead::first-letter {
      font-size: 3.3em;
      line-height: 0.7;
      float: left;
      padding: 0.04em 0.09em 0 0;
    }
    @supports (initial-letter: 3) or (-webkit-initial-letter: 3) {
      .prose p.lead::first-letter {
        -webkit-initial-letter: 3 1;
        initial-letter: 3 1;
        font-size: inherit;
        line-height: inherit;
        float: none;
        padding: 0;
        margin-right: 0.08em;
      }
    }

    /* scene break: a centred, spaced asterism, like turning a page within */
    hr.scene {
      border: 0;
      height: auto;
      margin: 3.25rem 0;
      text-align: center;
    }
    hr.scene::before {
      content: "\\002A \\00A0 \\002A \\00A0 \\002A";
      color: var(--fg-muted);
      letter-spacing: 0.35em;
      font-size: 0.9rem;
    }

    /* ---- foot navigation: prev / contents / next ---- */
    .pager {
      margin-top: 4rem;
      padding-top: 1.75rem;
      border-top: 1px solid var(--rule);
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 1rem;
      align-items: start;
    }
    .pager a { text-decoration: none; color: var(--fg); display: inline-flex; flex-direction: column; gap: 0.3rem; }
    .pager .prev { grid-column: 1; }
    .pager .toc-link { grid-column: 2; align-self: center; }
    .pager .next { grid-column: 3; text-align: right; align-items: flex-end; }
    .pager .nav-label { color: var(--accent); display: inline-flex; align-items: center; gap: 0.35rem; }
    .pager .nav-label .arrow { width: 0.9rem; height: 0.9rem; }
    .pager .nav-title { font-size: 1.0625rem; font-weight: 600; letter-spacing: -0.01em; line-height: 1.2; overflow-wrap: break-word; }
    .pager .toc-link { text-align: center; align-items: center; }
    .pager .toc-link .nav-label { letter-spacing: 0.14em; }
    .pager .toc-link .nav-title { font-weight: 500; color: var(--fg-muted); font-style: italic; font-size: 1rem; }
    .pager a:hover .nav-title { color: var(--accent); }
    .pager a:hover .next-arrow { transform: translateX(3px); }
    .pager a:hover .prev-arrow { transform: translateX(-3px); }
    .pager .arrow { transition: transform 0.15s ease; }
    .pager a:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; border-radius: 2px; }

    /* legible "you are at an end" markers instead of a silent empty slot */
    .pager .end-marker { display: inline-flex; flex-direction: column; gap: 0.3rem; color: var(--fg-muted); }
    .pager .end-marker .nav-label { color: var(--fg-muted); }
    .pager .end-marker .nav-title { font-weight: 500; font-style: italic; color: var(--fg-muted); }
    .pager .prev.end-marker { grid-column: 1; }
    .pager .next.end-marker { grid-column: 3; text-align: right; align-items: flex-end; }

    /* quiet keyboard hint — only where a physical keyboard/pointer exists */
    .pager-hint { margin-top: 1.1rem; color: var(--fg-muted); font-family: var(--sans); font-size: var(--size-small); display: none; }
    .pager-hint kbd { font-family: var(--sans); font-weight: 600; padding: 0.05em 0.4em; border: 1px solid var(--rule); border-radius: 4px; font-size: 0.95em; }
    @media (hover: hover) and (pointer: fine) { .pager-hint { display: block; } }

    .colophon {
      margin-top: 4rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--rule);
      color: var(--fg-muted);
      font-family: var(--sans);
      font-size: var(--size-small);
    }

    /* ---- theme toggle (shared with the rest of the site) ---- */
    .theme-toggle {
      position: fixed;
      right: clamp(1rem, 4vw, 2rem);
      bottom: clamp(1rem, 4vw, 2rem);
      width: 2.25rem; height: 2.25rem;
      display: inline-flex; align-items: center; justify-content: center;
      padding: 0; background: none; border: none; border-radius: 50%;
      color: var(--fg-muted); cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      transition: color 0.15s ease;
    }
    .theme-toggle:hover { color: var(--fg); }
    .theme-toggle:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }
    .theme-toggle svg { width: 20px; height: 20px; display: block; }
    .theme-toggle .icon-sun { display: none; }
    .theme-toggle .icon-moon { display: block; }
    @media (prefers-color-scheme: dark) {
      :root:not([data-theme="light"]) .theme-toggle .icon-moon { display: none; }
      :root:not([data-theme="light"]) .theme-toggle .icon-sun { display: block; }
    }
    :root[data-theme="dark"] .theme-toggle .icon-moon { display: none; }
    :root[data-theme="dark"] .theme-toggle .icon-sun { display: block; }
    :root[data-theme="light"] .theme-toggle .icon-moon { display: block; }
    :root[data-theme="light"] .theme-toggle .icon-sun { display: none; }

    @media (max-width: 32rem) {
      .pager { grid-template-columns: 1fr; }
      .pager .prev, .pager .toc-link, .pager .next { grid-column: 1; text-align: left; align-items: flex-start; }
      .pager .next { text-align: left; }
      .toc a { grid-template-columns: 2rem 1fr; }
    }`

// ---------------------------------------------------------------------------
// Tiny markdown helpers (the sources use only: # title, paragraphs, --- breaks,
// *italic*, **bold**, and em dashes).
// ---------------------------------------------------------------------------

const escHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const escAttr = (s) => escHtml(s).replace(/"/g, '&quot;')

function inline(s) {
  return escHtml(s)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
}

// blocks separated by blank lines; within a block, soft line breaks join.
function blocks(md) {
  return md.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean)
}
const joinLines = (b) => b.split('\n').map((l) => l.trim()).join(' ')

function renderProse(md) {
  const body = md.replace(/^#\s+.*(?:\n|$)/, '') // drop the leading # Title
  let lead = true
  return blocks(body)
    .map((b) => {
      if (/^-{3,}$/.test(b)) return '<hr class="scene">'
      const h = b.match(/^(#{1,6})\s+(.*)$/)
      if (h) return `<h${Math.min(h[1].length + 1, 6)}>${inline(h[2])}</h${Math.min(h[1].length + 1, 6)}>`
      const cls = lead ? ' class="lead"' : ''
      lead = false
      return `<p${cls}>${inline(joinLines(b))}</p>`
    })
    .join('\n      ')
}

// ---------------------------------------------------------------------------
// Parse the collection front matter from src/stories/collection.md
// ---------------------------------------------------------------------------

function parseCollection() {
  const md = readFileSync(join(SRC, 'collection.md'), 'utf8')
  const lines = md.split('\n')

  const title = (md.match(/^#\s+(.+)$/m) || [, 'Stories'])[1].trim()
  const subtitle = (md.match(/^\*([^*]+)\*\s*$/m) || [, 'stories'])[1].trim()

  // epigraph: the leading blockquote; the line beginning with an em dash is the source
  const quoteLines = lines.filter((l) => /^>\s?/.test(l)).map((l) => l.replace(/^>\s?/, ''))
  let epigraph = '', attribution = ''
  for (const l of quoteLines) {
    if (/^[—-]\s/.test(l)) attribution += (attribution ? ' ' : '') + l.replace(/^[—-]\s/, '')
    else epigraph += (epigraph ? ' ' : '') + l
  }

  // preface: blocks under "## Foreword" up to the next "##"
  const noteStart = md.search(/^##\s+Foreword/m)
  let preface = []
  if (noteStart !== -1) {
    const after = md.slice(noteStart).replace(/^##\s+.*(?:\n|$)/, '')
    const next = after.search(/^##\s/m)
    preface = blocks(next === -1 ? after : after.slice(0, next))
      .map((b) => joinLines(b))
      .filter((b) => !/^-{3,}$/.test(b))
  }

  // contents: "N. [Title](NN-slug.md) — *blurb.*"
  const entries = []
  const re = /^\d+\.\s+\[([^\]]+)\]\(([^)]+)\)\s*—\s*\*([^*]+)\*/gm
  let m
  while ((m = re.exec(md))) {
    const file = m[2].trim()
    entries.push({
      file,
      slug: file.replace(/^\d+-/, '').replace(/\.md$/, ''),
      title: m[1].trim(),
      blurb: m[3].trim(),
    })
  }
  return { title, subtitle, epigraph, attribution, preface, entries }
}

// ---------------------------------------------------------------------------
// Page assembly
// ---------------------------------------------------------------------------

function head({ title, description, canonical, ogType, prev, next, storyJs }) {
  const links = []
  if (prev) links.push(`  <link rel="prev" href="${escAttr(prev)}">`)
  if (next) links.push(`  <link rel="next" href="${escAttr(next)}">`)
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="Content-Security-Policy" content="${CSP}">
  <title>${escHtml(title)}</title>
  <meta name="description" content="${escAttr(description)}">
  <meta name="author" content="Alexander Kohlhofer">
  <link rel="canonical" href="${escAttr(canonical)}">
  <link rel="author" href="${ORIGIN}/">
  <link rel="preload" as="font" type="font/woff2" href="/fonts/inter-variable.woff2" crossorigin>
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/favicon.ico" sizes="32x32">
${links.length ? links.join('\n') + '\n' : ''}
  <meta property="og:type" content="${ogType}">
  <meta property="og:site_name" content="Alexander Kohlhofer">
  <meta property="og:url" content="${escAttr(canonical)}">
  <meta property="og:title" content="${escAttr(title)}">
  <meta property="og:description" content="${escAttr(description)}">
  <meta property="og:image" content="${OG_IMAGE}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escAttr(title)}">
  <meta name="twitter:description" content="${escAttr(description)}">
  <meta name="twitter:image" content="${OG_IMAGE}">

  ${THEME_SCRIPT}

  ${GA}

  <style>${CSS}
  </style>
</head>`
}

function buildIndex(col) {
  const description = 'A Catalogue of the Possible — twenty-four short fictions about judgment, attention, and what is worth making real once nothing is hard to make.'
  const toc = col.entries
    .map((e, i) => {
      const n = String(i + 1).padStart(2, '0')
      return `        <li>
          <a href="${BASE}/${e.slug}/">
            <span class="toc-num">${n}</span>
            <span class="toc-title">${escHtml(e.title)}</span>
            <span class="toc-blurb">${inline(e.blurb)}</span>
          </a>
        </li>`
    })
    .join('\n')

  const preface = col.preface
    .map((p) => (/^[—-]\s*\S/.test(p) && p.length < 40
      ? `        <p class="sign">${inline(p)}</p>`
      : `        <p>${inline(p)}</p>`))
    .join('\n')

  return `${head({
    title: `${col.title} — Alexander Kohlhofer`,
    description,
    canonical: `${ORIGIN}${BASE}/`,
    ogType: 'website',
  })}
<body>
  <main class="page">
    <a class="running" href="/">
      ${ARROW_LEFT}
      <span class="running-label">Home</span>
    </a>

    <header class="cover">
      <span class="eyebrow">Stories</span>
      <h1 class="title">${escHtml(col.title)}</h1>
      <p class="subtitle">${escHtml(col.subtitle)}</p>
      <div class="epigraph">
        <p>${inline(col.epigraph)}</p>
        <p class="attribution">${inline(col.attribution)}</p>
      </div>
    </header>

    <section class="preface" aria-label="Foreword">
      <span class="eyebrow">Foreword</span>
${preface}
    </section>

    <nav class="contents" aria-label="Contents">
      <span class="eyebrow">Contents</span>
      <ol class="toc">
${toc}
      </ol>
    </nav>

    <footer class="colophon">© Alexander Kohlhofer</footer>
  </main>

  ${THEME_TOGGLE}
</body>
</html>
`
}

function buildStory(col, i) {
  const e = col.entries[i]
  const prev = col.entries[i - 1]
  const next = col.entries[i + 1]
  const md = readFileSync(join(SRC, e.file), 'utf8')
  const fileTitle = (md.match(/^#\s+(.+)$/m) || [, e.title])[1].trim()
  const prose = renderProse(md)
  const num = String(i + 1).padStart(2, '0')

  // Root-relative so the arrow-key nav (which reads these via link.href) resolves
  // against the current origin — works on localhost preview and in production alike.
  const prevUrl = prev ? `${BASE}/${prev.slug}/` : ''
  const nextUrl = next ? `${BASE}/${next.slug}/` : ''

  const prevHtml = prev
    ? `      <a class="prev" href="${BASE}/${prev.slug}/" rel="prev">
        <span class="nav-label">${ARROW_LEFT.replace('class="arrow"', 'class="arrow prev-arrow"')} Previous</span>
        <span class="nav-title">${escHtml(prev.title)}</span>
      </a>`
    : `      <span class="prev end-marker">
        <span class="nav-label">Start</span>
        <span class="nav-title">The beginning</span>
      </span>`

  const nextHtml = next
    ? `      <a class="next" href="${BASE}/${next.slug}/" rel="next">
        <span class="nav-label">Next ${ARROW_RIGHT.replace('class="arrow"', 'class="arrow next-arrow"')}</span>
        <span class="nav-title">${escHtml(next.title)}</span>
      </a>`
    : `      <span class="next end-marker">
        <span class="nav-label">End</span>
        <span class="nav-title">The end</span>
      </span>`

  return `${head({
    title: `${fileTitle} — ${col.title}`,
    description: e.blurb,
    canonical: `${ORIGIN}${BASE}/${e.slug}/`,
    ogType: 'article',
    prev: prevUrl,
    next: nextUrl,
  })}
<body>
  <article class="page">
    <a class="running" href="${BASE}/" aria-label="Contents — ${escAttr(col.title)}">
      ${CONTENTS_ICON}
      <span class="running-label">${escHtml(col.title)}</span>
    </a>

    <header class="story-head">
      <p class="story-num" aria-label="Story ${i + 1} of ${col.entries.length}"><span aria-hidden="true">${num} · of ${col.entries.length}</span></p>
      <h1 class="story-title">${escHtml(fileTitle)}</h1>
      <p class="story-blurb">${inline(e.blurb)}</p>
    </header>

    <div class="prose">
      ${prose}
    </div>

    <nav class="pager" aria-label="More stories">
${prevHtml}
      <a class="toc-link" href="${BASE}/">
        <span class="nav-label">Contents</span>
        <span class="nav-title">${escHtml(col.title)}</span>
      </a>
${nextHtml}
    </nav>
    <p class="pager-hint" aria-hidden="true">Use the <kbd>←</kbd> and <kbd>→</kbd> keys to turn the page.</p>

    <footer class="colophon">© Alexander Kohlhofer</footer>
  </article>

  ${THEME_TOGGLE}
  <script defer src="/js/catalogue.js"></script>
</body>
</html>
`
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

const col = parseCollection()
if (col.entries.length === 0) throw new Error('No contents parsed from collection.md')

rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })
writeFileSync(join(OUT, 'index.html'), buildIndex(col))

for (let i = 0; i < col.entries.length; i++) {
  const dir = join(OUT, col.entries[i].slug)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), buildStory(col, i))
}

console.log(`Built ${BASE}/ — title page + ${col.entries.length} stories.`)
for (const e of col.entries) console.log(`  ${BASE}/${e.slug}/`)
