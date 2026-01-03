console.log("✅ next.config.js loaded");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Dev-Assets / _next/* über andere Origins erlauben
  allowedDevOrigins: [
    "localhost:3000",
    "*.app.github.dev",
    "*.githubpreview.dev",
  ],

  // ✅ Server Actions: extra Origins erlauben (CSRF check)
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "*.app.github.dev",
        "*.githubpreview.dev",
      ],
    },
  },
};

module.exports = nextConfig;