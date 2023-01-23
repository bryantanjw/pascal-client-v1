/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      "@solana/spl-token-swap": require.resolve("@solana/spl-token-swap"),
      crypto: false,
      stream: false,
    };

    return config;
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    // Only ignoring this to resolve Type errors in @monaco-protocol/admin-client package
    // Delete this when not building with the above package.
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
