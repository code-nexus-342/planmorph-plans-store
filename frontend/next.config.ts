import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove standalone output since we're deploying to App Service as code, not containers
  // output: 'standalone',
  
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Performance optimizations
  experimental: {
    scrollRestoration: true,
    optimizePackageImports: ['lucide-react', '@headlessui/react'],
  },

  // Image optimization - disable for App Service simplicity
  images: {
    unoptimized: true,
  },

  // Compression
  compress: true,

  // Environment variables for runtime
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  // Webpack optimizations for production build
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Production optimizations
      config.resolve.alias = {
        ...config.resolve.alias,
        '@/components': './src/components',
        '@/app': './src/app',
      }
      
      // Enable module concatenation for smaller bundles
      config.optimization.concatenateModules = true;
    }
    return config
  },
};

export default nextConfig;
