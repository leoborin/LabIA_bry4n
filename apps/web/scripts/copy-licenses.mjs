import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const lock = JSON.parse(await readFile(new URL('package-lock.json', root), 'utf8'));
const notices = [];
for (const [path, entry] of Object.entries(lock.packages)) {
  if (!path.startsWith('node_modules/') || entry.dev) continue;
  const directory = new URL(`${path}/`, root);
  const files = await readdir(directory);
  const license = files.find((name) => /^(license|licence|copying)(\.(md|txt))?$/i.test(name));
  if (!license) throw new Error(`Runtime dependency without a license file: ${path}`);
  notices.push(
    `${path.slice('node_modules/'.length)} ${entry.version}\n${await readFile(new URL(license, directory), 'utf8')}`,
  );
}
const output = new URL('dist/licenses/', root);
await mkdir(output, { recursive: true });
await writeFile(
  new URL('third-party.txt', output),
  notices.join('\n\n----------------------------------------\n\n'),
);
console.log(`Licenças de ${notices.length} dependências de runtime incluídas no build.`);
