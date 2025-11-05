# kohlhofer.github.com

Personal website for Alexander Kohlhofer, showcasing work history, projects, photography, music, and travel.

## About

This is a static website hosted on GitHub Pages at [kohlhofer.com](https://kohlhofer.com).

## Architecture

This site uses a **comprehensive templating system** that eliminates ~90% of code duplication across pages. All common HTML (DOCTYPE, meta tags, CSS links, analytics, etc.) is shared through a base layout, while page-specific content is managed through simple templates and JSON configuration files.

### Directory Structure

```
├── src/
│   ├── layout.html         # Base HTML template (shared across all pages)
│   ├── templates/          # Page content templates (body only)
│   │   ├── index.html
│   │   ├── about.html
│   │   ├── photos.html
│   │   └── ...
│   ├── pages/              # Page configuration files
│   │   ├── index.json      # Title, description, fonts, scripts, etc.
│   │   ├── about.json
│   │   ├── photos.json
│   │   └── ...
│   └── navigation-config.json  # Navigation links & info panels
├── css/
│   ├── main.css            # Main stylesheet
│   ├── music-page.css      # Music page specific styles
│   └── map-page.css        # Map page specific styles
├── build.js                # Build script
├── watch.js                # File watcher for live reload
├── package.json            # Node.js dependencies
├── .github/
│   └── workflows/
│       └── build.yml       # GitHub Actions workflow
└── *.html                  # Generated HTML files (in root)
```

### How It Works

1. **Base Layout** (`src/layout.html`):
   - Single source for all common HTML structure
   - Includes: DOCTYPE, meta tags, CSS links, fonts, analytics
   - Contains placeholders for page-specific content

2. **Page Configurations** (`src/pages/*.json`):
   - Each page has a JSON config file
   - Defines: title, description, viewport settings, fonts, CSS files, scripts
   - Example: `{"title": "About", "fonts": ["Rubik"], "pageCSS": [], "bodyScripts": ["background.js"]}`

3. **Content Templates** (`src/templates/*.html`):
   - Contain only the unique body content for each page
   - No boilerplate, no duplicate code
   - Just the main `<div>` content

4. **Navigation Config** (`src/navigation-config.json`):
   - Defines navigation links for all pages
   - Specifies which pages have info panels
   - Contains info panel content

5. **Build Script** (`build.js`):
   - Reads page configuration files
   - Loads content templates
   - Injects everything into base layout
   - Generates complete HTML files in root directory

6. **GitHub Actions** (`.github/workflows/build.yml`):
   - Automatically builds on push
   - Commits generated files back to repository
   - Ensures site is always up-to-date

## Development

### Prerequisites

- Node.js 14 or higher
- npm

### Setup

```bash
# Install dependencies
npm install

# Build the site
npm run build
```

### Local Development Server with Live Reload

The best way to develop is with the built-in dev server that automatically rebuilds and refreshes:

```bash
# Start dev server with live reload (recommended)
npm start

# Or use the full command
npm run dev
```

This will:
- Build the site initially
- Start a local server at `http://localhost:3000`
- Watch for changes in `src/templates/`, `src/pages/`, `src/navigation-config.json`, and `src/layout.html`
- Automatically rebuild when you save changes
- Live reload your browser automatically

**Alternative (manual refresh):**
```bash
# Build once
npm run build

# Serve with Python (no auto-reload)
python3 -m http.server 8000
```

### Making Changes

#### Updating Page Content

1. Start dev server: `npm start`
2. Edit the content template in `src/templates/yourpage.html` (just the body content!)
3. Save - browser will auto-refresh with your changes!
4. Commit both template and generated files

#### Changing Page Metadata (title, fonts, scripts, etc.)

1. Start dev server: `npm start`
2. Edit the page config in `src/pages/yourpage.json`
3. Update fields like `title`, `description`, `fonts`, `pageCSS`, `bodyScripts`, etc.
4. Save - page will rebuild and browser will refresh!
5. Commit changes

#### Updating Navigation

1. Start dev server: `npm start`
2. Edit `src/navigation-config.json`
3. Save - all pages will rebuild and browser will refresh!
4. Commit changes

#### Adding a New Page

1. Create content template: `src/templates/newpage.html` (body content only)
2. Create page config: `src/pages/newpage.json` (copy from similar page)
3. Add navigation entry to `src/navigation-config.json`
4. Add info panel to `infoPanels` in `src/navigation-config.json` if needed
5. Dev server will auto-rebuild
6. Commit all files

### Manual Build

If you just want to build without running the dev server:

```bash
npm run build
```

## Structure

- **Home** (`index.html`) - Landing page
- **Me** (`about.html`) - Career history and professional background
- **Map** (`map.html`) - Interactive D3.js map showing cities lived/worked in and places visited
- **Bits** (`bits.html`) - Collection of side projects and experiments
- **Music** (`music.html`) - Electronic music created with hardware instruments
- **Photos** (`photos.html`) - Photography gallery

## Features

### Navigation Component

The shared navigation component:
- Automatically highlights the active page
- Shows "info" badge for pages with info panels
- Supports dark mode (on photos page)
- Configured via `src/navigation-config.json`

### Info Panels

Some pages (Photos, Music, Map) have collapsible info panels:
- Toggle by clicking the active nav link
- Close with the × button
- Content defined in `src/navigation-config.json`

## Deployment

The site is deployed to **GitHub Pages** and builds automatically:

1. Push changes to the repository
2. GitHub Actions runs the build script
3. Generated HTML files are committed
4. GitHub Pages serves the updated site

**Note**: Generated HTML files are committed to the repository to ensure they're available for GitHub Pages deployment.

## Technologies

- Vanilla HTML, CSS, JavaScript
- D3.js for map visualization
- Font Awesome icons
- Google Fonts (Rubik, Inter)
- Node.js for build tooling

## License

© Alexander Kohlhofer. All rights reserved.
