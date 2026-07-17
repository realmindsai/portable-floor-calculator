import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.GITHUB_PAGES === "true" ? "/portable-floor-calculator" : "",
  poweredByHeader: false,
  turbopack: { root: process.cwd() },
};

export default nextConfig;
