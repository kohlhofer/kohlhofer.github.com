#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const SRC_DIR = path.join(__dirname, 'src');
const TEMPLATES_DIR = path.join(SRC_DIR, 'templates');
const PAGES_DIR = path.join(SRC_DIR, 'pages');
const OUTPUT_DIR = __dirname;
const LAYOUT_PATH = path.join(SRC_DIR, 'layout.html');
const NAV_CONFIG_PATH = path.join(SRC_DIR, 'navigation-config.json');

// Load configurations
const navConfig = JSON.parse(fs.readFileSync(NAV_CONFIG_PATH, 'utf8'));
const layoutTemplate = fs.readFileSync(LAYOUT_PATH, 'utf8');

/**
 * Generate navigation HTML for a specific page
 */
function generateNavigation(activePage) {
  const links = navConfig.navLinks.map(link => {
    const isActive = link.page === activePage;
    const activeClass = isActive ? ' class="active"' : '';
    const externalAttrs = link.external ? ' target="_blank" rel="noopener noreferrer"' : '';
    const infoIcon = link.hasInfo && isActive ? ' <span class="nav-info-icon">info</span>' : '';

    return `    <a href="${link.href}"${activeClass}${externalAttrs}>${link.text}${infoIcon}</a>`;
  }).join('\n');

  return `  <div class="top-nav">\n${links}\n  </div>`;
}

/**
 * Generate info panel HTML for a specific page
 */
function generateInfoPanel(page) {
  const panelData = navConfig.infoPanels[page];
  if (!panelData) return '';

  return `  <div id="nav-info-panel">
    ${panelData.content}
    <button class="close-button">
      <i class="fas fa-times"></i>
    </button>
  </div>`;
}

/**
 * Generate viewport meta tag
 */
function generateViewport(viewportConfig) {
  if (!viewportConfig) return '';

  const maxScale = viewportConfig.maxScale || '1.0';
  const userScalable = viewportConfig.userScalable || 'no';

  return `  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=${maxScale}, user-scalable=${userScalable}">`;
}

/**
 * Generate font links
 */
function generateFonts(fonts) {
  if (!fonts || fonts.length === 0) return '';

  const fontFamilies = fonts.map(font => {
    if (font === 'Rubik') return 'family=Rubik:wght@400;700';
    if (font === 'Inter') return 'family=Inter:wght@400;700';
    return `family=${font}`;
  }).join('&');

  return `  <link rel="preconnect" href="https://fonts.gstatic.com">
  <link href="https://fonts.googleapis.com/css2?${fontFamilies}&display=swap" rel="stylesheet">`;
}

/**
 * Generate page-specific CSS links
 */
function generatePageCSS(cssFiles) {
  if (!cssFiles || cssFiles.length === 0) return '';

  return cssFiles.map(file => `  <link rel="stylesheet" href="css/${file}">`).join('\n');
}

/**
 * Generate head scripts (external libraries)
 */
function generateHeadScripts(scripts) {
  if (!scripts || scripts.length === 0) return '';

  return scripts.map(src => `  <script src="${src}"></script>`).join('\n');
}

/**
 * Generate body scripts
 */
function generateBodyScripts(scripts) {
  if (!scripts || scripts.length === 0) return '';

  return '\n' + scripts.map(script => `  <script src="js/${script}"></script>`).join('\n');
}

/**
 * Generate Google Analytics script
 */
function generateAnalytics() {
  return `  <script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-58451-10', 'kohlhofer.com');
    ga('send', 'pageview');
  </script>`;
}

/**
 * Process a single page
 */
function processPage(pageName) {
  const pageConfigPath = path.join(PAGES_DIR, `${pageName}.json`);
  const templatePath = path.join(TEMPLATES_DIR, `${pageName}.html`);
  const outputPath = path.join(OUTPUT_DIR, `${pageName}.html`);

  // Check if files exist
  if (!fs.existsSync(pageConfigPath)) {
    console.log(`  ⚠️  Skipping ${pageName}.html - no configuration found`);
    return;
  }

  if (!fs.existsSync(templatePath)) {
    console.log(`  ⚠️  Skipping ${pageName}.html - no template found`);
    return;
  }

  console.log(`Processing ${pageName}.html...`);

  // Load page configuration
  const pageConfig = JSON.parse(fs.readFileSync(pageConfigPath, 'utf8'));

  // Read template content
  const templateContent = fs.readFileSync(templatePath, 'utf8');

  // Build the page
  let html = layoutTemplate;

  // Replace all placeholders
  html = html.replace('{{TITLE}}', pageConfig.title);
  html = html.replace('{{DESCRIPTION}}', pageConfig.description);
  html = html.replace('{{VIEWPORT}}', generateViewport(pageConfig.viewport));
  html = html.replace('{{FONTS}}', generateFonts(pageConfig.fonts));
  html = html.replace('{{PAGE_CSS}}', generatePageCSS(pageConfig.pageCSS));
  html = html.replace('{{HEAD_SCRIPTS}}', generateHeadScripts(pageConfig.headScripts));
  html = html.replace('{{ANALYTICS}}', pageConfig.analytics ? generateAnalytics() : '');
  html = html.replace('{{NAVIGATION}}', pageConfig.hasNavigation ? generateNavigation(pageName) : '');
  html = html.replace('{{INFO_PANEL}}', pageConfig.hasInfoPanel ? generateInfoPanel(pageName) : '');
  html = html.replace('{{CONTENT}}', templateContent);
  html = html.replace('{{BODY_SCRIPTS}}', generateBodyScripts(pageConfig.bodyScripts));

  // Clean up any extra blank lines
  html = html.replace(/\n\n\n+/g, '\n\n');

  // Write output
  fs.writeFileSync(outputPath, html, 'utf8');
  console.log(`  ✓ Generated ${pageName}.html`);
}

/**
 * Main build function
 */
function build() {
  console.log('🔨 Building site...\n');

  // Get all page configuration files
  const pageConfigs = fs.readdirSync(PAGES_DIR)
    .filter(file => file.endsWith('.json'))
    .map(file => path.basename(file, '.json'));

  if (pageConfigs.length === 0) {
    console.error('❌ No page configurations found');
    process.exit(1);
  }

  // Process each page
  pageConfigs.forEach(processPage);

  console.log(`\n✅ Build complete! Processed ${pageConfigs.length} page(s).`);
}

// Run build
if (require.main === module) {
  build();
}

module.exports = { build, generateNavigation, generateInfoPanel };
