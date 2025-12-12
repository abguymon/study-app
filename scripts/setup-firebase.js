#!/usr/bin/env node

/**
 * Firebase Setup Script
 * 
 * This script automates the Firebase setup process for the study-app project.
 * It will:
 * 1. Check for Firebase CLI installation
 * 2. Initialize Firebase in the project
 * 3. Set up Firestore with security rules
 * 4. Create a .env.example file
 * 5. Guide you through remaining manual steps
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkCommand(command) {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function runCommand(command, options = {}) {
  try {
    execSync(command, { 
      stdio: 'inherit', 
      cwd: projectRoot,
      ...options 
    });
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  log('\n🔥 Firebase Setup Script for Study App\n', 'bright');

  // Step 1: Check for Firebase CLI (optional check)
  log('Step 1: Checking Firebase setup...', 'blue');
  
  // Check if we're in WSL or a non-interactive environment
  const isWSL = process.env.WSL_DISTRO_NAME || process.env.WSL_INTEROP || false;
  const hasDisplay = process.env.DISPLAY && process.env.DISPLAY !== ':0';
  
  if (isWSL || !hasDisplay) {
    log('⚠️  Detected WSL or non-interactive environment.', 'yellow');
    log('   Firebase CLI commands may hang when trying to open a browser.', 'yellow');
    log('   Using manual configuration instead...\n', 'yellow');
  }
  
  // Firebase CLI is optional - we can set up config files manually
  const hasFirebaseCLI = checkCommand('firebase');
  if (hasFirebaseCLI) {
    log('✅ Firebase CLI found', 'green');
  } else {
    log('ℹ️  Firebase CLI not found (optional for basic setup)', 'yellow');
  }
  log('');

  // Step 2: Check if Firebase is already initialized
  const firebaseJsonPath = join(projectRoot, 'firebase.json');
  const firebaseRCPath = join(projectRoot, '.firebaserc');
  
  if (existsSync(firebaseJsonPath) && existsSync(firebaseRCPath)) {
    log('✅ Firebase is already initialized in this project.', 'green');
    try {
      const firebaseRC = JSON.parse(readFileSync(firebaseRCPath, 'utf-8'));
      const projectId = firebaseRC?.projects?.default || 'unknown';
      log(`   Project ID: ${projectId}\n`, 'yellow');
    } catch (e) {
      log('   (Could not read project ID)\n', 'yellow');
    }
  } else {
    // Step 2: Create Firebase config files manually (for WSL/non-interactive environments)
    log('Step 2: Creating Firebase configuration files...', 'blue');
    
    // Try to get project ID from .env file
    let projectId = 'study-app-2903d'; // default
    const envPath = join(projectRoot, '.env');
    if (existsSync(envPath)) {
      try {
        const envContent = readFileSync(envPath, 'utf-8');
        const projectIdMatch = envContent.match(/VITE_FIREBASE_PROJECT_ID=(.+)/);
        if (projectIdMatch) {
          projectId = projectIdMatch[1].trim();
        }
      } catch (e) {
        // Use default
      }
    }
    
    // Create .firebaserc
    const firebaseRC = {
      projects: {
        default: projectId
      }
    };
    writeFileSync(firebaseRCPath, JSON.stringify(firebaseRC, null, 2) + '\n');
    log(`✅ Created .firebaserc with project: ${projectId}`, 'green');
    
    // Create firebase.json if it doesn't exist
    if (!existsSync(firebaseJsonPath)) {
      const firebaseJson = {
        firestore: {
          rules: 'firestore.rules'
        }
      };
      writeFileSync(firebaseJsonPath, JSON.stringify(firebaseJson, null, 2) + '\n');
      log('✅ Created firebase.json', 'green');
    }
    
    log('\n   ℹ️  Note: If you need to use Firebase CLI commands later,', 'yellow');
    log('   you may need to authenticate first. Try:', 'yellow');
    log('   firebase login --no-localhost', 'yellow');
    log('   This will give you a URL to visit in your browser.\n', 'yellow');
  }

  // Step 3: Set up Firestore security rules
  log('Step 3: Setting up Firestore security rules...', 'blue');
  const rulesPath = join(projectRoot, 'firestore.rules');
  
  const defaultRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /notes/{noteId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null;
    }
    match /assignments/{assignmentId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null;
    }
  }
}
`;
  
  if (!existsSync(rulesPath)) {
    writeFileSync(rulesPath, defaultRules);
    log('✅ Created firestore.rules file', 'green');
  } else {
    const existingRules = readFileSync(rulesPath, 'utf-8');
    // Check if it has the basic structure we need
    if (!existingRules.includes('match /notes/') || !existingRules.includes('match /assignments/')) {
      log('⚠️  firestore.rules exists but may be missing required rules.', 'yellow');
      log('   Consider updating it with the rules for notes and assignments collections.', 'yellow');
    } else {
      log('✅ firestore.rules already exists with required rules', 'green');
    }
  }
  
  // Update firebase.json to include Firestore rules if not present
  if (existsSync(firebaseJsonPath)) {
    try {
      const firebaseJson = JSON.parse(readFileSync(firebaseJsonPath, 'utf-8'));
      if (!firebaseJson.firestore) {
        firebaseJson.firestore = {
          rules: 'firestore.rules'
        };
        writeFileSync(firebaseJsonPath, JSON.stringify(firebaseJson, null, 2) + '\n');
        log('✅ Updated firebase.json to include Firestore rules', 'green');
      }
    } catch (e) {
      log('⚠️  Could not update firebase.json (this is okay if Firestore is already configured)', 'yellow');
    }
  }

  // Step 4: Check environment configuration
  log('\nStep 4: Checking environment configuration...', 'blue');
  const envPath = join(projectRoot, '.env');
  const envExamplePath = join(projectRoot, '.env.example');
  
  if (existsSync(envPath)) {
    log('✅ Found .env file', 'green');
    const envContent = readFileSync(envPath, 'utf-8');
    const hasAllVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_STORAGE_BUCKET',
      'VITE_FIREBASE_MESSAGING_SENDER_ID',
      'VITE_FIREBASE_APP_ID'
    ].every(varName => envContent.includes(varName));
    
    if (hasAllVars) {
      log('✅ .env file appears to have all required Firebase configuration variables', 'green');
    } else {
      log('⚠️  .env file exists but may be missing some Firebase configuration variables', 'yellow');
      log('   Make sure all VITE_FIREBASE_* variables are set', 'yellow');
    }
  } else {
    log('⚠️  No .env file found', 'yellow');
    log('   You need to create a .env file with your Firebase configuration', 'yellow');
  }
  
  // Create .env.example if it doesn't exist
  const envExample = `# Firebase Configuration
# Get these values from Firebase Console > Project Settings > Your apps > Web app config
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
`;
  
  if (!existsSync(envExamplePath)) {
    writeFileSync(envExamplePath, envExample);
    log('✅ Created .env.example file as a template', 'green');
  }

  // Step 5: Instructions for remaining manual steps
  log('\n' + '='.repeat(60), 'bright');
  log('📋 Next Steps (if not already done):', 'bright');
  log('='.repeat(60) + '\n', 'bright');

  log('1. Link to your existing Firebase project (if not already linked):', 'blue');
  log('   firebase use --add', 'yellow');
  log('   Then select your project from the list.\n', 'yellow');

  log('2. Enable Authentication (if not already enabled):', 'blue');
  log('   - Go to Firebase Console > Authentication', 'yellow');
  log('   - Click "Get started" if needed', 'yellow');
  log('   - Enable "Email/Password" sign-in method\n', 'yellow');

  log('3. Enable Firestore Database (if not already enabled):', 'blue');
  log('   - Go to Firebase Console > Firestore Database', 'yellow');
  log('   - Click "Create database" if needed', 'yellow');
  log('   - Choose location and mode (test mode for development)\n', 'yellow');

  log('4. Get Firebase Configuration (if .env is not set up):', 'blue');
  log('   - Go to Firebase Console > Project Settings', 'yellow');
  log('   - Scroll to "Your apps" section', 'yellow');
  log('   - Click web icon (</>) to add a web app (if not already added)', 'yellow');
  log('   - Copy the config values to your .env file\n', 'yellow');

  log('5. Deploy Firestore Rules (optional but recommended):', 'blue');
  log('   firebase deploy --only firestore:rules\n', 'yellow');

  log('✅ Setup script completed!', 'green');
  log('\nFor more details, see FIREBASE_SETUP.md\n', 'bright');
}

main().catch((error) => {
  log(`\n❌ Error: ${error.message}`, 'red');
  process.exit(1);
});

