import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // Allow up to 5MB request body size for server actions
    },
    staleTimes: {
      // Set dynamic and static stale times for the entire application
      dynamic: 30 * 60, // 30 minutes
      static: 60 * 60, // 60 minutes
    },
  },
  output: 'standalone',
  logging: {
    fetches: {
      fullUrl: false,
      hmrRefreshes: false,
    },
    incomingRequests: false,
  },
  serverExternalPackages: ['pino', 'pino-pretty'],
};

export default nextConfig;
