import { logger } from "@/lib/utils/logger";

interface ResponseTimeRecord {
  endpoint: string;
  duration: number;
  timestamp: number;
}

export interface PerformanceStats {
  endpoint: string;
  totalRequests: number;
  p50: number;
  p95: number;
  p99: number;
  min: number;
  max: number;
  avg: number;
}

// 滑动窗口：保留最近 1000 个记录
const MAX_RECORDS = 1000;
const responseTimeRecords: ResponseTimeRecord[] = [];

/**
 * 记录 API 响应时间
 */
export function recordAPIResponse(endpoint: string, duration: number): void {
  const record: ResponseTimeRecord = {
    endpoint,
    duration,
    timestamp: Date.now(),
  };

  responseTimeRecords.push(record);

  // 滑动窗口: 保持最近 MAX_RECORDS 个记录
  if (responseTimeRecords.length > MAX_RECORDS) {
    responseTimeRecords.shift();
  }

  // 如果响应时间 > 200ms,发出警告
  if (duration > 200) {
    logger.warn("慢请求检测", {
      endpoint,
      duration: duration.toFixed(2),
      threshold: 200,
    });
  }
}

function calculatePercentile(sortedValues: number[], percentile: number): number {
  if (sortedValues.length === 0) return 0;

  const index = Math.ceil(sortedValues.length * percentile) - 1;
  const safeIndex = Math.max(0, index);
  return sortedValues[safeIndex] ?? 0;
}

/**
 * 获取指定端点的性能统计
 */
export function getPerformanceStats(endpoint?: string): PerformanceStats | null {
  // 过滤指定端点的记录
  const filteredRecords = endpoint
    ? responseTimeRecords.filter((r) => r.endpoint === endpoint)
    : responseTimeRecords;

  if (filteredRecords.length === 0) {
    return null;
  }

  // 提取所有响应时间并排序
  const durations = filteredRecords.map((r) => r.duration).sort((a, b) => a - b);

  // 计算统计指标
  const totalRequests = durations.length;
  const sum = durations.reduce((acc, d) => acc + d, 0);
  const avg = sum / totalRequests;
  const min = durations[0] ?? 0;
  const max = durations[durations.length - 1] ?? 0;
  const p50 = calculatePercentile(durations, 0.5);
  const p95 = calculatePercentile(durations, 0.95);
  const p99 = calculatePercentile(durations, 0.99);

  return {
    endpoint: endpoint || "ALL",
    totalRequests,
    p50: Math.round(p50),
    p95: Math.round(p95),
    p99: Math.round(p99),
    min: Math.round(min),
    max: Math.round(max),
    avg: Math.round(avg),
  };
}

/**
 * 获取所有端点的性能统计
 */
export function getAllEndpointStats(): Map<string, PerformanceStats> {
  const statsMap = new Map<string, PerformanceStats>();

  // 获取所有唯一的端点
  const uniqueEndpoints = Array.from(new Set(responseTimeRecords.map((r) => r.endpoint)));

  for (const endpoint of uniqueEndpoints) {
    const stats = getPerformanceStats(endpoint);
    if (stats) {
      statsMap.set(endpoint, stats);
    }
  }

  return statsMap;
}

/**
 * 打印性能报告
 */
export function printPerformanceReport(): void {
  const allStats = getAllEndpointStats();

  if (allStats.size === 0) {
    return;
  }

  for (const [endpoint, stats] of allStats.entries()) {
    if (stats.p95 > 200) {
      logger.warn("P95 响应时间超过目标", {
        endpoint,
        p95: stats.p95,
        threshold: 200,
      });
    }
  }
}

/**
 * 清空性能记录
 */
export function clearPerformanceRecords(): void {
  responseTimeRecords.length = 0;
}
