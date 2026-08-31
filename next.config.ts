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
    [envHostname(process.env.WOO_URL)].filter(Boolean) as string[],
  ),
);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
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
