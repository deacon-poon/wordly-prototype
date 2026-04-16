import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  ...(process.env.EXPORT_MODE === '1' ? {
    basePath: '/design-system',
    output: 'export',
  } : {}),
};

export default withMDX(nextConfig);
