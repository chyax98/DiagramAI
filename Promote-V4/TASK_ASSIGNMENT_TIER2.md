# Tier 2/3 语言 TOML 迁移任务分配

**生成时间**: 2025-10-19
**总任务**: 18 种语言 (51 个 L3 + 18 个 L2)
**并行策略**: 9 个 Task Agents

---

## 📊 任务统计

| 统计项 | 数量 |
|--------|------|
| 待迁移语言 | 18 种 |
| L2 文件 (语言级) | 18 个 |
| L3 文件 (类型级) | 51 个 |
| 总文件数 | 69 个 |
| 并行 Agents | 9 个 |
| 每 Agent 负责 | 2-3 种语言 |

---

## 🎯 Agent 任务分配

### Agent-1: D2 专家
- **语言**: d2
- **L2**: 1 个 (d2.toml)
- **L3**: 7 个 (flowchart, sequence, class, er, architecture, grid, network)
- **工作量**: 8 个文件

### Agent-2: Structurizr 专家
- **语言**: structurizr
- **L2**: 1 个 (structurizr.toml)
- **L3**: 7 个 (workspace, component, container, context, deployment, dynamic, filtered)
- **工作量**: 8 个文件

### Agent-3: Vega-Lite 专家
- **语言**: vegalite
- **L2**: 1 个 (vegalite.toml)
- **L3**: 7 个 (bar, line, scatter, pie, area, heatmap, boxplot)
- **工作量**: 8 个文件

### Agent-4: C4 + Nomnoml 专家
- **语言**: c4plantuml (4), nomnoml (4)
- **L2**: 2 个 (c4plantuml.toml, nomnoml.toml)
- **L3**: 8 个
  - c4plantuml: context, container, component, sequence
  - nomnoml: class, component, architecture, flowchart
- **工作量**: 10 个文件

### Agent-5: WaveDrom 专家
- **语言**: wavedrom
- **L2**: 1 个 (wavedrom.toml)
- **L3**: 4 个 (timing, signal, register, bitfield)
- **工作量**: 5 个文件

### Agent-6: BlockDiag 家族专家 (Part 1)
- **语言**: blockdiag (2), actdiag (2), seqdiag (1)
- **L2**: 3 个
- **L3**: 5 个
  - blockdiag: block, group
  - actdiag: activity, swimlane
  - seqdiag: sequence
- **工作量**: 8 个文件

### Agent-7: BlockDiag 家族专家 (Part 2)
- **语言**: nwdiag (1), packetdiag (2), rackdiag (2)
- **L2**: 3 个
- **L3**: 5 个
  - nwdiag: network
  - packetdiag: packet, protocol
  - rackdiag: rack, datacenter
- **工作量**: 8 个文件

### Agent-8: ASCII 转换专家
- **语言**: ditaa (1), pikchr (1), svgbob (1)
- **L2**: 3 个
- **L3**: 3 个
  - ditaa: ascii
  - pikchr: diagram
  - svgbob: ascii
- **工作量**: 6 个文件

### Agent-9: 专用图表专家
- **语言**: bpmn (1), erd (1), umlet (1)
- **L2**: 3 个
- **L3**: 3 个
  - bpmn: process
  - erd: er
  - umlet: uml
- **工作量**: 6 个文件

---

## 📋 Agent 执行清单

每个 Agent 需要完成:

1. **准备阶段**:
   - 读取 `Promote-V4/templates/L2.template.toml`
   - 读取 `Promote-V4/templates/L3.template.toml`
   - 读取分配语言的参考文档 (data/prompts/{语言}/)

2. **L2 创建**:
   - 创建 `Promote-V4/data/L2/{语言}.toml`
   - 基于 `data/prompts/{语言}/common.txt` 转换内容

3. **L3 创建**:
   - 为每个图表类型创建 `Promote-V4/data/L3/{语言}/{类型}.toml`
   - 基于 `data/prompts/{语言}/{类型}.txt` 转换内容

4. **验证阶段**:
   - TOML 语法验证
   - 内容完整性检查
   - 生成完成报告

---

## 🚀 执行命令模板

```bash
# 每个 Agent 需要执行的任务描述
任务描述: "迁移 {语言列表} 的 Promote-V4 TOML Prompt 文件"

输入:
- 语言: {语言1}, {语言2}, ...
- 模板: Promote-V4/templates/
- 源数据: data/prompts/
- 输出: Promote-V4/data/L2/, Promote-V4/data/L3/

要求:
1. 严格遵循 TASK_TEMPLATE.md
2. 保证 TOML 语法正确
3. 内容使用中文
4. 专业性强,针对图表类型
5. 生成完成报告
```

---

## ✅ 验收标准

### 全局检查
- [ ] 所有 69 个文件已创建
- [ ] 所有文件 TOML 语法正确
- [ ] 所有 L2 文件包含语言通用规范
- [ ] 所有 L3 文件包含 5 个必需 Section
- [ ] 内容专业性强,非通用模板

### 质量要求
- [ ] E_constraints ≥ 7 条
- [ ] P_process ≥ 5 条
- [ ] H_quality ≥ 4 条
- [ ] use_cases ≥ 3 个
- [ ] 反斜杠正确转义

---

## 📊 工作量平衡

| Agent | 语言数 | L2 | L3 | 总计 | 负载 |
|-------|--------|----|----|------|------|
| Agent-1 | 1 | 1 | 7 | 8 | 中 |
| Agent-2 | 1 | 1 | 7 | 8 | 中 |
| Agent-3 | 1 | 1 | 7 | 8 | 中 |
| Agent-4 | 2 | 2 | 8 | 10 | 重 |
| Agent-5 | 1 | 1 | 4 | 5 | 轻 |
| Agent-6 | 3 | 3 | 5 | 8 | 中 |
| Agent-7 | 3 | 3 | 5 | 8 | 中 |
| Agent-8 | 3 | 3 | 3 | 6 | 轻 |
| Agent-9 | 3 | 3 | 3 | 6 | 轻 |
| **总计** | **18** | **18** | **51** | **69** | - |

**平衡策略**:
- 复杂语言 (D2, Structurizr, Vega-Lite): 单独分配
- 相关语言族 (BlockDiag, ASCII): 分组分配
- 简单语言 (BPMN, Erd, UMLet): 组合分配

---

## 🎯 成功指标

- **完成率**: 100% (69/69 文件)
- **语法正确率**: 100% (所有 TOML 可解析)
- **质量达标率**: ≥ 95% (符合质量标准)
- **执行时间**: ≤ 30 分钟 (并行执行)
- **报告完整性**: 每个 Agent 提交完成报告

---

**准备就绪,等待执行启动!** 🚀
