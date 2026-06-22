#!/usr/bin/env node

/**
 * Image Reference Utility - Maps all external URLs to local paths
 * Generates a reference file for quick lookups
 * Run with: node scripts/image-references.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// All image URL mappings organized by component/feature
const IMAGE_MAPPINGS = {
  'base44-logos': {
    'logo-navbar-about': {
      old: 'https://media.base44.com/images/public/69fb006d51e7a4116cb6d468/ce0384b42_1000018901.jpg',
      new: '/images/base44/logo-navbar-about.jpg',
      usedIn: ['Navbar.jsx', 'About.jsx']
    },
    'team-photo': {
      old: 'https://media.base44.com/images/public/69fb006d51e7a4116cb6d468/8e5c625a4_image.png',
      new: '/images/base44/team-photo.png',
      usedIn: ['About.jsx']
    },
    'logo-welcome': {
      old: 'https://media.base44.com/images/public/user_698665958200b3f7c38a9102/20dcc144c_logo_main.png',
      new: '/images/base44/logo-welcome.png',
      usedIn: ['Welcome.jsx']
    }
  },
  'unsplash-images': {
    'forest-campfire': {
      old: 'https://images.unsplash.com/photo-1448375240586-882707db888b',
      new: '/images/unsplash/forest-campfire.webp',
      usedIn: ['Hero', 'Welcome', 'About', 'Marketing Popup', 'HomeFeatureBlocks', 'HeroSplit', 'BrotherhoodLetters'],
      description: 'Forest campfire scene'
    },
    'hiking-backpack': {
      old: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
      new: '/images/unsplash/hiking-backpack.webp',
      usedIn: ['CrossBrandCTA', 'GearLoan'],
      description: 'Hiking backpack in mountains'
    },
    'men-group-bonding': {
      old: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac',
      new: '/images/unsplash/men-group-bonding.webp',
      usedIn: ['About', 'Welcome', 'ImpactStories', 'Contact', 'HomeFeatureBlocks'],
      description: 'Group of men bonding'
    },
    'campfire-night': {
      old: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4',
      new: '/images/unsplash/campfire-night.webp',
      usedIn: ['HomeFeatureBlocks', 'Welcome', 'GearLoan', 'Events', 'About'],
      description: 'Campfire at night'
    },
    'forest-hiking-trail': {
      old: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d',
      new: '/images/unsplash/forest-hiking-trail.webp',
      usedIn: ['BarberServices', 'BarberGallery', 'About', 'Events', 'ImpactStories', 'GearLoan'],
      description: 'Forest hiking trail'
    },
    'barbershop-interior': {
      old: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1',
      new: '/images/unsplash/barbershop-interior.webp',
      usedIn: ['Welcome', 'Marketing Popup'],
      description: 'Barbershop interior'
    },
    'man-portrait-marcus': {
      old: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      new: '/images/unsplash/man-portrait-marcus.webp',
      usedIn: ['BarberTeam', 'ImpactStories'],
      description: 'Man portrait - Marcus'
    },
    'man-portrait-dre': {
      old: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
      new: '/images/unsplash/man-portrait-dre.webp',
      usedIn: ['BarberTeam'],
      description: 'Man portrait - Dre'
    },
    'man-portrait-tomas': {
      old: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
      new: '/images/unsplash/man-portrait-tomas.webp',
      usedIn: ['BarberTeam', 'ImpactStories'],
      description: 'Man portrait - Tomás'
    },
    'headlamp-outdoor': {
      old: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
      new: '/images/unsplash/headlamp-outdoor.webp',
      usedIn: ['HomeFeatureBlocks', 'GearLoan'],
      description: 'Headlamp in outdoors'
    },
    'sleeping-bag': {
      old: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
      new: '/images/unsplash/sleeping-bag.webp',
      usedIn: ['GearLoan'],
      description: 'Sleeping bag'
    },
    'camp-stove': {
      old: 'https://images.unsplash.com/photo-1476611338391-6f395a0ebc7b',
      new: '/images/unsplash/camp-stove.webp',
      usedIn: ['GearLoan'],
      description: 'Camp stove'
    },
    'campfire-gathering': {
      old: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8',
      new: '/images/unsplash/campfire-gathering.webp',
      usedIn: ['BrotherhoodLetters'],
      description: 'Campfire gathering'
    },
    'desert-landscape': {
      old: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800',
      new: '/images/unsplash/desert-landscape.webp',
      usedIn: ['Events'],
      description: 'Desert landscape'
    },
    'man-portrait-david': {
      old: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      new: '/images/unsplash/man-portrait-david.webp',
      usedIn: ['ImpactStories'],
      description: 'Man portrait - David'
    },
    'man-portrait-robert': {
      old: 'https://images.unsplash.com/photo-1560250097-0b93528c311a',
      new: '/images/unsplash/man-portrait-robert.webp',
      usedIn: ['ImpactStories'],
      description: 'Man portrait - Robert'
    },
    'man-portrait-andre': {
      old: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7',
      new: '/images/unsplash/man-portrait-andre.webp',
      usedIn: ['ImpactStories'],
      description: 'Man portrait - Andre'
    },
    'man-portrait-kevin': {
      old: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
      new: '/images/unsplash/man-portrait-kevin.webp',
      usedIn: ['ImpactStories'],
      description: 'Man portrait - Kevin'
    },
    'man-portrait-troy': {
      old: 'https://images.unsplash.com/photo-1553267751-1c148a7280a1',
      new: '/images/unsplash/man-portrait-troy.webp',
      usedIn: ['ImpactStories'],
      description: 'Man portrait - Troy'
    },
    'man-portrait-damon': {
      old: 'https://images.unsplash.com/photo-1542178243-bc20204b769f',
      new: '/images/unsplash/man-portrait-damon.webp',
      usedIn: ['ImpactStories'],
      description: 'Man portrait - Damon'
    },
    'man-portrait-chris': {
      old: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857',
      new: '/images/unsplash/man-portrait-chris.webp',
      usedIn: ['ImpactStories'],
      description: 'Man portrait - Chris'
    },
    'man-portrait-leon': {
      old: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79',
      new: '/images/unsplash/man-portrait-leon.webp',
      usedIn: ['ImpactStories'],
      description: 'Man portrait - Leon'
    },
    'man-portrait-jr': {
      old: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
      new: '/images/unsplash/man-portrait-jr.webp',
      usedIn: ['ImpactStories'],
      description: 'Man portrait - Marcus Jr'
    },
    'barber-tools': {
      old: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a',
      new: '/images/unsplash/barber-classic-cut.webp',
      usedIn: ['BarberGallery'],
      description: 'Barber classic cut'
    },
    'barber-hot-towel': {
      old: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033',
      new: '/images/unsplash/barber-hot-towel.webp',
      usedIn: ['BarberGallery', 'BarberServices', 'Events'],
      description: 'Hot towel shave'
    },
    'barber-lineup': {
      old: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c',
      new: '/images/unsplash/barber-lineup.webp',
      usedIn: ['BarberGallery'],
      description: 'Sharp barber lineup'
    },
    'barbershop-chair': {
      old: 'https://images.unsplash.com/photo-1585747860019-8007580e2f14',
      new: '/images/unsplash/barbershop-chair.webp',
      usedIn: ['BarberGallery'],
      description: 'Barbershop atmosphere'
    },
    'barber-fresh-cut': {
      old: 'https://images.unsplash.com/photo-1596728325478-17f1e0acda3b',
      new: '/images/unsplash/barber-fresh-cut.webp',
      usedIn: ['BarberGallery'],
      description: 'Fresh haircut'
    }
  }
};

// Generate reference report
function generateReport() {
  let report = `# Image Reference Guide\n\n`;
  report += `Generated: ${new Date().toLocaleString()}\n\n`;

  report += `## Summary\n\n`;
  const base44Count = Object.keys(IMAGE_MAPPINGS['base44-logos']).length;
  const unsplashCount = Object.keys(IMAGE_MAPPINGS['unsplash-images']).length;
  report += `- Base44 Images: ${base44Count}\n`;
  report += `- Unsplash Images: ${unsplashCount}\n`;
  report += `- **Total: ${base44Count + unsplashCount} images**\n\n`;

  report += `## Base44 Images\n\n`;
  report += `Status: ✅ Downloaded to \`/public/images/base44/\`\n\n`;
  Object.entries(IMAGE_MAPPINGS['base44-logos']).forEach(([key, data]) => {
    report += `### ${key}\n`;
    report += `- **Old URL:** ${data.old}\n`;
    report += `- **New Path:** ${data.new}\n`;
    report += `- **Used In:** ${data.usedIn.join(', ')}\n\n`;
  });

  report += `\n## Unsplash Images\n\n`;
  report += `Status: 🔄 Downloading to \`/public/images/unsplash/\`\n\n`;
  Object.entries(IMAGE_MAPPINGS['unsplash-images']).forEach(([key, data]) => {
    report += `### ${key}\n`;
    report += `- **Description:** ${data.description}\n`;
    report += `- **Old URL Base:** ${data.old}\n`;
    report += `- **New Path:** ${data.new}\n`;
    report += `- **Used In:** ${data.usedIn.join(', ')}\n\n`;
  });

  return report;
}

// Save report
const reportPath = path.join(__dirname, '../IMAGE_REFERENCES.md');
const report = generateReport();
fs.writeFileSync(reportPath, report);

console.log('✅ Image reference guide generated at IMAGE_REFERENCES.md');
console.log(`📊 Total images: ${Object.keys(IMAGE_MAPPINGS['base44-logos']).length + Object.keys(IMAGE_MAPPINGS['unsplash-images']).length}`);
