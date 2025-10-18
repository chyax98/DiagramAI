/** 图表类型元数据 - 用于智能推荐的领域分类和关键词映射 */

import type { RenderLanguage } from "./diagram-types";

/**
 * 领域分类规则 - 将用户需求映射到推荐的语言和图表类型
 */
export interface DomainRule {
  domain: string;
  description: string;
  languages: Array<{
    language: RenderLanguage;
    types: string[];
    note?: string;
  }>;
}

/**
 * 关键词映射规则 - 用户输入关键词到图表特征的映射
 */
export interface KeywordRule {
  keywords: string[];
  targetType: string;
  languages: Array<{
    language: RenderLanguage;
    type: string;
    confidence: number;
    reason: string;
  }>;
}

/**
 * 专业场景规则 - 特定领域的专业工具优先
 */
export interface ProfessionalRule {
  scenario: string;
  language: RenderLanguage;
  confidence: number;
  reason: string;
}

/**
 * 复杂度匹配规则 - 根据场景复杂度和风格要求优化选择
 */
export interface ComplexityRule {
  category: string;
  description: string;
  languages: RenderLanguage[];
}

/**
 * 领域识别规则
 */
export const DOMAIN_RULES: readonly DomainRule[] = [
  {
    domain: "业务流程分析",
    description: "业务流程、步骤流转、审批流程",
    languages: [
      { language: "mermaid", types: ["flowchart", "sequence", "journey"] },
      { language: "plantuml", types: ["activity", "sequence"] },
      { language: "bpmn", types: ["process"], note: "业务标准" },
      { language: "actdiag", types: ["swimlane"], note: "多角色协作" },
    ],
  },
  {
    domain: "数据库设计",
    description: "数据库表结构、ER 图、Schema 设计",
    languages: [
      { language: "dbml", types: ["schema", "erd", "migration"], note: "专业数据库语法" },
      { language: "mermaid", types: ["er"], note: "快速原型" },
      { language: "erd", types: ["er"], note: "简洁语法" },
      { language: "d2", types: ["er"], note: "现代美观" },
    ],
  },
  {
    domain: "系统架构设计",
    description: "系统组件、模块依赖、架构图",
    languages: [
      { language: "plantuml", types: ["class", "component", "deployment"], note: "UML 标准" },
      { language: "d2", types: ["architecture", "class"], note: "现代化" },
      { language: "nomnoml", types: ["architecture"], note: "简化 UML" },
      {
        language: "structurizr",
        types: ["system_context", "container", "component"],
        note: "C4 模型",
      },
      { language: "c4plantuml", types: ["context", "container", "component"], note: "C4 PlantUML" },
      { language: "umlet", types: ["diagram"], note: "轻量级 UML" },
    ],
  },
  {
    domain: "数据可视化",
    description: "数据图表、统计分析、趋势展示",
    languages: [
      {
        language: "vegalite",
        types: ["bar", "line", "point", "area", "pie", "heatmap"],
        note: "专业数据分析",
      },
      { language: "mermaid", types: ["pie", "xychart", "sankey"], note: "快速可视化" },
    ],
  },
  {
    domain: "网络拓扑",
    description: "网络架构、拓扑图、服务器布局",
    languages: [
      { language: "nwdiag", types: ["network"], note: "网络专用" },
      { language: "graphviz", types: ["network"], note: "高度自定义" },
      { language: "d2", types: ["network"], note: "现代美观" },
      { language: "packetdiag", types: ["packet", "protocol"], note: "数据包" },
      { language: "rackdiag", types: ["rack", "datacenter"], note: "机柜布局" },
    ],
  },
  {
    domain: "硬件/数字信号",
    description: "信号波形、时序图、寄存器",
    languages: [
      {
        language: "wavedrom",
        types: ["timing", "signal", "register", "bitfield"],
        note: "硬件专用",
      },
    ],
  },
  {
    domain: "项目管理",
    description: "项目计划、甘特图、时间线",
    languages: [
      { language: "mermaid", types: ["gantt", "timeline"], note: "快速计划" },
      { language: "plantuml", types: ["gantt"], note: "专业项目" },
    ],
  },
  {
    domain: "知识管理",
    description: "思维导图、知识分类、层级结构",
    languages: [
      { language: "mermaid", types: ["mindmap", "quadrant"], note: "快速头脑风暴" },
      { language: "graphviz", types: ["tree"], note: "树形结构" },
    ],
  },
  {
    domain: "手绘/原型",
    description: "草图、线框图、UI 原型",
    languages: [
      {
        language: "excalidraw",
        types: ["sketch", "wireframe", "diagram"],
        note: "手绘风格",
      },
    ],
  },
  {
    domain: "ASCII 转图形",
    description: "ASCII 字符图转换",
    languages: [
      { language: "ditaa", types: ["ascii"], note: "ASCII 艺术" },
      { language: "svgbob", types: ["ascii"], note: "自动美化" },
    ],
  },
] as const;

/**
 * 关键词匹配规则
 */
export const KEYWORD_RULES: readonly KeywordRule[] = [
  {
    keywords: ["登录", "调用", "API", "接口", "交互", "通信", "请求响应"],
    targetType: "sequence",
    languages: [
      { language: "mermaid", type: "sequence", confidence: 0.95, reason: "简洁语法" },
      { language: "plantuml", type: "sequence", confidence: 0.9, reason: "UML 标准" },
      { language: "seqdiag", type: "sequence", confidence: 0.75, reason: "BlockDiag 风格" },
      { language: "d2", type: "sequence", confidence: 0.8, reason: "现代美观" },
    ],
  },
  {
    keywords: ["订单", "审批", "业务流程", "步骤", "流程"],
    targetType: "flowchart/process",
    languages: [
      { language: "mermaid", type: "flowchart", confidence: 0.92, reason: "通用场景" },
      { language: "bpmn", type: "process", confidence: 0.9, reason: "业务标准" },
      { language: "plantuml", type: "activity", confidence: 0.85, reason: "UML 活动图" },
      { language: "graphviz", type: "flowchart", confidence: 0.75, reason: "高度自定义" },
    ],
  },
  {
    keywords: ["数据库", "表", "Schema", "字段", "外键", "索引"],
    targetType: "schema/er",
    languages: [
      { language: "dbml", type: "schema", confidence: 0.95, reason: "专业数据库语法" },
      { language: "mermaid", type: "er", confidence: 0.85, reason: "快速原型" },
      { language: "erd", type: "er", confidence: 0.8, reason: "简洁语法" },
      { language: "d2", type: "er", confidence: 0.75, reason: "现代美观" },
    ],
  },
  {
    keywords: ["架构", "模块", "组件", "微服务", "系统设计"],
    targetType: "component/architecture",
    languages: [
      { language: "plantuml", type: "component", confidence: 0.9, reason: "UML 标准" },
      { language: "structurizr", type: "container", confidence: 0.95, reason: "C4 模型" },
      { language: "d2", type: "architecture", confidence: 0.85, reason: "现代美观" },
      { language: "nomnoml", type: "architecture", confidence: 0.75, reason: "简化 UML" },
    ],
  },
  {
    keywords: ["类", "继承", "接口", "面向对象"],
    targetType: "class",
    languages: [
      { language: "plantuml", type: "class", confidence: 0.95, reason: "UML 标准" },
      { language: "mermaid", type: "class", confidence: 0.85, reason: "快速原型" },
      { language: "d2", type: "class", confidence: 0.8, reason: "现代美观" },
      { language: "nomnoml", type: "class", confidence: 0.75, reason: "简化 UML" },
    ],
  },
  {
    keywords: ["知识", "分类", "层级", "思维导图", "脑图"],
    targetType: "mindmap",
    languages: [
      { language: "mermaid", type: "mindmap", confidence: 0.98, reason: "最简洁语法" },
      { language: "graphviz", type: "tree", confidence: 0.7, reason: "树形结构" },
    ],
  },
  {
    keywords: ["项目", "排期", "时间表", "甘特图", "里程碑"],
    targetType: "gantt",
    languages: [
      { language: "mermaid", type: "gantt", confidence: 0.98, reason: "最常用" },
      { language: "plantuml", type: "gantt", confidence: 0.85, reason: "专业项目" },
    ],
  },
  {
    keywords: ["数据可视化", "统计", "趋势", "对比", "分析"],
    targetType: "data visualization",
    languages: [
      { language: "vegalite", type: "bar", confidence: 0.95, reason: "专业数据分析" },
      { language: "vegalite", type: "line", confidence: 0.95, reason: "趋势分析" },
      { language: "mermaid", type: "xychart", confidence: 0.75, reason: "快速可视化" },
    ],
  },
  {
    keywords: ["网络", "拓扑", "服务器", "路由", "交换机"],
    targetType: "network",
    languages: [
      { language: "nwdiag", type: "network", confidence: 0.95, reason: "网络专用" },
      { language: "graphviz", type: "network", confidence: 0.8, reason: "高度自定义" },
      { language: "d2", type: "network", confidence: 0.85, reason: "现代美观" },
    ],
  },
  {
    keywords: ["信号", "时序波形", "寄存器", "硬件"],
    targetType: "timing/signal",
    languages: [
      { language: "wavedrom", type: "timing", confidence: 0.98, reason: "硬件专用" },
      { language: "wavedrom", type: "signal", confidence: 0.95, reason: "信号分析" },
    ],
  },
  {
    keywords: ["状态", "状态机", "流转", "工作流状态"],
    targetType: "state",
    languages: [
      { language: "mermaid", type: "state", confidence: 0.9, reason: "简洁语法" },
      { language: "plantuml", type: "state", confidence: 0.85, reason: "UML 标准" },
      { language: "graphviz", type: "state", confidence: 0.75, reason: "自定义布局" },
    ],
  },
  {
    keywords: ["用户旅程", "体验", "情感曲线"],
    targetType: "journey",
    languages: [{ language: "mermaid", type: "journey", confidence: 0.98, reason: "用户体验专用" }],
  },
  {
    keywords: ["Git", "分支", "提交历史"],
    targetType: "gitgraph",
    languages: [{ language: "mermaid", type: "gitgraph", confidence: 0.98, reason: "Git 可视化" }],
  },
  {
    keywords: ["机柜", "机架", "U位", "数据中心物理布局"],
    targetType: "rack",
    languages: [
      { language: "rackdiag", type: "rack", confidence: 0.98, reason: "机柜专用" },
      { language: "rackdiag", type: "datacenter", confidence: 0.95, reason: "数据中心" },
    ],
  },
  {
    keywords: ["数据包", "协议头", "字段布局"],
    targetType: "packet",
    languages: [
      { language: "packetdiag", type: "packet", confidence: 0.95, reason: "数据包专用" },
      { language: "packetdiag", type: "protocol", confidence: 0.9, reason: "协议栈" },
    ],
  },
  {
    keywords: ["泳道", "多角色协作", "并行活动"],
    targetType: "swimlane",
    languages: [
      { language: "actdiag", type: "swimlane", confidence: 0.95, reason: "泳道专用" },
      { language: "actdiag", type: "activity", confidence: 0.85, reason: "并行活动" },
    ],
  },
] as const;

/**
 * 专业场景优先规则
 */
export const PROFESSIONAL_RULES: readonly ProfessionalRule[] = [
  {
    scenario: "UML 标准建模",
    language: "plantuml",
    confidence: 0.95,
    reason: "符合 UML 2.5 规范",
  },
  {
    scenario: "数据库正式文档",
    language: "dbml",
    confidence: 0.95,
    reason: "最接近 SQL DDL",
  },
  {
    scenario: "C4 架构模型",
    language: "structurizr",
    confidence: 0.98,
    reason: "C4 架构建模 DSL 专家",
  },
  {
    scenario: "BPMN 业务流程",
    language: "bpmn",
    confidence: 0.95,
    reason: "符合 BPMN 2.0 标准",
  },
  {
    scenario: "数据分析报告",
    language: "vegalite",
    confidence: 0.95,
    reason: "支持交互和数据绑定",
  },
  {
    scenario: "硬件设计文档",
    language: "wavedrom",
    confidence: 0.98,
    reason: "数字电路专用",
  },
  {
    scenario: "网络架构文档",
    language: "nwdiag",
    confidence: 0.95,
    reason: "网络工程师首选",
  },
] as const;

/**
 * 复杂度匹配规则
 */
export const COMPLEXITY_RULES: readonly ComplexityRule[] = [
  {
    category: "快速原型",
    description: "简单场景，快速迭代",
    languages: ["mermaid", "nomnoml", "erd", "blockdiag"],
  },
  {
    category: "专业文档",
    description: "标准规范，正式输出",
    languages: ["plantuml", "bpmn", "structurizr", "dbml"],
  },
  {
    category: "现代美观",
    description: "演示展示，视觉优先",
    languages: ["d2", "excalidraw"],
  },
  {
    category: "特定领域",
    description: "专业场景专用工具",
    languages: ["wavedrom", "nwdiag", "vegalite", "packetdiag", "rackdiag"],
  },
] as const;

/**
 * 参与者/实体数量判断规则
 */
export interface ParticipantRule {
  condition: string;
  minCount: number;
  keywords: string[];
  recommendations: Array<{
    language: RenderLanguage;
    type: string;
    confidence: number;
  }>;
}

export const PARTICIPANT_RULES: readonly ParticipantRule[] = [
  {
    condition: "多参与者交互",
    minCount: 2,
    keywords: ["交互", "通信"],
    recommendations: [{ language: "mermaid", type: "sequence", confidence: 0.95 }],
  },
  {
    condition: "单一主体流程",
    minCount: 1,
    keywords: ["步骤", "流程"],
    recommendations: [{ language: "mermaid", type: "flowchart", confidence: 0.9 }],
  },
  {
    condition: "多表关系",
    minCount: 3,
    keywords: ["关系", "外键"],
    recommendations: [
      { language: "dbml", type: "schema", confidence: 0.9 },
      { language: "mermaid", type: "er", confidence: 0.8 },
    ],
  },
  {
    condition: "多组件系统",
    minCount: 5,
    keywords: ["依赖"],
    recommendations: [
      { language: "plantuml", type: "component", confidence: 0.88 },
      { language: "structurizr", type: "container", confidence: 0.85 },
    ],
  },
] as const;

/**
 * 时间/动态特征分析规则
 */
export interface TimeFeatureRule {
  feature: string;
  keywords: string[];
  recommendations: Array<{
    language: RenderLanguage;
    type: string;
    confidence: number;
  }>;
}

export const TIME_FEATURE_RULES: readonly TimeFeatureRule[] = [
  {
    feature: "交互时序",
    keywords: ["时序", "先后顺序", "交互"],
    recommendations: [
      { language: "mermaid", type: "sequence", confidence: 0.9 },
      { language: "plantuml", type: "sequence", confidence: 0.85 },
    ],
  },
  {
    feature: "项目排期",
    keywords: ["排期", "时间跨度", "计划"],
    recommendations: [{ language: "mermaid", type: "gantt", confidence: 0.95 }],
  },
  {
    feature: "状态流转",
    keywords: ["状态", "事件触发", "流转"],
    recommendations: [
      { language: "mermaid", type: "state", confidence: 0.9 },
      { language: "plantuml", type: "state", confidence: 0.85 },
    ],
  },
  {
    feature: "数据趋势",
    keywords: ["趋势", "时间轴", "变化"],
    recommendations: [
      { language: "vegalite", type: "line", confidence: 0.9 },
      { language: "mermaid", type: "xychart", confidence: 0.75 },
    ],
  },
  {
    feature: "历史事件",
    keywords: ["历史", "时间线", "事件"],
    recommendations: [{ language: "mermaid", type: "timeline", confidence: 0.92 }],
  },
] as const;
