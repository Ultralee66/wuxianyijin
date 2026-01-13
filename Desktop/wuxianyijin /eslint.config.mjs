const nextConfig = {
  ignores: [".next/", "node_modules/"],
  ...require("next/core-web-vitals/eslint-config"),
};

export default nextConfig;
