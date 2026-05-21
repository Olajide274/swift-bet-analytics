/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Allows production builds even if type errors exist
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
