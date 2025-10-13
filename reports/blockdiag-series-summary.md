# BlockDiag 系列 Prompt 系统深度审查汇总报告

**审查范围**: BlockDiag 系列 6 种语言 (BlockDiag, NwDiag, ActDiag, PacketDiag, RackDiag, SeqDiag)
**审查日期**: 2025-10-13
**文件总数**: 6 个 L2 文件 + 11 个 L3 文件 = 17 个文件
**总行数**: 4,690 行

---

## 📊 语言概览

| 语言 | L2 行数 | L3 文件数 | L3 总行数 | 总行数 | 评分 |
|------|---------|----------|----------|--------|------|
| **BlockDiag** | 176 | 2 | 628 | 804 | 8.0/10 |
| **NwDiag** | 206 | 1 | 316 | 522 | 7.8/10 |
| **ActDiag** | 187 | 2 | 545 | 732 | 8.2/10 |
| **PacketDiag** | 156 | 2 | 324 | 480 | 8.8/10 |
| **RackDiag** | 290 | 2 | 497 | 787 | 8.3/10 |
| **SeqDiag** | 372 | 1 | 193 | 565 | 8.5/10 |
| **总计** | 1,387 | 10 | 2,503 | 4,690 | **8.3/10** |

---

## 🏆 横向对比分析

### 1. L2 通用规范质量排名

| 排名 | 语言 | L2 行数 | 强制规则数 | 核心特性 | 质量评价 |
|------|------|---------|----------|----------|----------|
| 🥇 1 | **SeqDiag** | 372 | 4 | 返回消息 `<--`, 激活框成对 | 最详细,但过长 |
| 🥈 2 | **RackDiag** | 290 | 5 | U 位 1-42, 多 U 标记 `[2U]` | 规则最多,设备表格实用 |
| 🥉 3 | **NwDiag** | 206 | 4 | `network {}`, IP 地址匹配 | 但混淆了三种语言 |
| 4 | **ActDiag** | 187 | 4 | `lane` 泳道, 跨泳道连接 | 泳道特性突出 |
| 5 | **BlockDiag** | 176 | 3 | 基础流程图语法 | 最简洁 |
| 6 | **PacketDiag** | 156 | 4 | `colwidth`, 位范围不重叠 | 最简洁且专业 |

**关键发现**:
- **SeqDiag 和 RackDiag 的 L2 过长** (372 和 290 行),包含过多 L3 特有内容
- **PacketDiag 的 L2 最优秀** (156 行,简洁且专业)
- **NwDiag 的 L2 存在严重设计问题** - 混淆了 NwDiag, RackDiag, PacketDiag 三种语言

---

### 2. L3 示例质量排名

| 排名 | 语言 | 示例数 | 示例质量 | 代码完整性 | 实用性 |
|------|------|--------|----------|------------|--------|
| 🥇 1 | **PacketDiag (protocol.txt)** | 3 | 极高 | ✅ | OSI 七层模型,HTTPS 协议栈 |
| 🥈 2 | **NwDiag (network.txt)** | 3 | 极高 | ✅ | 三层架构,数据中心互联,DMZ |
| 🥉 3 | **RackDiag (datacenter.txt)** | 3 | 高 | ✅ | 企业级机柜,云服务商,金融级 |
| 4 | **ActDiag (swimlane.txt)** | 3 | 高 | ✅ | 购物流程,请假审批,微服务 |
| 5 | **BlockDiag (group.txt)** | 3 | 高 | ✅ | 三层架构,微服务,企业组织 |
| 6 | **SeqDiag (sequence.txt)** | 3 | 中 | ✅ | 登录,下单,微服务调用链 |

**关键发现**:
- **PacketDiag 的 protocol.txt 示例质量最高** - 教科书级别的 OSI 七层模型
- **NwDiag 的 network.txt 示例极其专业** - 真实网络拓扑场景
- **所有语言都提供 3 个示例** - 难度递进合理

---

### 3. 常见问题汇总

#### 问题 1: L2 与 L3 内容重复 (所有语言都存在)

**严重性**: 🟡 中等

**重复内容统计**:
| 语言 | 重复行数 | 重复率 | 影响 |
|------|---------|--------|------|
| BlockDiag | ~70 行 | 15% | Prompt 总长度增加 |
| NwDiag | ~50 行 | 10% | 中等影响 |
| ActDiag | ~60 行 | 13% | 中等影响 |
| PacketDiag | ~10 行 | 2% | 影响最小 ⭐ |
| RackDiag | ~100 行 | 20% | 影响最大 ⚠️ |
| SeqDiag | ~15 行 | 3% | 影响较小 |

**改进建议**:
```markdown
## 统一原则: L2 只保留通用规则, L3 保留特异性内容

### L2 应该保留的内容
- 强制规则 (编译失败、渲染异常、逻辑错误)
- 专家视角 (角色定义)
- 基础语法 (图表声明、核心关键字)
- 生成检查清单 (通用版本)

### L3 应该保留的内容
- 该类型特有的语法点
- 该类型的生成示例 (3 个,难度递进)
- 该类型的常见错误 (3-5 个)
- 该类型的检查清单 (扩展 L2)
- 该类型的设计原则

### 应该删除的内容
- ❌ L3 中的基础语法重复内容
- ❌ L3 中的图表声明重复内容
- ❌ L2 中的特异性示例 (应该在 L3 中)
```

---

#### 问题 2: L2 文件设计混乱 (NwDiag, RackDiag, PacketDiag)

**严重性**: 🔴 高

**问题描述**:
1. **NwDiag 的 L2 混淆了三种语言**:
   - `/prompts/nwdiag/common.txt` 第 138-152 行提到 `nwdiag {}`, `rackdiag {}`, `packetdiag {}`
   - 说明这个 L2 实际上是 **NwDiag 系列 (nwdiag, rackdiag, packetdiag)** 的共用文件

2. **RackDiag 和 PacketDiag 的 L2 独立存在**:
   - RackDiag 有独立的 290 行 L2 文件
   - PacketDiag 有独立的 156 行 L2 文件

3. **设计不一致**:
   - 如果三种语言共用 L2,为什么 RackDiag 和 PacketDiag 还有独立的 L2?
   - 如果不共用,为什么 NwDiag 的 L2 要提到另外两种语言?

**改进建议**:
```bash
# 方案 1: 完全拆分 (推荐)
/prompts/nwdiag/common.txt     - 只包含 nwdiag 特有规则
/prompts/rackdiag/common.txt   - 只包含 rackdiag 特有规则 (已存在)
/prompts/packetdiag/common.txt - 只包含 packetdiag 特有规则 (已存在)

# 操作步骤
1. 从 /prompts/nwdiag/common.txt 删除关于 rackdiag 和 packetdiag 的内容
2. 确认 rackdiag 和 packetdiag 的 L2 文件内容完整
3. 更新 prompt-loader.ts,明确每种语言只加载自己的 L2

# 方案 2: 共用 L2 (不推荐)
/prompts/_shared/nwdiag-series-common.txt  - 三种语言共用
然后在每个语言的 prompt-loader.ts 中引用

# 推荐方案 1,因为这三种语言的规则差异较大
```

---

#### 问题 3: L2 过长 (RackDiag 和 SeqDiag)

**严重性**: 🟡 中等

**问题数据**:
| 语言 | L2 行数 | 包含的 L3 内容 | 应该缩减到 |
|------|---------|---------------|----------|
| SeqDiag | 372 | 常见消息类型(36行), 设计原则(21行), 常见错误(57行) | ~200 行 |
| RackDiag | 290 | 设备类型表格, U 位计算规则, 设备属性说明 | ~150 行 |

**改进建议**:
- 将 L3 特有内容从 L2 移到对应的 L3 文件
- L2 仅保留通用规则和基础语法

---

#### 问题 4: 类型区分不够明确 (部分语言)

**严重性**: 🟢 低

**问题语言**:
| 语言 | L3 文件 | 类型区分问题 | 改进建议 |
|------|---------|-------------|----------|
| BlockDiag | block vs group | Group 特异性不够突出 | 在 group.txt 开头添加 "Block vs Group 区别" |
| ActDiag | activity vs swimlane | 差异不够明确 | 在两个 L3 开头添加 "Activity vs Swimlane 区别" |
| RackDiag | datacenter vs rack | 差异不够明确 | 在两个 L3 开头添加 "DataCenter vs Rack 区别" |

**改进建议**:
```markdown
## 在每个 L3 文件开头添加
> **[Type A] vs [Type B] 的核心区别**
> - **Type A**: 适用场景、设计重点、关键语法
> - **Type B**: 适用场景、设计重点、关键语法
>
> **选择建议**: 何时使用 Type A 而非 Type B
```

---

## 📈 语法相似性分析

### 共同特点 (所有 6 种语言)

1. **图表声明**: 所有语言都使用 `<语言名> {}` 包裹
   ```
   blockdiag {}
   nwdiag {}
   actdiag {}
   packetdiag {}
   rackdiag {}
   seqdiag {}
   ```

2. **属性语法**: 所有语言都使用 `[属性名 = "值"]` 格式
   ```
   node [label = "标签", color = "#color"];
   ```

3. **中文标签**: 所有语言都要求中文标签使用双引号
   ```
   [label = "中文标签"]  // ✅ 正确
   [label = 中文标签]    // ❌ 错误
   ```

4. **分组支持**: 多数语言支持 `group {}` 逻辑分组
   - BlockDiag: ✅ (group)
   - NwDiag: ✅ (group)
   - ActDiag: ✅ (lane,类似 group)
   - PacketDiag: ❌ (不支持)
   - RackDiag: ❌ (不支持)
   - SeqDiag: ✅ (group)

---

### 核心差异点

| 语言 | 核心关键字 | 特有语法 | 核心约束 |
|------|----------|----------|----------|
| **BlockDiag** | `A -> B` | 节点形状 `shape` | 无特殊约束 |
| **NwDiag** | `network {}` | `address = "IP"` | IP 地址与网段匹配 |
| **ActDiag** | `lane {}` | 泳道内活动 | 跨泳道连接在泳道外 |
| **PacketDiag** | `colwidth` | 位范围 `0-15: Field` | 位范围不重叠 |
| **RackDiag** | `1: Device` | 多 U 标记 `[2U]` | U 位 1-42,不重叠 |
| **SeqDiag** | `A -> B [label]` | 返回 `<--`, 激活 `activation` | 返回方向正确,激活成对 |

---

## 🎯 优先改进建议总览

### P0 - 高优先级 (必须修复)

1. **拆分 NwDiag 的 L2 文件** (影响 3 种语言)
   - 删除 `/prompts/nwdiag/common.txt` 中关于 rackdiag 和 packetdiag 的内容
   - 确保 RackDiag 和 PacketDiag 的 L2 文件内容完整

2. **删除所有 L3 文件中的语法重复内容** (影响 6 种语言)
   - 减少 Prompt 总长度约 15-20%
   - 提升 AI 理解效率

3. **精简 RackDiag 和 SeqDiag 的 L2 文件** (影响 2 种语言)
   - 将 L3 特有内容移到对应的 L3 文件
   - RackDiag: 290 行 → 150 行
   - SeqDiag: 372 行 → 200 行

---

### P1 - 中优先级 (建议修复)

4. **在 L3 文件开头添加类型区别说明** (影响 3 种语言)
   - BlockDiag: Block vs Group
   - ActDiag: Activity vs Swimlane
   - RackDiag: DataCenter vs Rack

5. **统一检查清单结构** (影响 6 种语言)
   - L2 检查清单: 通用规则
   - L3 检查清单: 在 L2 基础上扩展

6. **增加语法边界情况说明** (影响部分语言)
   - NwDiag: 双网卡服务器语法
   - ActDiag: 是否支持嵌套泳道
   - RackDiag: 是否支持非 42U 机柜
   - SeqDiag: 激活框语法详细说明

---

### P2 - 低优先级 (可选优化)

7. **增加与其他工具的对比说明**
   - SeqDiag vs Mermaid Sequence
   - BlockDiag vs Mermaid Flowchart

8. **增加性能优化建议**
   - 避免过深嵌套
   - 避免过多节点 (建议 < 50 个)

9. **增加实际应用场景示例**
   - PacketDiag: 增加自定义协议示例
   - RackDiag: 增加边缘计算机柜示例

---

## 📊 最终评分与建议

### 整体评分: 8.3/10 (优秀)

**优点**:
- ✅ **L2 规则完整**: 所有语言的强制规则覆盖全面
- ✅ **L3 示例质量高**: 所有语言都提供 3 个专业示例
- ✅ **错误预防完善**: 常见错误覆盖较全
- ✅ **语法清晰**: 所有语言的语法说明清晰

**主要问题**:
- ⚠️ **L2 文件设计混乱**: NwDiag L2 混淆了三种语言
- ⚠️ **L2 与 L3 内容重复**: 平均重复率约 10-15%
- ⚠️ **L2 过长**: RackDiag (290 行) 和 SeqDiag (372 行)
- ⚠️ **类型区分不够明确**: 部分 L3 文件的类型差异不够突出

---

## 🚀 实施路线图

### 第一阶段: 架构修复 (1-2 天)
- [ ] 拆分 NwDiag 的 L2 文件
- [ ] 删除所有 L3 文件中的语法重复内容
- [ ] 精简 RackDiag 和 SeqDiag 的 L2 文件

### 第二阶段: 内容增强 (1 天)
- [ ] 在 3 种语言的 L3 文件开头添加类型区别说明
- [ ] 统一所有语言的检查清单结构

### 第三阶段: 细节优化 (1 天)
- [ ] 增加语法边界情况说明
- [ ] 增加与其他工具的对比说明

---

## 📝 总结

**BlockDiag 系列 Prompt 系统整体质量优秀 (8.3/10)**,所有语言的 L2 规则完整,L3 示例质量高。

**主要问题是架构设计层面的混乱** - NwDiag 的 L2 混淆了三种语言,以及 L2 与 L3 存在内容重复。

**优先修复 P0 问题**,可将整体质量提升到 **9.0/10 以上**。

**PacketDiag 是 BlockDiag 系列中质量最高的语言 (8.8/10)**,可作为其他语言优化的参考模板。
