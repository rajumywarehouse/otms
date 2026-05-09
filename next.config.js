/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'otms-storage.s3.amazonaws.com'],
    unoptimized: true,
  },
  experimental: {},
};

module.exports = nextConfig;
