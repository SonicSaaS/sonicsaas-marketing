import type { NextConfig } from "next";

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

export default nextConfig;
