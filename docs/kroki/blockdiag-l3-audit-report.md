# BlockDiag 系列 L3 审查报告

## 执行摘要

对 BlockDiag 家族 7 种语言的 L3 层级 prompt 文件进行了全面审查。整体质量良好,所有类型定义与前端配置完全对齐。发现 **3 个关键问题** 需要优化。

---

## 一、各语言现状统计

### 1.1 类型定义对齐验证

| 语言 | 前端定义类型数 | L3 文件数 | 对齐状态 |
|------|----------------|-----------|----------|
| **Ditaa** | 1 | 1 | ✅ 完全对齐 |
| **NwDiag** | 1 | 1 | ✅ 完全对齐 |
| **BlockDiag** | 2 | 2 | ✅ 完全对齐 |
| **ActDiag** | 2 | 2 | ✅ 完全对齐 |
| **PacketDiag** | 2 | 2 | ✅ 完全对齐 |
| **RackDiag** | 2 | 2 | ✅ 完全对齐 |
| **SeqDiag** | 1 | 1 | ✅ 完全对齐 |
| **总计** | **11** | **11** | **100% 对齐** |

**结论**: 所有 L3 文件与前端类型定义完全一致,无缺失或多余文件。

---

### 1.2 文件质量指标

| 语言 | 类型 | 行数 | 示例数 | 错误案例 | 检查清单 | 质量评级 |
|------|------|------|--------|----------|----------|----------|
| **Ditaa** | ascii | 381 | 5 | 3 | 0 | ⚠️ 中等 |
| **NwDiag** | network | 315 | 3 | 3 | 7 | ✅ 良好 |
| **BlockDiag** | block | 262 | 3 | 3 | 8 | ✅ 良好 |
| **BlockDiag** | group | 364 | 3 | 2 | 7 | ✅ 良好 |
| **ActDiag** | activity | 246 | 3 | 2 | 6 | ✅ 良好 |
| **ActDiag** | swimlane | 297 | 3 | 2 | 7 | ✅ 良好 |
| **PacketDiag** | packet | 134 | 2 | 2 | 5 | ✅ 良好 |
| **PacketDiag** | protocol | **43** | **1** | **0** | **3** | ❌ **过简** |
| **RackDiag** | rack | **63** | **1** | **1** | **4** | ⚠️ **偏简** |
| **RackDiag** | datacenter | **60** | **1** | **0** | **4** | ⚠️ **偏简** |
| **SeqDiag** | sequence | 192 | 3 | 3 | 6 | ✅ 良好 |

**发现问题**:
- **严重**: PacketDiag/protocol.txt 仅 43 行,缺少多场景示例和错误案例
- **次要**: RackDiag 的两个 L3 文件偏简单,示例不足

---

## 二、L2/L3 内容分布验证

### 2.1 RackDiag: L2 精简后的内容边界

**背景**: 我们在优化 RackDiag 时将 L2 (common.txt) 精简到 289 行,需验证 L3 是否遗漏关键内容。

#### L2 (common.txt) - 289 行
**核心内容**:
```
## 强制规则（Mandatory Rules）
### ⚠️ 规则 1: 图表声明语法（编译失败）
### ⚠️ 规则 2: U 位范围必须在 1-42 之间（渲染异常）
### ⚠️ 规则 3: 多 U 设备必须使用 `[2U]` 等标记（空间计算错误）
### ⚠️ 规则 4: 多 U 设备不能导致 U 位重叠（渲染异常）
### ⚠️ 规则 5: 中文描述必须使用双引号包裹（编译失败）

## 核心语法
- 图表声明
- 设备定义
- 属性定义
- 分组
- 最佳实践
```

#### L3 (rack.txt) - 63 行
**专属内容**:
```
## 图表类型：机柜图（Rack Diagram）
- 单机柜设备布局（U位规划）

## 核心语法
- 基础机架定义

## 生成示例
- 示例：标准42U机柜
  - 电源在底部，网络居中，管理在顶部

## 常见错误
- 错误 1: U位重叠

## 生成检查清单
- U位编号：1-42范围内
- 无重叠
- 布局合理
```

#### L3 (datacenter.txt) - 60 行
**专属内容**:
```
## 图表类型：数据中心机柜布局
- 多机柜布局规划

## 核心语法
- 基础机架定义（与 rack.txt 相同）
- 数据中心场景侧重多机柜协作和分区规划

## 生成示例
- 示例：数据中心标准机柜
  - 分区规划：电源→网络→计算→存储→管理
  - 冗余设计：关键设备有备份

## 生成检查清单
- 分区规划
- 冗余设计
- 散热考虑
```

**结论**:
- ✅ L2 精简后内容分布合理
- ✅ L3 补充了特定场景的布局规范
- ⚠️ **但示例不足** - rack.txt 和 datacenter.txt 各只有 1 个示例

---

### 2.2 SeqDiag: L2 精简后的内容边界

**背景**: SeqDiag 的 L2 (common.txt) 精简到 371 行,需验证 L3 是否遗漏关键内容。

#### L2 (common.txt) - 371 行
**核心内容**:
```
## 强制规则（Mandatory Rules）
### ⚠️ 规则 1: 图表声明语法（编译失败）
### ⚠️ 规则 2: 返回消息必须使用 `<--`（渲染异常）
### ⚠️ 规则 3: 中文标签必须使用双引号包裹（编译失败）
### ⚠️ 规则 4: 激活/失活必须成对出现（渲染异常）

## 核心语法
- 图表声明
- 对象定义
- 消息定义
- 激活块
- 分组
- 最佳实践
```

#### L3 (sequence.txt) - 192 行
**专属内容**:
```
## 图表类型：时序图（BlockDiag风格）
- 对象间消息传递序列

## 核心语法
- 基础时序图
- 语法要点（-> 请求，--> 返回）

## 生成示例（3 个层次）
- 示例 1: 用户登录流程（简单场景）
- 示例 2: 电商下单流程（中等复杂度）
- 示例 3: 微服务调用链（高级场景）

## 常见错误
- 错误 1: 消息缺少标签
- 错误 2: 对象未定义
- 错误 3: 返回消息使用实线

## 生成检查清单（6 项）
```

**结论**:
- ✅ L2 精简后内容分布合理
- ✅ L3 有充分的场景示例（3 个层次）
- ✅ SeqDiag 的 L2/L3 边界清晰,无遗漏

---

## 三、问题清单和修复建议

### 优先级 1: PacketDiag/protocol.txt 过于简陋

**问题描述**:
- 文件仅 43 行,是所有 L3 文件中最短的
- 只有 1 个示例（HTTP 请求协议栈）
- 没有常见错误案例
- 检查清单仅 3 项,不够全面
- 说明文字"同 packet.txt，使用 PacketDiag 语法展示协议分层"过于简略

**影响**:
- 用户无法理解 packet 和 protocol 的区别
- 缺少多场景示例导致 AI 生成能力受限
- 没有错误案例导致用户容易犯错

**修复建议**:
```markdown
1. 补充概念说明:
   - packet: 单个协议头的字段布局（横向细节）
   - protocol: 多层协议栈的分层结构（纵向架构）

2. 新增示例（至少 3 个）:
   - 示例 1: TCP/IP 四层模型（简单）
   - 示例 2: OSI 七层模型（标准）
   - 示例 3: HTTPS 完整协议栈（复杂）

3. 新增常见错误:
   - 错误 1: 协议层次混乱
   - 错误 2: 字段位偏移计算错误
   - 错误 3: 缺少关键协议层

4. 扩充检查清单:
   - [ ] 协议分层清晰
   - [ ] 各层颜色区分
   - [ ] 字段位偏移正确
   - [ ] 包含完整协议栈
   - [ ] 代码可渲染
```

**预期目标**: 将文件扩充到 120-150 行,与 packet.txt (134 行) 相当

---

### 优先级 2: RackDiag 的 L3 文件示例不足

**问题描述**:
- rack.txt (63 行) 和 datacenter.txt (60 行) 各只有 1 个示例
- 缺少常见错误案例（datacenter.txt 完全没有）
- 场景覆盖不足

**影响**:
- 用户无法理解两种类型的差异
- AI 生成能力受限于单一示例

**修复建议**:

#### rack.txt 补充:
```markdown
1. 新增示例:
   - 示例 2: 高密度刀片服务器机柜
   - 示例 3: 存储专用机柜

2. 新增常见错误:
   - 错误 2: 电源容量计算错误
   - 错误 3: 散热布局不合理
```

#### datacenter.txt 补充:
```markdown
1. 新增示例:
   - 示例 2: 双机房冗余架构
   - 示例 3: 边缘计算机柜布局

2. 新增常见错误:
   - 错误 1: 机柜间连接关系不清晰
   - 错误 2: 冗余设计缺失
```

**预期目标**: 将两个文件扩充到 90-120 行

---

### 优先级 3: Ditaa/ascii.txt 缺少检查清单

**问题描述**:
- 文件虽然有 381 行,但缺少"生成检查清单"部分
- 其他语言都有 `- [ ]` 格式的检查清单,唯独 Ditaa 没有

**影响**:
- 用户和 AI 无法系统化验证生成结果
- 与其他语言的格式不一致

**修复建议**:
```markdown
## 生成检查清单

- [ ] **边框闭合**：所有矩形框完全闭合
- [ ] **连接对齐**：连接线无空格缩进,精确对齐
- [ ] **文本适配**：文本完全在边框内,边框宽度足够
- [ ] **符号正确**：Ditaa 特殊标记（{d}, {s}, {io}）使用正确
- [ ] **箭头清晰**：箭头方向明确,连接关系清晰
- [ ] **颜色合理**：适当使用颜色标记增强视觉效果
- [ ] **代码可渲染**：语法正确，可直接通过 Kroki 渲染

**任何检查项不通过，立即修正后重新生成**
```

---

## 四、家族一致性分析

### 4.1 BlockDiag 系列语法相似性

**核心共性**:
```python
# 所有 BlockDiag 系列语言的共同特征
BLOCKDIAG_COMMON = {
    "图表声明": "{language}diag { ... }",
    "节点定义": "A [label = \"标签\"];",
    "连接语法": "A -> B;",
    "分组语法": "group { label = \"分组\"; A; B; }",
    "颜色标记": "color = \"#RRGGBB\"",
    "中文支持": "双引号包裹",
}

# 各语言的特殊性
SPECIFIC_FEATURES = {
    "blockdiag": "节点形状 (box, diamond, roundedbox)",
    "actdiag": "泳道 (lane), 并行活动",
    "seqdiag": "消息箭头 (->, <--), 激活块",
    "nwdiag": "网段 (network), IP 地址",
    "packetdiag": "位范围 (0-15), 列宽 (colwidth)",
    "rackdiag": "U 位编号 (1-42), 多 U 设备 ([2U])",
}
```

**一致性验证**:
- ✅ 所有语言都有完整的强制规则（L2 层）
- ✅ 所有语言都有专家视角和核心语法
- ✅ 所有语言都区分了 L2 通用规则和 L3 特定场景
- ⚠️ 部分 L3 文件的示例数量不均（1-3 个不等）

---

### 4.2 Ditaa 的特殊性

**为什么 Ditaa 不属于 BlockDiag 家族？**

| 特性 | BlockDiag 系列 | Ditaa |
|------|----------------|-------|
| **语法风格** | 结构化 DSL | ASCII 艺术 |
| **节点定义** | `A [label = "..."]` | ASCII 字符框 `+---+` |
| **连接方式** | `A -> B` | ASCII 箭头 `-->` |
| **渲染方式** | 直接解析 DSL | ASCII 转图形 |
| **主要用途** | 标准流程图/网络图 | 快速原型/文本图表 |

**Ditaa 的独特价值**:
- ✅ 无需学习 DSL,直接用 ASCII 字符绘图
- ✅ 适合代码注释、文档内嵌图表
- ✅ 纯文本可读性强

**L3 文件特点**:
- 381 行,是所有 L3 文件中最长的
- 包含完整的"角色定义"、"职责"、"输出标准"
- **唯一缺少检查清单的文件**（需补充）

---

## 五、总结与行动计划

### 5.1 整体评估

| 维度 | 评分 | 说明 |
|------|------|------|
| **类型对齐** | 100% | 11/11 文件与前端定义完全一致 |
| **L2/L3 边界** | ✅ 良好 | RackDiag 和 SeqDiag 精简后内容分布合理 |
| **内容完整性** | ⚠️ 中等 | 3 个文件需要补充内容 |
| **示例丰富度** | ⚠️ 中等 | 部分文件示例不足（1-2 个） |
| **错误覆盖** | ✅ 良好 | 大部分文件有 2-3 个错误案例 |
| **检查清单** | ⚠️ 中等 | Ditaa 缺少检查清单 |

**综合评分**: **78/100** (良好,需优化)

---

### 5.2 行动计划

#### 立即修复（高优先级）
1. **PacketDiag/protocol.txt** - 扩充到 120-150 行
   - 补充概念说明（packet vs protocol）
   - 新增 2 个示例（OSI 七层、HTTPS 协议栈）
   - 新增 3 个常见错误
   - 扩充检查清单到 5-7 项

2. **Ditaa/ascii.txt** - 补充检查清单
   - 添加 7 项检查清单
   - 格式与其他语言保持一致

#### 次要优化（中优先级）
3. **RackDiag/rack.txt** - 扩充到 90-120 行
   - 新增 2 个示例（刀片服务器、存储机柜）
   - 新增 2 个常见错误

4. **RackDiag/datacenter.txt** - 扩充到 90-120 行
   - 新增 2 个示例（双机房冗余、边缘计算）
   - 新增 2 个常见错误

#### 可选改进（低优先级）
5. **统一示例数量** - 所有 L3 文件至少 3 个示例
   - 简单场景（1 个）
   - 中等复杂度（1 个）
   - 高级场景（1 个）

---

### 5.3 质量标准（参考）

**优秀 L3 文件的标准**:
```
✅ 文件长度: 150-300 行
✅ 示例数量: 3-5 个（覆盖简单→复杂）
✅ 错误案例: 2-3 个（常见错误）
✅ 检查清单: 5-8 项（系统化验证）
✅ 图表类型说明: 清晰的使用场景
✅ 核心语法: 与 L2 互补,不重复
```

**当前达标情况**:
- **达标** (6/11): NwDiag/network, BlockDiag/block, BlockDiag/group, ActDiag/activity, ActDiag/swimlane, SeqDiag/sequence
- **接近达标** (2/11): PacketDiag/packet, Ditaa/ascii
- **需改进** (3/11): PacketDiag/protocol, RackDiag/rack, RackDiag/datacenter

---

## 六、历史教训与经验

### 6.1 L2 精简的成功案例

**RackDiag 和 SeqDiag 的 L2 精简**:
- ✅ 成功将冗余内容移除,保留核心强制规则
- ✅ L3 文件正确补充了特定场景的规范
- ✅ 证明了 L2 通用 + L3 特定的三层架构是可行的

**经验总结**:
1. L2 精简后,必须验证 L3 是否遗漏关键内容
2. L3 文件的示例数量直接影响 AI 生成质量
3. 检查清单是 L3 文件的必备组成部分

---

### 6.2 类型定义对齐的重要性

**2025-10-12 的教训**:
- 发现所有 23 种语言的类型定义都存在严重混乱
- 原因: 复制粘贴错误,把其他语言的类型混在一起
- 修复: 完全基于实际 prompt 文件重建类型定义

**本次验证结果**:
- ✅ BlockDiag 系列 11 个类型定义与 L3 文件 100% 对齐
- ✅ 证明了类型定义维护流程的有效性

**持续维护规则**:
1. 添加新图表类型:
   - ✅ 先创建 `prompts/{language}/{type}.txt` 文件
   - ✅ 然后在 `LANGUAGE_DIAGRAM_TYPES` 添加对应类型定义
   - ✅ 验证三方对齐: 运行 `npx tsx scripts/verify-types.ts`

2. 删除图表类型:
   - ✅ 先从 `LANGUAGE_DIAGRAM_TYPES` 移除类型定义
   - ✅ 然后删除或重命名 `prompts/{language}/{type}.txt`
   - ⚠️ 保留有价值的 prompt 内容,避免误删

---

## 附录: 文件清单

### A1. 所有 L3 文件路径

```
/root/Diagram/DiagramAI/src/lib/constants/prompts/ditaa/ascii.txt
/root/Diagram/DiagramAI/src/lib/constants/prompts/nwdiag/network.txt
/root/Diagram/DiagramAI/src/lib/constants/prompts/blockdiag/block.txt
/root/Diagram/DiagramAI/src/lib/constants/prompts/blockdiag/group.txt
/root/Diagram/DiagramAI/src/lib/constants/prompts/actdiag/activity.txt
/root/Diagram/DiagramAI/src/lib/constants/prompts/actdiag/swimlane.txt
/root/Diagram/DiagramAI/src/lib/constants/prompts/packetdiag/packet.txt
/root/Diagram/DiagramAI/src/lib/constants/prompts/packetdiag/protocol.txt
/root/Diagram/DiagramAI/src/lib/constants/prompts/rackdiag/rack.txt
/root/Diagram/DiagramAI/src/lib/constants/prompts/rackdiag/datacenter.txt
/root/Diagram/DiagramAI/src/lib/constants/prompts/seqdiag/sequence.txt
```

### A2. 官方文档参考

```
/root/Diagram/DiagramAI/docs/kroki/ditaa/
/root/Diagram/DiagramAI/docs/kroki/nwdiag/
/root/Diagram/DiagramAI/docs/kroki/blockdiag/
/root/Diagram/DiagramAI/docs/kroki/actdiag/
/root/Diagram/DiagramAI/docs/kroki/packetdiag/
/root/Diagram/DiagramAI/docs/kroki/rackdiag/
/root/Diagram/DiagramAI/docs/kroki/seqdiag/
```

每个目录包含:
- `official-docs.md` - 官方文档
- `syntax-rules.md` - 语法规则
- `common-errors.md` - 常见错误
- `community-issues.md` - 社区问题

---

**报告生成时间**: 2025-10-13
**审查人**: Claude (Sonnet 4.5)
**审查范围**: BlockDiag 系列 7 种语言 11 个 L3 文件
**下一步**: 根据行动计划优化 3 个关键文件
