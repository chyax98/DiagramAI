/** 数据库类型 - User+AIModel+History+ChatSession表结构及参数 */

import type { RenderLanguage } from "@/lib/constants/diagram-types";

export interface DatabaseConfig {
  path: string; // 数据库文件路径
  readonly?: boolean; // 是否只读模式
  fileMustExist?: boolean; // 文件是否必须存在
  timeout?: number; // 超时时间（毫秒）
  verbose?: (message?: unknown, ...args: unknown[]) => void; // 调试日志函数
}

export interface User {
  id: number;
  username: string;
  password_hash: string;
  created_at: string; // ISO 8601 格式: "2025-10-03T10:30:00Z"
  last_login_at: string | null;
}

export interface CreateUserParams {
  username: string;
  password_hash: string;
}

export interface UserPublic {
  id: number;
  username: string;
  created_at: string;
  last_login_at: string | null;
}

export type AIProvider = "openai" | "gemini" | "claude" | "openai-compatible";

export interface AIModel {
  id: number;
  user_id: number;
  name: string;
  provider: AIProvider; // 新增: AI Provider 类型
  api_endpoint: string;
  api_key: string;
  model_id: string;
  parameters: string | null; // JSON 字符串
  created_at: string;
}

export interface CreateAIModelParams {
  user_id: number;
  name: string;
  provider?: AIProvider;
  api_endpoint: string;
  api_key: string;
  model_id: string;
  parameters?: string;
}

export interface UpdateAIModelParams {
  name?: string;
  provider?: AIProvider;
  api_endpoint?: string;
  api_key?: string;
  model_id?: string;
  parameters?: string;
}

// todo 参数需要判断ai provider是否真的支持
export interface AIModelParameters {
  temperature?: number; // 0.0 ~ 2.0
  max_tokens?: number; // 最大生成 token 数
  top_p?: number; // 0.0 ~ 1.0
  frequency_penalty?: number; // -2.0 ~ 2.0
  presence_penalty?: number; // -2.0 ~ 2.0
  [key: string]: unknown; // 允许其他自定义参数
}

export type { RenderLanguage };

export interface GenerationHistory {
  id: number;
  user_id: number;
  input_text: string;
  render_language: RenderLanguage; // ✅ 统一命名
  diagram_type: string | null;
  generated_code: string;
  model_id: number | null;
  is_saved: number; // SQLite BOOLEAN: 0 或 1
  render_error: string | null; // Kroki 渲染错误信息
  created_at: string;
}

export interface CreateHistoryParams {
  user_id: number;
  input_text: string;
  render_language: RenderLanguage; // ✅ 统一命名（原 code_language）
  diagram_type?: string | null;
  generated_code: string;
  model_id?: number | null;
  is_saved?: number; // 可选,默认 0
  render_error?: string | null; // 可选,默认 NULL
}

export interface QueryHistoryParams {
  user_id: number;
  render_language?: RenderLanguage | "all"; // ✅ 统一命名（原 code_language）
  page?: number; // 页码,从 1 开始
  page_size?: number; // 每页数量,默认 20
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ChatSession {
  id: number;
  user_id: number;
  generation_history_id: number | null; // 关联的生成历史 ID
  session_data: string; // JSON 字符串,包含 chatHistory + currentCode
  round_count: number; // 对话轮次,0-10
  created_at: string;
  updated_at: string;
}

export interface ChatSessionData {
  chatHistory: ChatMessage[]; // 对话历史
  currentCode: string; // 当前图表代码
  renderLanguage: RenderLanguage; // ✅ 统一命名（原 renderMode）
  diagramType?: string; // 图表类型
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface CreateChatSessionParams {
  userId: number;
  generationHistoryId?: number;
  sessionData: string;
  roundCount?: number;
}

export interface UpdateChatSessionParams {
  sessionData: string;
  roundCount: number;
}
