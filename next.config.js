console.log("✅ next.config.js loaded");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "127.0.0.1:3000",
        "*.app.github.dev",
        "*.githubpreview.dev",
      ],
    },
  },
};

module.exports = nextConfig;