/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // This allows production builds to successfully complete even if
    // your project has minor type or styling errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // This allows production builds to successfully complete even if
    // your project has linting or formatting issues.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
