const platform = process.argv[2] || 'all';

const requiredByPlatform = {
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

function check(keys) {
  const missing = keys.filter((key) => !process.env[key] || !String(process.env[key]).trim());
  return missing;
}

let targets = [];
if (platform === 'all') {
  targets = ['mac', 'win', 'updater'];
} else if (requiredByPlatform[platform]) {
  targets = [platform];
} else {
  console.error(`Unknown platform target: ${platform}`);
  console.error('Use one of: mac, win, updater, all');
  process.exit(1);
}

let hasMissing = false;
for (const target of targets) {
  const missing = check(requiredByPlatform[target]);
  if (!missing.length) {
    console.log(`[ok] ${target}: all required env vars present`);
  } else {
    hasMissing = true;
    console.log(`[missing] ${target}: ${missing.join(', ')}`);
  }
}

if (hasMissing) {
  process.exit(1);
}
