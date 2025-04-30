/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["arweave.net", "www.arweave.net", "quicknode.quicknode-ipfs.com"],
    unoptimized: true,
  },
}

module.exports = nextConfig
