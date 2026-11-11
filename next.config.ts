import type { NextConfig } from "next";

// Allow next/image to optimise photos uploaded through the admin (Supabase Storage).
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL) : null;

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Match the old WordPress URLs exactly (e.g. /packages/), so existing links and rankings carry over.
  trailingSlash: true,
  poweredByHeader: false,
  images: {
    remotePatterns: supabase
      ? [
          {
            protocol: supabase.protocol === "http:" ? "http" : "https",
            hostname: supabase.hostname,
            port: supabase.port,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
    // Local Supabase runs on 127.0.0.1; only allow that outside production builds.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // English lives at the normal URLs; internally those pages are under /en/. Japanese is /ja/...
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/en" },
        {
          source:
            "/:path((?!ja(?:/|$)|en(?:/|$)|admin(?:/|$)|_next/|_vercel/|images/|api/|sitemap\\.xml|robots\\.txt|icon|apple-icon|favicon).*)",
          destination: "/en/:path",
        },
      ],
    };
  },
  async redirects() {
    return [
      // Never expose /en/ publicly: one URL per page for search engines.
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
      // Old WordPress media URLs (Google Images, backlinks). Resized copies map to the original.
      {
        source: "/wp-content/uploads/:y(\\d{4})/:m(\\d{2})/:name([^/]+)-:size(\\d+x\\d+).:ext(jpg|jpeg|png|webp)",
        destination: "/images/:y-:m-:name.:ext",
        permanent: true,
      },
      {
        source: "/wp-content/uploads/:y(\\d{4})/:m(\\d{2})/:file",
        destination: "/images/:y-:m-:file",
        permanent: true,
      },
      // Old WordPress / Rank Math sitemaps and feeds.
      { source: "/sitemap_index.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/page-sitemap.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/wp-sitemap.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/feed/:path*", destination: "/", permanent: true },
      { source: "/home/", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
