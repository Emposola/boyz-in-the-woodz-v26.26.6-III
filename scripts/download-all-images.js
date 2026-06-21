#!/usr/bin/env node

/**
 * Comprehensive Image Downloader - All Unsplash Images
 * Downloads all images used in the site from Unsplash
 * Run with: node scripts/download-all-images.js
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

// Unique Unsplash photo IDs extracted from codebase
const UNIQUE_IMAGES = [
  { id: 'photo-1441974231531-c6227db76b6e', name: 'hiking-backpack' },
  { id: 'photo-1448375240586-882707db888b', name: 'forest-campfire' },
  { id: 'photo-1464822759023-fed622ff2c3b', name: 'landscape-1' },
  { id: 'photo-1469854523086-cc02fe5d8800', name: 'desert-landscape' },
  { id: 'photo-1470071459604-3b5ec3a7fe05', name: 'sleeping-bag' },
  { id: 'photo-1471897488648-5eae4ac6d485', name: 'nature-1' },
  { id: 'photo-1472099645785-5658abf4ff4e', name: 'man-portrait-david' },
  { id: 'photo-1476611338391-6f395a0ebc7b', name: 'camp-stove' },
  { id: 'photo-1484788984921-03950022c9ef', name: 'nature-2' },
  { id: 'photo-1491553895911-0055eca6402d', name: 'nature-3' },
  { id: 'photo-1492562080023-ab3db95bfbce', name: 'nature-4' },
  { id: 'photo-1500648767791-00dcc994a43e', name: 'man-portrait-tomas' },
  { id: 'photo-1503341338985-95048f33ab37', name: 'nature-5' },
  { id: 'photo-1503341504253-dff4815485f1', name: 'nature-6' },
  { id: 'photo-1503951914875-452162b0f3f1', name: 'barbershop-interior' },
  { id: 'photo-1504280390367-361c6d9f38f4', name: 'campfire-night' },
  { id: 'photo-1506794778202-cad84cf45f1d', name: 'man-portrait-dre' },
  { id: 'photo-1506905925346-21bda4d32df4', name: 'headlamp-outdoor' },
  { id: 'photo-1507003211169-0a1dd7228f2d', name: 'man-portrait-marcus' },
  { id: 'photo-1508193638397-1c4234db14d8', name: 'campfire-gathering' },
  { id: 'photo-1509048191080-d2984bad6ae5', name: 'nature-7' },
  { id: 'photo-1509942774463-acf339cf87d5', name: 'nature-8' },
  { id: 'photo-1510431198580-7727c9fa6e0a', name: 'nature-9' },
  { id: 'photo-1513694203232-719a280e022f', name: 'nature-10' },
  { id: 'photo-1513789181297-6f2ec112c0bc', name: 'nature-11' },
  { id: 'photo-1519085360753-af0119f7cbe7', name: 'man-portrait-andre' },
  { id: 'photo-1521369909029-2afed882baee', name: 'nature-12' },
  { id: 'photo-1521572163474-6864f9cf17ab', name: 'nature-13' },
  { id: 'photo-1522202176988-66273c2fd55f', name: 'nature-14' },
  { id: 'photo-1523712999610-f77fbcfc3843', name: 'nature-15' },
  { id: 'photo-1524504388940-b1c1722653e1', name: 'man-portrait-jr' },
  { id: 'photo-1529156069898-49953e39b3ac', name: 'men-group-bonding' },
  { id: 'photo-1529374255404-311a2a4f1fd9', name: 'nature-16' },
  { id: 'photo-1531427186611-ecfd6d936c79', name: 'man-portrait-leon' },
  { id: 'photo-1533577116850-9cc66cad8a9b', name: 'nature-17' },
  { id: 'photo-1534215754734-18e55d13e346', name: 'nature-18' },
  { id: 'photo-1539571696357-5a69c17a67c6', name: 'nature-19' },
  { id: 'photo-1541960071727-c531398e7494', name: 'nature-20' },
  { id: 'photo-1542178243-bc20204b769f', name: 'man-portrait-damon' },
  { id: 'photo-1542273917363-3b1817f69a2d', name: 'forest-hiking-trail' },
  { id: 'photo-1542291026-7eec264c27ff', name: 'nature-21' },
  { id: 'photo-1544367567-0f2fcb009e0b', name: 'nature-22' },
  { id: 'photo-1544787219-7f47ccb76574', name: 'nature-23' },
  { id: 'photo-1545839875-8bdf26c43f20', name: 'nature-24' },
  { id: 'photo-1548036328-c9fa89d128fa', name: 'nature-25' },
  { id: 'photo-1551698618-1dfe5d97d256', name: 'nature-26' },
  { id: 'photo-1553062407-98eeb64c6a62', name: 'nature-27' },
  { id: 'photo-1553267751-1c148a7280a1', name: 'man-portrait-troy' },
  { id: 'photo-1553621042-f6e147245754', name: 'nature-28' },
  { id: 'photo-1553867745-6f72bc0ab8bb', name: 'nature-29' },
  { id: 'photo-1556157382-97eda2f9e2bf', name: 'nature-30' },
  { id: 'photo-1556821840-3a63f15732ce', name: 'nature-31' },
  { id: 'photo-1557804506-669a67965ba0', name: 'nature-32' },
  { id: 'photo-1558618666-fcd25c85cd64', name: 'man-portrait-kevin' },
  { id: 'photo-1558637845-e8ac5d677915', name: 'nature-33' },
  { id: 'photo-1558769132-cb1aea458c5e', name: 'nature-34' },
  { id: 'photo-1560250097-0b93528c311a', name: 'man-portrait-robert' },
  { id: 'photo-1566492031773-4f4e44671857', name: 'man-portrait-chris' },
  { id: 'photo-1571781926291-c477ebfd024b', name: 'nature-35' },
  { id: 'photo-1572119865084-43c285814d63', name: 'nature-36' },
  { id: 'photo-1573496359142-b8d87734a5a2', name: 'nature-37' },
  { id: 'photo-1576566588028-4147f3842f27', name: 'nature-38' },
  { id: 'photo-1581791538161-8a0b1b2e2e7c', name: 'nature-39' },
  { id: 'photo-1583743814966-8936f5b7be1a', name: 'nature-40' },
  { id: 'photo-1585747860019-8007580e2f14', name: 'barbershop-chair' },
  { id: 'photo-1588850561407-ed78c282e89b', name: 'nature-41' },
  { id: 'photo-1594938298603-c8148c4b4f8d', name: 'nature-42' },
  { id: 'photo-1596728325478-17f1e0acda3b', name: 'barber-fresh-cut' },
  { id: 'photo-1596755094514-f87e34085b2c', name: 'nature-43' },
  { id: 'photo-1599351431202-1e0f0137899a', name: 'barber-classic-cut' },
  { id: 'photo-1601333144130-8cbb312386b6', name: 'nature-44' },
  { id: 'photo-1601924994987-69e26d50dc26', name: 'nature-45' },
  { id: 'photo-1602143407151-7111542de6e8', name: 'nature-46' },
  { id: 'photo-1603398938378-e54eab446dde', name: 'nature-47' },
  { id: 'photo-1612349317150-e413f6a5b16d', name: 'nature-48' },
  { id: 'photo-1618354691373-d851c5c3a990', name: 'nature-49' },
  { id: 'photo-1620799140408-edc6dcb6d633', name: 'nature-50' },
  { id: 'photo-1621605815971-fbc98d665033', name: 'barber-hot-towel' },
  { id: 'photo-1622286342621-4bd786c2447c', name: 'barber-lineup' },
];

// Create output directories
const imagesDir = path.join(__dirname, '../public/images/unsplash');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Function to download image
function downloadImage(photoId, filename) {
  return new Promise((resolve, reject) => {
    const url = `https://images.unsplash.com/${photoId}?w=1200&q=85&fm=webp`;
    const filepath = path.join(imagesDir, `${filename}.webp`);

    const file = fs.createWriteStream(filepath);

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve(filepath);
      });

      file.on('error', (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

// Main download function
async function downloadAllImages() {
  log.header('🖼️  Downloading All Unsplash Images');
  log.info(`Total images: ${UNIQUE_IMAGES.length}`);
  log.info(`Output directory: ${imagesDir}\n`);

  let successCount = 0;
  let failureCount = 0;
  const failed = [];

  for (let i = 0; i < UNIQUE_IMAGES.length; i++) {
    const img = UNIQUE_IMAGES[i];
    const progress = `[${i + 1}/${UNIQUE_IMAGES.length}]`;

    try {
      await downloadImage(img.id, img.name);
      log.success(`${progress} ${img.name}`);
      successCount++;
    } catch (error) {
      log.error(`${progress} ${img.name} - ${error.message}`);
      failed.push(img.name);
      failureCount++;
    }

    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  log.header('📊 Download Summary');
  log.success(`Successfully downloaded: ${successCount}/${UNIQUE_IMAGES.length}`);

  if (failureCount > 0) {
    log.error(`Failed: ${failureCount}`);
    log.info('Failed images:');
    failed.forEach(f => log.warning(`  • ${f}`));
  }

  log.header('📝 Next Steps');
  log.info('Images are now downloaded to: public/images/unsplash/');
  log.info('Update component references to use: /images/unsplash/{filename}.webp');
}

downloadAllImages().catch((error) => {
  log.error(`Script failed: ${error.message}`);
  process.exit(1);
});
