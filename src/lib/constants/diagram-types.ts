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
  | "dbml"
  | "bpmn"
  | "ditaa"
  | "nwdiag"
  | "blockdiag"
  | "actdiag"
  | "packetdiag"
  | "rackdiag"
  | "seqdiag"
  | "structurizr"
  | "erd"
  | "pikchr"
  | "svgbob"
  | "umlet";

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
    value: "d2",
    label: "D2",
    description: "现代化声明式图表，7 种图表",
    iconPath: "/icons/languages/d2.svg",
  },
  {
    value: "graphviz",
    label: "Graphviz",
    description: "DOT 语言图形可视化，6 种图表",
    iconPath: "/icons/languages/graphviz.svg",
  },
  {
    value: "wavedrom",
    label: "WaveDrom",
    description: "数字信号时序图，4 种图表",
    iconPath: "/icons/languages/wavedrom.svg",
  },
  {
    value: "nomnoml",
    label: "Nomnoml",
    description: "简化 UML 图表，4 种图表",
    iconPath: "/icons/languages/nomnoml.svg",
  },
  {
    value: "excalidraw",
    label: "Excalidraw",
    description: "手绘风格图表，5 种图表",
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
  {
    value: "bpmn",
    label: "BPMN",
    description: "业务流程建模标准，1 种图表",
    iconPath: "/icons/languages/bpmn.svg",
  },
  {
    value: "ditaa",
    label: "Ditaa",
    description: "ASCII 艺术图转换，1 种图表",
    iconPath: "/icons/languages/ditaa.svg",
  },
  {
    value: "nwdiag",
    label: "NwDiag",
    description: "网络拓扑图，数据中心和网络架构设计，1 种图表",
    iconPath: "/icons/languages/nwdiag.svg",
  },
  {
    value: "blockdiag",
    label: "BlockDiag",
    description: "块状流程图，简化的流程和关系图，2 种图表",
    iconPath: "/icons/languages/blockdiag.svg",
  },
  {
    value: "actdiag",
    label: "ActDiag",
    description: "活动图，展示并行活动和泳道流程，2 种图表",
    iconPath: "/icons/languages/actdiag.svg",
  },
  {
    value: "packetdiag",
    label: "PacketDiag",
    description: "网络数据包图，协议头和字段结构，2 种图表",
    iconPath: "/icons/languages/packetdiag.svg",
  },
  {
    value: "rackdiag",
    label: "RackDiag",
    description: "机柜图，数据中心机柜和设备布局，2 种图表",
    iconPath: "/icons/languages/rackdiag.svg",
  },
  {
    value: "seqdiag",
    label: "SeqDiag",
    description: "时序图，简化的对象交互序列（BlockDiag 风格），1 种图表",
    iconPath: "/icons/languages/seqdiag.svg",
  },
  {
    value: "structurizr",
    label: "Structurizr",
    description: "C4 架构建模DSL，7 种图表",
    iconPath: "/icons/languages/structurizr.svg",
  },
  {
    value: "erd",
    label: "Erd",
    description: "简洁 ER 图语法，1 种图表",
    iconPath: "/icons/languages/erd.svg",
  },
  {
    value: "pikchr",
    label: "Pikchr",
    description: "图表脚本语言，2 种图表",
    iconPath: "/icons/languages/pikchr.svg",
  },
  {
    value: "svgbob",
    label: "SvgBob",
    description: "ASCII 转 SVG 美化，1 种图表",
    iconPath: "/icons/languages/svgbob.svg",
  },
  {
    value: "umlet",
    label: "UMLet",
    description: "轻量级 UML 工具，1 种图表",
    iconPath: "/icons/languages/umlet.svg",
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

  d2: [
    { value: "flowchart", label: "流程图", description: "使用 -> 表示流向" },
    { value: "sequence", label: "时序图", description: "使用箭头和标签表示交互顺序" },
    { value: "er", label: "ER 图", description: "使用 shape: sql_table 展示数据库关系" },
    { value: "class", label: "类图", description: "使用 shape: class 展示面向对象设计" },
    { value: "architecture", label: "架构图", description: "使用容器和层级结构" },
    { value: "network", label: "网络拓扑图", description: "使用双向箭头 <->" },
    { value: "grid", label: "网格布局", description: "精确网格定位系统" },
  ] as const,

  graphviz: [
    { value: "flowchart", label: "流程图", description: "使用 digraph 和 ->" },
    { value: "state", label: "状态图", description: "使用 digraph 和节点形状" },
    { value: "network", label: "网络拓扑图", description: "使用 graph 和 --" },
    { value: "tree", label: "树形结构", description: "使用 rankdir=TB" },
    { value: "architecture", label: "架构图", description: "使用分层布局" },
    { value: "er", label: "实体关系图", description: "数据库 ER 图" },
  ] as const,

  wavedrom: [
    { value: "timing", label: "时序波形图", description: "数字信号时序图" },
    { value: "signal", label: "信号图", description: "展示信号变化" },
    { value: "register", label: "寄存器图", description: "位字段布局" },
    { value: "bitfield", label: "位字段图", description: "寄存器位定义" },
  ] as const,

  nomnoml: [
    { value: "class", label: "类图", description: "简化的 UML 类图" },
    { value: "component", label: "组件图", description: "系统组件关系" },
    { value: "architecture", label: "架构图", description: "系统架构设计" },
    { value: "flowchart", label: "流程图", description: "简洁流程图" },
  ] as const,

  excalidraw: [
    { value: "sketch", label: "手绘草图", description: "自由手绘风格图表" },
    { value: "wireframe", label: "线框图", description: "UI 原型设计" },
    { value: "diagram", label: "通用图表", description: "手绘风格的通用图表" },
    { value: "flowchart", label: "流程图", description: "手绘风格的流程图" },
    { value: "architecture", label: "架构图", description: "手绘风格的系统架构" },
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

  bpmn: [
    {
      value: "process",
      label: "业务流程",
      description: "BPMN 2.0 标准业务流程图（支持单流程和协作流程）",
    },
  ] as const,

  ditaa: [{ value: "ascii", label: "ASCII 艺术图", description: "ASCII 字符转图形" }] as const,

  nwdiag: [
    { value: "network", label: "网络拓扑图", description: "多网段网络结构和设备连接" },
  ] as const,

  blockdiag: [
    { value: "block", label: "块状流程图", description: "简化的流程图表示" },
    { value: "group", label: "分组图", description: "逻辑分组和层次结构" },
  ] as const,

  actdiag: [
    { value: "activity", label: "活动图", description: "并行活动流程图" },
    { value: "swimlane", label: "泳道图", description: "多角色活动分工" },
  ] as const,

  packetdiag: [
    { value: "packet", label: "网络数据包", description: "协议头字段布局" },
    { value: "protocol", label: "协议栈", description: "OSI 七层模型" },
  ] as const,

  rackdiag: [
    { value: "rack", label: "机柜图", description: "单机柜设备布局（U 位）" },
    { value: "datacenter", label: "数据中心", description: "多机柜布局规划" },
  ] as const,

  seqdiag: [{ value: "sequence", label: "时序图", description: "对象间消息传递序列" }] as const,

  structurizr: [
    { value: "workspace", label: "完整工作空间", description: "包含多个视图的完整架构文档" },
    { value: "system_landscape", label: "系统全景图", description: "企业级系统总览 (C4 Level 0)" },
    {
      value: "system_context",
      label: "系统上下文图",
      description: "系统边界和外部依赖 (C4 Level 1)",
    },
    { value: "container", label: "容器图", description: "技术栈和运行时容器 (C4 Level 2)" },
    { value: "component", label: "组件图", description: "容器内部组件结构 (C4 Level 3)" },
    { value: "deployment", label: "部署图", description: "部署节点和环境配置" },
    { value: "dynamic", label: "动态图", description: "运行时交互序列" },
  ] as const,

  erd: [
    { value: "er", label: "实体关系图", description: "简洁 ER 图语法，比 DBML 更简单" },
  ] as const,

  pikchr: [{ value: "diagram", label: "通用图表", description: "精确坐标和布局控制" }] as const,

  svgbob: [{ value: "ascii", label: "ASCII 转 SVG", description: "自动美化文本图表" }] as const,

  umlet: [{ value: "diagram", label: "UML 图表", description: "轻量级 UML 工具" }] as const,
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
  | (typeof LANGUAGE_DIAGRAM_TYPES.dbml)[number]["value"]
  | (typeof LANGUAGE_DIAGRAM_TYPES.bpmn)[number]["value"]
  | (typeof LANGUAGE_DIAGRAM_TYPES.ditaa)[number]["value"]
  | (typeof LANGUAGE_DIAGRAM_TYPES.nwdiag)[number]["value"]
  | (typeof LANGUAGE_DIAGRAM_TYPES.blockdiag)[number]["value"]
  | (typeof LANGUAGE_DIAGRAM_TYPES.actdiag)[number]["value"]
  | (typeof LANGUAGE_DIAGRAM_TYPES.packetdiag)[number]["value"]
  | (typeof LANGUAGE_DIAGRAM_TYPES.rackdiag)[number]["value"]
  | (typeof LANGUAGE_DIAGRAM_TYPES.seqdiag)[number]["value"]
  | (typeof LANGUAGE_DIAGRAM_TYPES.structurizr)[number]["value"]
  | (typeof LANGUAGE_DIAGRAM_TYPES.erd)[number]["value"]
  | (typeof LANGUAGE_DIAGRAM_TYPES.pikchr)[number]["value"]
  | (typeof LANGUAGE_DIAGRAM_TYPES.svgbob)[number]["value"]
  | (typeof LANGUAGE_DIAGRAM_TYPES.umlet)[number]["value"];

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
