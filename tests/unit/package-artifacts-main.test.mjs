import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { main as packageArtifactsMain } from '../../scripts/package-artifacts.mjs';

function makeTempProjectRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'cla-package-artifacts-main-'));
}

function createSampleAppBundle(tempRoot) {
  const bundleRoot = path.join(tempRoot, 'src-tauri', 'target', 'release', 'bundle');
  const appBundlePath = path.join(bundleRoot, 'macos', 'ChurchLive.app');
  fs.mkdirSync(path.join(appBundlePath, 'Contents'), { recursive: true });
  fs.writeFileSync(path.join(appBundlePath, 'Contents', 'Info.plist'), '<plist/>', 'utf8');
  return appBundlePath;
}

function createIoCapture() {
  const out = { logs: [], errors: [] };
  return {
    out,
    io: {
      log: (line) => out.logs.push(String(line)),
      error: (line) => out.errors.push(String(line))
    }
  };
}

test('package-artifacts main uses zip branch and reports spawn error details', (t) => {
  const tempRoot = makeTempProjectRoot();
  t.after(() => fs.rmSync(tempRoot, { recursive: true, force: true }));
  const appBundlePath = createSampleAppBundle(tempRoot);
  const { out, io } = createIoCapture();

  const exitCode = packageArtifactsMain({
    cwd: tempRoot,
    platform: 'linux',
    io,
    spawnSyncImpl: () => ({
      status: 1,
      stderr: Buffer.from('zip failed'),
      error: new Error('spawn zip ENOENT')
    })
  });

  assert.equal(exitCode, 1);
  assert.match(out.errors.join('\n'), new RegExp(`Failed to zip app bundle ${appBundlePath}: spawn zip ENOENT`));
  assert.match(out.errors.join('\n'), /Failed to zip app bundle ChurchLive\.app: zip failed/);
});

test('package-artifacts main handles archiver failure without spawn error object', (t) => {
  const tempRoot = makeTempProjectRoot();
  t.after(() => fs.rmSync(tempRoot, { recursive: true, force: true }));
  createSampleAppBundle(tempRoot);
  const { out, io } = createIoCapture();

  const exitCode = packageArtifactsMain({
    cwd: tempRoot,
    platform: 'linux',
    io,
    spawnSyncImpl: () => ({
      status: 1,
      stderr: Buffer.from('permission denied')
    })
  });

  assert.equal(exitCode, 1);
  assert.equal(out.errors.some((line) => line.includes('spawn zip ENOENT')), false);
  assert.match(out.errors.join('\n'), /Failed to zip app bundle ChurchLive\.app: permission denied/);
});
