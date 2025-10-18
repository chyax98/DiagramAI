-- DiagramAI 数据库 Schema
-- SQLite 3.x
-- 编码: UTF-8

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

  -- Provider 类型
  -- 支持任意 AI 提供商，无枚举限制
  -- 常见: 'openai' | 'anthropic' | 'gemini' | 'openai-compatible' | 'cerebras' 等
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
  CHECK (length(provider) > 0),  -- 移除枚举限制，支持任意 provider
  CHECK (api_endpoint LIKE 'http://%' OR api_endpoint LIKE 'https://%'),
  CHECK (length(api_key) > 0),
  CHECK (length(model_id) > 0)
);

-- 索引: 按用户查询模型列表
CREATE INDEX IF NOT EXISTS idx_models_user ON ai_models(user_id);

-- 索引: 按创建时间倒序(显示最新配置)
CREATE INDEX IF NOT EXISTS idx_models_user_time ON ai_models(user_id, created_at DESC);

-- 索引: 按 provider 筛选
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

  -- ⚠️ SSOT 维护要求: 渲染语言枚举值
  -- 唯一真实来源: src/lib/constants/diagram-types.ts (RenderLanguage type)
  --
  -- 添加新语言时必须同步修改以下位置:
  -- 1. src/lib/constants/diagram-types.ts - RenderLanguage type (SSOT 源头)
  -- 2. 本文件第 158 行 - generation_histories 表 CHECK 约束
  -- 3. 本文件第 314-319 行 - custom_prompts 表 CHECK 约束
  --
  -- 当前支持 23 种图表语言:
  -- 主流 10 种: mermaid, plantuml, d2, graphviz, wavedrom, nomnoml, excalidraw, c4plantuml, vegalite, dbml
  -- 专业扩展 13 种: bpmn, ditaa, nwdiag, blockdiag, actdiag, packetdiag, rackdiag, seqdiag, structurizr, erd, pikchr, svgbob, umlet
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

  -- 是否已保存
  is_saved BOOLEAN DEFAULT 0,

  -- 渲染错误信息
  render_error TEXT,

  -- 创建时间（UTC 时间）
  created_at TEXT NOT NULL DEFAULT (datetime('now')),

  -- 外键约束
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (model_id) REFERENCES ai_models(id) ON DELETE SET NULL,

  -- 约束检查
  CHECK (length(input_text) > 0 AND length(input_text) <= 20000),
  -- ⚠️ 维护警告: 此枚举必须与 diagram-types.ts 保持 100% 同步 (参见上方注释)
  CHECK (render_language IN ('mermaid', 'plantuml', 'd2', 'graphviz', 'wavedrom', 'nomnoml', 'excalidraw', 'c4plantuml', 'vegalite', 'dbml', 'bpmn', 'ditaa', 'nwdiag', 'blockdiag', 'actdiag', 'packetdiag', 'rackdiag', 'seqdiag', 'structurizr', 'erd', 'pikchr', 'svgbob', 'umlet')),
  CHECK (length(generated_code) > 0)
);

-- 索引: 按用户和时间倒序查询(最常用的查询模式)
CREATE INDEX IF NOT EXISTS idx_histories_user_time
  ON generation_histories(user_id, created_at DESC);

-- 索引: 按渲染语言筛选
CREATE INDEX IF NOT EXISTS idx_histories_language
  ON generation_histories(user_id, render_language, created_at DESC);

-- 索引: 按保存状态查询
CREATE INDEX IF NOT EXISTS idx_histories_user_saved_time
  ON generation_histories(user_id, is_saved, created_at DESC);

-- 索引: 按错误状态查询
CREATE INDEX IF NOT EXISTS idx_histories_user_error
  ON generation_histories(user_id, render_error);


-- ============================================================================
-- 4. chat_sessions 表 - 多轮对话会话
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

-- 索引: 用户会话分页查询
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
-- 6. custom_prompts 表 - 用户自定义提示词管理
-- ============================================================================

CREATE TABLE IF NOT EXISTS custom_prompts (
  -- 主键
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  -- 外键: 关联用户
  user_id INTEGER NOT NULL,

  -- 提示词层级 (L1/L2/L3)
  -- L1: 通用提示词 (所有图表)
  -- L2: 语言级提示词 (特定渲染语言)
  -- L3: 类型级提示词 (特定图表类型)
  prompt_level INTEGER NOT NULL CHECK(prompt_level IN (1, 2, 3)),

  -- 渲染语言 (L2/L3 必填, L1 为 NULL)
  render_language TEXT,

  -- 图表类型 (L3 必填, L1/L2 为 NULL)
  diagram_type TEXT,

  -- 版本号: 语义化版本控制 (如 "v1.2.3")
  version TEXT NOT NULL CHECK(length(version) > 0 AND length(version) <= 20),

  -- 版本名称 (可选)
  version_name TEXT,

  -- 当前激活版本标记 (0: 历史版本, 1: 当前激活版本)
  is_active INTEGER DEFAULT 0 CHECK(is_active IN (0, 1)),

  -- 提示词内容
  content TEXT NOT NULL CHECK(length(content) > 0),

  -- Meta 信息 (JSON 格式, 可选)
  meta_info TEXT,

  -- 时间戳
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),

  -- 外键约束
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

  -- 业务逻辑约束
  -- L1 级别提示词不能有 render_language 和 diagram_type
  CHECK (
    (prompt_level = 1 AND render_language IS NULL AND diagram_type IS NULL)
    OR prompt_level IN (2, 3)
  ),

  -- L2 级别提示词必须有 render_language,但不能有 diagram_type
  CHECK (
    (prompt_level = 2 AND render_language IS NOT NULL AND diagram_type IS NULL)
    OR prompt_level IN (1, 3)
  ),

  -- L3 级别提示词必须有 render_language 和 diagram_type
  CHECK (
    (prompt_level = 3 AND render_language IS NOT NULL AND diagram_type IS NOT NULL)
    OR prompt_level IN (1, 2)
  ),

  -- ⚠️ 维护警告: 此枚举必须与 diagram-types.ts 保持 100% 同步
  -- 参见 generation_histories 表注释 (第 122-132 行) 获取完整的同步要求
  CHECK (
    render_language IS NULL OR
    render_language IN (
      'mermaid', 'plantuml', 'd2', 'graphviz', 'wavedrom', 'nomnoml',
      'excalidraw', 'c4plantuml', 'vegalite', 'dbml', 'bpmn', 'ditaa',
      'nwdiag', 'blockdiag', 'actdiag', 'packetdiag', 'rackdiag',
      'seqdiag', 'structurizr', 'erd', 'pikchr', 'svgbob', 'umlet'
    )
  )
);

-- 每个位置只能有一个激活版本
CREATE UNIQUE INDEX IF NOT EXISTS idx_prompts_active_unique
  ON custom_prompts(user_id, prompt_level, render_language, diagram_type)
  WHERE is_active = 1;

-- 性能优化索引
CREATE INDEX IF NOT EXISTS idx_prompts_user
  ON custom_prompts(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_prompts_lookup
  ON custom_prompts(user_id, prompt_level, render_language, diagram_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_prompts_version
  ON custom_prompts(user_id, prompt_level, render_language, diagram_type, version DESC);

CREATE INDEX IF NOT EXISTS idx_prompts_active
  ON custom_prompts(user_id, is_active, prompt_level)
  WHERE is_active = 1;

-- 触发器: 自动更新 updated_at
CREATE TRIGGER IF NOT EXISTS update_custom_prompts_timestamp
  AFTER UPDATE ON custom_prompts
  FOR EACH ROW
BEGIN
  UPDATE custom_prompts
  SET updated_at = datetime('now')
  WHERE id = NEW.id;
END;


-- ============================================================================
-- Schema 创建完成
-- ============================================================================
