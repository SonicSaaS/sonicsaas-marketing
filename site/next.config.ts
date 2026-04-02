import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  output: "export",
  // Proxy API requests to Azure Functions local runtime during development
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:7071/api/:path*",
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  silent: true,
  sourcemaps: { disable: true },
  // No tunnelRoute — static export has no server to proxy through
});
