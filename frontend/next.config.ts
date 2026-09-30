import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: the entire site is pre-rendered to plain HTML/CSS/JS in
  // `out/`, which is what gets synced to S3 and served through CloudFront
  // (see infrastructure/lib/frontend-stack.ts). There is no Node.js server
  // at runtime, so every page must be statically renderable and all data
  // fetching happens client-side against the API Gateway backend.
  output: "export",

  // Without this, `next build` emits flat files like `cart.html` instead of
  // `cart/index.html`. S3 + CloudFront (no Node server, no URL rewriting)
  // can only resolve a directory request to its index.html, so a direct
  // visit or hard refresh on /cart would 403/404 without trailingSlash.
  // With it on, every route becomes a real folder with its own index.html,
  // so any deep link works exactly like the root path does.
  trailingSlash: true,

  // next/image's built-in optimizer requires a running server, which is not
  // available with static export. Images are served as-is (product images
  // already come pre-sized from S3/CloudFront).
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
