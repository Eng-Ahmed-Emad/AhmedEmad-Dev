import withBundleAnalyzer from "@next/bundle-analyzer";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: {
    unoptimized: true,
  },
};

// Only wrap with bundle analyzer in non-CI environments
const config =
  process.env.CI === "true" || process.env.GITHUB_ACTIONS === "true"
    ? nextConfig
    : withBundleAnalyzer({ enabled: process.env.ANALYZE === "true" })(
        nextConfig
      );

export default config;
