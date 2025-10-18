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

  // Turbopack 配置 (开发模式专用)
  // Turbopack 自动处理代码分割,无需手动配置
  turbopack: {
    resolveAlias: {
      // 等效于 webpack resolve.fallback
      // 禁用 Node.js 模块 polyfill (与 better-sqlite3 兼容)
    },
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

  // Webpack 配置 (生产构建专用)
  // 注意: 开发模式使用 Turbopack，此配置仅在生产构建时生效
  webpack: (config, { isServer }) => {
    // Bundle analyzer 已禁用

    if (!isServer) {
      // 代码分割优化 (生产构建)
      config.optimization = config.optimization || {};
      config.optimization.splitChunks = config.optimization.splitChunks || {};
      if (config.optimization.splitChunks !== false) {
        config.optimization.splitChunks = {
          chunks: "all",
          cacheGroups: {
            ...(typeof config.optimization.splitChunks === "object"
              ? config.optimization.splitChunks.cacheGroups
              : {}),
            // 第三方库单独打包
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              chunks: "all",
              priority: 10,
            },
            // 公共组件单独打包
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

    // Node.js 模块 polyfill 禁用
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
    return [];
  },

  // 头部配置（安全头部 + 静态资源缓存）
  async headers() {
    return [
      {
        // 静态资源缓存 - SVG 图标
        source: "/icons/:path*.svg",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable", // 1年缓存
          },
        ],
      },
      {
        // 静态资源缓存 - 其他图片
        source: "/icons/:path*.(png|jpg|jpeg|gif|webp|avif|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable", // 1年缓存
          },
        ],
      },
      {
        // 根目录 SVG 文件
        source: "/:path*.svg",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable", // 1年缓存
          },
        ],
      },
      {
        // 全局安全头部
        source: "/:path*",
        headers: [
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
        ],
      },
    ];
  },
};

// Sentry 错误监控配置（暂时禁用）
export default nextConfig;
