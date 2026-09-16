import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

async function readRootFile(name) {
  return readFile(path.join(rootDir, name), 'utf8');
}

async function readRootBuffer(name) {
  return readFile(path.join(rootDir, name));
}

test('manifest declares installable PWA metadata and mobile icons', async () => {
  const manifest = JSON.parse(await readRootFile('manifest.webmanifest'));

  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.id, './');
  assert.equal(manifest.start_url, './');
  assert.equal(manifest.scope, './');
  assert.equal(manifest.theme_color, '#0f172a');
  assert.equal(manifest.background_color, '#020617');

  const iconSizes = manifest.icons.map((icon) => icon.sizes);
  assert(iconSizes.includes('192x192'));
  assert(iconSizes.includes('512x512'));
  assert(manifest.icons.some((icon) => icon.purpose === 'maskable any'));
});

test('icon assets exist at the documented sizes', async () => {
  const expectedSizes = new Map([
    ['assets/icons/icon-180.png', 180],
    ['assets/icons/icon-192.png', 192],
    ['assets/icons/icon-512.png', 512],
    ['assets/icons/icon-maskable-512.png', 512]
  ]);

  await Promise.all(
    [...expectedSizes.entries()].map(async ([file, expectedSize]) => {
      const bytes = await readRootBuffer(file);
      assert.equal(bytes.toString('ascii', 1, 4), 'PNG');
      assert.equal(bytes.readUInt32BE(16), expectedSize);
      assert.equal(bytes.readUInt32BE(20), expectedSize);
    })
  );
});

test('html includes mobile install metadata and local-only app shell assets', async () => {
  const html = await readRootFile('index.html');

  assert.match(html, /rel="manifest" href="\.\/manifest\.webmanifest"/);
  assert.match(html, /apple-mobile-web-app-capable/);
  assert.match(html, /apple-touch-icon/);
  assert.match(html, /type="module" src="\.\/app\.js"/);
});

test('service worker caches the local app shell', async () => {
  const worker = await readRootFile('sw.js');

  assert.match(worker, /private-life-tracker-v1/);
  assert.match(worker, /\.\/manifest\.webmanifest/);
  assert.match(worker, /\.\/assets\/icons\/icon-192\.png/);
  assert.match(worker, /event\.request\.method !== 'GET'/);
  assert.match(worker, /requestUrl\.origin !== self\.location\.origin/);
});
