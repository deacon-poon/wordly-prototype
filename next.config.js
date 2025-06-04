/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
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
  experimental: {
    // Exclude mobile-app from compilation
    outputFileTracingExcludes: {
      "*": ["./mobile-app/**/*"],
    },
  },
};

module.exports = nextConfig;
