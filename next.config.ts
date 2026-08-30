import type { NextConfig } from "next";

function envHostname(raw: string | undefined): string | null {
  if (!raw) return null;
  try {
    return new URL(raw).hostname;
  } catch {
    return null;
  }
}

const hosts = Array.from(
  new Set(
    [envHostname(process.env.WOO_URL), envHostname(process.env.WP_URL)].filter(
      Boolean,
    ) as string[],
  ),
);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
      },
      // Jetpack / WordPress.com image CDN
      { protocol: "https", hostname: "i0.wp.com" },
      { protocol: "https", hostname: "i1.wp.com" },
      { protocol: "https", hostname: "i2.wp.com" },
      { protocol: "https", hostname: "i3.wp.com" },
      // Default WP blogs host
      {
        protocol: "https",
        hostname: "ship.lagracia.co.uk",
        pathname: "/**",
      },
      ...hosts.flatMap((hostname) => [
        {
          protocol: "https" as const,
          hostname,
          pathname: "/**" as const,
        },
        {
          protocol: "http" as const,
          hostname,
          pathname: "/**" as const,
        },
      ]),
    ],
  },
};

export default nextConfig;
