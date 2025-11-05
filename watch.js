#!/usr/bin/env node

const chokidar = require('chokidar');
const { build } = require('./build.js');
const path = require('path');

console.log('👀 Watching for changes...\n');

// Watch src directory for changes
const watcher = chokidar.watch('src/**/*', {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
  ignoreInitial: true
});

// Debounce builds to avoid multiple rapid rebuilds
let buildTimeout;
function debouncedBuild(changedPath) {
  clearTimeout(buildTimeout);
  buildTimeout = setTimeout(() => {
    console.log(`\n📝 Change detected: ${path.relative(process.cwd(), changedPath)}`);
    try {
      build();
      console.log('✅ Rebuild complete. Browser will refresh.\n');
    } catch (error) {
      console.error('❌ Build failed:', error.message);
    }
  }, 100);
}

watcher
  .on('change', debouncedBuild)
  .on('add', debouncedBuild)
  .on('unlink', debouncedBuild)
  .on('error', error => console.error('Watcher error:', error));

console.log('Watching:');
console.log('  - src/templates/*.html');
console.log('  - src/navigation-config.json');
console.log('\nMake changes to see live updates! Press Ctrl+C to stop.\n');

// Keep the process running
process.on('SIGINT', () => {
  console.log('\n\n👋 Stopping watcher...');
  watcher.close();
  process.exit(0);
});
