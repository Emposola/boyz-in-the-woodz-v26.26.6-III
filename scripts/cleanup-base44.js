#!/usr/bin/env node

/**
 * Cleanup Script - Remove Base44 Artifacts
 * Removes any remaining Base44 related files and references
 * Run with: node scripts/cleanup-base44.js
 */

const fs = require('fs');
const path = require('path');

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

// Files and directories to remove
const filesToRemove = [
  'base44.config.json',
  'base44.config.js',
  '.base44',
  'src-backup',  // Optional: remove backup if you don't need it
];

// Directories to check for Base44 references
const dirsToCheck = [
  'src',
  'public',
];

function removeFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return false;
    }

    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      fs.rmSync(filePath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(filePath);
    }

    log.success(`Removed: ${filePath}`);
    return true;
  } catch (error) {
    log.error(`Failed to remove ${filePath}: ${error.message}`);
    return false;
  }
}

function searchFiles(dir, pattern) {
  const matches = [];
  
  try {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      
      // Skip node_modules and dist
      if (file.name === 'node_modules' || file.name === 'dist' || file.name === '.git') {
        continue;
      }
      
      if (file.isDirectory()) {
        matches.push(...searchFiles(fullPath, pattern));
      } else if (file.isFile()) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (content.includes(pattern)) {
            matches.push(fullPath);
          }
        } catch (e) {
          // Skip binary files
        }
      }
    }
  } catch (error) {
    // Skip inaccessible directories
  }
  
  return matches;
}

console.log('\n' + colors.cyan + '╔════════════════════════════════════════════════════════════╗' + colors.reset);
console.log(colors.cyan + '║  Base44 Cleanup Script                                     ║' + colors.reset);
console.log(colors.cyan + '║  Remove all Base44 artifacts and references                ║' + colors.reset);
console.log(colors.cyan + '╚════════════════════════════════════════════════════════════╝' + colors.reset);

log.header('🧹 Removing Base44 Files');

let removed = 0;
for (const file of filesToRemove) {
  if (removeFile(file)) {
    removed++;
  }
}

log.header('🔍 Searching for Base44 References');

const base44Patterns = [
  '@base44/sdk',
  '@base44/vite-plugin',
  'VITE_BASE44',
  'base44.com',
  'Base44',
];

let foundReferences = [];

for (const pattern of base44Patterns) {
  log.info(`Searching for: "${pattern}"`);
  const matches = searchFiles('.', pattern);
  
  // Filter out backup and node_modules
  const filtered = matches.filter(m => 
    !m.includes('node_modules') && 
    !m.includes('dist') &&
    !m.includes('src-backup') &&
    !m.includes('.git')
  );

  if (filtered.length === 0) {
    log.success(`No references found for "${pattern}"`);
  } else {
    log.warning(`Found ${filtered.length} reference(s) for "${pattern}"`);
    filtered.forEach(f => console.log(`  - ${f}`));
    foundReferences.push(...filtered);
  }
}

log.header('📊 Cleanup Summary');

console.log(`Files/directories removed: ${removed}`);
console.log(`Base44 references found: ${foundReferences.length}`);

if (foundReferences.length === 0) {
  log.success('✅ All Base44 artifacts removed!');
  console.log('\n' + colors.green + 'Your project is clean and ready for deployment.' + colors.reset);
  process.exit(0);
} else {
  log.warning(`⚠️  ${foundReferences.length} Base44 reference(s) still present`);
  console.log('\nThese are likely in:');
  console.log('  - Comments (safe to leave)');
  console.log('  - Documentation files (can be left)');
  console.log('  - package-lock.json (from npm cache)');
  console.log('\nManually check the files above if needed.');
  process.exit(0);
}
