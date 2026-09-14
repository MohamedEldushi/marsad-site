import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  // Pins the workspace root here — an unrelated package.json sits in the
  // user's home directory further up the tree and Next.js's auto-detection
  // otherwise picks that up instead.
  turbopack: {
    root: __dirname,
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
