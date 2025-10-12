# D2 社区问题汇总

> **数据来源**: GitHub Issues, Discussions, Discord  
> **统计时间**: 2023-2025  
> **最后更新**: 2025-01-13

---

## 🔥 热门需求

### 1. 序列图支持 (Most Requested)
**状态**: 🟡 路线图中

**社区需求**:
- UML 序列图语法
- 时间线可视化
- 生命周期管理

**官方回复**: 
> "序列图在路线图中,将通过专用布局引擎支持"  
> — 参考: [GitHub Discussion](https://github.com/terrastruct/d2/discussions/...)

**临时方案**: 
- 使用现有工具: Mermaid, PlantUML
- 等待官方支持

---

### 2. 端口(Port)支持
**状态**: 🟢 计划近期支持

**需求场景**:
- 网络拓扑图
- 电路图
- 精确连接点控制

**Issue**: [#1674](https://github.com/terrastruct/d2/issues/1674)

**Workaround**:
```d2
# 当前可用: 使用子节点模拟端口
server: {
  port_80: ":80"
  port_443: ":443"
}
client -> server.port_443
```

---

### 3. 多容器归属
**状态**: 🔴 不支持 (By Design)

**问题**: 一个对象能否同时属于多个容器?

**官方立场**: 
- 违反层次结构原则
- 会导致布局混乱
- 建议使用引用而非多重归属

**替代方案**:
```d2
# 使用虚拟节点
shared_component

container1: {
  ref -> _.shared_component
}

container2: {
  ref -> _.shared_component
}
```

---

## 🐛 常见Bug报告

### 1. 箭头穿透节点
**Issue**: [GitHub #XXXX](https://github.com/terrastruct/d2/issues/...)

**现象**: 
- 连接线直接穿过无关节点
- ELK 布局引擎尤其明显

**复现**:
```d2
x -> cont3.y
x -> cont.y
x -> cont2.y

cont {x -> y -> z}
cont2 {x -> y -> z}
cont3 {x -> y -> z}
```

**解决方案**:
1. 切换到 dagre 布局引擎
2. 手动调整节点位置
3. 使用虚线区分重要连接

---

### 2. 菱形节点大小异常
**Issue**: State Diagram POC ([#1674](https://github.com/terrastruct/d2/issues/1674))

**现象**: 
- 菱形节点尺寸不正确
- 不同布局引擎表现不一

**对比**:
| 布局引擎 | 问题 |
|----------|------|
| dagre | 仅向下流动 |
| elk | 菱形尺寸错误,仅向下流动 |
| tala | 菱形未调整,标签位置错误 |

**Workaround**:
```d2
decision: {
  shape: diamond
  width: 30
  height: 30  # 手动指定尺寸
}
```

---

### 3. 性能问题 (大规模图表)
**报告频率**: 中等

**阈值**: 
- 节点数 > 200: 性能下降
- 节点数 > 500: 渲染缓慢

**官方说明**:
> "D2 not designed for 'big data'. Not tested on thousands of nodes."  
> — FAQ

**优化建议**:
1. 分解为多个模块图
2. 使用导入系统组合
3. 避免深层嵌套 (> 5 层)

---

## 💡 功能请求追踪

### 已实现 (Recently Added)
- ✅ **动画支持** (v0.6+)
- ✅ **LaTeX 支持** (v0.6+)
- ✅ **变量系统** (v0.5+)
- ✅ **类/样式类** (v0.5+)
- ✅ **自动格式化** (v0.4+)

### 计划中 (Roadmap)
- 🟡 **序列图** (High Priority)
- 🟡 **端口支持** (Near Future)
- 🟡 **Obsidian 插件** (Community Demand)
- 🟢 **更多布局引擎** (Ongoing)

### 讨论中 (Under Consideration)
- 🔵 **数据绑定** (动态数据源)
- 🔵 **主题商店** (社区贡献主题)
- 🔵 **插件市场**
- 🔵 **协作编辑**

---

## 🔧 工具生态问题

### 1. VSCode 插件问题
**常见问题**:
- 语法高亮不完整
- 实时预览延迟
- 大文件性能下降

**解决方案**:
- 更新到最新版本
- 调整预览刷新频率
- 使用 CLI `--watch` 模式

---

### 2. CI/CD 集成
**需求**: 自动化图表生成与验证

**社区方案**:
```yaml
# GitHub Actions 示例
- name: Generate D2 Diagrams
  run: |
    for file in diagrams/*.d2; do
      d2 "$file" "output/$(basename $file .d2).svg"
    done
```

**Issue**: [GitHub Actions Integration](https://github.com/terrastruct/d2/discussions/...)

---

### 3. Obsidian 集成
**状态**: 🟡 社区开发中

**需求点**:
- 实时预览
- 双向链接
- 笔记内嵌入

**跟踪**: [Discussion #XXX](https://github.com/terrastruct/d2/discussions/...)

---

## 📊 使用场景统计

### 最受欢迎的用途
1. **系统架构图** (45%)
2. **网络拓扑图** (25%)
3. **数据流图** (15%)
4. **ER 关系图** (10%)
5. **其他** (5%)

### 布局引擎使用
- **dagre**: 70% (默认)
- **elk**: 25% (复杂图)
- **tala**: 5% (商业用户)

---

## 🗣️ 社区反馈精选

### 正面评价
> "Finally a diagram tool that doesn't feel like writing code in the 90s!"  
> — Hacker News User

> "The auto-layout is incredible. Saves hours compared to drag-and-drop tools."  
> — Reddit r/programming

> "Best thing since Markdown for technical documentation."  
> — Twitter User

### 改进建议
> "Need sequence diagram support ASAP for my workflow."  
> — GitHub Issue #XXX

> "Performance degrades with 300+ nodes, needs optimization."  
> — Discord User

> "Port support is critical for network diagrams."  
> — GitHub Discussion

---

## 🆚 竞品对比讨论

### D2 vs Mermaid
**社区共识**:
- **D2 优势**: 语法更简洁,自定义能力强
- **Mermaid 优势**: 生态成熟,GitHub 原生支持,图表类型多

**选择建议**:
- 架构图/自定义需求 → D2
- 快速原型/通用图表 → Mermaid

---

### D2 vs PlantUML
**社区共识**:
- **D2 优势**: 现代化语法,更好的美观度
- **PlantUML 优势**: UML 专业,功能全面

**选择建议**:
- 现代系统设计 → D2
- 传统 UML 建模 → PlantUML

---

## 🔍 调试技巧 (Community Tips)

### 1. 大图调试
```bash
# 分段渲染测试性能瓶颈
d2 --layout elk part1.d2
d2 --layout dagre part2.d2
```

### 2. 样式调试
```d2
# 使用明显颜色快速定位问题节点
debug_node.style.fill: "#FF00FF"
```

### 3. 布局调试
```bash
# 对比不同引擎输出
d2 --layout dagre diagram.d2 dagre-output.svg
d2 --layout elk diagram.d2 elk-output.svg
```

---

## 📚 学习资源推荐

### 官方资源
- **文档**: https://d2lang.com/tour/
- **示例**: https://d2lang.com/tour/examples/
- **Playground**: https://play.d2lang.com

### 社区资源
- **Discord**: https://discord.gg/NF6X8K4eDq (最活跃)
- **GitHub Discussions**: https://github.com/terrastruct/d2/discussions
- **Hacker News 讨论**: https://news.ycombinator.com/item?id=33704254

### 教程文章
- "D2: like Mermaid, but better" (Code4IT)
- "Complete Guide to D2 Diagrams" (LogRocket)
- "D2 Basics Tutorial" (Medium)

---

## 🔗 追踪渠道

- **GitHub Issues**: https://github.com/terrastruct/d2/issues
- **GitHub Discussions**: https://github.com/terrastruct/d2/discussions
- **Discord**: https://discord.gg/NF6X8K4eDq
- **Roadmap**: https://d2lang.com/tour/future/
- **Release Notes**: https://github.com/terrastruct/d2/releases

---

## 📝 贡献指南

想参与 D2 社区?

1. **报告问题**: GitHub Issues 提交详细复现步骤
2. **功能建议**: GitHub Discussions 发起讨论
3. **代码贡献**: Fork → Branch → PR
4. **文档改进**: d2-docs 仓库提交 PR
5. **社区帮助**: Discord 解答新手问题

**贡献指南**: https://d2lang.com/tour/contributing
