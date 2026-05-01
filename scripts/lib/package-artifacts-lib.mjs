import fs from 'node:fs';
import path from 'node:path';

export function walkFiles(dir) {
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkFiles(full));
    } else if (entry.isFile()) {
      out.push(full);
    }
  }
  return out;
}

export function walkAppBundles(dir) {
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.toLowerCase().endsWith('.app')) {
        out.push(full);
      } else {
        out.push(...walkAppBundles(full));
      }
    }
  }
  return out;
}

export function filterBundleFiles(files) {
  return files.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return ['.dmg', '.app', '.msi', '.exe', '.deb', '.rpm'].includes(ext);
  });
}
