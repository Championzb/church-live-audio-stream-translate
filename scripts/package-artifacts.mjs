import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { walkFiles, walkAppBundles, filterBundleFiles } from './lib/package-artifacts-lib.mjs';

const projectRoot = process.cwd();
const bundleRoot = path.join(projectRoot, 'src-tauri', 'target', 'release', 'bundle');
const distRoot = path.join(projectRoot, 'dist');

if (!fs.existsSync(bundleRoot)) {
  console.error(`No bundle output found at: ${bundleRoot}`);
  console.error('Run `npm run build` or platform-specific build first.');
  process.exit(1);
}

fs.rmSync(distRoot, { recursive: true, force: true });
fs.mkdirSync(distRoot, { recursive: true });

const allFiles = filterBundleFiles(walkFiles(bundleRoot));
const appBundles = walkAppBundles(bundleRoot);

if (!allFiles.length && !appBundles.length) {
  console.error('No bundle artifacts found in bundle output directory.');
  process.exit(1);
}

const checksums = [];

for (const file of allFiles) {
  const rel = path.relative(bundleRoot, file);
  const outFile = path.join(distRoot, path.basename(file));
  fs.copyFileSync(file, outFile);

  const hash = crypto.createHash('sha256').update(fs.readFileSync(outFile)).digest('hex');
  checksums.push(`${hash}  ${path.basename(outFile)}`);

  console.log(`Copied: ${rel} -> dist/${path.basename(outFile)}`);
}

for (const appBundle of appBundles) {
  const bundleName = path.basename(appBundle);
  const zipName = `${path.basename(appBundle)}.zip`;
  const zipPath = path.join(distRoot, zipName);
  let result;

  if (process.platform === 'darwin') {
    // Preserve macOS bundle metadata and resource forks for .app packaging.
    result = spawnSync('ditto', ['-c', '-k', '--sequesterRsrc', '--keepParent', appBundle, zipPath]);
  } else {
    const cwd = path.dirname(appBundle);
    const bundleName = path.basename(appBundle);
    result = spawnSync('zip', ['-r', zipPath, bundleName], { cwd });
  }

  if (result.status !== 0) {
    if (result.error) {
      console.error(`Failed to zip app bundle ${appBundle}: ${result.error.message}`);
    }
    const err = Buffer.from(result.stderr || '').toString('utf8');
    console.error(`Failed to zip app bundle ${bundleName}: ${err}`);
    process.exit(1);
  }

  const hash = crypto.createHash('sha256').update(fs.readFileSync(zipPath)).digest('hex');
  checksums.push(`${hash}  ${path.basename(zipPath)}`);
  console.log(`Packed: ${path.relative(bundleRoot, appBundle)} -> dist/${zipName}`);
}

const checksumsPath = path.join(distRoot, 'SHA256SUMS.txt');
fs.writeFileSync(checksumsPath, `${checksums.join('\n')}\n`, 'utf8');

console.log(`\nWrote checksums: dist/${path.basename(checksumsPath)}`);
console.log('Distribution artifacts are ready in dist/');
