import { evaluateTargets } from './lib/check-signing-env-lib.mjs';

const platform = process.argv[2] || 'all';
const evaluation = evaluateTargets(platform, process.env);

if (evaluation.error) {
  console.error(evaluation.error);
  console.error('Use one of: mac, win, updater, all');
  process.exit(1);
}

let hasMissing = false;
for (const { target, missing } of evaluation.targets) {
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
