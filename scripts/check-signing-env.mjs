import { evaluateTargets } from './lib/check-signing-env-lib.mjs';
import { pathToFileURL } from 'node:url';

export function main(args = process.argv.slice(2), env = process.env, io = console) {
  const platform = args[0] || 'all';
  const evaluation = evaluateTargets(platform, env);

  if (evaluation.error) {
    io.error(evaluation.error);
    io.error('Use one of: mac, win, updater, all');
    return 1;
  }

  let hasMissing = false;
  for (const { target, missing } of evaluation.targets) {
    if (!missing.length) {
      io.log(`[ok] ${target}: all required env vars present`);
    } else {
      hasMissing = true;
      io.log(`[missing] ${target}: ${missing.join(', ')}`);
    }
  }

  return hasMissing ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(main());
}
