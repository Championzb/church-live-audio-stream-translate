import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const projectRoot = path.resolve(new URL('../..', import.meta.url).pathname);
const scriptPath = path.join(projectRoot, 'scripts', 'package-artifacts.mjs');

function makeTempProjectRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'cla-package-artifacts-cli-'));
}

function runPackageArtifacts(cwd) {
  return spawnSync(process.execPath, [scriptPath], {
    cwd,
    env: process.env,
    encoding: 'utf8'
  });
}

function canPackAppBundle() {
  if (process.platform === 'darwin') {
    return fs.existsSync('/usr/bin/ditto');
  }
  const probe = spawnSync('zip', ['--version'], { encoding: 'utf8' });
  return probe.status === 0;
}

test('package-artifacts exits when bundle output is missing', (t) => {
  const tempRoot = makeTempProjectRoot();
  t.after(() => fs.rmSync(tempRoot, { recursive: true, force: true }));

  const result = runPackageArtifacts(tempRoot);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /No bundle output found at:/);
  assert.match(result.stderr, /Run `npm run build` or platform-specific build first\./);
});

test('package-artifacts exits when bundle root has no supported artifacts', (t) => {
  const tempRoot = makeTempProjectRoot();
  t.after(() => fs.rmSync(tempRoot, { recursive: true, force: true }));

  const bundleRoot = path.join(tempRoot, 'src-tauri', 'target', 'release', 'bundle');
  fs.mkdirSync(bundleRoot, { recursive: true });
  fs.writeFileSync(path.join(bundleRoot, 'notes.txt'), 'not an artifact', 'utf8');

  const result = runPackageArtifacts(tempRoot);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /No bundle artifacts found in bundle output directory\./);
});

test('package-artifacts copies artifacts and writes checksums', (t) => {
  const tempRoot = makeTempProjectRoot();
  t.after(() => fs.rmSync(tempRoot, { recursive: true, force: true }));

  const bundleRoot = path.join(tempRoot, 'src-tauri', 'target', 'release', 'bundle');
  fs.mkdirSync(bundleRoot, { recursive: true });

  const dmgName = 'ChurchLive.dmg';
  const dmgSourcePath = path.join(bundleRoot, dmgName);
  const dmgContent = Buffer.from('fake-dmg-binary');
  fs.writeFileSync(dmgSourcePath, dmgContent);

  const result = runPackageArtifacts(tempRoot);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /Copied: ChurchLive\.dmg -> dist\/ChurchLive\.dmg/);
  assert.match(result.stdout, /Wrote checksums: dist\/SHA256SUMS\.txt/);

  const distPath = path.join(tempRoot, 'dist');
  const copiedPath = path.join(distPath, dmgName);
  assert.equal(fs.existsSync(copiedPath), true);
  assert.deepEqual(fs.readFileSync(copiedPath), dmgContent);

  const checksumPath = path.join(distPath, 'SHA256SUMS.txt');
  const checksumText = fs.readFileSync(checksumPath, 'utf8');
  const expectedHash = crypto.createHash('sha256').update(dmgContent).digest('hex');
  assert.match(checksumText, new RegExp(`${expectedHash}\\s+${dmgName}`));
});

test('package-artifacts packs app bundle into zip artifact', (t) => {
  if (!canPackAppBundle()) {
    t.skip('Required archiver command is unavailable in this environment.');
    return;
  }

  const tempRoot = makeTempProjectRoot();
  t.after(() => fs.rmSync(tempRoot, { recursive: true, force: true }));

  const bundleRoot = path.join(tempRoot, 'src-tauri', 'target', 'release', 'bundle');
  const appBundlePath = path.join(bundleRoot, 'macos', 'ChurchLive.app');
  fs.mkdirSync(path.join(appBundlePath, 'Contents'), { recursive: true });
  fs.writeFileSync(path.join(appBundlePath, 'Contents', 'Info.plist'), '<plist/>', 'utf8');

  const result = runPackageArtifacts(tempRoot);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /Packed: macos\/ChurchLive\.app -> dist\/ChurchLive\.app\.zip/);

  const zipPath = path.join(tempRoot, 'dist', 'ChurchLive.app.zip');
  assert.equal(fs.existsSync(zipPath), true);

  const checksumPath = path.join(tempRoot, 'dist', 'SHA256SUMS.txt');
  const checksumText = fs.readFileSync(checksumPath, 'utf8');
  assert.match(checksumText, /\s+ChurchLive\.app\.zip/);
});
