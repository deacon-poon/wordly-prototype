const createWithVercelToolbar = require('@vercel/toolbar/plugins/next');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Exclude mobile-app directory from compilation
  pageExtensions: ["tsx", "ts", "jsx", "js"],
  webpack: (config) => {
    // Exclude mobile-app directory from webpack compilation
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ["**/mobile-app/**", "**/node_modules/**"],
    };

    // Exclude mobile-app from module resolution
    config.module.rules.push({
      test: /\.(tsx?|jsx?)$/,
      exclude: [/node_modules/, /mobile-app/],
    });

    return config;
  },
  // Exclude mobile-app from TypeScript compilation
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Move outputFileTracingExcludes out of experimental
  outputFileTracingExcludes: {
    "*": ["./mobile-app/**/*"],
  },
};

const withVercelToolbar = createWithVercelToolbar();
module.exports = withVercelToolbar(nextConfig);
