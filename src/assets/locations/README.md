# Real / AI location photos

This folder is the drop-in point for real or AI-generated hero photographs.
Nothing here is required for the site to build — every province and
district already renders a hand-curated or data-derived illustration
(`src/data/sceneArchetypes.js`) until a real asset shows up.

## Convention

```
src/assets/locations/provinces/<province-slug>/hero-real.jpg   (licensed real photo)
src/assets/locations/provinces/<province-slug>/hero-ai.jpg     (AI-generated photo)
src/assets/locations/districts/<province-slug>/<district-slug>/hero-real.jpg
src/assets/locations/districts/<province-slug>/<district-slug>/hero-ai.jpg
```

Accepted extensions: `.jpg`, `.jpeg`, `.png`, `.webp`. Only one hero per
location — `<Picture>` generates every responsive size/format from it
automatically (see `src/components/geography/LocationHero.astro`).

`hero-real.*` and `hero-ai.*` are mutually exclusive in effect: if both
exist, `hero-real.*` wins. Use `hero-real.*` only for a photo you have an
actual license/right to use; use `hero-ai.*` for an AI image generated from
that place's real, verified features (see
`content/image-generation-prompts.json` for ready-made prompts).

## After adding a file

1. Fill in the matching entry in `src/data/locationImageOverrides.ts`:
   - real photo → `credit: { author, sourceName, sourceUrl, license, licenseUrl, attributionRequired }`
   - AI photo → `aiMetadata: { provider, model, prompt, generatedAt, referenceLocation }`
2. Run `npm run images:validate` to confirm the manifest picked it up,
   credits are complete, and the file size/aspect ratio are reasonable.
3. `locationImageManifest.ts` auto-upgrades that location's `type` on the
   next build — no other code changes needed.
