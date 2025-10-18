/** 剪贴板工具 - 基于 navigator.clipboard API,降级 execCommand */

import { logger } from "./logger";

export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (!navigator.clipboard) {
      return copyTextFallback(text);
    }

    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    logger.error("复制文本失败", error);
    return copyTextFallback(text);
  }
}

function copyTextFallback(text: string): boolean {
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "0";
    textarea.style.opacity = "0";

    document.body.appendChild(textarea);
    textarea.select();

    const success = document.execCommand("copy");

    document.body.removeChild(textarea);

    return success;
  } catch (error) {
    logger.error("降级复制失败", error);
    return false;
  }
}

export async function copyImageToClipboard(imageBlob: Blob): Promise<boolean> {
  try {
    if (!navigator.clipboard || !window.ClipboardItem) {
      throw new Error("Clipboard API 不支持图片复制");
    }

    const clipboardItem = new ClipboardItem({
      [imageBlob.type]: imageBlob,
    });

    await navigator.clipboard.write([clipboardItem]);
    return true;
  } catch (error) {
    logger.error("复制图片失败", error);
    return false;
  }
}

// 以下函数暂未使用,保留供未来功能扩展
// export async function copySVGToClipboard(svgString: string): Promise<boolean>
// export async function copyImageURLToClipboard(imageUrl: string): Promise<boolean>
// export function isClipboardTextSupported(): boolean
// export function isClipboardImageSupported(): boolean
