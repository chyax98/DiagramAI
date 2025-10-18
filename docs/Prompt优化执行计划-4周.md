# Prompt 优化执行计划（4周）

> **基于**: 三级提示词编写指南 + 现有 Prompt 文件结构
> **创建时间**: 2025-10-19
> **总目标**: 优化 23 种语言 × 117 个 Prompt 文件，提升成功率和用户体验
> **完整计划**: 见 Serena Memory `prompt_optimization_execution_plan`

---

## 📊 快速概览

### 现状

```
总计: 117 个 L3 类型文件 + 23 个 L2 语言文件 + 4 个 L1 文件
✅ 已优化: L1 universal_optimized_v2.txt (压缩率 82.8%)
✅ 已优化: Mermaid L2 common_optimized.txt (压缩率 54.2%)
⏳ 待优化: 22 个 L2 文件 + 116 个 L3 文件
```

### 4 周计划概要

- **Week 1**: Tier 1 核心语言（Mermaid + PlantUML + D2）- 32 文件
- **Week 2**: Tier 1 专业场景（6 种语言）- 26 文件
- **Week 3**: Tier 2 完整覆盖（13 种语言）- 32 文件
- **Week 4**: UI 优化 + 全面验证 + 性能测试

---

## 🎯 Week 1: Tier 1 核心语言全面优化

### 目标

完成 **Mermaid + PlantUML + D2** 全面优化（32 个 L3 文件）

### Day 1-2: Mermaid 核心图表优化 (16h)

```
✅ common_optimized.txt 已完成
⏳ flowchart.txt (2h) - 基于 flowchart_minimal.txt 全面优化
⏳ sequence.txt (2h) - 时序图优化
⏳ class.txt (2h) - 类图优化
⏳ er.txt (1.5h) - ER 图优化
```

**优化重点**:

- 增加复杂场景示例（条件分支、子图、样式）
- 优化布局建议（TB/LR/RL/BT）
- 添加常见错误对比（❌ → ✅）
- 目标: 成功率 70% → 90%

### Day 3: Mermaid 其他图表 (8h)

```
⏳ gantt.txt (1.5h) - 甘特图
⏳ state.txt (1.5h) - 状态图
⏳ pie.txt (1h) - 饼图
⏳ journey.txt (1h) - 用户旅程图
⏳ gitgraph.txt (1h) - Git 图
⏳ mindmap.txt (1h) - 思维导图
⏳ timeline.txt (1h) - 时间线
```

### Day 4: PlantUML 核心优化 (8h)

```
⏳ L2: common.txt (2h) - PlantUML 语言通用规范
⏳ sequence.txt (1.5h) - UML 时序图
⏳ class.txt (1.5h) - UML 类图
⏳ activity.txt (1.5h) - 活动图
⏳ usecase.txt (1h) - 用例图
```

### Day 5: D2 + PlantUML 剩余 (8h)

```
D2:
⏳ L2: common.txt (1.5h)
⏳ flowchart.txt (1h)
⏳ sequence.txt (1h)
⏳ er.txt (0.5h)

PlantUML 剩余:
⏳ component.txt (1h)
⏳ state.txt (1h)
⏳ deployment.txt (1h)
⏳ object.txt (1h)
```

### Week 1 验证检查点

```
✅ Mermaid: 14/14 文件优化完成
✅ PlantUML: 9/9 文件优化完成
✅ D2: 8/8 文件优化完成
✅ 成功率测试: Tier 1 核心图表 > 85%
✅ Token 节省: 预计 40-60%
```

---

## 🎯 Week 2: Tier 1 专业场景补充

### 目标

完成 **Graphviz + WaveDrom + 5 种扩展语言**（26 个 L3 文件）

### Day 6-7: Graphviz 全面优化 (16h)

```
⏳ L2: common.txt (2h) - DOT 语法、布局引擎
⏳ flowchart.txt (1.5h)
⏳ state.txt (1.5h)
⏳ tree.txt (1.5h)
⏳ er.txt (1h)
⏳ network.txt (1h)
⏳ architecture.txt (1h)
```

### Day 8: WaveDrom + Nomnoml (8h)

```
WaveDrom:
⏳ L2: common.txt (1.5h) - JSON 格式、信号语法
⏳ timing.txt (1h)
⏳ signal.txt (1h)
⏳ register.txt (0.5h)

Nomnoml:
⏳ L2: common.txt (1.5h)
⏳ class.txt (1h)
⏳ flowchart.txt (1h)
⏳ component.txt (0.5h)
```

### Day 9: Excalidraw + C4-PlantUML (8h)

```
Excalidraw:
⏳ L2: common.txt (1.5h) - JSON、手绘效果
⏳ sketch.txt (1h)
⏳ wireframe.txt (1h)
⏳ diagram.txt (0.5h)

C4-PlantUML:
⏳ L2: common.txt (1.5h) - C4 宏、关系语法
⏳ context.txt (1h)
⏳ container.txt (0.5h)
⏳ component.txt (0.5h)
```

### Day 10: Vega-Lite + DBML (8h)

```
Vega-Lite:
⏳ L2: common.txt (2h) - JSON Schema、mark/encoding
⏳ bar.txt (0.5h)
⏳ line.txt (0.5h)
⏳ point.txt (0.5h)
⏳ pie.txt (0.5h)

DBML:
⏳ L2: common.txt (1.5h) - Table/Ref/Enum 语法
⏳ schema.txt (1h)
⏳ erd.txt (1h)
⏳ single_table.txt (0.5h)
```

### Week 2 验证检查点

```
✅ Tier 1 全部 10 种语言优化完成
✅ Tier 1 整体成功率: > 90%
✅ 累计进度: 41/140 (29%)
```

---

## 🎯 Week 3: Tier 2 完整覆盖

### 目标

完成剩余 **13 种扩展语言**（32 个 L3 文件）

### Day 11-12: BlockDiag 系列 (16h)

```
BlockDiag 系列（5 种语言，统一语法）:
⏳ BlockDiag: L2 + 2 L3 (2h)
⏳ ActDiag: L2 + 2 L3 (2h)
⏳ NwDiag: L2 + 1 L3 (1.5h)
⏳ PacketDiag: L2 + 2 L3 (2h)
⏳ RackDiag: L2 + 2 L3 (2h)
```

**优化重点**: 统一 blockdiag 系列通用规范，强调特定语法差异

### Day 13: SeqDiag + BPMN + Ditaa (8h)

```
⏳ SeqDiag: L2 + 1 L3 (2h)
⏳ BPMN: L2 + 1 L3 (3h) - BPMN 2.0 标准
⏳ Ditaa: L2 + 1 L3 (3h) - ASCII 艺术转图形
```

### Day 14-15: Structurizr + 其他语言 (16h)

```
Structurizr:
⏳ L2: common.txt (2h) - C4 DSL
⏳ 7 个 L3 文件 (4h)

其他语言:
⏳ Erd: L2 + 1 L3 (2h)
⏳ Pikchr: L2 + 1 L3 (2h)
⏳ SvgBob: L2 + 1 L3 (2h)
⏳ UMLet: L2 + 1 L3 (2h)
```

### Week 3 验证检查点

```
✅ 所有 23 种语言 L2 文件优化完成
✅ 所有 117 个 L3 文件优化完成
✅ Tier 2 语言成功率: > 75%
✅ 整体 Token 优化率: > 50%
✅ 累计进度: 140/140 (100%)
```

---

## 🎯 Week 4: UI 优化 + 全面验证

### 目标

**UI 改进、全面测试、性能优化、用户体验提升**

### Day 16-17: UI 改进 (16h)

```
⏳ 图表类型选择器优化 (4h)
  - 按使用频率排序（Tier 1 优先）
  - 添加搜索和筛选功能
  - 图表预览缩略图

⏳ 错误提示优化 (4h)
  - 智能语法错误定位
  - 基于 L2/L3 的修复建议
  - 错误分类（语法/逻辑/渲染）

⏳ 示例库改进 (4h)
  - 每种类型 3-5 个模板示例
  - 简单 → 中等 → 复杂三个难度
  - 一键插入功能

⏳ 文档更新 (4h)
```

### Day 18: 全面测试与验证 (8h)

```
⏳ 自动化测试脚本 (4h)
  - 创建 scripts/test-prompts.ts
  - 准备测试用例集（简单、中等、复杂、错误修复）

⏳ 手动测试 (4h)
  - Tier 1 语言全覆盖
  - 边缘情况测试
```

### Day 19: 性能优化与监控 (8h)

```
⏳ 性能分析 (4h)
  - Token 消耗统计（优化前后对比）
  - 响应时间分析
  - 生成对比报告和图表

⏳ 监控配置 (4h)
  - Prompt 性能监控
  - 用户行为分析
```

### Day 20: 文档完善与发布 (8h)

```
⏳ 文档完善 (4h)
  - Prompt 优化总结报告
  - 更新 CLAUDE.md

⏳ 发布准备 (4h)
  - 代码审查
  - Git 提交（按语言分批）
  - 部署验证（灰度发布）
```

### Week 4 最终验证

```
✅ 整体成功率: > 85% (原 70%)
✅ Tier 1 成功率: > 90%
✅ Token 节省: > 50%
✅ 响应速度: 提升 40%
✅ 用户满意度: 提升 30%
```

---

## 📋 执行检查清单

### 每个 Prompt 文件必须包含

- [ ] 2-3 个示例（简洁对比格式 ❌ → ✅）
- [ ] 明确语法规范和约束
- [ ] 常见错误和修复建议
- [ ] 符合长度标准（L2: 1,500-2,000, L3: 3,000-3,500 字符）
- [ ] 无重复内容（与 L1/L2 对比检查）
- [ ] 包含检查清单（5-8 要点）

### 质量标准

```
L1: 3,000-3,500 字符 (750-875 tokens)
L2: 1,500-2,000 字符 (375-500 tokens)
L3: 3,000-3,500 字符 (750-875 tokens)
```

### 测试通过标准

- [ ] 简单场景成功率 > 95%
- [ ] 中等复杂度成功率 > 85%
- [ ] 复杂场景成功率 > 75%
- [ ] Token 消耗 ≤ 2,000 tokens/请求
- [ ] 响应时间 < 3s

---

## 💰 资源估算

### 工时分配

```
Week 1: 40 小时（Tier 1 核心优化）
Week 2: 40 小时（Tier 1 完成 + Tier 2 开始）
Week 3: 40 小时（Tier 2 完成）
Week 4: 40 小时（UI 优化 + 全面验证）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
总计: 160 小时（4 周 × 40 小时/周）
```

### 成本节省预估

```
基于 DiagramAI 实际数据:
├─ L1 优化节省: $39,960/年 ✅ 已实现
├─ L2 优化节省: ~$15,000/年 (预计)
├─ L3 优化节省: ~$30,000/年 (预计)
└─ 总计预期节省: ~$85,000/年

投入产出比 (ROI):
├─ 投入: 160 小时 × $50/小时 = $8,000
├─ 年度节省: $85,000
└─ ROI: 1,062% (10.6x 回报)
```

---

## 🎯 成功指标

### Week 1 结束

- ✅ Tier 1 核心 3 种语言优化完成
- ✅ 成功率: Mermaid > 90%, PlantUML > 85%, D2 > 85%
- ✅ Token 节省: > 40%

### Week 2 结束

- ✅ Tier 1 全部 10 种语言优化完成
- ✅ 成功率: Tier 1 整体 > 90%
- ✅ Token 节省: > 50%

### Week 3 结束

- ✅ 所有 23 种语言优化完成
- ✅ 成功率: Tier 2 语言 > 75%
- ✅ 文件覆盖率: 100%

### Week 4 结束（最终目标）

- ✅ UI 优化完成，用户体验提升明显
- ✅ 整体用户满意度提升: 30%
- ✅ 整体成功率: > 85%
- ✅ 成本节省: 年度 ~$85,000

---

## 📝 风险管理

### 主要风险与应对

**风险 1: 优化导致质量下降**

- 🛡️ 缓解: 每周验证检查点，低于阈值立即回滚
- 🔄 应对: 保留原版文件 (.txt.backup)

**风险 2: 时间不足**

- 🛡️ 缓解: 优先级排序，Tier 1 > Tier 2 > UI 优化
- 🔄 应对: Week 4 可缩减 UI 优化时间

**风险 3: 某些语言难以优化**

- 🛡️ 缓解: 提前识别复杂语言，预留更多时间
- 🔄 应对: 复杂语言可保留详细版本，仅优化 L2

**风险 4: 用户反馈负面**

- 🛡️ 缓解: 灰度发布，先 10% 用户
- 🔄 应对: 24 小时内快速回滚机制

---

## 📚 参考资源

### 核心文档

- `三级提示词编写指南.md` - L1/L2/L3 编写标准 ⭐
- `提示词长度优化指南.md` - Token 优化技巧
- `L1提示词优化对比.md` - L1 优化实战案例
- `Mermaid_L2优化对比.md` - L2 优化实战案例
- `docs/spec/prompt-level-spec.md` - DEPTH 框架映射

### 工具

- Token 计数: `wc -c filename`
- 批量测试: `npm run test:prompts` (待开发)
- 性能监控: 待开发

---

## 🚀 快速启动

### 开始前准备

```bash
# 1. 创建分支
git checkout -b feature/prompt-optimization-phase2

# 2. 备份原版文件
cp -r data/prompts data/prompts.backup

# 3. 设置测试环境
# (待定)
```

### 每周执行

1. ✅ 按计划优化 Prompt 文件
2. ✅ 每天 commit，commit message 清晰
3. ✅ 周五验证检查点，记录数据
4. ✅ 遇到问题及时调整

### 完成后

1. ✅ 生成优化总结报告
2. ✅ 更新文档和 CHANGELOG
3. ✅ 分享经验和最佳实践
4. ✅ 持续监控和迭代优化

---

**计划版本**: 1.0
**创建时间**: 2025-10-19
**预计完成**: 2025-11-16 (4 周后)
**状态**: 待执行

**完整计划详情**: Serena Memory `prompt_optimization_execution_plan`
