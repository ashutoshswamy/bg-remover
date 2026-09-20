# Matte

Background remover that runs entirely in your browser. Upload up to 5 photos, the model pulls the subject off the backdrop, download the cutouts as transparent PNGs — nothing ever leaves your device.

## Features

- Upload up to 5 images at once
- Background removal runs client-side (WASM, no server round-trip, no upload)
- Per-image status: queued → keying → composited
- Download each cutout as a transparent PNG

## Tech stack

- [Next.js](https://nextjs.org) (App Router)
- React 19 + TypeScript
- Tailwind CSS
- [`@imgly/background-removal`](https://www.npmjs.com/package/@imgly/background-removal) for in-browser background removal

## SEO

- Metadata, OpenGraph/Twitter cards, canonical URL set for `mattebgremover.ashutoshswamy.in`
- `app/robots.ts` + `app/sitemap.ts` (Next.js file conventions)
- Social preview image: `public/og-image.png`

## Getting started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — lint the codebase

## Author

Built by [Ashutosh Swamy](https://ashutoshswamy.in)

- Portfolio: [ashutoshswamy.in](https://ashutoshswamy.in)
- GitHub: [@ashutoshswamy](https://github.com/ashutoshswamy)
- LinkedIn: [ashutoshswamy](https://linkedin.com/in/ashutoshswamy)
- X: [@ashutoshswamy_](https://x.com/ashutoshswamy_)
