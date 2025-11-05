#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const SRC_DIR = path.join(__dirname, 'src', 'templates');
const OUTPUT_DIR = __dirname;
const CONFIG_PATH = path.join(__dirname, 'src', 'navigation-config.json');

// Load navigation configuration
const navConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

/**
 * Generate navigation HTML for a specific page
 * @param {string} activePage - The page identifier (e.g., 'index', 'about')
 * @returns {string} Navigation HTML
 */
function generateNavigation(activePage) {
  const links = navConfig.navLinks.map(link => {
    const isActive = link.page === activePage;
    const activeClass = isActive ? ' class="active"' : '';
    const externalAttrs = link.external ? ' target="_blank" rel="noopener noreferrer"' : '';

    // Add info icon if this link has an info panel
    const infoIcon = link.hasInfo && isActive
      ? ' <span class="nav-info-icon">info</span>'
      : '';

    return `    <a href="${link.href}"${activeClass}${externalAttrs}>${link.text}${infoIcon}</a>`;
  }).join('\n');

  return `  <div class="top-nav">\n${links}\n  </div>`;
}

/**
 * Generate info panel HTML for a specific page
 * @param {string} page - The page identifier
 * @returns {string} Info panel HTML or empty string
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
 * Process a template file
 * @param {string} filename - Template filename
 */
function processTemplate(filename) {
  const templatePath = path.join(SRC_DIR, filename);
  const outputPath = path.join(OUTPUT_DIR, filename);

  // Extract page identifier from filename (e.g., 'index.html' -> 'index')
  const pageName = path.basename(filename, '.html');

  console.log(`Processing ${filename}...`);

  // Read template
  let content = fs.readFileSync(templatePath, 'utf8');

  // Generate navigation and info panel
  const navigation = generateNavigation(pageName);
  const infoPanel = generateInfoPanel(pageName);

  // Replace placeholders
  content = content.replace('<!-- NAVIGATION -->', navigation);

  if (infoPanel) {
    content = content.replace('<!-- INFO_PANEL -->', infoPanel);
  } else {
    content = content.replace('<!-- INFO_PANEL -->', '');
  }

  // Write output
  fs.writeFileSync(outputPath, content, 'utf8');
  console.log(`  ✓ Generated ${filename}`);
}

/**
 * Main build function
 */
function build() {
  console.log('🔨 Building site...\n');

  // Check if source directory exists
  if (!fs.existsSync(SRC_DIR)) {
    console.error(`❌ Source directory not found: ${SRC_DIR}`);
    process.exit(1);
  }

  // Get all HTML files in templates directory
  const templates = fs.readdirSync(SRC_DIR)
    .filter(file => file.endsWith('.html'));

  if (templates.length === 0) {
    console.error('❌ No HTML templates found');
    process.exit(1);
  }

  // Process each template
  templates.forEach(processTemplate);

  console.log(`\n✅ Build complete! Processed ${templates.length} file(s).`);
}

// Run build
if (require.main === module) {
  build();
}

module.exports = { build, generateNavigation, generateInfoPanel };
