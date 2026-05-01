import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  filterBundleFiles,
  walkAppBundles,
  walkFiles
} from '../../scripts/lib/package-artifacts-lib.mjs';

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'cla-package-artifacts-test-'));
}

test('walkFiles returns nested file paths', () => {
  const root = makeTempDir();
  const nested = path.join(root, 'nested');
  fs.mkdirSync(nested, { recursive: true });
  const fileA = path.join(root, 'a.txt');
  const fileB = path.join(nested, 'b.msi');
  fs.writeFileSync(fileA, 'a', 'utf8');
  fs.writeFileSync(fileB, 'b', 'utf8');

  const files = walkFiles(root).sort();
  assert.deepEqual(files, [fileA, fileB].sort());
});

test('walkAppBundles finds .app directories recursively', () => {
  const root = makeTempDir();
  const bundle = path.join(root, 'mac', 'Church.app');
  const other = path.join(root, 'mac', 'Other');
  fs.mkdirSync(bundle, { recursive: true });
  fs.mkdirSync(other, { recursive: true });

  const bundles = walkAppBundles(root);
  assert.deepEqual(bundles, [bundle]);
});

test('filterBundleFiles keeps supported artifact extensions', () => {
  const files = [
    '/tmp/a.dmg',
    '/tmp/b.msi',
    '/tmp/c.app',
    '/tmp/d.exe',
    '/tmp/e.deb',
    '/tmp/f.rpm',
    '/tmp/g.zip',
    '/tmp/h.txt'
  ];
  assert.deepEqual(filterBundleFiles(files), [
    '/tmp/a.dmg',
    '/tmp/b.msi',
    '/tmp/c.app',
    '/tmp/d.exe',
    '/tmp/e.deb',
    '/tmp/f.rpm'
  ]);
});
