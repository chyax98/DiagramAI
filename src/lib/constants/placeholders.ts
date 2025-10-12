/**
 * 图表类型 Placeholder 配置
 *
 * 功能:
 * - 为每种图表类型提供具体的输入示例
 * - 帮助用户理解每种图表的使用场景
 * - 提升用户体验和输入准确性
 *
 * 设计原则:
 * - 自动生成: 基于 diagram-types.ts 的定义自动生成 placeholder
 * - 零维护: 新增图表类型无需手动更新此文件
 * - 类型安全: 依赖 SSOT (diagram-types.ts)
 *
 * 架构说明:
 * - 短期方案: 自动从 description 生成基础 placeholder
 * - 长期规划: 迁移到 Prompt metadata 驱动的系统（见 CLAUDE.md）
 */

import { LANGUAGE_DIAGRAM_TYPES, type RenderLanguage, type DiagramType } from "./diagram-types";

/**
 * 默认 Placeholder (当没有选择具体图表类型时使用)
 */
export const DEFAULT_PLACEHOLDER = "✨ 描述你想要生成的图表，例如：用户登录流程的时序图...";

/**
 * 手动定义的高质量 Placeholder（可选）
 *
 * 这些手动定义的 placeholder 会覆盖自动生成的版本
 * 用于提供更生动、更具体的示例
 *
 * 迁移路径:
 * 1. 短期: 保留现有的高质量 placeholder
 * 2. 中期: 逐步迁移到 Prompt metadata
 * 3. 长期: 完全由 Prompt 文件驱动，删除此对象
 */
const MANUAL_PLACEHOLDERS: Partial<Record<DiagramType, string>> = {
  // ============================================
  // Mermaid - 主流图表的高质量 placeholder
  // ============================================
  flowchart: "✨ 描述一个流程，例如：用户登录流程，包括输入账号密码、验证、登录成功或失败处理",
  sequence:
    "✨ 描述对象间的交互，例如：用户下单流程的时序图，包括前端、后端、数据库、支付系统的交互",
  class: "✨ 描述类的结构和关系，例如：电商系统的用户、订单、商品、购物车类图",
  state: "✨ 描述状态转换，例如：订单状态机，包括待付款、已付款、已发货、已完成、已取消状态",
  er: "✨ 描述数据库实体关系，例如：博客系统的用户、文章、评论、标签表关系",
  gantt: "✨ 描述项目时间计划，例如：网站开发项目，包括需求分析、设计、开发、测试、上线阶段",
  pie: "✨ 描述比例分布，例如：公司 2024 年销售额构成，包括产品 A 40%、产品 B 30%、产品 C 30%",
  mindmap: "✨ 描述概念层级，例如：前端技术栈思维导图，包括 HTML、CSS、JavaScript 及相关框架",
  timeline:
    "✨ 描述事件时间轴，例如：公司发展历程，包括 2020 年成立、2021 年 A 轮融资、2022 年产品上线",
  quadrant: "✨ 描述四象限分析，例如：任务优先级矩阵，按重要性和紧急程度分类",
  sankey: "✨ 描述流量分布，例如：网站流量来源分析，从不同渠道到页面到转化的流向",

  // ============================================
  // PlantUML - UML 图表
  // ============================================
  usecase: "✨ 描述系统用例，例如：在线购物系统，包括浏览商品、加入购物车、下单、支付等用例",
  activity: "✨ 描述业务流程，例如：请假审批流程，包括提交申请、部门审批、HR 审批、结束",
  component: "✨ 描述系统组件，例如：微服务架构，包括网关、用户服务、订单服务、支付服务",
  object: "✨ 描述对象实例，例如：用户对象和订单对象的关联关系，展示具体的实例数据",
  deployment: "✨ 描述部署架构，例如：三层架构部署，包括负载均衡、应用服务器、数据库服务器",

  // ============================================
  // D2 - 现代化图表
  // ============================================
  architecture: "✨ 描述系统架构，例如：云原生架构，包括 CDN、负载均衡、容器集群、数据库集群",
  network: "✨ 描述网络拓扑，例如：企业网络拓扑，包括路由器、交换机、防火墙、服务器的连接",

  // ============================================
  // Graphviz - 图形可视化
  // ============================================
  tree: "✨ 描述树形结构，例如：公司组织架构树，从 CEO 到部门到团队的层级结构",

  // ============================================
  // WaveDrom - 数字信号
  // ============================================
  timing: "✨ 描述数字信号时序，例如：SPI 通信时序图，包括 CLK、MOSI、MISO、CS 信号",
  signal: "✨ 描述信号变化，例如：I2C 总线信号，包括 SDA 和 SCL 的时序关系",
  register: "✨ 描述寄存器布局，例如：32 位控制寄存器，包括各个位字段的功能和位置",

  // ============================================
  // Excalidraw - 手绘风格
  // ============================================
  sketch: "✨ 描述自由草图，例如：产品功能脑暴草图，包括各种想法和关联",
  wireframe: "✨ 描述界面原型，例如：移动应用登录页面线框图，包括 Logo、输入框、按钮布局",
  diagram: "✨ 描述通用图表，例如：技术选型对比图，用手绘风格展示不同方案的优缺点",

  // ============================================
  // C4-PlantUML - C4 架构图
  // ============================================
  context: "✨ 描述系统上下文，例如：电商系统的外部环境，包括用户、支付平台、物流系统",
  container: "✨ 描述容器视图，例如：电商系统内部结构，包括 Web 应用、API 服务、数据库",

  // ============================================
  // Vega-Lite - 数据可视化
  // ============================================
  bar: "✨ 描述柱状图数据，例如：各城市 2024 年 GDP 对比，包括北京、上海、深圳等数据",
  line: "✨ 描述折线图数据，例如：过去一年的股票价格走势，包括开盘价、收盘价",
  point: "✨ 描述散点图数据，例如：身高体重相关性分析，包括 100 个样本数据点",
  area: "✨ 描述面积图数据，例如：网站月活跃用户累积趋势，从 2023 年 1 月到 2024 年 12 月",
  heatmap: "✨ 描述热力图数据，例如：网站访问热力图，按小时和星期几统计访问量",

  // ============================================
  // DBML - 数据库设计
  // ============================================
  schema: "✨ 描述数据库设计，例如：社交网络数据库，包括用户、帖子、评论、点赞表及关系",
  single_table: "✨ 描述单表结构，例如：用户表设计，包括 id、用户名、邮箱、密码、创建时间等字段",
  erd: "✨ 描述实体关系，例如：学校管理系统 ER 图，包括学生、课程、教师、选课关系",
  migration: "✨ 描述数据库演进，例如：从 v1 到 v2 的架构变更，包括新增表、字段修改、索引优化",
};

/**
 * 自动从图表类型定义生成 placeholder
 *
 * 策略:
 * 1. 查找图表类型的 label 和 description
 * 2. 生成格式: "✨ 描述你想要的{label}，例如：{description}"
 * 3. 如果找不到定义，返回 DEFAULT_PLACEHOLDER
 *
 * @param language - 渲染语言
 * @param type - 图表类型
 * @returns 自动生成的 placeholder
 *
 * @example
 * generatePlaceholder('mermaid', 'gitgraph')
 * // 返回: "✨ 描述你想要的 Git 图，例如：展示 Git 提交历史和分支"
 */
function generatePlaceholder(language: RenderLanguage, type: DiagramType): string {
  const types = LANGUAGE_DIAGRAM_TYPES[language];
  if (!types) {
    return DEFAULT_PLACEHOLDER;
  }

  const info = types.find((t) => t.value === type);
  if (!info) {
    return DEFAULT_PLACEHOLDER;
  }

  // 生成格式: "✨ 描述你想要的{label}，例如：{description}"
  return `✨ 描述你想要的${info.label}，例如：${info.description}`;
}

/**
 * Placeholder 缓存
 *
 * key 格式: "{language}:{type}"
 * value: placeholder 文本
 *
 * 缓存策略:
 * - 首次访问时计算并缓存
 * - 后续访问直接返回缓存值
 * - 应用重启时清空
 */
const placeholderCache = new Map<string, string>();

/**
 * 获取图表类型对应的 Placeholder
 *
 * 优先级:
 * 1. 手动定义的高质量 placeholder (MANUAL_PLACEHOLDERS)
 * 2. 自动生成的 placeholder (基于 diagram-types.ts)
 * 3. 默认 placeholder (DEFAULT_PLACEHOLDER)
 *
 * @param language - 渲染语言 (可选)
 * @param type - 图表类型 (可选)
 * @returns Placeholder 文本
 *
 * @example
 * // 场景 1: 有手动定义
 * getPlaceholder('mermaid', 'flowchart')
 * // 返回: "✨ 描述一个流程，例如：用户登录流程..."
 *
 * // 场景 2: 无手动定义，自动生成
 * getPlaceholder('mermaid', 'gitgraph')
 * // 返回: "✨ 描述你想要的 Git 图，例如：展示 Git 提交历史和分支"
 *
 * // 场景 3: 未选择类型
 * getPlaceholder()
 * // 返回: DEFAULT_PLACEHOLDER
 */
export function getPlaceholder(language?: RenderLanguage, type?: DiagramType): string {
  // 未选择语言或类型，返回默认
  if (!language || !type) {
    return DEFAULT_PLACEHOLDER;
  }

  // 优先级 1: 检查手动定义
  if (type in MANUAL_PLACEHOLDERS) {
    return MANUAL_PLACEHOLDERS[type]!;
  }

  // 优先级 2: 自动生成（带缓存）
  const cacheKey = `${language}:${type}`;
  if (!placeholderCache.has(cacheKey)) {
    const generated = generatePlaceholder(language, type);
    placeholderCache.set(cacheKey, generated);
  }

  return placeholderCache.get(cacheKey)!;
}

/**
 * 清除 placeholder 缓存
 *
 * 用途:
 * - 开发环境热更新
 * - 测试环境重置状态
 */
export function clearPlaceholderCache(): void {
  placeholderCache.clear();
}

/**
 * 获取缓存统计信息
 *
 * 用途:
 * - 监控缓存命中率
 * - 调试和性能分析
 */
export function getPlaceholderCacheStats(): { size: number; keys: string[] } {
  return {
    size: placeholderCache.size,
    keys: Array.from(placeholderCache.keys()),
  };
}
