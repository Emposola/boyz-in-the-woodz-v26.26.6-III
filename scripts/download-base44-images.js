#!/usr/bin/env node

/**
 * Download Base44 Images Script
 * Downloads all base44 images and stores them locally
 * Run with: node scripts/download-base44-images.js
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  header: (msg) => console.log(`\n${colors.cyan}${msg}${colors.reset}\n`),
};

// Images to download from Base44
const IMAGES = [
  {
    url: 'https://media.base44.com/images/public/69fb006d51e7a4116cb6d468/ce0384b42_1000018901.jpg',
    filename: 'logo-navbar-about.jpg',
    usedIn: ['Navbar.jsx', 'About.jsx']
  },
  {
    url: 'https://media.base44.com/images/public/69fb006d51e7a4116cb6d468/8e5c625a4_image.png',
    filename: 'team-photo.png',
    usedIn: ['About.jsx']
  },
  {
    url: 'https://media.base44.com/images/public/user_698665958200b3f7c38a9102/20dcc144c_logo_main.png',
    filename: 'logo-welcome.png',
    usedIn: ['Welcome.jsx']
  }
];

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, '../public/images/base44');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  log.success(`Created directory: ${outputDir}`);
}

// Function to download image
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(outputDir, filename);
    const file = fs.createWriteStream(filepath);

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve(filepath);
      });

      file.on('error', (err) => {
        fs.unlink(filepath, () => {}); // Delete the file on error
        reject(err);
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

// Main function
async function downloadAllImages() {
  log.header('🖼️  Base44 Images Download');
  log.info(`Downloading ${IMAGES.length} images to ${outputDir}`);

  let successCount = 0;
  let failureCount = 0;

  for (const image of IMAGES) {
    try {
      log.info(`Downloading: ${image.filename}`);
      log.info(`  Used in: ${image.usedIn.join(', ')}`);
      
      await downloadImage(image.url, image.filename);
      log.success(`Downloaded: ${image.filename}`);
      successCount++;
    } catch (error) {
      log.error(`Failed to download ${image.filename}: ${error.message}`);
      failureCount++;
    }
  }

  log.header('📊 Download Summary');
  log.success(`Successfully downloaded: ${successCount} images`);
  if (failureCount > 0) {
    log.error(`Failed: ${failureCount} images`);
  }

  log.header('📝 Next Steps');
  log.info('Update these files with local image paths:');
  IMAGES.forEach((image) => {
    log.info(`  • ${image.usedIn.join(', ')} → use /images/base44/${image.filename}`);
  });
}

// Run the script
downloadAllImages().catch((error) => {
  log.error(`Script failed: ${error.message}`);
  process.exit(1);
});
