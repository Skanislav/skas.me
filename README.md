# skas.me

A static MDX blog built with **Next.js 16** (App Router), deployed to **IPFS** and served via **ENS**.

## Requirements

- Node **22** (see `.nvmrc`; anything ≥ 20.9 works). With nvm: `nvm use`.

## Develop

```bash
npm install
npm run dev          # http://localhost:3000
```

Posts are `.mdx` files in `posts/epf/`. Each one is rendered at `/epf/<filename>` and listed on `/epf`.
Shared MDX element styling lives in `mdx-components.tsx`.

## Build (static export)

```bash
npm run build        # emits a fully static site to ./out
npm run preview      # serve ./out locally to sanity-check
```

The site is configured for static hosting in `next.config.js`:

- `output: 'export'` — plain HTML/JS/CSS, no server needed.
- `trailingSlash: true` — generates `epf/<post>/index.html` so IPFS gateways resolve routes (without it, every route but `/` 404s).
- `images: { unoptimized: true }` — there is no image-optimization server on IPFS.

Dynamic post routes are enumerated at build time via `generateStaticParams` in
`app/epf/[postName]/page.tsx`, so every post becomes its own static page.

## Deploy to IPFS + ENS

One-time setup: `cp .env.example .env` and fill it in.

```bash
npm run deploy       # build + pin to IPFS (prints the CID, saves it to .cid)
```

`deploy` runs `build` then `pin`. To pin separately: `npm run pin`.

> [!IMPORTANT]
> **Hard gate — do not set the contenthash until this passes.** Open the preview URL printed
> by `pin` (`https://dweb.link/ipfs/<cid>/`) and confirm the site renders at the **root** of
> the CID, not nested under a folder. The whole ENS → eth.limo chain only works if
> `index.html` is at the CID root. If it ever nests, pin with the
> `ipfs add -r --cid-version 1 out` fallback below (root-clean by construction).

Then point the ENS name's contenthash at the CID (one mainnet transaction — costs gas,
signed by the account that owns/manages the name).

Do it in the browser — no private key needed:

1. Open [app.ens.domains](https://app.ens.domains), connect your wallet, and select your name.
2. **Records → Content Hash → Edit**, set it to `ipfs://<cid>` (the CID from `npm run pin` / `.cid`).
3. Save and **sign in MetaMask**. The ENS app encodes the contenthash and, if the name has no
   resolver yet, prompts you to set the Public Resolver first.

The name then resolves at `https://you.eth.limo/` (and `https://you.eth.link/`).

### CI

`.github/workflows/deploy.yml` builds and pins on every push to `main` (set repo secrets
`PINATA_JWT` and optionally `PINATA_GATEWAY`), then writes the CID to the job summary.
Pointing ENS at the new CID is a manual step in the ENS app (no on-chain key in CI).

### Alternative pinning

Prefer not to use Pinata? You can pin `out/` with any IPFS tool, e.g. BuidlGuidl's
key-free uploader (`npx bgipfs upload out`) or `ipfs add -r --cid-version 1 out`, then
set the ENS contenthash to `ipfs://<cid>` in the ENS app.
