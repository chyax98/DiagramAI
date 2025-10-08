import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),

  // 输出配置
  output: "standalone",

  // 实验性功能
  experimental: {
    optimizeCss: true,
  },

  // 图片优化配置
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    domains: ["localhost", "your-domain.com"],
    path: "/_next/image",
    loader: "default",
    unoptimized: process.env.NODE_ENV === "development",
  },

  compress: true,
  poweredByHeader: false,

  webpack: (config, { isServer }) => {
    // Bundle analyzer 已禁用

    if (!isServer) {
      config.optimization = config.optimization || {};
      config.optimization.splitChunks = config.optimization.splitChunks || {};
      if (config.optimization.splitChunks !== false) {
        config.optimization.splitChunks = {
          chunks: "all",
          cacheGroups: {
            ...(typeof config.optimization.splitChunks === "object"
              ? config.optimization.splitChunks.cacheGroups
              : {}),
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              chunks: "all",
              priority: 10,
            },
            commons: {
              test: /[\\/]src[\\/]components[\\/]/,
              name: "commons",
              chunks: "all",
              minChunks: 2,
              priority: 5,
            },
          },
        };
      }
    }

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    return config;
  },

  // 重定向和重写规则（如果需要）
  async redirects() {
    return [
      // 示例：重定向旧路径到新路径
      // {
      //   source: '/old-path',
      //   destination: '/new-path',
      //   permanent: true,
      // },
    ];
  },

  // 头部配置（安全和性能）
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // 安全头部
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // 性能头部
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // 环境变量配置提示
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

// Sentry 错误监控配置（暂时禁用）
export default nextConfig;
