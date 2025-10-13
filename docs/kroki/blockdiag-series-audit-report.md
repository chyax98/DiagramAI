# BlockDiag 系列 Prompt 架构审查报告

## 📋 审查范围

| 语言 | 前端类型定义 | L2 文件 | L3 文件 |
|------|-------------|---------|---------|
| **blockdiag** | block, group | common.txt (175行) | block.txt, group.txt |
| **actdiag** | activity, swimlane | common.txt (186行) | activity.txt, swimlane.txt |
| **nwdiag** | network | common.txt (205行) | network.txt |
| **packetdiag** | packet, protocol | common.txt (155行) | packet.txt, protocol.txt |
| **rackdiag** | rack, datacenter | common.txt (496行) | rack.txt, datacenter.txt |
| **seqdiag** | sequence | common.txt (539行) | sequence.txt |

---

## ✅ 符合规范项

### 1. **文件对齐完整性** - 全部通过 ✅

所有 6 种语言的 Prompt 文件与前端类型定义完全对齐:

- **blockdiag**: ✅ block.txt + group.txt
- **actdiag**: ✅ activity.txt + swimlane.txt
- **nwdiag**: ✅ network.txt
- **packetdiag**: ✅ packet.txt + protocol.txt
- **rackdiag**: ✅ rack.txt + datacenter.txt
- **seqdiag**: ✅ sequence.txt

**结论**: 无缺失文件,无多余文件,类型定义与 Prompt 文件一一对应。

---

### 2. **L2 层基础职责** - 全部通过 ✅

所有语言的 L2 (common.txt) 都包含必需的通用规范:

- ✅ **强制规则** (Mandatory Rules) - 编译失败级别的语法规则
- ✅ **专家视角** - 角色定位和思维方式指引
- ✅ **核心语法** - 语言通用的语法结构

---

### 3. **L3 层基础职责** - 全部通过 ✅

所有 L3 类型文件都包含必需的具体实践指导:

- ✅ **生成示例** - 简单/中等/复杂场景的代码示例
- ✅ **常见错误** - 错误示例和正确写法对比
- ✅ **检查清单** - 代码生成后的验证步骤

---

## ❌ 违反规范项

### 1. **L2 层职责越界** - 严重问题 🚨

**问题**: rackdiag 和 seqdiag 的 L2 common.txt 文件异常庞大,包含了本应属于 L3 的内容。

#### 违规详情

| 语言 | L2 文件大小 | 包含的 L3 内容 |
|------|------------|---------------|
| **rackdiag** | 496 行 | ❌ 生成示例<br>❌ 常见错误<br>❌ 高级特性<br>❌ 样式配置 |
| **seqdiag** | 539 行 | ❌ 生成示例<br>❌ 常见错误<br>❌ 高级特性<br>❌ 样式配置 |

对比正常语言:
- blockdiag: 175 行 ✅
- actdiag: 186 行 ✅
- nwdiag: 205 行 ✅
- packetdiag: 155 行 ✅

#### 违反原则

根据 **CLAUDE.md** 的三层架构定义:

**L2 职责** (语言通用规范):
- ✅ 强制规则
- ✅ 专家视角
- ✅ 核心语法

**L3 职责** (类型特定实践):
- ✅ 生成示例
- ✅ 常见错误
- ✅ 检查清单
- ✅ 高级特性
- ✅ 样式配置

**问题根源**: rackdiag 和 seqdiag 的 L2 文件把 L3 的示例、错误、高级特性等内容混进了通用层,违反了职责分离原则。

---

## 🔍 层级职责分析

### 正确示例: blockdiag

```
L2 (common.txt - 175行):
  ✅ 强制规则 (5条)
  ✅ 专家视角 (3个角色)
  ✅ 核心语法 (4种结构)
  ✅ 生成检查清单

L3 (block.txt - 262行):
  ✅ 图表类型说明
  ✅ 核心语法细化
  ✅ 生成示例 (3个场景)
  ✅ 常见错误 (3类)
  ✅ 检查清单

L3 (group.txt - 364行):
  ✅ 图表类型说明
  ✅ 核心语法细化
  ✅ 生成示例 (3个场景)
  ✅ 常见错误 (2类)
  ✅ 检查清单
```

**职责清晰**: L2 定义通用规则,L3 提供具体实践。

---

### 问题示例: rackdiag

```
L2 (common.txt - 496行):
  ✅ 强制规则 (7条)
  ✅ 专家视角 (3个角色)
  ✅ 核心语法 (4种结构)
  ❌ 生成示例 (2个场景) <- 应该在 L3
  ❌ 常见错误 (7类) <- 应该在 L3
  ❌ 检查清单 <- 应该在 L3
  ❌ 高级特性 <- 应该在 L3
  ❌ 样式配置 <- 应该在 L3

L3 (rack.txt - 63行):
  ✅ 生成示例 (1个场景)
  ✅ 检查清单

L3 (datacenter.txt - 60行):
  ✅ 生成示例 (1个场景)
  ✅ 检查清单
```

**职责混乱**: L2 包含大量 L3 特定内容,导致:
1. L2 文件过大 (496 行 vs 175 行平均)
2. L3 文件过小 (63/60 行 vs 200+ 行平均)
3. 内容重复 (L2 和 L3 都有示例和检查清单)

---

## 📊 统计对比

### L2 文件大小对比

| 语言 | 行数 | 状态 |
|------|------|------|
| packetdiag | 155 | ✅ 正常 |
| blockdiag | 175 | ✅ 正常 |
| actdiag | 186 | ✅ 正常 |
| nwdiag | 205 | ✅ 正常 |
| **rackdiag** | **496** | ❌ **异常 (+184%)** |
| **seqdiag** | **539** | ❌ **异常 (+208%)** |

### L3 文件大小对比

| 语言 | 平均行数 | 状态 |
|------|---------|------|
| blockdiag | 313 行 | ✅ 完整 |
| actdiag | 272 行 | ✅ 完整 |
| nwdiag | 315 行 | ✅ 完整 |
| packetdiag | 89 行 | ✅ 简洁 |
| **rackdiag** | **62 行** | ⚠️ **过小** |
| **seqdiag** | **192 行** | ⚠️ **偏小** |

---

## 🛠️ 修复建议

### 1. rackdiag 重构方案

**当前结构**:
```
rackdiag/
  common.txt (496行) <- L2+L3混合
  rack.txt (63行) <- L3不完整
  datacenter.txt (60行) <- L3不完整
```

**建议结构**:
```
rackdiag/
  common.txt (200行左右) <- 仅保留:
    ✅ 强制规则 (U位、多U标记等)
    ✅ 专家视角
    ✅ 核心语法
    ❌ 删除: 生成示例、常见错误、高级特性

  rack.txt (200行左右) <- 从 common.txt 迁移:
    ✅ rack 类型专属示例
    ✅ rack 类型常见错误
    ✅ rack 类型高级特性

  datacenter.txt (200行左右) <- 从 common.txt 迁移:
    ✅ datacenter 类型专属示例
    ✅ datacenter 类型常见错误
    ✅ datacenter 类型高级特性
```

---

### 2. seqdiag 重构方案

**当前结构**:
```
seqdiag/
  common.txt (539行) <- L2+L3混合
  sequence.txt (192行) <- L3不完整
```

**建议结构**:
```
seqdiag/
  common.txt (200行左右) <- 仅保留:
    ✅ 强制规则 (箭头类型、label必填等)
    ✅ 专家视角
    ✅ 核心语法
    ❌ 删除: 生成示例、常见错误、高级特性

  sequence.txt (350行左右) <- 从 common.txt 迁移:
    ✅ sequence 类型专属示例
    ✅ sequence 类型常见错误 (7类完整)
    ✅ sequence 类型高级特性 (嵌套、并行等)
    ✅ sequence 类型样式配置
```

---

### 3. 迁移内容清单

#### rackdiag/common.txt 需要迁移的内容:

**迁移到 rack.txt**:
- [ ] 示例 1: 基础单机柜布局
- [ ] 示例 2: 数据中心标准机柜
- [ ] 错误 1-7: 所有常见错误
- [ ] 高级特性: U位规划策略、设备分区、冗余设计
- [ ] 样式配置: 设备颜色标记

**迁移到 datacenter.txt**:
- [ ] 多机柜布局示例
- [ ] 数据中心规划错误
- [ ] 跨机柜冗余设计
- [ ] 数据中心样式配置

#### seqdiag/common.txt 需要迁移的内容:

**迁移到 sequence.txt**:
- [ ] 示例 1: 简单请求-响应
- [ ] 示例 2: 三层架构调用
- [ ] 错误 1-7: 所有常见错误
- [ ] 高级特性: 嵌套调用、自调用、并行消息
- [ ] 样式配置: 参与者样式、消息样式、全局配置

---

## 📝 总结

### ✅ 优点

1. **类型对齐完美**: 23 种语言的 Prompt 文件与前端定义完全一致
2. **L2 基础职责完整**: 所有语言都包含强制规则、专家视角、核心语法
3. **L3 基础职责完整**: 所有类型文件都包含示例、错误、检查清单

### ❌ 问题

1. **职责越界** (严重): rackdiag 和 seqdiag 的 L2 包含了大量 L3 内容
2. **文件失衡**: L2 过大 (496/539行),L3 过小 (62/192行)
3. **内容重复**: L2 和 L3 存在示例、检查清单的重复

### 🎯 修复优先级

**P0 (立即修复)**:
- [ ] rackdiag: 将 L2 的示例、错误、高级特性迁移到 L3
- [ ] seqdiag: 将 L2 的示例、错误、高级特性迁移到 L3

**P1 (优化)**:
- [ ] 确保 L2 common.txt 控制在 150-250 行
- [ ] 确保 L3 类型文件达到 200-350 行 (内容充实)
- [ ] 删除 L2 和 L3 之间的重复内容

---

## 🔗 参考文档

- **架构规范**: `/root/Diagram/DiagramAI/CLAUDE.md` - 类型定义对齐原则
- **加载器实现**: `src/lib/utils/prompt-loader.ts` - 三层 Prompt 构建逻辑
- **类型定义**: `src/lib/constants/diagram-types.ts` - SSOT 单一数据源

---

**审查完成时间**: 2025-10-13
**审查工具**: Claude Code Agent
**审查范围**: BlockDiag 系列全部 6 种语言
