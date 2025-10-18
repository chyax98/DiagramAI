# Promote V3 拼接规范与文件组织

## 📂 文件组织结构

```
Promote-V3/
├── Promote-V3-Spec.md          # V3 架构规范文档
├── ASSEMBLY_SPEC.md            # 本文件 - 拼接规范
│
├── L1.md                       # 通用层 (936字符)
│
├── L2-{language}.md            # 语言层 (800-1200字符)
│   ├── L2-mermaid.md
│   ├── L2-plantuml.md
│   ├── L2-d2.md
│   ├── L2-graphviz.md
│   ├── L2-structurizr.md
│   ├── L2-c4plantuml.md
│   ├── L2-dbml.md
│   └── ...
│
└── L3-{language}-{type}.md     # 类型层 (800-950字符)
    ├── L3-mermaid-flowchart.md
    ├── L3-mermaid-sequence.md
    ├── L3-mermaid-class.md
    ├── L3-mermaid-er.md
    └── ...
```

---

## 🔧 拼接逻辑

### 核心原则

1. **按 DEPTH 段合并**: D → E → P → T → H 顺序拼接三层
2. **去除层级标记**: 不在最终提示词中暴露 "L1/L2/L3"
3. **自然语言改写**: 将三层内容重写为流畅连续的段落
4. **占位符替换**: 拼接时替换 `{language}` 和 `{diagram_type}`

### 拼接公式

```typescript
最终提示词 =
  拼接(L1.D, L2.D, L3.D) +
  拼接(L1.E, L2.E, L3.E) +
  拼接(L1.P, L2.P, L3.P) +
  拼接(L1.T, L2.T, L3.T) +
  拼接(L1.H, L2.H, L3.H);
```

### 段落拼接规则

#### D (Define) - 角色定义

```
合并策略: 累加角色，去重职责
输出格式: "你同时扮演 {L1角色}、{L2角色}、{L3角色}，协作目标是 {目标}。"

示例:
L1.D: "同时扮演需求分析专家、图表架构师、代码实现工程师，协作将用户自然语言描述转化为符合目标语言语法的完整可渲染图表代码。"
L2.D: "Mermaid 语法稽核员负责核对首行声明、方向语句、箭头符号与保留关键字。"
L3.D: "业务流程审校员负责确保流程图覆盖所有分支路径、起止节点完整且决策逻辑闭环。"

拼接后:
"你同时扮演需求分析专家、图表架构师、代码实现工程师、Mermaid 语法稽核员、业务流程审校员，协作将用户自然语言描述转化为可直接渲染的 Mermaid 流程图代码。Mermaid 语法稽核员核对首行声明、方向语句、箭头符号与保留关键字，业务流程审校员确保流程图覆盖所有分支路径、起止节点完整且决策逻辑闭环。"
```

#### E (Establish) - 成功指标

```
合并策略: L1 通用约束 + L2 语言红线 + L3 类型必备，按优先级排列
输出格式: 连续段落，使用分号或句号分隔

示例:
L1.E: "读取消息开头的 <<<SYSTEM_INSTRUCTION>>> 标记判定任务模式...最终产物必须零语法错误..."
L2.E: "首行仅允许图表类型与方向...ID 禁用 graph、subgraph、end..."
L3.E: "声明行必须是 graph TD、graph LR...必须包含至少一个明确的起点节点..."

拼接后:
"读取消息开头的 <<<SYSTEM_INSTRUCTION>>> 标记判定任务模式:GENERATE_NEW_DIAGRAM 表示从零生成全新图表，ADJUST_EXISTING_DIAGRAM 表示基于现有代码进行最小化修改保持原风格，FIX_SYNTAX_ERRORS_ONLY 表示仅修复导致渲染失败的语法错误而不改变任何逻辑或内容。最终产物必须零语法错误且完全覆盖需求，所有节点或边 ID 仅用英文、数字、下划线、连字符且全局唯一，标签与文本默认中文并按目标语言规范转义特殊符号，输出只含纯图表源代码严禁 Markdown 包裹、frontmatter、解释段或占位符。

Mermaid 特定约束:首行仅允许图表类型与方向可在其前单独放置 %%{init:...}%% 配置；ID 禁用 graph、subgraph、end、flowchart、direction、class 等保留关键字且保持唯一，包含括号、引号、竖线、尖括号、花括号的标签或注释必须双引号包裹，注释统一使用 %%。

流程图特定要求:声明行必须是 graph TD、graph LR、flowchart TD 或 flowchart LR 其中之一推荐使用 flowchart TD 以支持长文本自动换行；必须包含至少一个明确的起点节点和一个明确的终点节点，所有决策节点必须至少有两条出边且所有分支最终汇聚或达到终点，循环结构必须有明确的退出条件防止死循环。"
```

#### P (Provide) - 背景信息

```
合并策略: 仅保留对生成行为有实际影响的信息
输出格式: 精简段落，突出限制和要求

示例:
L1.P: "系统通过 Kroki HTTP API 渲染图表，当前运行 SECURE 模式禁止访问文件系统与外部网络。"
L2.P: "Kroki 通过无头浏览器执行 Mermaid，默认 UTF-8 支持中文标签..."
L3.P: "流程图常用于业务审批流程、算法逻辑、异常处理...flowchart 相比 graph 支持更多节点形状..."

拼接后:
"系统通过 Kroki HTTP API 渲染 Mermaid 图表运行 SECURE 模式禁止访问外部资源，默认 UTF-8 支持中文标签，输出必须是纯源码不含 Markdown 或 frontmatter。流程图常用于业务审批流程、算法逻辑、异常处理等场景，推荐使用 flowchart TD 以支持长文本自动换行和更多节点形状。"
```

#### T (Task) - 执行任务

```
合并策略: L1 任务分流 + L2 语言步骤 + L3 类型操作骨架
输出格式: 分点列举或连续流程描述

示例:
L1.T: "判定任务模式后执行对应流程。GENERATE 模式:拆解需求、圈定语言与图表类型..."
L2.T: "确定图表类型与方向后，先按需写入 %%{init:} 并紧接首行声明..."
L3.T: "首行声明 flowchart TD 并定义所有节点(起点、处理、决策、终点)..."

拼接后:
"判定任务模式后执行对应流程。若为 GENERATE_NEW_DIAGRAM 模式:拆解需求、圈定图表类型为流程图、列出全部元素关系，首行声明 flowchart TD 并定义所有节点(起点、处理、决策、终点)确保 ID 唯一且不含保留字，按需写入 %%{init:} 配置紧接首行声明，按业务逻辑顺序连线并为决策节点的每条分支附加条件标签，检查所有分支是否最终汇聚或到达终点避免断链，若有循环确保存在退出条件。

若为 ADJUST_EXISTING_DIAGRAM 模式:通读原代码确认结构、锚点、注释与命名，在保留既有布局前提下实施最小修改并补齐必要注释。

若为 FIX_SYNTAX_ERRORS_ONLY 模式:仅修正导致渲染失败的语法、声明、转义或大小写问题禁止隐形重构或额外优化。"
```

#### H (Human) - 自检回路

```
合并策略: L1 通用自检 + L2 语言复核 + L3 类型复核
输出格式: 分层检查清单

示例:
L1.H: "交付前按语法准确性、结构完整性、需求匹配度三维评估..."
L2.H: "提交前确认首行声明、方向和主题配置合法，检查是否存在保留字冲突..."
L3.H: "确认声明行合法、起止节点存在且唯一，所有决策节点至少有两条出边..."

拼接后:
"交付前按语法准确性、结构完整性、需求匹配度三维评估确保各项合格。

通用检查:核对语言层与类型层的所有强制约束，预判 Kroki 常见报错如 unknown token、empty message、Lexical error、syntax Error 并确认不存在，排查遗漏实体、重复连线、孤立节点或命名冲突。

Mermaid 语法检查:确认首行声明、方向和主题配置合法，检查是否存在保留字冲突、未加引号的特殊字符、误用的箭头或注释；核对所有 classDef、style、link 是否受 Kroki 支持且未触发 SECURE 限制。

流程图特定检查:确认声明行合法、起止节点存在且唯一，所有决策节点至少有两条出边并附带条件标签；检查是否存在孤立节点(无入边或无出边)、断链(分支未汇聚)、死循环(无退出条件的循环)；核对节点 ID 无保留字冲突、特殊字符已加引号；最后模拟渲染预判 Parse error、end is a reserved word 等常见错误并确保不存在。"
```

---

## 🔄 占位符替换

在拼接过程中，需要替换以下占位符:

| 占位符            | 说明         | 示例值                     |
| ----------------- | ------------ | -------------------------- |
| `{language}`      | 渲染语言名称 | Mermaid, PlantUML, D2      |
| `{diagram_type}`  | 图表类型名称 | 流程图, 时序图, 类图       |
| `{language_code}` | 语言代码     | mermaid, plantuml, d2      |
| `{type_code}`     | 类型代码     | flowchart, sequence, class |

**替换时机**: 在拼接 D/E/P 段时替换，确保最终文本中不含占位符

---

## 📏 质量标准

### 字数控制

| 最终拼接结果 | 目标字数  | 最大字数 |
| ------------ | --------- | -------- |
| L1 + L2 + L3 | 2500-3500 | 5000     |

### 质量检查清单

- [ ] ✅ 不含层级标记 (L1/L2/L3)
- [ ] ✅ 不含 DEPTH 段落标题 (# D, # E 等)
- [ ] ✅ 占位符已全部替换
- [ ] ✅ 语句流畅自然无重复
- [ ] ✅ 关键约束无遗漏
- [ ] ✅ 任务指令系统完整
- [ ] ✅ 自检清单可执行

---

## 🛠️ 拼接实现伪代码

```typescript
function assemblePrompt(language: string, diagramType: string): string {
  // 1. 读取三层文件
  const l1 = readFile(`L1.md`);
  const l2 = readFile(`L2-${language}.md`);
  const l3 = readFile(`L3-${language}-${diagramType}.md`);

  // 2. 按 DEPTH 段解析
  const l1Parts = parseDEPTH(l1);
  const l2Parts = parseDEPTH(l2);
  const l3Parts = parseDEPTH(l3);

  // 3. 拼接各段
  const D = mergeD(l1Parts.D, l2Parts.D, l3Parts.D);
  const E = mergeE(l1Parts.E, l2Parts.E, l3Parts.E);
  const P = mergeP(l1Parts.P, l2Parts.P, l3Parts.P);
  const T = mergeT(l1Parts.T, l2Parts.T, l3Parts.T);
  const H = mergeH(l1Parts.H, l2Parts.H, l3Parts.H);

  // 4. 替换占位符
  const final = replacePlaceholders(`${D}\n\n${E}\n\n${P}\n\n${T}\n\n${H}`, {
    language,
    diagramType,
  });

  // 5. 验证质量
  validatePrompt(final);

  return final;
}

function parseDEPTH(content: string): Record<string, string> {
  const parts = {};
  const sections = content.split(/^# [DEPTH]/m);

  for (const section of sections) {
    const [header, ...body] = section.split("\n");
    const key = header.trim().split(" ")[1]; // D, E, P, T, H
    parts[key] = body.join("\n").trim();
  }

  return parts;
}

function mergeD(l1: string, l2: string, l3: string): string {
  // 合并角色定义
  const roles = [extractRoles(l1), extractRoles(l2), extractRoles(l3)].filter(Boolean);

  return `你同时扮演${roles.join("、")}，协作将用户输入转化为可直接渲染的图表代码。${l2} ${l3}`;
}

function mergeE(l1: string, l2: string, l3: string): string {
  // 合并成功指标：通用 + 语言 + 类型
  return `${l1}\n\n${l2}\n\n${l3}`;
}

function mergeP(l1: string, l2: string, l3: string): string {
  // 合并背景信息：去重，保留有用部分
  const combined = [l1, l2, l3].filter(Boolean).join(" ");
  return deduplicateInfo(combined);
}

function mergeT(l1: string, l2: string, l3: string): string {
  // 合并执行任务：嵌套层级
  return `${l1}\n\n${l2}\n\n${l3}`;
}

function mergeH(l1: string, l2: string, l3: string): string {
  // 合并自检回路：分层检查
  return `交付前按以下维度检查:\n\n通用检查:\n${l1}\n\n语言检查:\n${l2}\n\n类型检查:\n${l3}`;
}

function replacePlaceholders(text: string, vars: Record<string, string>): string {
  return text.replace(/{language}/g, vars.language).replace(/{diagram_type}/g, vars.diagramType);
}

function validatePrompt(prompt: string): void {
  const checks = [
    !prompt.includes("L1") && !prompt.includes("L2") && !prompt.includes("L3"),
    !prompt.includes("# D") && !prompt.includes("# E"),
    !prompt.includes("{language}") && !prompt.includes("{diagram_type}"),
    prompt.length <= 15000, // ~5000 字
  ];

  if (!checks.every(Boolean)) {
    throw new Error("Prompt validation failed");
  }
}
```

---

## 📝 使用示例

### 生成 Mermaid 流程图提示词

```bash
输入:
  language = "mermaid"
  diagramType = "flowchart"

文件:
  L1.md (936字符)
  L2-mermaid.md (1010字符)
  L3-mermaid-flowchart.md (824字符)

输出:
  拼接后提示词 (约 2800-3200字符)

质量检查:
  ✅ 无层级标记
  ✅ 无 DEPTH 标题
  ✅ 占位符已替换
  ✅ 总字数 < 5000
```

---

## 🎯 下一步行动

1. **实现拼接脚本** (`scripts/assemble-prompts.ts`)
2. **测试拼接输出** (验证质量和可读性)
3. **数据库导入** (更新 `custom_prompts` 表结构)
4. **API 集成** (修改提示词加载逻辑)
5. **A/B 测试** (V2 vs V3 效果对比)
