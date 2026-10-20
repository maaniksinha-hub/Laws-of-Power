// Tiny zero-dependency static file server so ES modules load over http://.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)));
const PORT = Number(process.env.PORT) || 8080;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json',
};
const BLOCKED = /^\/(\.git|node_modules|tests|tools|references)(\/|$)/;

export function createGameServer() {
  return createServer(async (req, res) => {
    try {
      let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (path.endsWith('/')) path += 'index.html';
      if (BLOCKED.test(path)) { res.writeHead(404); return res.end('Not found'); }
      const file = normalize(join(ROOT, path));
      if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end('Forbidden'); }
      const info = await stat(file);
      if (!info.isFile()) throw new Error('not a file');
      res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
      res.end(await readFile(file));
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
    }
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  createGameServer().listen(PORT, () => console.log(`48: Laws of Power running at http://localhost:${PORT}`));
}
