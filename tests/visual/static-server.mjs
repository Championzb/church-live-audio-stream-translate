import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const PORT = Number(process.env.VISUAL_PORT || 4173);
const ROOT = join(process.cwd(), 'src');

const CONTENT_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

const server = createServer(async (req, res) => {
  try {
    const urlPath = (req.url || '/').split('?')[0];
    const requestPath = urlPath === '/' ? '/index.html' : urlPath;
    const safePath = normalize(requestPath).replace(/^(\.\.[/\\])+/, '');
    const absolutePath = join(ROOT, safePath);
    const body = await readFile(absolutePath);
    const contentType = CONTENT_TYPES[extname(absolutePath)] || 'application/octet-stream';
    res.writeHead(200, { 'content-type': contentType });
    res.end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
});

server.listen(PORT, '127.0.0.1', () => {
  // eslint-disable-next-line no-console
  console.log(`visual static server listening on http://127.0.0.1:${PORT}`);
});
