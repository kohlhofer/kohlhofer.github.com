# kohlhofer.com

Static site for [kohlhofer.com](https://kohlhofer.com). Hand-authored HTML, no build step. Deployed via GitHub Pages Actions on push to master.

## Structure

- `index.html` — the splash: positioning statement, proof ladder, essays, doorways, contact.
- `building/index.html`, `leading/index.html` — `/building/` and `/leading/`, the cornerstone essays. Evergreen positioning pieces live as hand-authored pages and link out to the deeper writing on notsocommonthoughts.com and the work on fieldbw.com.
- `images/og.png` — 1200×630 social card. Source is `src/og.html`; regenerate with `scripts/og-render.sh` after editing it.
- `sitemap.xml` / `robots.txt` — keep these in sync when adding pages. Canonicals use trailing slashes (`/building/`).
- `js/theme.js` — readable source for the theme toggle. It is inlined (minified) into each page's `<head>` and allowed via a CSP `sha256` hash; regenerate the hash with `scripts/theme-hash.sh` if you change it.
- `js/analytics.js` — GA4 init, same-origin and `defer`red.

## License

© Alexander Kohlhofer. All rights reserved.
