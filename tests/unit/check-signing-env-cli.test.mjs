import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const projectRoot = path.resolve(new URL('../..', import.meta.url).pathname);
const scriptPath = path.join(projectRoot, 'scripts', 'check-signing-env.mjs');

function runCheckSigningEnv(args = [], env = {}) {
  return spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: projectRoot,
    env: { ...process.env, ...env },
    encoding: 'utf8'
  });
}

test('check-signing-env exits with usage for unknown target', () => {
  const result = runCheckSigningEnv(['linux']);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unknown platform target: linux/);
  assert.match(result.stderr, /Use one of: mac, win, updater, all/);
});

test('check-signing-env reports ok when win keys are present', () => {
  const result = runCheckSigningEnv(['win'], {
    WINDOWS_CERTIFICATE: 'cert',
    WINDOWS_CERTIFICATE_PASSWORD: 'password'
  });
  assert.equal(result.status, 0);
  assert.match(result.stdout, /\[ok\] win: all required env vars present/);
});

test('check-signing-env reports missing keys and exits non-zero', () => {
  const result = runCheckSigningEnv(['mac'], {
    APPLE_CERTIFICATE: 'cert',
    APPLE_CERTIFICATE_PASSWORD: 'password',
    APPLE_SIGNING_IDENTITY: 'identity',
    APPLE_ID: '',
    APPLE_PASSWORD: '',
    APPLE_TEAM_ID: ''
  });
  assert.equal(result.status, 1);
  assert.match(result.stdout, /\[missing\] mac:/);
  assert.match(result.stdout, /APPLE_ID/);
  assert.match(result.stdout, /APPLE_PASSWORD/);
  assert.match(result.stdout, /APPLE_TEAM_ID/);
});

test('check-signing-env defaults to all targets when no target is provided', () => {
  const result = runCheckSigningEnv([], {
    APPLE_CERTIFICATE: '',
    APPLE_CERTIFICATE_PASSWORD: '',
    APPLE_SIGNING_IDENTITY: '',
    APPLE_ID: '',
    APPLE_PASSWORD: '',
    APPLE_TEAM_ID: '',
    WINDOWS_CERTIFICATE: '',
    WINDOWS_CERTIFICATE_PASSWORD: '',
    TAURI_SIGNING_PRIVATE_KEY: '',
    TAURI_SIGNING_PRIVATE_KEY_PASSWORD: ''
  });
  assert.equal(result.status, 1);
  assert.match(result.stdout, /\[missing\] mac:/);
  assert.match(result.stdout, /\[missing\] win:/);
  assert.match(result.stdout, /\[missing\] updater:/);
});
