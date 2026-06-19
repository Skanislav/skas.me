const createMDX = require('@next/mdx')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emit a fully static site (`out/`) that can be pinned to IPFS and served via ENS.
  output: 'export',
  // IPFS/ENS gateways resolve directories to `index.html`; without trailing slashes
  // every route except `/` would 404. Generates `blog/index.html` instead of `blog.html`.
  trailingSlash: true,
  // There is no image-optimization server on IPFS, so images must be served as-is.
  images: { unoptimized: true },
  // Let `.md`/`.mdx` files act as content/pages.
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
}

const withMDX = createMDX()

module.exports = withMDX(nextConfig)
