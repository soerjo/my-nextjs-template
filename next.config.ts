import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Emit a self-contained server bundle in .next/standalone for container images.
  output: 'standalone',
  reactStrictMode: true,
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
