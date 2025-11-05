# kohlhofer.github.com

Personal website for Alexander Kohlhofer, showcasing work history, projects, photography, music, and travel.

## About

This is a static website hosted on GitHub Pages at [kohlhofer.com](https://kohlhofer.com).

## Architecture

This site uses a **build-based approach** with shared navigation components to avoid code duplication across pages.

### Directory Structure

```
├── src/
│   ├── templates/          # HTML templates with placeholders
│   │   ├── index.html
│   │   ├── about.html
│   │   ├── photos.html
│   │   └── ...
│   ├── navigation-config.json  # Navigation configuration
│   └── components/         # Reusable components (future)
├── build.js                # Build script
├── package.json            # Node.js dependencies
├── .github/
│   └── workflows/
│       └── build.yml       # GitHub Actions workflow
└── *.html                  # Generated HTML files (in root)
```

### How It Works

1. **Templates** (`src/templates/*.html`): HTML files with placeholders:
   - `<!-- NAVIGATION -->` - Replaced with navigation HTML
   - `<!-- INFO_PANEL -->` - Replaced with info panel HTML (if applicable)

2. **Navigation Config** (`src/navigation-config.json`):
   - Defines navigation links
   - Specifies which pages have info panels
   - Contains info panel content

3. **Build Script** (`build.js`):
   - Reads templates from `src/templates/`
   - Injects navigation and info panels based on config
   - Outputs built HTML files to root directory

4. **GitHub Actions** (`.github/workflows/build.yml`):
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
- Watch for changes in `src/templates/` and `src/navigation-config.json`
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
2. Edit templates in `src/templates/`
3. Save - browser will auto-refresh with your changes!
4. When done, commit both template and generated files

#### Updating Navigation

1. Start dev server: `npm start`
2. Edit `src/navigation-config.json`
3. Save - all pages will rebuild and browser will refresh!
4. Commit changes

#### Adding a New Page

1. Create template in `src/templates/yourpage.html`
2. Add entry to `navLinks` in `src/navigation-config.json`
3. Add info panel to `infoPanels` if needed
4. Dev server will auto-rebuild
5. Commit files

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
