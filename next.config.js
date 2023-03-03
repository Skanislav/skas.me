/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    mdxRs: true,
    typedRoutes: false
  }
}

const withMDX = require('@next/mdx')()
module.exports = withMDX(nextConfig)