import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateTargets,
  missingKeysForEnv,
  resolveTargets
} from '../../scripts/lib/check-signing-env-lib.mjs';

test('resolveTargets supports all and single platform', () => {
  assert.deepEqual(resolveTargets('all'), ['mac', 'win', 'updater']);
  assert.deepEqual(resolveTargets('mac'), ['mac']);
  assert.equal(resolveTargets('unknown'), null);
});

test('missingKeysForEnv treats empty and whitespace as missing', () => {
  const env = {
    APPLE_CERTIFICATE: 'value',
    APPLE_CERTIFICATE_PASSWORD: '',
    APPLE_SIGNING_IDENTITY: '   '
  };
  const missing = missingKeysForEnv(
    ['APPLE_CERTIFICATE', 'APPLE_CERTIFICATE_PASSWORD', 'APPLE_SIGNING_IDENTITY'],
    env
  );
  assert.deepEqual(missing, ['APPLE_CERTIFICATE_PASSWORD', 'APPLE_SIGNING_IDENTITY']);
});

test('evaluateTargets returns missing keys per target', () => {
  const env = {
    APPLE_CERTIFICATE: 'a',
    APPLE_CERTIFICATE_PASSWORD: 'b',
    APPLE_SIGNING_IDENTITY: 'c',
    APPLE_ID: '',
    APPLE_PASSWORD: 'e',
    APPLE_TEAM_ID: 'f'
  };
  const result = evaluateTargets('mac', env);
  assert.equal(result.error, null);
  assert.equal(result.targets.length, 1);
  assert.deepEqual(result.targets[0], {
    target: 'mac',
    missing: ['APPLE_ID']
  });
});

test('evaluateTargets returns error for unknown target', () => {
  const result = evaluateTargets('linux', {});
  assert.equal(result.error, 'Unknown platform target: linux');
  assert.deepEqual(result.targets, []);
});
