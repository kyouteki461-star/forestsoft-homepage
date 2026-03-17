/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/index'
      },
      {
        source: '/:path*',
        destination: '/index.html'
      }
    ]
  }
}

module.exports = nextConfig