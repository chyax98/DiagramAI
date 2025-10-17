/** 推荐功能类型定义 */

import type { RenderLanguage } from "./database";

/**
 * 推荐结果
 */
export interface RecommendationResult {
  /** 推荐的渲染语言 */
  renderLanguage: RenderLanguage;
  /** 推荐的图表类型 */
  diagramType: string;
  /** 匹配度 (0-1) */
  confidence: number;
  /** 推荐理由列表 (2-5条) */
  reasons: string[];
  /** 备选方案 (最多2个) */
  alternatives?: AlternativeRecommendation[];
}

/**
 * 备选推荐方案
 */
export interface AlternativeRecommendation {
  /** 备选语言 */
  language: RenderLanguage;
  /** 备选图表类型 */
  type: string;
  /** 匹配度 (0-1) */
  confidence: number;
  /** 备选理由 */
  reason: string;
}

/**
 * 推荐请求参数
 */
export interface RecommendRequest {
  /** 用户输入的需求描述 */
  inputText: string;
  /** AI 模型 ID */
  modelId: number;
}

/**
 * 推荐 API 响应
 */
export interface RecommendResponse {
  success: boolean;
  data?: RecommendationResult;
  error?: string;
}
