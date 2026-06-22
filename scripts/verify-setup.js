#!/usr/bin/env node

/**
 * Verify Setup Script
 * Checks if the application is properly configured for Supabase
 * Run with: npm run verify or node scripts/verify-setup.js
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

let issues = 0;
let warnings = 0;

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    log.success(`${description} exists`);
    return true;
  } else {
    log.error(`${description} NOT FOUND: ${filePath}`);
    issues++;
    return false;
  }
}

function checkFileContent(filePath, searchString, description) {
  if (!fs.existsSync(filePath)) {
    log.error(`${description} - File not found: ${filePath}`);
    issues++;
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(searchString)) {
    log.success(`${description} - Found`);
    return true;
  } else {
    log.error(`${description} - String not found in ${filePath}`);
    issues++;
    return false;
  }
}

function checkNoBase44(filePath, description) {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf8');
  const base44Refs = [
    '@base44/sdk',
    '@base44/vite-plugin',
    'base44Client',
    'Base44',
  ];

  const found = base44Refs.filter(ref => 
    content.includes(ref) && !filePath.includes('backup')
  );

  if (found.length === 0) {
    log.success(`${description} - No Base44 references`);
    return true;
  } else {
    log.warning(`${description} - Found Base44 references: ${found.join(', ')}`);
    warnings++;
    return false;
  }
}

function checkEnvVar(varName) {
  if (process.env[varName]) {
    log.success(`Environment variable ${varName} is set`);
    return true;
  } else {
    log.warning(`Environment variable ${varName} is not set (may be OK in development)`);
    return false;
  }
}

// Main verification
console.log('\n' + colors.cyan + '╔════════════════════════════════════════════════════════════╗' + colors.reset);
console.log(colors.cyan + '║  Supabase Setup Verification                               ║' + colors.reset);
console.log(colors.cyan + '║  BOYZ IN THE WOODZ v26.5.17                                ║' + colors.reset);
console.log(colors.cyan + '╚════════════════════════════════════════════════════════════╝' + colors.reset);

// Check environment files
log.header('📁 Environment Files');
checkFile('.env.local', 'Development environment file (.env.local)');
checkFile('.env.example', 'Environment template (.env.example)');
checkFile('.gitignore', 'Git ignore file');

// Check environment variables in .env.local
log.header('🔐 Environment Variables');
const envLocalPath = '.env.local';
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  checkFileContent(envLocalPath, 'VITE_SUPABASE_URL', 'Supabase URL variable');
  checkFileContent(envLocalPath, 'VITE_SUPABASE_ANON_KEY', 'Supabase Anon Key variable');
} else {
  log.error('Cannot check environment variables - .env.local not found');
  issues++;
}

// Check configuration files
log.header('⚙️  Configuration Files');
checkFile('supabase.json', 'Supabase configuration (supabase.json)');
checkFile('supabase_schema.sql', 'Database schema (supabase_schema.sql)');
checkFile('vite.config.js', 'Vite configuration');
checkFile('package.json', 'Package configuration');

// Check source files
log.header('📝 Source Files');
checkFile('src/api/base44Client.js', 'Supabase API client');
checkFile('src/lib/supabase.js', 'Supabase client');
checkFile('src/lib/AuthContext.jsx', 'Authentication context');
checkFile('src/lib/supabaseUtils.js', 'Supabase utilities');
checkFile('src/config/environment.js', 'Environment configuration');

// Check for Base44 removal
log.header('🧹 Base44 Removal');
checkNoBase44('package.json', 'package.json');
checkNoBase44('vite.config.js', 'vite.config.js');
checkNoBase44('src/api/base44Client.js', 'src/api/base44Client.js');

// Check documentation
log.header('📚 Documentation');
checkFile('README.md', 'Project README');
checkFile('QUICK_START.md', 'Quick Start Guide');
checkFile('SETUP.md', 'Setup Guide');
checkFile('MIGRATION_COMPLETE.md', 'Migration Summary');
checkFile('SUPABASE_MIGRATION_GUIDE.md', 'Migration Guide');

// Summary
log.header('📊 Verification Summary');

if (issues === 0 && warnings === 0) {
  console.log(colors.green + '✅ Everything looks good!' + colors.reset);
  console.log('\n' + colors.green + 'You are ready to:' + colors.reset);
  console.log('  1. Run: npm install');
  console.log('  2. Run: npm run dev');
  console.log('  3. Visit: http://localhost:5173');
  process.exit(0);
} else {
  if (issues > 0) {
    log.error(`${issues} critical issue(s) found`);
  }
  if (warnings > 0) {
    log.warning(`${warnings} warning(s) found`);
  }

  console.log('\n' + colors.yellow + 'Please fix the issues above before running the application.' + colors.reset);
  console.log('\n📖 See documentation for help:');
  console.log('   - QUICK_START.md');
  console.log('   - SETUP.md');
  console.log('   - SUPABASE_MIGRATION_GUIDE.md');

  process.exit(issues > 0 ? 1 : 0);
}
