/** 图表类型统一配置 - SSOT 单一数据源 */

export interface DiagramTypeInfo {
  value: string;
  label: string;
  description: string;
}

export type RenderLanguage =
  // ===== Tier 1: 优先优化的核心语言 (覆盖 100% 软件开发需求) =====
  | "mermaid" // #1: 60% 覆盖率 - 流程图、时序图、类图、状态图、ER图
  | "plantuml" // #2: 25% 覆盖率 - 复杂 UML 图表、企业级时序图
  | "dbml" // #3: 8% 覆盖率 - 数据库设计
  | "excalidraw" // #4: 5% 覆盖率 - 手绘讨论图
  | "graphviz"; // #5: 2% 覆盖率 - 复杂依赖图

// ===== Tier 2: 延后优化的扩展语言 (已注释,可按需启用) =====
// | "d2"            // 现代化图表 (与 Mermaid 90% 重叠)
// | "nomnoml"       // 简化 UML (可用 PlantUML 替代)
// | "c4plantuml"    // C4 架构图 (可用 PlantUML 实现)
// | "vegalite"      // 数据可视化 (非核心需求)
// | "structurizr"   // C4 DSL (架构师专用,太专业)

// ===== Tier 3: 低优先级的特殊语言 (已注释,可按需启用) =====
// | "wavedrom"      // 硬件信号图 (软件团队不需要)
// | "bpmn"          // 业务流程 (可用 Mermaid 替代)
// | "ditaa"         // ASCII 转图 (边缘需求)
// | "nwdiag"        // 网络拓扑 (运维专用)
// | "blockdiag"     // 块状图 (可用 Mermaid 替代)
// | "actdiag"       // 活动图 (可用 PlantUML 替代)
// | "packetdiag"    // 网络协议 (运维专用)
// | "rackdiag"      // 机柜图 (运维专用)
// | "seqdiag"       // 时序图 (可用 Mermaid 替代)
// | "erd"           // ER 图 (可用 DBML 替代)
// | "pikchr"        // 图表脚本 (边缘需求)
// | "svgbob"        // ASCII 美化 (边缘需求)
// | "umlet"         // 轻量 UML (可用 PlantUML 替代)

export interface RenderLanguageInfo {
  value: RenderLanguage;
  label: string;
  description: string;
  iconPath: string;
}

export const RENDER_LANGUAGES: readonly RenderLanguageInfo[] = [
  // ===== Tier 1: 优先优化的核心语言 (5 种, 覆盖 100% 软件开发需求) =====
  {
    value: "mermaid",
    label: "Mermaid",
    description: "流程图、时序图、类图等 14 种图表",
    iconPath: "/icons/languages/mermaid.svg",
  },
  {
    value: "plantuml",
    label: "PlantUML",
    description: "UML 统一建模语言，8 种图表",
    iconPath: "/icons/languages/plantuml.svg",
  },
  {
    value: "dbml",
    label: "DBML",
    description: "数据库 ER 图，4 种图表",
    iconPath: "/icons/languages/dbml.svg",
  },
  {
    value: "excalidraw",
    label: "Excalidraw",
    description: "手绘风格图表，5 种图表",
    iconPath: "/icons/languages/excalidraw.svg",
  },
  {
    value: "graphviz",
    label: "Graphviz",
    description: "DOT 语言图形可视化，6 种图表",
    iconPath: "/icons/languages/graphviz.svg",
  },
] as const;

export const LANGUAGE_DIAGRAM_TYPES: Record<RenderLanguage, readonly DiagramTypeInfo[]> = {
  mermaid: [
    { value: "flowchart", label: "流程图", description: "展示流程、步骤和决策 (graph TD/LR)" },
    { value: "sequence", label: "时序图", description: "展示对象间的交互时序 (sequenceDiagram)" },
    { value: "class", label: "类图", description: "展示类的结构和关系 (classDiagram)" },
    { value: "state", label: "状态图", description: "展示状态转换 (stateDiagram-v2)" },
    { value: "er", label: "实体关系图", description: "展示数据库实体关系 (erDiagram)" },
    { value: "gantt", label: "甘特图", description: "展示项目时间计划 (gantt)" },
    { value: "gitgraph", label: "Git 图", description: "展示 Git 提交历史和分支 (gitGraph)" },
    { value: "journey", label: "用户旅程图", description: "展示用户体验旅程和情感曲线 (journey)" },
    { value: "pie", label: "饼图", description: "展示比例分布 (pie)" },
    { value: "mindmap", label: "思维导图", description: "展示概念层级 (mindmap)" },
    { value: "timeline", label: "时间线", description: "展示事件时间轴 (timeline)" },
    { value: "quadrant", label: "象限图", description: "展示四象限分析 (quadrantChart)" },
    { value: "sankey", label: "桑基图", description: "展示流量分布 (sankey-beta)" },
    { value: "xychart", label: "XY 图表", description: "展示数据趋势 (xyChart)" },
  ] as const,

  plantuml: [
    { value: "sequence", label: "时序图", description: "展示对象间的交互时序" },
    { value: "class", label: "类图", description: "展示类的结构和关系" },
    { value: "usecase", label: "用例图", description: "展示系统用例" },
    { value: "activity", label: "活动图", description: "展示业务流程" },
    { value: "component", label: "组件图", description: "展示系统组件" },
    { value: "state", label: "状态图", description: "展示状态转换" },
    { value: "object", label: "对象图", description: "展示对象实例" },
    { value: "deployment", label: "部署图", description: "展示部署架构" },
  ] as const,

  dbml: [
    { value: "schema", label: "完整 Schema", description: "多表关系数据库设计" },
    { value: "single_table", label: "单表设计", description: "单个表的结构定义" },
    { value: "erd", label: "实体关系图", description: "ER 图（Entity-Relationship）" },
    { value: "migration", label: "数据库迁移", description: "架构演进和变更" },
  ] as const,

  excalidraw: [
    { value: "sketch", label: "手绘草图", description: "自由手绘风格图表" },
    { value: "wireframe", label: "线框图", description: "UI 原型设计" },
    { value: "diagram", label: "通用图表", description: "手绘风格的通用图表" },
    { value: "flowchart", label: "流程图", description: "手绘风格的流程图" },
    { value: "architecture", label: "架构图", description: "手绘风格的系统架构" },
  ] as const,

  graphviz: [
    { value: "flowchart", label: "流程图", description: "使用 digraph 和 ->" },
    { value: "state", label: "状态图", description: "使用 digraph 和节点形状" },
    { value: "network", label: "网络拓扑图", description: "使用 graph 和 --" },
    { value: "tree", label: "树形结构", description: "使用 rankdir=TB" },
    { value: "architecture", label: "架构图", description: "使用分层布局" },
    { value: "er", label: "实体关系图", description: "数据库 ER 图" },
  ] as const,
} as const;

export type DiagramType =
  | (typeof LANGUAGE_DIAGRAM_TYPES.mermaid)[number]["value"]
  | (typeof LANGUAGE_DIAGRAM_TYPES.plantuml)[number]["value"]
  | (typeof LANGUAGE_DIAGRAM_TYPES.dbml)[number]["value"]
  | (typeof LANGUAGE_DIAGRAM_TYPES.excalidraw)[number]["value"]
  | (typeof LANGUAGE_DIAGRAM_TYPES.graphviz)[number]["value"];

export function getSupportedDiagramTypes(language: RenderLanguage): readonly DiagramTypeInfo[] {
  return LANGUAGE_DIAGRAM_TYPES[language] || [];
}

export function getDiagramTypesPromptText(language: RenderLanguage): string {
  const types = getSupportedDiagramTypes(language);
  return types.map((type) => `- ${type.value}: ${type.label} (${type.description})`).join("\n");
}

export function getDefaultDiagramType(language: RenderLanguage): string {
  const types = getSupportedDiagramTypes(language);
  return types[0]?.value ?? "flowchart";
}

export function getRenderLanguages(): readonly RenderLanguageInfo[] {
  return RENDER_LANGUAGES;
}
