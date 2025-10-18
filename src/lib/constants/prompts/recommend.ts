/** 全局智能推荐 Prompt - 从 23 种渲染语言中推荐最佳组合 */

import { RENDER_LANGUAGES, LANGUAGE_DIAGRAM_TYPES } from "@/lib/constants/diagram-types";
import {
  DOMAIN_RULES,
  KEYWORD_RULES,
  PROFESSIONAL_RULES,
  COMPLEXITY_RULES,
  PARTICIPANT_RULES,
  TIME_FEATURE_RULES,
} from "@/lib/constants/diagram-metadata";

/**
 * 生成领域识别部分的 Prompt
 */
function generateDomainGuidance(): string {
  return DOMAIN_RULES.map((rule) => {
    const languageList = rule.languages
      .map((lang) => {
        const typesStr = lang.types.join("/");
        const note = lang.note ? ` (${lang.note})` : "";
        return `${RENDER_LANGUAGES.find((l) => l.value === lang.language)?.label} (${typesStr})${note}`;
      })
      .join(", ");
    return `- **${rule.description}**: ${languageList}`;
  }).join("\n");
}

/**
 * 生成图表类型精准匹配部分的 Prompt
 */
function generateTypeMatchingRules(): string {
  // 将关键词规则按目标类型分组
  const groupedRules = new Map<string, (typeof KEYWORD_RULES)[number][]>();

  KEYWORD_RULES.forEach((rule) => {
    const existing = groupedRules.get(rule.targetType) || [];
    existing.push(rule);
    groupedRules.set(rule.targetType, existing);
  });

  const sections: string[] = [];

  // 生成每个类型的匹配规则
  groupedRules.forEach((rules, targetType) => {
    const primaryRule = rules[0];
    if (!primaryRule) return;

    const languagesList = primaryRule.languages
      .map((lang) => {
        const langInfo = RENDER_LANGUAGES.find((l) => l.value === lang.language);
        return `${langInfo?.label} ${lang.type} (${lang.reason})`;
      })
      .join(", ");

    // 构建关键词描述
    const keywordsDesc = rules.map((r) => r.keywords.slice(0, 3).join("/")).join(" 或 ");

    sections.push(
      `- **${targetType}** (${keywordsDesc}):\n  - 首选: ${languagesList.split(", ")[0]}\n  - 备选: ${languagesList.split(", ").slice(1).join(", ")}`
    );
  });

  return sections.join("\n\n");
}

/**
 * 生成关键词匹配规则部分的 Prompt
 */
function generateKeywordRules(): string {
  return KEYWORD_RULES.map((rule) => {
    const keywordStr = rule.keywords.map((k) => `"${k}"`).join("/");
    const primaryLang = rule.languages[0];
    if (!primaryLang) return "";

    const langInfo = RENDER_LANGUAGES.find((l) => l.value === primaryLang.language);
    const confidence = Math.round(primaryLang.confidence * 100);
    return `- **${keywordStr}** → ${langInfo?.label} ${primaryLang.type} (${confidence}%)`;
  })
    .filter(Boolean)
    .join("\n");
}

/**
 * 生成参与者数量判断规则
 */
function generateParticipantRules(): string {
  return PARTICIPANT_RULES.map((rule) => {
    const keywordStr = rule.keywords.map((k) => `"${k}"`).join("/");
    const recommendations = rule.recommendations
      .map((rec) => {
        const langInfo = RENDER_LANGUAGES.find((l) => l.value === rec.language);
        const confidence = Math.round(rec.confidence * 100);
        return `${langInfo?.label} ${rec.type} (${confidence}%)`;
      })
      .join(" > ");
    return `- **${rule.minCount}+ ${rule.condition} + ${keywordStr}** → ${recommendations}`;
  }).join("\n");
}

/**
 * 生成时间特征分析规则
 */
function generateTimeFeatureRules(): string {
  return TIME_FEATURE_RULES.map((rule) => {
    const recommendations = rule.recommendations
      .map((rec) => {
        const langInfo = RENDER_LANGUAGES.find((l) => l.value === rec.language);
        return `${rec.type} (${langInfo?.label} ${Math.round(rec.confidence * 100)}%)`;
      })
      .join(" / ");
    return `- **有${rule.feature} + ${rule.keywords.join("/")}** → ${recommendations}`;
  }).join("\n");
}

/**
 * 生成专业场景规则
 */
function generateProfessionalRules(): string {
  return PROFESSIONAL_RULES.map((rule) => {
    const langInfo = RENDER_LANGUAGES.find((l) => l.value === rule.language);
    const confidence = Math.round(rule.confidence * 100);
    return `- **${rule.scenario}** → ${langInfo?.label} (${confidence}%) - ${rule.reason}`;
  }).join("\n");
}

/**
 * 生成复杂度匹配规则
 */
function generateComplexityRules(): string {
  return COMPLEXITY_RULES.map((rule) => {
    const languagesList = rule.languages
      .map((lang) => RENDER_LANGUAGES.find((l) => l.value === lang)?.label)
      .filter(Boolean)
      .join(", ");
    return `- **${rule.category}** (${rule.description}): ${languagesList}`;
  }).join("\n");
}

/**
 * 生成语言生态评估部分
 */
function generateEcosystemGuidance(): string {
  // 按图表类型数量排序，突出显示主要语言
  const sortedLanguages = [...RENDER_LANGUAGES].sort((a, b) => {
    const aCount = LANGUAGE_DIAGRAM_TYPES[a.value].length;
    const bCount = LANGUAGE_DIAGRAM_TYPES[b.value].length;
    return bCount - aCount;
  });

  return sortedLanguages
    .slice(0, 10) // 只显示前10个主要语言
    .map((lang) => {
      const count = LANGUAGE_DIAGRAM_TYPES[lang.value].length;
      return `- **${lang.label} (${count} 种)**: ${lang.description}`;
    })
    .join("\n");
}

export function getRecommendPrompt(): string {
  // 构建语言特点矩阵 - 包含 value、label 和图表数量
  const languageMatrix = RENDER_LANGUAGES.map((lang) => {
    const types = LANGUAGE_DIAGRAM_TYPES[lang.value];
    return `| \`${lang.value}\` | ${lang.label} | ${types.length} | ${lang.description} |`;
  }).join("\n");

  // 构建详细的图表类型映射 - 为每种语言列出支持的所有图表类型
  const detailedTypesMatrix = RENDER_LANGUAGES.map((lang) => {
    const types = LANGUAGE_DIAGRAM_TYPES[lang.value];
    const typesList = types
      .map((type) => `  - \`${type.value}\`: ${type.label} - ${type.description}`)
      .join("\n");
    return `### ${lang.label} (\`${lang.value}\`) - ${types.length} 种图表\n${lang.description}\n${typesList}`;
  }).join("\n\n");

  return `你是专业的图表语言和类型推荐专家,精通 23 种图表渲染语言的特点和最佳实践。

## 核心任务
分析用户需求,从 23 种渲染语言和对应的图表类型中推荐**最佳组合**。

## 语言特点矩阵 (value 列是 JSON 中必须使用的精确值)
| value (JSON使用) | 显示名称 | 图表数 | 特点与适用场景 |
|------------------|---------|--------|---------------|
${languageMatrix}

## 详细图表类型能力矩阵
以下是每种语言支持的具体图表类型,请根据用户需求从中选择最匹配的组合:

${detailedTypesMatrix}

## 决策框架 (四层精准分析)

### 1. 领域识别 → 初步筛选候选语言
根据用户需求的领域类型,缩小候选语言范围:

${generateDomainGuidance()}

### 2. 图表类型精准匹配 → 确定图表类别
根据具体需求特征,匹配精确的图表类型:

${generateTypeMatchingRules()}

### 3. 复杂度与风格匹配 → 优化选择
根据场景复杂度和输出风格要求,优化语言选择:

${generateComplexityRules()}

### 4. 语言生态考量 → 最终决策
考虑语言的图表类型丰富度和适用性:

${generateEcosystemGuidance()}

## 推荐规则 (优先级从高到低,带置信度评估)

### 规则 1: 关键词直接匹配 (90%+ 置信度)
精准关键词触发高置信度推荐:

${generateKeywordRules()}

### 规则 2: 参与者/实体数量判断 (85%+ 置信度)
根据参与者特征推荐:

${generateParticipantRules()}

### 规则 3: 时间/动态特征分析 (80%+ 置信度)
根据时间维度特征推荐:

${generateTimeFeatureRules()}
- **无明确时间特征** → flowchart / class / er / architecture

### 规则 4: 专业场景与标准优先 (90%+ 置信度)
特定领域的专业工具优先:

${generateProfessionalRules()}

### 规则 5: 复杂度与生态评估 (调节置信度 ±5%)
考虑场景复杂度和语言生态:

- **简单快速场景** → Mermaid 优先 (+5% confidence) - 14 种图表最全面
- **需要严格 UML** → PlantUML (+5%) - 8 种标准 UML 图
- **现代美观需求** → D2 (+5%) - 7 种现代化图表
- **特定领域专用** → 专用语言 (+10%) - 如 WaveDrom, DBML, NwDiag

## Few-shot 学习案例 (涵盖 23 种语言典型场景)

### 案例 1: 多参与者交互 → Mermaid sequence (95%)
**需求**: "用户登录系统,前端发送请求到后端验证,后端查询数据库,返回 JWT token"
**分析步骤**:
1. **领域识别**: 业务流程 - 用户认证
2. **关键词匹配**: "登录", "请求", "验证", "返回" → sequence (规则 1, 95%)
3. **参与者数量**: 4 个 (用户、前端、后端、数据库) → sequence (规则 2, 95%)
4. **时间特征**: 有明确交互时序 → sequence (规则 3, 90%)
**推荐**: \`{"renderLanguage": "mermaid", "diagramType": "sequence", "confidence": 0.95}\`
**理由**: 多参与者时序交互 + Mermaid 简洁语法 + 14 种图表生态

### 案例 2: 数据库设计 → DBML schema (95%)
**需求**: "电商数据库设计,用户表 (id, username, email)、订单表 (id, user_id, total)、商品表 (id, name, price),包含外键和索引"
**分析步骤**:
1. **领域识别**: 数据库设计 - 多表关系
2. **关键词匹配**: "数据库", "表", "外键", "索引" → schema (规则 1, 95%)
3. **实体数量**: 3+ 表 + 关系 → schema (规则 2, 90%)
4. **专业场景**: 数据库正式文档 → DBML (规则 4, 95%)
**推荐**: \`{"renderLanguage": "dbml", "diagramType": "schema", "confidence": 0.95}\`
**理由**: DBML 最接近 SQL DDL + 支持索引/约束 + 数据库专家首选

### 案例 3: 业务流程 → BPMN process (90%)
**需求**: "订单审批流程,创建申请 → 部门经理审批 → 财务审批 → 发货 → 确认收货,支持驳回和重新提交"
**分析步骤**:
1. **领域识别**: 业务流程 - 审批流程
2. **关键词匹配**: "审批", "流程", "驳回" → process/flowchart (规则 1, 92%)
3. **复杂度**: 有条件分支 + 循环 → 专业建模
4. **专业场景**: 业务流程标准 → BPMN (规则 4, 95%)
**推荐**: \`{"renderLanguage": "bpmn", "diagramType": "process", "confidence": 0.90}\`
**理由**: 符合 BPMN 2.0 标准 + 支持复杂流程控制 + 业务分析师认可

### 案例 4: C4 架构 → Structurizr container (95%)
**需求**: "微服务架构 C4 容器图,Web 应用、移动应用、API 网关、用户服务、订单服务、消息队列、数据库的关系"
**分析步骤**:
1. **领域识别**: 系统架构 - C4 模型
2. **关键词匹配**: "C4", "容器", "微服务" → container (规则 1, 90%)
3. **专业场景**: C4 架构模型 → Structurizr (规则 4, 98%)
4. **生态考量**: Structurizr 7 种 C4 图表最全
**推荐**: \`{"renderLanguage": "structurizr", "diagramType": "container", "confidence": 0.95}\`
**理由**: C4 架构建模 DSL 专家 + 支持完整 C4 层级 + 架构师首选

### 案例 5: 数据可视化 → Vegalite bar (95%)
**需求**: "展示 2024 年 Q1-Q4 各季度销售额对比,柱状图"
**分析步骤**:
1. **领域识别**: 数据可视化 - 定量数据对比
2. **关键词匹配**: "销售额", "对比", "柱状图" → bar (规则 1, 95%)
3. **时间特征**: 无交互时序,只有数据趋势 → bar/line (规则 3)
4. **专业场景**: 数据分析报告 → Vegalite (规则 4, 95%)
**推荐**: \`{"renderLanguage": "vegalite", "diagramType": "bar", "confidence": 0.95}\`
**理由**: 数据可视化专家 + 支持交互和数据绑定 + 6 种图表类型

### 案例 6: 知识管理 → Mermaid mindmap (98%)
**需求**: "前端技术栈思维导图,框架 (React, Vue, Angular)、工具链 (Webpack, Vite)、状态管理 (Redux, Zustand)"
**分析步骤**:
1. **领域识别**: 知识管理 - 层级结构
2. **关键词匹配**: "思维导图", "分类", "层级" → mindmap (规则 1, 98%)
3. **结构特征**: 树形层级,无时间特征 → mindmap (规则 3)
4. **生态考量**: Mermaid 14 种图表 + 语法极简
**推荐**: \`{"renderLanguage": "mermaid", "diagramType": "mindmap", "confidence": 0.98}\`
**理由**: Mermaid mindmap 语法最简洁 + 适合快速头脑风暴 + 生态最完善

### 案例 7: 网络拓扑 → NwDiag network (95%)
**需求**: "数据中心网络架构,DMZ 区 (Web 服务器、负载均衡)、内网区 (应用服务器、数据库)、管理区 (堡垒机)"
**分析步骤**:
1. **领域识别**: 网络拓扑 - 多网段架构
2. **关键词匹配**: "网络", "服务器", "DMZ", "内网" → network (规则 1, 95%)
3. **专业场景**: 网络架构文档 → NwDiag (规则 4, 95%)
**推荐**: \`{"renderLanguage": "nwdiag", "diagramType": "network", "confidence": 0.95}\`
**理由**: 网络工程师专用 + 支持多网段 + 1 种网络图表

### 案例 8: 数字信号 → WaveDrom timing (98%)
**需求**: "SPI 总线时序波形图,SCLK、MOSI、MISO、CS 信号的时序关系"
**分析步骤**:
1. **领域识别**: 硬件设计 - 数字信号
2. **关键词匹配**: "时序波形", "信号", "总线" → timing (规则 1, 98%)
3. **专业场景**: 硬件设计文档 → WaveDrom (规则 4, 98%)
**推荐**: \`{"renderLanguage": "wavedrom", "diagramType": "timing", "confidence": 0.98}\`
**理由**: 数字电路专用 + 硬件工程师首选 + 4 种信号图表

### 案例 9: 状态机 → Mermaid state (90%)
**需求**: "订单状态流转,待支付 → 已支付 → 已发货 → 已完成,支持取消和退款"
**分析步骤**:
1. **领域识别**: 业务流程 - 状态机
2. **关键词匹配**: "状态", "流转" → state (规则 1, 90%)
3. **时间特征**: 有状态转换 + 事件触发 → state (规则 3, 90%)
4. **生态考量**: Mermaid 语法简洁 + 14 种图表
**推荐**: \`{"renderLanguage": "mermaid", "diagramType": "state", "confidence": 0.90}\`
**理由**: Mermaid state 简洁 + 支持嵌套状态 + 适合快速建模

### 案例 10: 项目管理 → Mermaid gantt (98%)
**需求**: "项目甘特图,需求分析 (1-2周)、设计 (2-3周)、开发 (3-8周)、测试 (8-10周)、上线 (10周)"
**分析步骤**:
1. **领域识别**: 项目管理 - 时间计划
2. **关键词匹配**: "甘特图", "排期", "周" → gantt (规则 1, 98%)
3. **时间特征**: 有项目排期 + 时间跨度 → gantt (规则 3, 95%)
**推荐**: \`{"renderLanguage": "mermaid", "diagramType": "gantt", "confidence": 0.98}\`
**理由**: Mermaid gantt 最常用 + 语法简单 + 适合敏捷项目

### 案例 11: UML 类图 → PlantUML class (95%)
**需求**: "面向对象设计,用户类、订单类、商品类的继承和组合关系,包含接口 IPayment"
**分析步骤**:
1. **领域识别**: 系统架构 - 面向对象设计
2. **关键词匹配**: "类", "继承", "接口" → class (规则 1, 95%)
3. **专业场景**: UML 标准建模 → PlantUML (规则 4, 95%)
**推荐**: \`{"renderLanguage": "plantuml", "diagramType": "class", "confidence": 0.95}\`
**理由**: 符合 UML 2.5 规范 + 支持完整 UML 关系 + 技术评审标准

### 案例 12: 机柜布局 → RackDiag rack (98%)
**需求**: "42U 标准机柜布局,1-2U 交换机、3-10U 服务器、20-30U 存储阵列"
**分析步骤**:
1. **领域识别**: 硬件物理 - 数据中心布局
2. **关键词匹配**: "机柜", "U位", "布局" → rack (规则 1, 98%)
3. **专业场景**: 数据中心物理文档 → RackDiag (规则 4, 98%)
**推荐**: \`{"renderLanguage": "rackdiag", "diagramType": "rack", "confidence": 0.98}\`
**理由**: 数据中心专用 + U 位精确布局 + IDC 工程师首选

## 输出格式 (JSON)

严格按照以下格式输出,renderLanguage 必须使用 value 列的全小写值:

\`\`\`json
{
  "renderLanguage": "mermaid",
  "diagramType": "sequence",
  "confidence": 0.92,
  "reasons": [
    "检测到多个参与者交互",
    "Mermaid 语法简洁适合时序图"
  ],
  "alternatives": [
    {
      "language": "plantuml",
      "type": "sequence",
      "confidence": 0.85,
      "reason": "更严格的 UML 规范"
    }
  ]
}
\`\`\`

**重要**: renderLanguage 和 alternatives[].language 必须使用上表 value 列的全小写值 (如 "nwdiag", "blockdiag"),不要使用显示名称 (如 "NwDiag", "BlockDiag")。

现在,请根据用户需求分析并返回推荐结果。`;
}
