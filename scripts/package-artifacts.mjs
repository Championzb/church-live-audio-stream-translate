import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const projectRoot = process.cwd();
const bundleRoot = path.join(projectRoot, 'src-tauri', 'target', 'release', 'bundle');
const distRoot = path.join(projectRoot, 'dist');

function walkFiles(dir) {
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

if (!fs.existsSync(bundleRoot)) {
  console.error(`No bundle output found at: ${bundleRoot}`);
  console.error('Run `npm run build` or platform-specific build first.');
  process.exit(1);
}

fs.rmSync(distRoot, { recursive: true, force: true });
fs.mkdirSync(distRoot, { recursive: true });

const allFiles = walkFiles(bundleRoot).filter((file) => {
  const ext = path.extname(file).toLowerCase();
  return ['.dmg', '.app', '.msi', '.exe', '.deb', '.rpm'].includes(ext);
});

if (!allFiles.length) {
  console.error('No bundle artifacts found in bundle output directory.');
  process.exit(1);
}

const checksums = [];

for (const file of allFiles) {
  const rel = path.relative(bundleRoot, file);
  const outFile = path.join(distRoot, path.basename(file));
  fs.copyFileSync(file, outFile);

  const hash = crypto.createHash('sha256').update(fs.readFileSync(outFile)).digest('hex');
  checksums.push(`${hash}  ${path.basename(outFile)}`);

  console.log(`Copied: ${rel} -> dist/${path.basename(outFile)}`);
}

const checksumsPath = path.join(distRoot, 'SHA256SUMS.txt');
fs.writeFileSync(checksumsPath, `${checksums.join('\n')}\n`, 'utf8');

console.log(`\nWrote checksums: dist/${path.basename(checksumsPath)}`);
console.log('Distribution artifacts are ready in dist/');
