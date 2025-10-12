/** 全局类型 - 扩展Window等全局对象 */

declare global {
  interface Window {
    __NEXT_DATA__?: any;
  }
}

export {};
