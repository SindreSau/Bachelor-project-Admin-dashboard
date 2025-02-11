import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // Allow up to 5MB request body size for server actions
    },
  },
  output: 'standalone',
};

export default nextConfig;
