/** @type {import('next').NextConfig} */

// For GitHub Pages project sites the app is served from
// https://<user>.github.io/<repo>/, so we need a basePath.
// Set NEXT_PUBLIC_BASE_PATH="/your-repo-name" in CI (the deploy workflow
// sets it automatically). Leave empty for a user/org page (<user>.github.io).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  // Produce a fully static site in ./out that GitHub Pages can serve.
  output: 'export',
  basePath: basePath,
  // Static export can't use the Next.js image optimizer.
  images: { unoptimized: true },
  // GitHub Pages serves /about as /about/index.html — trailing slash avoids 404s.
  trailingSlash: true,
};

export default nextConfig;
