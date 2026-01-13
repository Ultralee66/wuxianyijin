import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // 在构建时禁用 ESLint 检查
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 在构建时禁用 TypeScript 类型检查
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
