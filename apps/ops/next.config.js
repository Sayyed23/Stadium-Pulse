/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@stadiumpulse/ai", "@stadiumpulse/db", "@stadiumpulse/config", "@stadiumpulse/ui"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

module.exports = nextConfig;
