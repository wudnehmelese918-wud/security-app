/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '5000', pathname: '/uploads/**' },
      { protocol: 'https', hostname: '**' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.BACKEND_URL 
          ? `${process.env.BACKEND_URL}/api/:path*` 
          : 'http://localhost:5000/api/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: process.env.BACKEND_URL 
          ? `${process.env.BACKEND_URL}/uploads/:path*` 
          : 'http://localhost:5000/uploads/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
