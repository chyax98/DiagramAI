/** SVG 转图片工具 - 多层降级方案,确保最佳性能和兼容性 */

import { logger } from "./logger";

/**
 * 策略模式: 多层降级方案
 * 1. canvg (最优): 直接解析 SVG XML,完全避免 CORS 问题
 * 2. Data URL (备用): 使用 base64 编码,兼容性好
 * 3. 如果都失败,调用方会降级到 Kroki PNG API
 */

/**
 * 方案 1: 使用 canvg 将 SVG 转换为 PNG Blob
 * 优势: 直接解析 SVG,无需 img 加载,完全避免 CORS 问题
 *
 * @param svgString - SVG 字符串
 * @param scale - 缩放比例
 * @returns PNG Blob
 */
async function svgToPngBlobWithCanvg(svgString: string, scale = 2): Promise<Blob> {
  try {
    // 动态导入 canvg (按需加载,减少初始包体积)
    const { Canvg } = await import("canvg");

    // 创建 Canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("无法获取 Canvas 2D 上下文");
    }

    // 使用 canvg 解析 SVG
    const v = Canvg.fromString(ctx, svgString);

    // 开始渲染以获取尺寸
    await v.render();

    // 获取渲染后的 Canvas 尺寸
    const width = canvas.width;
    const height = canvas.height;

    // 如果需要缩放,重新设置 Canvas 尺寸并渲染
    if (scale !== 1) {
      canvas.width = width * scale;
      canvas.height = height * scale;
      ctx.scale(scale, scale);

      // 绘制白色背景
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);

      // 重新渲染
      await v.render();
    } else {
      // 绘制白色背景
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      await v.render();
    }

    // 转换为 PNG Blob
    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            logger.info("✅ [SVG->PNG] canvg 方案成功");
            resolve(blob);
          } else {
            reject(new Error("Canvas.toBlob 返回 null"));
          }
        },
        "image/png",
        1.0
      );
    });
  } catch (error) {
    logger.warn("⚠️ [SVG->PNG] canvg 方案失败,原因:", error);
    throw error;
  }
}

/**
 * 方案 2: 使用 Data URL + Image 将 SVG 转换为 PNG Blob
 * 优势: 兼容性好,不依赖额外库
 *
 * @param svgString - SVG 字符串
 * @param scale - 缩放比例
 * @returns PNG Blob
 */
async function svgToPngBlobWithDataURL(svgString: string, scale = 2): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();

      // 设置 crossOrigin 允许 Canvas 访问
      img.crossOrigin = "anonymous";

      // 将 SVG 转换为 Data URL
      const utf8Encoder = new TextEncoder();
      const utf8Bytes = utf8Encoder.encode(svgString);
      const binaryString = Array.from(utf8Bytes, (byte) => String.fromCharCode(byte)).join("");
      const svgBase64 = btoa(binaryString);
      const dataUrl = `data:image/svg+xml;base64,${svgBase64}`;

      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d", { alpha: false });

          if (!ctx) {
            reject(new Error("无法获取 Canvas 2D 上下文"));
            return;
          }

          // 设置 Canvas 尺寸
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;

          // 绘制白色背景
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // 绘制 SVG
          ctx.scale(scale, scale);
          ctx.drawImage(img, 0, 0);

          // 转换为 PNG Blob
          canvas.toBlob(
            (blob) => {
              if (blob) {
                logger.info("✅ [SVG->PNG] Data URL 方案成功");
                resolve(blob);
              } else {
                reject(new Error("Canvas.toBlob 返回 null"));
              }
            },
            "image/png",
            1.0
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error("SVG 图片加载失败"));
      };

      img.src = dataUrl;
    } catch (error) {
      logger.warn("⚠️ [SVG->PNG] Data URL 方案失败,原因:", error);
      reject(error);
    }
  });
}

/**
 * 主函数: 自动选择最佳方案,带智能降级
 *
 * @param svgString - SVG 字符串
 * @param scale - 缩放比例,默认 2
 * @returns PNG Blob
 */
export async function svgToPngBlob(svgString: string, scale = 2): Promise<Blob> {
  // 第一层: 尝试 canvg (最优方案)
  try {
    return await svgToPngBlobWithCanvg(svgString, scale);
  } catch (canvgError) {
    logger.info("🔄 [SVG->PNG] canvg 不可用,降级到 Data URL 方案");

    // 第二层: 降级到 Data URL
    try {
      return await svgToPngBlobWithDataURL(svgString, scale);
    } catch (dataUrlError) {
      logger.error("❌ [SVG->PNG] 所有客户端方案失败", {
        canvgError,
        dataUrlError,
      });
      // 抛出错误,让调用方降级到 Kroki PNG API
      throw new Error(
        `SVG 转 PNG 失败: canvg (${canvgError instanceof Error ? canvgError.message : "unknown"}), Data URL (${dataUrlError instanceof Error ? dataUrlError.message : "unknown"})`
      );
    }
  }
}

/**
 * 将 SVG 字符串转换为 Data URL (PNG 格式)
 *
 * @param svgString - SVG 字符串
 * @param scale - 缩放比例
 * @returns PNG Data URL
 */
export async function svgToPngDataURL(svgString: string, scale = 2): Promise<string> {
  const blob = await svgToPngBlob(svgString, scale);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("FileReader 返回非字符串结果"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * 检查浏览器是否支持 SVG 转图片
 */
export function isSvgToImageSupported(): boolean {
  if (typeof document === "undefined") return false;

  const canvas = document.createElement("canvas");
  return !!(canvas.getContext && canvas.getContext("2d") && typeof canvas.toBlob === "function");
}

/**
 * 检测可用的转换方案
 * 用于诊断和测试
 */
export async function detectAvailableMethods(): Promise<{
  canvg: boolean;
  dataUrl: boolean;
  canvas: boolean;
}> {
  const result = {
    canvg: false,
    dataUrl: false,
    canvas: isSvgToImageSupported(),
  };

  // 检测 canvg
  try {
    await import("canvg");
    result.canvg = true;
  } catch {
    result.canvg = false;
  }

  // 检测 Data URL (依赖 Canvas)
  result.dataUrl = result.canvas && typeof btoa === "function";

  return result;
}
