#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const CleanCSS = require('clean-css');

// Configuration
const JS_DIR = path.join(__dirname, 'js');
const CSS_DIR = path.join(__dirname, 'css');

// Track statistics
let stats = {
  jsProcessed: 0,
  cssProcessed: 0,
  jsOriginalSize: 0,
  jsMinifiedSize: 0,
  cssOriginalSize: 0,
  cssMinifiedSize: 0
};

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Minify JavaScript files
 */
async function minifyJS() {
  console.log('📦 Minifying JavaScript files...\n');

  if (!fs.existsSync(JS_DIR)) {
    console.log('  No js directory found, skipping JS minification.');
    return;
  }

  const files = fs.readdirSync(JS_DIR).filter(file =>
    file.endsWith('.js') && !file.endsWith('.min.js')
  );

  for (const file of files) {
    try {
      const filePath = path.join(JS_DIR, file);
      const code = fs.readFileSync(filePath, 'utf8');
      const originalSize = Buffer.byteLength(code, 'utf8');

      console.log(`  Minifying ${file}...`);

      // Minify with Terser
      const result = await minify(code, {
        compress: {
          dead_code: true,
          drop_console: false, // Keep console for debugging
          drop_debugger: true,
          pure_funcs: ['console.debug']
        },
        mangle: {
          toplevel: false
        },
        output: {
          comments: false
        }
      });

      if (result.code) {
        const minifiedSize = Buffer.byteLength(result.code, 'utf8');
        const minFilePath = path.join(JS_DIR, file.replace('.js', '.min.js'));

        // Only create minified version if it's actually smaller
        if (minifiedSize < originalSize) {
          fs.writeFileSync(minFilePath, result.code, 'utf8');
          stats.jsProcessed++;
          stats.jsOriginalSize += originalSize;
          stats.jsMinifiedSize += minifiedSize;

          const saved = originalSize - minifiedSize;
          const percent = Math.round((saved / originalSize) * 100);
          console.log(`    ${formatBytes(originalSize)} → ${formatBytes(minifiedSize)} (saved ${percent}%)`);
        } else {
          console.log(`    Keeping original (minified version is not smaller)`);
        }
      }
    } catch (error) {
      console.error(`  ❌ Error minifying ${file}:`, error.message);
    }
  }
}

/**
 * Minify CSS files
 */
function minifyCSS() {
  console.log('\n🎨 Minifying CSS files...\n');

  if (!fs.existsSync(CSS_DIR)) {
    console.log('  No css directory found, skipping CSS minification.');
    return;
  }

  const files = fs.readdirSync(CSS_DIR).filter(file =>
    file.endsWith('.css') && !file.endsWith('.min.css')
  );

  const cleanCSS = new CleanCSS({
    level: 2,
    format: false
  });

  for (const file of files) {
    try {
      const filePath = path.join(CSS_DIR, file);
      const code = fs.readFileSync(filePath, 'utf8');
      const originalSize = Buffer.byteLength(code, 'utf8');

      console.log(`  Minifying ${file}...`);

      // Minify with CleanCSS
      const result = cleanCSS.minify(code);

      if (!result.errors || result.errors.length === 0) {
        const minifiedSize = Buffer.byteLength(result.styles, 'utf8');
        const minFilePath = path.join(CSS_DIR, file.replace('.css', '.min.css'));

        // Only create minified version if it's actually smaller
        if (minifiedSize < originalSize) {
          fs.writeFileSync(minFilePath, result.styles, 'utf8');
          stats.cssProcessed++;
          stats.cssOriginalSize += originalSize;
          stats.cssMinifiedSize += minifiedSize;

          const saved = originalSize - minifiedSize;
          const percent = Math.round((saved / originalSize) * 100);
          console.log(`    ${formatBytes(originalSize)} → ${formatBytes(minifiedSize)} (saved ${percent}%)`);
        } else {
          console.log(`    Keeping original (minified version is not smaller)`);
        }
      } else {
        console.error(`  ❌ Error minifying ${file}:`, result.errors);
      }
    } catch (error) {
      console.error(`  ❌ Error minifying ${file}:`, error.message);
    }
  }
}

/**
 * Main optimization function
 */
async function optimize() {
  console.log('⚡ Starting asset optimization...\n');
  const startTime = Date.now();

  await minifyJS();
  minifyCSS();

  // Print summary
  console.log('\n📊 Optimization Summary:');
  console.log('   JavaScript:');
  console.log(`     Files processed: ${stats.jsProcessed}`);
  if (stats.jsProcessed > 0) {
    const jsSaved = stats.jsOriginalSize - stats.jsMinifiedSize;
    const jsPercent = Math.round((jsSaved / stats.jsOriginalSize) * 100);
    console.log(`     Original size: ${formatBytes(stats.jsOriginalSize)}`);
    console.log(`     Minified size: ${formatBytes(stats.jsMinifiedSize)}`);
    console.log(`     Saved: ${formatBytes(jsSaved)} (${jsPercent}%)`);
  }

  console.log('   CSS:');
  console.log(`     Files processed: ${stats.cssProcessed}`);
  if (stats.cssProcessed > 0) {
    const cssSaved = stats.cssOriginalSize - stats.cssMinifiedSize;
    const cssPercent = Math.round((cssSaved / stats.cssOriginalSize) * 100);
    console.log(`     Original size: ${formatBytes(stats.cssOriginalSize)}`);
    console.log(`     Minified size: ${formatBytes(stats.cssMinifiedSize)}`);
    console.log(`     Saved: ${formatBytes(cssSaved)} (${cssPercent}%)`);
  }

  const totalOriginal = stats.jsOriginalSize + stats.cssOriginalSize;
  const totalMinified = stats.jsMinifiedSize + stats.cssMinifiedSize;
  if (totalOriginal > 0) {
    const totalSaved = totalOriginal - totalMinified;
    const totalPercent = Math.round((totalSaved / totalOriginal) * 100);
    console.log('   Total:');
    console.log(`     Saved: ${formatBytes(totalSaved)} (${totalPercent}%)`);
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n✅ Optimization complete in ${elapsed}s!`);
}

// Run if called directly
if (require.main === module) {
  optimize().catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
}

module.exports = { optimize, minifyJS, minifyCSS };
