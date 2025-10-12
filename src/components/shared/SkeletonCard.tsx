/** 骨架屏卡片 - 历史记录页面加载占位,避免内容闪现 */

export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between">
        <div className="h-4 w-3/4 rounded bg-slate-200" />
        <div className="h-6 w-16 rounded-full bg-slate-200" />
      </div>

      <div className="mb-3 space-y-2">
        <div className="h-3 w-full rounded bg-slate-200" />
        <div className="h-3 w-5/6 rounded bg-slate-200" />
        <div className="h-3 w-4/5 rounded bg-slate-200" />
      </div>

      <div className="mb-3 space-y-2 rounded bg-slate-50 p-3">
        <div className="h-2 w-full rounded bg-slate-200" />
        <div className="h-2 w-4/5 rounded bg-slate-200" />
        <div className="h-2 w-3/4 rounded bg-slate-200" />
        <div className="h-2 w-5/6 rounded bg-slate-200" />
      </div>

      <div className="flex items-center justify-between">
        <div className="h-3 w-24 rounded bg-slate-200" />
        <div className="flex gap-2">
          <div className="h-8 w-16 rounded bg-slate-200" />
          <div className="h-8 w-16 rounded bg-slate-200" />
        </div>
      </div>
    </div>
  );
}
