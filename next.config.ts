import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // Allow up to 5MB request body size for server actions
    },
    staleTimes: {
      // Set dynamic and static stale times for the entire application
      dynamic: 30, // 60 seconds
      static: 60 * 30, // 30 minutes
    },
  },
  output: 'standalone',
};

export default nextConfig;
