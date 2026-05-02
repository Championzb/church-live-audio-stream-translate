import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { walkFiles, walkAppBundles, filterBundleFiles } from './lib/package-artifacts-lib.mjs';

export function main(options = {}) {
  const {
    cwd = process.cwd(),
    platform = process.platform,
    fsImpl = fs,
    pathImpl = path,
    cryptoImpl = crypto,
    spawnSyncImpl = spawnSync,
    io = console
  } = options;
  const projectRoot = cwd;
  const bundleRoot = pathImpl.join(projectRoot, 'src-tauri', 'target', 'release', 'bundle');
  const distRoot = pathImpl.join(projectRoot, 'dist');

  if (!fsImpl.existsSync(bundleRoot)) {
    io.error(`No bundle output found at: ${bundleRoot}`);
    io.error('Run `npm run build` or platform-specific build first.');
    return 1;
  }

  fsImpl.rmSync(distRoot, { recursive: true, force: true });
  fsImpl.mkdirSync(distRoot, { recursive: true });

  const allFiles = filterBundleFiles(walkFiles(bundleRoot));
  const appBundles = walkAppBundles(bundleRoot);

  if (!allFiles.length && !appBundles.length) {
    io.error('No bundle artifacts found in bundle output directory.');
    return 1;
  }

  const checksums = [];

  for (const file of allFiles) {
    const rel = pathImpl.relative(bundleRoot, file);
    const outFile = pathImpl.join(distRoot, pathImpl.basename(file));
    fsImpl.copyFileSync(file, outFile);

    const hash = cryptoImpl.createHash('sha256').update(fsImpl.readFileSync(outFile)).digest('hex');
    checksums.push(`${hash}  ${pathImpl.basename(outFile)}`);

    io.log(`Copied: ${rel} -> dist/${pathImpl.basename(outFile)}`);
  }

  for (const appBundle of appBundles) {
    const bundleName = pathImpl.basename(appBundle);
    const zipName = `${pathImpl.basename(appBundle)}.zip`;
    const zipPath = pathImpl.join(distRoot, zipName);
    let result;

    if (platform === 'darwin') {
      // Preserve macOS bundle metadata and resource forks for .app packaging.
      result = spawnSyncImpl('ditto', ['-c', '-k', '--sequesterRsrc', '--keepParent', appBundle, zipPath]);
    } else {
      const zipCwd = pathImpl.dirname(appBundle);
      const bundleDirName = pathImpl.basename(appBundle);
      result = spawnSyncImpl('zip', ['-r', zipPath, bundleDirName], { cwd: zipCwd });
    }

    if (result.status !== 0) {
      if (result.error) {
        io.error(`Failed to zip app bundle ${appBundle}: ${result.error.message}`);
      }
      const err = Buffer.from(result.stderr || '').toString('utf8');
      io.error(`Failed to zip app bundle ${bundleName}: ${err}`);
      return 1;
    }

    const hash = cryptoImpl.createHash('sha256').update(fsImpl.readFileSync(zipPath)).digest('hex');
    checksums.push(`${hash}  ${pathImpl.basename(zipPath)}`);
    io.log(`Packed: ${pathImpl.relative(bundleRoot, appBundle)} -> dist/${zipName}`);
  }

  const checksumsPath = pathImpl.join(distRoot, 'SHA256SUMS.txt');
  fsImpl.writeFileSync(checksumsPath, `${checksums.join('\n')}\n`, 'utf8');

  io.log(`\nWrote checksums: dist/${pathImpl.basename(checksumsPath)}`);
  io.log('Distribution artifacts are ready in dist/');
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(main());
}
