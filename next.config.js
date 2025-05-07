/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Enable additional debugging for CSS
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig;
