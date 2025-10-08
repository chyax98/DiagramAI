/** SVG 转图片工具 - 本地转换，无需额外请求 */

import { logger } from "./logger";

/**
 * 将 SVG 字符串转换为 PNG Blob
 * 使用 Canvas API 在浏览器端本地转换，无需请求服务器
 * 
 * @param svgString - SVG 字符串（来自 DiagramPreview 已渲染的内容）
 * @param scale - 缩放比例，默认 2（2倍分辨率，提升清晰度）
 * @returns PNG Blob
 */
export async function svgToPngBlob(svgString: string, scale = 2): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      // 1. 创建 Image 对象
      const img = new Image();
      
      // 2. 将 SVG 转换为 Data URL
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        try {
          // 3. 创建 Canvas
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          
          if (!ctx) {
            throw new Error("无法获取 Canvas 2D 上下文");
          }
          
          // 4. 设置 Canvas 尺寸（应用缩放）
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          
          // 5. 绘制白色背景（PNG 默认透明，某些场景需要白底）
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // 6. 绘制 SVG 到 Canvas
          ctx.scale(scale, scale);
          ctx.drawImage(img, 0, 0);
          
          // 7. 转换为 PNG Blob
          canvas.toBlob(
            (blob) => {
              URL.revokeObjectURL(url); // 清理内存
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error("Canvas.toBlob 返回 null"));
              }
            },
            "image/png",
            1.0 // 最高质量
          );
        } catch (error) {
          URL.revokeObjectURL(url);
          reject(error);
        }
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("SVG 图片加载失败"));
      };
      
      img.src = url;
    } catch (error) {
      logger.error("SVG 转 PNG 失败:", error);
      reject(error);
    }
  });
}

/**
 * 将 SVG 字符串转换为 Data URL（PNG 格式）
 * 适用于需要图片 URL 的场景（如下载）
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
  return !!(
    canvas.getContext &&
    canvas.getContext("2d") &&
    typeof canvas.toBlob === "function"
  );
}
