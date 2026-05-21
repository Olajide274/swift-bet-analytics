/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // This allows production builds to successfully complete even if
    // your project has type warnings or package layer errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // This bypasses linting issues during production compiles
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
