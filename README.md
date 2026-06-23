# kohlhofer.com

Static site for [kohlhofer.com](https://kohlhofer.com). Hand-authored HTML, no build step. Deployed via GitHub Pages Actions on push to master.

## Structure

- `index.html` — the splash: positioning statement, proof ladder, essays, doorways, contact.
- `building/index.html`, `leading/index.html` — `/building/` and `/leading/`, the cornerstone essays. Evergreen positioning pieces live as hand-authored pages and link out to the deeper writing on notsocommonthoughts.com and the work on fieldbw.com.
- `catalogue/` — `/catalogue/`, *A Catalogue of the Possible*, a collection of short fictions read like a small Penguin-classic book (title page → preface → contents, then one page per story with prev/contents/next). Unlike the hand-authored pages, this is **generated**: sources are the markdown in `src/catalogue/` (`collection.md` for the front matter, `NN-slug.md` per story) and the build is `scripts/catalogue-build.mjs` (`node scripts/catalogue-build.mjs`, no dependencies). Edit the markdown, re-run, commit the output. Not linked from `index.html` and intentionally left out of `sitemap.xml` — reachable by direct URL only for now. Arrow-key page-turning lives in `js/catalogue.js`.
- `images/og.png` — 1200×630 social card. Source is `src/og.html`; regenerate with `scripts/og-render.sh` after editing it.
- `sitemap.xml` / `robots.txt` — keep these in sync when adding pages. Canonicals use trailing slashes (`/building/`).
- `js/theme.js` — readable source for the theme toggle. It is inlined (minified) into each page's `<head>` and allowed via a CSP `sha256` hash; regenerate the hash with `scripts/theme-hash.sh` if you change it.
- `js/analytics.js` — GA4 init, same-origin and `defer`red.

## License

© Alexander Kohlhofer. All rights reserved.
