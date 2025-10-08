/**
 * 全局加载状态
 */

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        {/* 加载动画 */}
        <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

        {/* 加载文本 */}
        <p className="text-slate-600">加载中...</p>

        {/* 提示信息 */}
        <p className="mt-2 text-sm text-slate-500">首次加载可能需要几秒钟</p>
      </div>
    </div>
  );
}
