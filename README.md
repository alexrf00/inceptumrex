# inceptumrex.com

The portfolio of Alex M. Rodriguez (InceptumRex): every project pasted on one wall of
posters, then set straight on paper below it.

## Run it

```bash
npm install
npm run dev
```

`npm run build` builds the static site; its `postbuild` step regenerates `sitemap.xml` and
`robots.txt` with next-sitemap. Deploys run on Vercel.

## Where things live

| What | File |
|---|---|
| Every fact, line of copy and screenshot list | `src/content/work.ts` |
| The wall's posters (size, color, text, image crop) | `src/components/wall/posters.ts` |
| Poster positions per screen size | `src/app/globals.css`, the `[data-poster=...]` rules |
| The HTML poster (accessible, and the no-WebGL wall) | `src/components/wall/Poster.tsx` |
| The three.js paper (lighting, corner curl, shadows) | `src/components/wall/wall-scene.ts` |
| The canvas that paints each poster's WebGL texture | `src/components/wall/poster-texture.ts` |
| The paper program, résumé and contact flyer | `src/components/paper/` |
| Product truth, claims to avoid, evidence | `PRODUCT.md` |

## Adding or changing a project

1. Add the images to `public/work/` as WebP and embed where they came from:
   `impeccable embed-prompt public/work/<file>.webp --prompt "ORIGIN: ..."`.
2. Add the project to `featured` (full paper entry) or `minor` (one line on the bill) in
   `src/content/work.ts`.
3. To give it a poster on the wall, add a spec in `posters.ts` and a position rule in
   `globals.css`; the lineup poster lists minor projects by id.

Poster sizes are in `cqw`, percent of the poster's own width. `Poster.tsx` and
`poster-texture.ts` read the same numbers (`imageLayout`, `lineupTops`), so the HTML poster
and its three.js paper twin always agree. Change a number in one place only.

## How the wall behaves

- The HTML posters render first, with a short paste-up entrance.
- When motion is allowed and data saver is off, three.js loads after the page is idle, paints
  each poster onto lit paper and takes over. The HTML posters stay underneath as the links,
  the focus targets and the text screen readers read.
- The corner nearest the pointer curls; keyboard focus curls the bottom-right corner.
  Nothing renders while nothing moves.
- Under `prefers-reduced-motion` or without WebGL, the HTML wall is the wall.

## Contact form

The flyer posts to the same Basin form endpoint as the old site, with the same field names
and order: `name`, `phone` (optional), `email`, `message`.

## Never publish

Secrets or keys, personal documents, other people's data (for example LuzRD chat names),
confidential dashboards, client logos without permission, unknown-source art, or numbers
that do not come from real data. See `PRODUCT.md`.
