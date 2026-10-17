import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Emit a self-contained server bundle in .next/standalone for container images.
  output: 'standalone',
  reactStrictMode: true,
  experimental: {
    reactDebugChannel: false,
  },
  // Tailscale access untuk dev container (memungkinkan cross-origin dev resource /_next/hmr dari host Tailscale)
  allowedDevOrigins: ['100.64.62.59', 'localhost'],
  async rewrites() {
    const apiProxyTarget = process.env.API_PROXY_TARGET ?? 'http://localhost:3000';

    return [
      {
        source: '/api/:path*',
        destination: `${apiProxyTarget}/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
