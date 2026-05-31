# kohlhofer.com

Static site for [kohlhofer.com](https://kohlhofer.com). Hand-authored HTML, no build step. Deployed via GitHub Pages Actions on push to master.

## Structure

- `index.html` — the splash: positioning statement, proof ladder, essays, doorways, contact.
- `building/index.html` — `/building`, the first cornerstone essay. Evergreen positioning pieces live as hand-authored pages and link out to the deeper writing on notsocommonthoughts.com and the work on fieldbw.com.
- `images/og.png` — 1200×630 social card (rendered from an HTML template via headless Chrome).
- `sitemap.xml` / `robots.txt` — keep these in sync when adding pages.
- `js/theme.js`, `js/analytics.js` — shared, same-origin so the strict CSP stays `script-src 'self'`.

## License

© Alexander Kohlhofer. All rights reserved.
