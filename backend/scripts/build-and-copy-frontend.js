const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const frontendDir = path.join(root, '..', 'frontend');
const buildDir = path.join(root, 'build');

function log(...args) { console.log('[build-and-copy-frontend]', ...args); }

try {
  if (!fs.existsSync(frontendDir)) {
    log('Frontend folder not found at', frontendDir);
    process.exit(1);
  }

  log('Installing frontend dependencies...');
  execSync('npm ci', { stdio: 'inherit', cwd: frontendDir });

  log('Building frontend...');
  execSync('npm run build', { stdio: 'inherit', cwd: frontendDir });

  const frontendBuild = path.join(frontendDir, 'build');
  if (!fs.existsSync(frontendBuild)) {
    log('Frontend build output not found at', frontendBuild);
    process.exit(1);
  }

  // Remove existing backend build folder
  if (fs.existsSync(buildDir)) {
    log('Removing existing backend build folder:', buildDir);
    fs.rmSync(buildDir, { recursive: true, force: true });
  }

  log('Copying frontend build -> backend/build');

  // Use fs.cp if available (Node 16.7+), otherwise do recursive copy
  if (typeof fs.cp === 'function') {
    fs.cpSync(frontendBuild, buildDir, { recursive: true });
  } else {
    // naive recursive copy
    const copyRecursive = (src, dest) => {
      const stat = fs.statSync(src);
      if (stat.isDirectory()) {
        fs.mkdirSync(dest, { recursive: true });
        for (const entry of fs.readdirSync(src)) {
          copyRecursive(path.join(src, entry), path.join(dest, entry));
        }
      } else {
        fs.copyFileSync(src, dest);
      }
    };
    copyRecursive(frontendBuild, buildDir);
  }

  log('Frontend build copied successfully. backend/build is ready.');
  process.exit(0);
} catch (err) {
  console.error('[build-and-copy-frontend] Error:', err.message || err);
  process.exit(1);
}
