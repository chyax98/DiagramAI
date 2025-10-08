/**
 * Web Vitals 性能监控
 *
 * 设计要点：
 * - 监控 LCP、INP、CLS、FCP、TTFB 指标
 * - 生产环境上报到 Google Analytics
 */

import { onCLS, onINP, onLCP, onFCP, onTTFB, Metric } from "web-vitals";

const reportWebVitals = (metric: Metric) => {
  // 在生产环境中上报到监控服务
  if (process.env.NODE_ENV === "production") {
    // 示例：上报到 Google Analytics 4
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", metric.name, {
        value: Math.round(metric.value),
        event_category: "Web Vitals",
        event_label: metric.id,
        non_interaction: true,
      });
    }

    // 可以上报到其他监控服务（如 DataDog）
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(metric),
    // });
  }
};

export const initWebVitals = () => {
  if (typeof window !== "undefined") {
    onLCP(reportWebVitals);
    onINP(reportWebVitals);
    onCLS(reportWebVitals);
    onFCP(reportWebVitals);
    onTTFB(reportWebVitals);
  }
};

export const getPerformanceRating = (metric: string, value: number) => {
  const thresholds = {
    lcp: { good: 2500, poor: 4000 },
    inp: { good: 200, poor: 500 },
    cls: { good: 0.1, poor: 0.25 },
    fcp: { good: 1800, poor: 3000 },
    ttfb: { good: 800, poor: 1800 },
  };

  const threshold = thresholds[metric.toLowerCase() as keyof typeof thresholds];
  if (!threshold) return "unknown";

  if (value <= threshold.good) return "good";
  if (value <= threshold.poor) return "needs-improvement";
  return "poor";
};
