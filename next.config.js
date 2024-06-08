import withBundleAnalyzerFactory from "@next/bundle-analyzer";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    // Get leaner client builds by disabling polyfills for node.js modules like "crypto"
    // cf. https://github.com/vercel/next.js/pull/39248
    fallbackNodePolyfills: false,
  },
};

const withBundleAnalyzer = withBundleAnalyzerFactory({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
});

export default withBundleAnalyzer(config);
