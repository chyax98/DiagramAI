-- DiagramAI 数据库 Schema (最终版本)
-- SQLite 3.x
-- 版本: v5.0.0
-- 创建日期: 2025-10-10
-- 编码: UTF-8
--
-- 说明: 此 Schema 包含所有迁移的最终状态,可一次性生成完整数据库
-- 变更日志 v5.0.0: 新增 13 种图表渲染语言 (bpmn, ditaa, nwdiag, blockdiag, actdiag, packetdiag, rackdiag, seqdiag, structurizr, erd, pikchr, svgbob, umlet)

-- ============================================================================
-- 1. users 表 - 用户认证与访问控制
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
  -- 主键: 自增整数 ID
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  -- 用户名: 唯一,非空
  -- 无长度限制,无特殊字符限制(简化设计)
  username TEXT UNIQUE NOT NULL,

  -- 密码哈希: bcrypt 10 轮加盐
  -- 格式: $2b$10$... (60 字符)
  password_hash TEXT NOT NULL,

  -- 创建时间: ISO 8601 格式（UTC 时间）
  -- 示例: 2025-10-03T10:30:00Z
  -- 注意: 前端会自动转换为用户本地时区显示
  created_at TEXT NOT NULL DEFAULT (datetime('now')),

  -- 最后登录时间: 可选
  -- 用于统计活跃用户
  last_login_at TEXT,

  -- 约束检查
  CHECK (length(username) > 0),
  CHECK (length(password_hash) = 60)  -- bcrypt 固定长度
);

-- 索引: 用户名查询(登录时)
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- 索引: 创建时间(统计用)
CREATE INDEX IF NOT EXISTS idx_users_created ON users(created_at DESC);


-- ============================================================================
-- 2. ai_models 表 - AI 模型配置
-- ============================================================================

CREATE TABLE IF NOT EXISTS ai_models (
  -- 主键: 自增整数 ID
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  -- 外键: 关联用户
  -- 级联删除: 用户删除时,其所有模型配置也删除
  user_id INTEGER NOT NULL,

  -- 模型显示名称
  -- 示例: "DeepSeek Chat", "GPT-4 Turbo"
  name TEXT NOT NULL,

  -- Provider 类型 (新增字段 - Migration 001)
  -- 'openai' | 'anthropic' | 'gemini' | 'openai-compatible'
  -- 注意: 'gemini' 支持 Google AI, 'openai-compatible' 支持 DeepSeek 等
  provider TEXT NOT NULL DEFAULT 'openai',

  -- API 端点 URL
  -- 必须以 http:// 或 https:// 开头
  -- 示例: https://api.deepseek.com/v1/chat/completions
  api_endpoint TEXT NOT NULL,

  -- API 密钥
  -- 明文存储(自用场景,无需加密)
  -- 示例: sk-xxx...
  api_key TEXT NOT NULL,

  -- 模型标识符
  -- 示例: gpt-4, deepseek-chat, claude-3, gemini-pro
  model_id TEXT NOT NULL,

  -- 模型参数: JSON 字符串
  -- 示例: {"temperature": 0.7, "max_tokens": 2000, "top_p": 0.95}
  -- 可为空,使用 AI Provider 默认值
  parameters TEXT,

  -- 创建时间（UTC 时间）
  created_at TEXT NOT NULL DEFAULT (datetime('now')),

  -- 外键约束
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

  -- 约束检查
  CHECK (length(name) > 0),
  CHECK (provider IN ('openai', 'anthropic', 'gemini', 'openai-compatible')),
  CHECK (api_endpoint LIKE 'http://%' OR api_endpoint LIKE 'https://%'),
  CHECK (length(api_key) > 0),
  CHECK (length(model_id) > 0)
);

-- 索引: 按用户查询模型列表
CREATE INDEX IF NOT EXISTS idx_models_user ON ai_models(user_id);

-- 索引: 按创建时间倒序(显示最新配置)
CREATE INDEX IF NOT EXISTS idx_models_user_time ON ai_models(user_id, created_at DESC);

-- 索引: 按 provider 筛选 (新增 - Migration 001)
CREATE INDEX IF NOT EXISTS idx_models_provider ON ai_models(provider);


-- ============================================================================
-- 3. generation_histories 表 - 图表生成历史
-- ============================================================================

CREATE TABLE IF NOT EXISTS generation_histories (
  -- 主键: 自增整数 ID
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  -- 外键: 关联用户
  -- 级联删除: 用户删除时,其所有历史记录也删除
  user_id INTEGER NOT NULL,

  -- 用户输入的原始文本
  -- 最大长度: 20,000 字符
  input_text TEXT NOT NULL,

  -- 渲染语言: 枚举值 (字段名更新 - Migration 004, 扩展 - Migration 005, v5.0.0 扩展)
  -- 原有 10 种: 'mermaid' | 'plantuml' | 'd2' | 'graphviz' | 'wavedrom' | 'nomnoml' | 'excalidraw' | 'c4plantuml' | 'vegalite' | 'dbml'
  -- 新增 13 种 (v5.0.0): 'bpmn' | 'ditaa' | 'nwdiag' | 'blockdiag' | 'actdiag' | 'packetdiag' | 'rackdiag' | 'seqdiag' | 'structurizr' | 'erd' | 'pikchr' | 'svgbob' | 'umlet'
  render_language TEXT NOT NULL,

  -- 图表类型: 可选
  -- Mermaid: 'flowchart' | 'sequence' | 'class' | 'er' | 'gantt' 等
  -- PlantUML: 'activity' | 'sequence' | 'component' | 'class' 等
  -- D2: 'flowchart' | 'architecture' | 'network' | 'sequence' | 'erd' 等
  -- Graphviz: 'digraph' | 'graph' | 'strict-digraph' | 'strict-graph' 等
  diagram_type TEXT,

  -- AI 生成的完整代码
  -- 仅在生成成功后保存(非空)
  generated_code TEXT NOT NULL,

  -- 使用的 AI 模型 ID: 可选
  -- 记录用于生成的模型,便于追溯
  -- 允许为空(模型可能被删除)
  model_id INTEGER,

  -- 是否已保存 (新增字段 - Migration 002)
  is_saved BOOLEAN DEFAULT 0,

  -- 渲染错误信息 (新增字段 - Migration 002)
  render_error TEXT,

  -- 创建时间（UTC 时间）
  created_at TEXT NOT NULL DEFAULT (datetime('now')),

  -- 外键约束
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (model_id) REFERENCES ai_models(id) ON DELETE SET NULL,

  -- 约束检查
  CHECK (length(input_text) > 0 AND length(input_text) <= 20000),
  CHECK (render_language IN ('mermaid', 'plantuml', 'd2', 'graphviz', 'wavedrom', 'nomnoml', 'excalidraw', 'c4plantuml', 'vegalite', 'dbml', 'bpmn', 'ditaa', 'nwdiag', 'blockdiag', 'actdiag', 'packetdiag', 'rackdiag', 'seqdiag', 'structurizr', 'erd', 'pikchr', 'svgbob', 'umlet')),
  CHECK (length(generated_code) > 0)
);

-- 索引: 按用户和时间倒序查询(最常用的查询模式)
CREATE INDEX IF NOT EXISTS idx_histories_user_time
  ON generation_histories(user_id, created_at DESC);

-- 索引: 按渲染语言筛选 (字段名更新 - Migration 004)
CREATE INDEX IF NOT EXISTS idx_histories_language
  ON generation_histories(user_id, render_language, created_at DESC);

-- 索引: 按保存状态查询 (新增 - Migration 003)
CREATE INDEX IF NOT EXISTS idx_histories_user_saved_time
  ON generation_histories(user_id, is_saved, created_at DESC);

-- 索引: 按错误状态查询 (新增 - Migration 003)
CREATE INDEX IF NOT EXISTS idx_histories_user_error
  ON generation_histories(user_id, render_error);


-- ============================================================================
-- 4. chat_sessions 表 - 多轮对话会话 (新增 - Migration 002)
-- ============================================================================

CREATE TABLE IF NOT EXISTS chat_sessions (
  -- 主键: 自增整数 ID
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  -- 外键: 关联用户
  user_id INTEGER NOT NULL,

  -- 外键: 关联生成历史 (可选)
  generation_history_id INTEGER,

  -- 会话数据: JSON 字符串
  -- 包含: messages (对话历史), currentCode, renderLanguage, diagramType 等
  session_data TEXT NOT NULL,

  -- 对话轮次计数
  round_count INTEGER DEFAULT 0,

  -- 创建时间（UTC 时间）
  created_at TEXT NOT NULL DEFAULT (datetime('now')),

  -- 更新时间 (自动更新 - 触发器，UTC 时间)
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),

  -- 外键约束
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (generation_history_id) REFERENCES generation_histories(id) ON DELETE CASCADE,

  -- 约束检查
  CHECK (length(session_data) > 0),
  CHECK (round_count >= 0)
);

-- 索引: 按用户查询会话
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id
  ON chat_sessions(user_id);

-- 索引: 按生成历史查询会话
CREATE INDEX IF NOT EXISTS idx_chat_sessions_generation_history_id
  ON chat_sessions(generation_history_id);

-- 索引: 按创建时间查询
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at
  ON chat_sessions(created_at DESC);

-- 索引: 用户会话分页查询 (新增 - Migration 003)
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_time
  ON chat_sessions(user_id, created_at DESC);


-- ============================================================================
-- 5. 触发器 - 自动更新 updated_at
-- ============================================================================

-- 触发器: 更新 chat_sessions.updated_at（UTC 时间）
CREATE TRIGGER IF NOT EXISTS update_chat_sessions_timestamp
  AFTER UPDATE ON chat_sessions
  FOR EACH ROW
BEGIN
  UPDATE chat_sessions
  SET updated_at = datetime('now')
  WHERE id = NEW.id;
END;


-- ============================================================================
-- Schema 创建完成
-- ============================================================================
