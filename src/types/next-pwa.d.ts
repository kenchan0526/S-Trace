declare module 'next-pwa' {
  import type { NextConfig } from 'next';

  interface PWAConfig {
    dest?: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    [key: string]: any;
  }

  export default function withPWAInit(config: PWAConfig): (nextConfig: NextConfig) => NextConfig;
}
