import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production' 
          ? 'http://app:8080/api/:path*'  // Docker Compose 환경
          : 'http://localhost:8080/api/:path*', // 로컬 개발 환경
      },
    ];
  },
};

export default nextConfig;
