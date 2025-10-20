import { existsSync } from 'fs';
import { rm } from 'fs/promises';
import path from 'path';

const cacheDir = path.join(process.cwd(), '.next', 'cache');

async function main() {
  if (!existsSync(cacheDir)) {
    return;
  }

  try {
    await rm(cacheDir, { recursive: true, force: true });
    console.log('[postbuild] Removed .next/cache to shrink deployment artifacts.');
  } catch (error) {
    console.warn('[postbuild] Failed to remove .next/cache:', error);
  }
}

await main();
