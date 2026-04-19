#!/usr/bin/env node
// @astrojs/vercel@7 hard-codes nodejs18.x, which Vercel has deprecated.
// We're pinned to v7 until the Astro 5 upgrade (v8+ requires it), so
// patch the generated function config in place to nodejs20.x.
//
// Remove this script once Astro 5 + @astrojs/vercel@>=10 land.

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

async function findConfigs(dir) {
  const results = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await findConfigs(path)));
    } else if (entry.name === '.vc-config.json') {
      results.push(path);
    }
  }
  return results;
}

const configs = await findConfigs('.vercel/output');

if (configs.length === 0) {
  console.error(
    '[patch-vercel-runtime] no .vc-config.json files found under .vercel/output',
  );
  process.exit(1);
}

for (const path of configs) {
  const raw = await readFile(path, 'utf8');
  const cfg = JSON.parse(raw);
  if (cfg.runtime === 'nodejs18.x') {
    cfg.runtime = 'nodejs20.x';
    await writeFile(path, JSON.stringify(cfg, null, '\t'));
    console.log(
      `[patch-vercel-runtime] ${path}: nodejs18.x → nodejs20.x`,
    );
  } else {
    console.log(
      `[patch-vercel-runtime] ${path}: already ${cfg.runtime}`,
    );
  }
}
