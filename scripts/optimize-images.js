#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const IMAGE_DIRS = [
  'images/profile',
  'images/projects',
  'images/bits',
  'images/illustrations'
];

const QUALITY = {
  jpeg: 85,
  png: 90,
  webp: 85
};

// Track statistics
let stats = {
  processed: 0,
  skipped: 0,
  originalSize: 0,
  optimizedSize: 0
};

/**
 * Get all image files recursively from a directory
 */
function getImageFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) {
    return fileList;
  }

  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getImageFiles(filePath, fileList);
    } else if (/\.(jpg|jpeg|png)$/i.test(file)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

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
 * Optimize a single image file
 */
async function optimizeImage(filePath) {
  try {
    const originalSize = fs.statSync(filePath).size;
    const ext = path.extname(filePath).toLowerCase();
    const webpPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');

    // Skip if already optimized (check if webp exists and is newer)
    if (fs.existsSync(webpPath)) {
      const webpTime = fs.statSync(webpPath).mtime;
      const origTime = fs.statSync(filePath).mtime;
      if (webpTime >= origTime) {
        stats.skipped++;
        return;
      }
    }

    console.log(`  Optimizing ${path.relative(process.cwd(), filePath)}...`);

    const image = sharp(filePath);
    const metadata = await image.metadata();

    // Determine max width based on image type and current size
    let maxWidth = 2000; // Default max width
    if (filePath.includes('/profile/')) {
      maxWidth = 800; // Profile images don't need to be huge
    } else if (filePath.includes('/bits/')) {
      maxWidth = 1200; // Preview images
    } else if (filePath.includes('/projects/')) {
      maxWidth = 1600; // Project images
    }

    // Resize if needed
    let processedImage = image;
    if (metadata.width > maxWidth) {
      processedImage = processedImage.resize(maxWidth, null, {
        withoutEnlargement: true,
        fit: 'inside'
      });
    }

    // Optimize the original format
    if (ext === '.jpg' || ext === '.jpeg') {
      await processedImage
        .jpeg({ quality: QUALITY.jpeg, progressive: true })
        .toFile(filePath + '.tmp');
    } else if (ext === '.png') {
      await processedImage
        .png({ quality: QUALITY.png, compressionLevel: 9 })
        .toFile(filePath + '.tmp');
    }

    // Create WebP version
    await processedImage
      .webp({ quality: QUALITY.webp })
      .toFile(webpPath);

    // Replace original with optimized version
    const tmpSize = fs.statSync(filePath + '.tmp').size;
    if (tmpSize < originalSize) {
      fs.renameSync(filePath + '.tmp', filePath);
      stats.originalSize += originalSize;
      stats.optimizedSize += tmpSize;
    } else {
      // Keep original if optimized version is larger
      fs.unlinkSync(filePath + '.tmp');
      stats.optimizedSize += originalSize;
    }

    stats.processed++;

    const saved = originalSize - tmpSize;
    if (saved > 0) {
      console.log(`    Saved ${formatBytes(saved)} (${Math.round((saved / originalSize) * 100)}%)`);
    }

  } catch (error) {
    console.error(`  ❌ Error optimizing ${filePath}:`, error.message);
  }
}

/**
 * Main optimization function
 */
async function optimizeImages() {
  console.log('🖼️  Optimizing images...\n');

  // Collect all images
  let allImages = [];
  IMAGE_DIRS.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir);
    const images = getImageFiles(dirPath);
    allImages = allImages.concat(images);
  });

  if (allImages.length === 0) {
    console.log('No images found to optimize.');
    return;
  }

  console.log(`Found ${allImages.length} images to process.\n`);

  // Process each image
  for (const imagePath of allImages) {
    await optimizeImage(imagePath);
  }

  // Print summary
  console.log('\n📊 Optimization Summary:');
  console.log(`   Processed: ${stats.processed}`);
  console.log(`   Skipped: ${stats.skipped}`);

  if (stats.processed > 0) {
    const totalSaved = stats.originalSize - stats.optimizedSize;
    const percentSaved = Math.round((totalSaved / stats.originalSize) * 100);
    console.log(`   Original size: ${formatBytes(stats.originalSize)}`);
    console.log(`   Optimized size: ${formatBytes(stats.optimizedSize)}`);
    console.log(`   Total saved: ${formatBytes(totalSaved)} (${percentSaved}%)`);
  }

  console.log('\n✅ Image optimization complete!');
}

// Run if called directly
if (require.main === module) {
  optimizeImages().catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
}

module.exports = { optimizeImages };
