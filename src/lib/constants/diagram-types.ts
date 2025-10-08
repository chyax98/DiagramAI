/** 图表类型统一配置 - SSOT 单一数据源 */

export interface DiagramTypeInfo {
  value: string;
  label: string;
  description: string;
}

export type RenderLanguage =
  | "mermaid"
  | "plantuml"
  | "d2"
  | "graphviz"
  | "wavedrom"
  | "nomnoml"
  | "excalidraw"
  | "c4plantuml"
  | "vegalite"
  | "dbml";

export interface RenderLanguageInfo {
  value: RenderLanguage;
  label: string;
  description: string;
  iconPath: string;
}

export const RENDER_LANGUAGES: readonly RenderLanguageInfo[] = [
  {
    value: "mermaid",
    label: "Mermaid",
    description: "流程图、时序图、类图等 12 种图表",
    iconPath: "/icons/languages/mermaid.svg",
  },
  {
    value: "plantuml",
    label: "PlantUML",
    description: "UML 统一建模语言，8 种图表",
    iconPath: "/icons/languages/plantuml.svg",
  },
  {
    value: "d2",
    label: "D2",
    description: "现代化声明式图表，4 种图表",
    iconPath: "/icons/languages/d2.svg",
  },
  {
    value: "graphviz",
    label: "Graphviz",
    description: "DOT 语言图形可视化，5 种图表",
    iconPath: "/icons/languages/graphviz.svg",
  },
  {
    value: "wavedrom",
    label: "WaveDrom",
    description: "数字信号时序图，3 种图表",
    iconPath: "/icons/languages/wavedrom.svg",
  },
  {
    value: "nomnoml",
    label: "Nomnoml",
    description: "简化 UML 图表，3 种图表",
    iconPath: "/icons/languages/nomnoml.svg",
  },
  {
    value: "excalidraw",
    label: "Excalidraw",
    description: "手绘风格图表，3 种图表",
    iconPath: "/icons/languages/excalidraw.svg",
  },
  {
    value: "c4plantuml",
    label: "C4-PlantUML",
    description: "C4 架构图，4 种图表",
    iconPath: "/icons/languages/c4plantuml.svg",
  },
  {
    value: "vegalite",
    label: "Vega-Lite",
    description: "数据可视化图表，6 种图表",
    iconPath: "/icons/languages/vegalite.svg",
  },
  {
    value: "dbml",
    label: "DBML",
    description: "数据库 ER 图，4 种图表",
    iconPath: "/icons/languages/dbml.svg",
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
    { value: "pie", label: "饼图", description: "展示比例分布 (pie)" },
    { value: "mindmap", label: "思维导图", description: "展示概念层级 (mindmap)" },
    { value: "timeline", label: "时间线", description: "展示事件时间轴 (timeline)" },
    { value: "quadrant", label: "象限图", description: "展示四象限分析 (quadrantChart)" },
    { value: "sankey", label: "桑基图", description: "展示流量分布 (sankey-beta)" },
    { value: "xyChart", label: "XY 图表", description: "展示数据趋势 (xyChart)" },
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

  d2: [
    { value: "flowchart", label: "流程图", description: "使用 -> 表示流向" },
    { value: "sequence", label: "时序图", description: "使用箭头和标签表示交互顺序" },
    { value: "architecture", label: "架构图", description: "使用容器和层级结构" },
    { value: "network", label: "网络拓扑图", description: "使用双向箭头 <->" },
  ] as const,

  graphviz: [
    { value: "flowchart", label: "流程图", description: "使用 digraph 和 ->" },
    { value: "state", label: "状态图", description: "使用 digraph 和节点形状" },
    { value: "network", label: "网络拓扑图", description: "使用 graph 和 --" },
    { value: "tree", label: "树形结构", description: "使用 rankdir=TB" },
    { value: "architecture", label: "架构图", description: "使用分层布局" },
  ] as const,

  wavedrom: [
    { value: "timing", label: "时序波形图", description: "数字信号时序图" },
    { value: "signal", label: "信号图", description: "展示信号变化" },
    { value: "register", label: "寄存器图", description: "位字段布局" },
  ] as const,

  nomnoml: [
    { value: "class", label: "类图", description: "简化的 UML 类图" },
    { value: "component", label: "组件图", description: "系统组件关系" },
    { value: "architecture", label: "架构图", description: "系统架构设计" },
  ] as const,

  excalidraw: [
    { value: "sketch", label: "手绘草图", description: "自由手绘风格图表" },
    { value: "wireframe", label: "线框图", description: "UI 原型设计" },
    { value: "diagram", label: "通用图表", description: "手绘风格的通用图表" },
  ] as const,

  c4plantuml: [
    {
      value: "context",
      label: "系统上下文图",
      description: "展示系统外部环境和交互（C4-Context）",
    },
    { value: "container", label: "容器图", description: "展示系统内部技术构成（C4-Container）" },
    { value: "component", label: "组件图", description: "展示容器内部组件（C4-Component）" },
    { value: "sequence", label: "C4 时序图", description: "展示交互流程（C4-Sequence）" },
  ] as const,

  vegalite: [
    { value: "bar", label: "柱状图", description: "分类数据对比" },
    { value: "line", label: "折线图", description: "趋势变化分析" },
    { value: "point", label: "散点图", description: "相关性分析" },
    { value: "area", label: "面积图", description: "累积趋势展示" },
    { value: "pie", label: "饼图", description: "比例分布（arc 标记）" },
    { value: "heatmap", label: "热力图", description: "矩阵数据可视化" },
  ] as const,

  dbml: [
    { value: "schema", label: "完整 Schema", description: "多表关系数据库设计" },
    { value: "single_table", label: "单表设计", description: "单个表的结构定义" },
    { value: "erd", label: "实体关系图", description: "ER 图（Entity-Relationship）" },
    { value: "migration", label: "数据库迁移", description: "架构演进和变更" },
  ] as const,
} as const;

export type DiagramType =
  | (typeof LANGUAGE_DIAGRAM_TYPES.mermaid)[number]["value"]
  | (typeof LANGUAGE_DIAGRAM_TYPES.plantuml)[number]["value"]
  | (typeof LANGUAGE_DIAGRAM_TYPES.d2)[number]["value"]
  | (typeof LANGUAGE_DIAGRAM_TYPES.graphviz)[number]["value"]
  | (typeof LANGUAGE_DIAGRAM_TYPES.wavedrom)[number]["value"]
  | (typeof LANGUAGE_DIAGRAM_TYPES.nomnoml)[number]["value"]
  | (typeof LANGUAGE_DIAGRAM_TYPES.excalidraw)[number]["value"]
  | (typeof LANGUAGE_DIAGRAM_TYPES.c4plantuml)[number]["value"]
  | (typeof LANGUAGE_DIAGRAM_TYPES.vegalite)[number]["value"]
  | (typeof LANGUAGE_DIAGRAM_TYPES.dbml)[number]["value"];

export function getSupportedDiagramTypes(language: RenderLanguage): readonly DiagramTypeInfo[] {
  return LANGUAGE_DIAGRAM_TYPES[language];
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
