import { readdir, readFile, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = new URL('../dist/', import.meta.url);
const assets = new URL('assets/', dist);
for (const name of await readdir(assets)) {
  if (!/\.(js|css)$/.test(name)) continue;
  const path = join(fileURLToPath(assets), name);
  await writeFile(`${path}.gz`, gzipSync(await readFile(path), { level: 9 }));
}
await writeFile(
  new URL('index.html.gz', dist),
  gzipSync(await readFile(new URL('index.html', dist)), { level: 9 }),
);
console.log('Assets JS/CSS/HTML pré-comprimidos com gzip.');
