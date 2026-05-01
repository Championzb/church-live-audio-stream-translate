export const requiredByPlatform = {
  mac: [
    'APPLE_CERTIFICATE',
    'APPLE_CERTIFICATE_PASSWORD',
    'APPLE_SIGNING_IDENTITY',
    'APPLE_ID',
    'APPLE_PASSWORD',
    'APPLE_TEAM_ID'
  ],
  win: ['WINDOWS_CERTIFICATE', 'WINDOWS_CERTIFICATE_PASSWORD'],
  updater: ['TAURI_SIGNING_PRIVATE_KEY', 'TAURI_SIGNING_PRIVATE_KEY_PASSWORD']
};

export function missingKeysForEnv(keys, env = process.env) {
  return keys.filter((key) => !env[key] || !String(env[key]).trim());
}

export function resolveTargets(platform) {
  if (platform === 'all') {
    return ['mac', 'win', 'updater'];
  }
  if (requiredByPlatform[platform]) {
    return [platform];
  }
  return null;
}

export function evaluateTargets(platform, env = process.env) {
  const targets = resolveTargets(platform);
  if (!targets) {
    return { error: `Unknown platform target: ${platform}`, targets: [] };
  }

  const results = targets.map((target) => ({
    target,
    missing: missingKeysForEnv(requiredByPlatform[target], env)
  }));
  return { error: null, targets: results };
}
