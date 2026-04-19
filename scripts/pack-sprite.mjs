#!/usr/bin/env node
// Pack a Godmode bbox PNG + JSON into a tight horizontal sprite sheet
// that CSS `steps()` can animate via background-position-x.
//
// Usage:
//   node scripts/pack-sprite.mjs <bbox.png> <bbox.json> <out.png>
//
// Every frame is normalized to the maximum frame width × height found
// across the JSON. Sprites are bottom-center anchored so the base of
// the object (candle stand, horse hooves) stays pinned across frames.

import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const [, , inputPng, inputJson, outputPng] = process.argv;
if (!inputPng || !inputJson || !outputPng) {
  console.error('usage: pack-sprite.mjs <bbox.png> <bbox.json> <out.png>');
  process.exit(1);
}

const frames = JSON.parse(await readFile(inputJson, 'utf8'));
const maxWidth = frames.reduce((m, f) => Math.max(m, f.width), 0);
const maxHeight = frames.reduce((m, f) => Math.max(m, f.height), 0);

console.log(
  `${frames.length} frames · per-frame canvas ${maxWidth}×${maxHeight}`,
);

const composites = [];
for (const f of frames) {
  const cropped = await sharp(inputPng)
    .extract({ left: f.x, top: f.y, width: f.width, height: f.height })
    .png()
    .toBuffer();

  const xOffset =
    f.frameIndex * maxWidth + Math.round((maxWidth - f.width) / 2);
  const yOffset = maxHeight - f.height;

  composites.push({ input: cropped, left: xOffset, top: yOffset });
}

await sharp({
  create: {
    width: maxWidth * frames.length,
    height: maxHeight,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite(composites)
  .png()
  .toFile(outputPng);

const outDims = `${maxWidth * frames.length}×${maxHeight}`;
console.log(`→ ${path.relative(process.cwd(), outputPng)}`);
console.log(`  packed ${outDims} · frame ${maxWidth}×${maxHeight} · ${frames.length} frames`);
