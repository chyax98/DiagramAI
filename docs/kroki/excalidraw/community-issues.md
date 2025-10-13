# Excalidraw 社区问题汇总

> **数据来源**: GitHub Issues/Discussions  
> **最后更新**: 2025-01-13

---

## 🔥 热门需求

### 1. LaTeX/MathJax 支持
**状态**: 🟡 讨论中

**需求**: 数学公式渲染

**临时方案**: 
- 使用文本 + 图片
- 导出后外部添加

**跟踪**: [Discussion](https://github.com/excalidraw/excalidraw/discussions/...)

---

### 2. 多页面 (Multi-page)
**状态**: 🟡 提议中

**需求**: 
- 单文件多页面
- PDF 多页导出

**Issue**: #9719

---

### 3. GitHub 原生支持
**状态**: 🔴 不支持

**需求**: Markdown 直接渲染 .excalidraw

**临时方案**:
- 使用 .excalidraw.svg 格式
- GitHub Actions 自动转换

**Issue**: #12216

---

## 🐛 常见Bug

### 1. RTL (从右到左) 兼容性
**问题**: 阿拉伯语等 RTL 语言显示异常

**Issue**: #9710

---

### 2. 弯头箭头拖动闪烁
**问题**: Elbow arrow 拖动时画布闪烁

**Issue**: #9720

---

### 3. SVG 导出 Frame 标签残留
**问题**: 删除 Frame 后标签仍在 SVG

**Issue**: #9725

---

## 💡 功能请求

### 已实现
- ✅ 实时协作
- ✅ 端到端加密
- ✅ 库系统
- ✅ Frame 分组
- ✅ 自由手绘

### 计划中
- 🟡 LaTeX 支持
- 🟡 多页面
- 🟡 改进移动端

### 讨论中
- 🔵 数据库集成
- 🔵 自动对齐优化
- 🔵 更多导出格式

---

## 🔧 集成案例

### 成功集成
- **Google Cloud**: 内部使用
- **Meta**: 产品设计
- **CodeSandbox**: 架构图
- **Obsidian**: 笔记插件
- **Replit**: 项目可视化

---

## 🆚 社区对比

### Excalidraw vs draw.io
| 特性 | Excalidraw | draw.io |
|------|------------|---------|
| 风格 | 手绘风 | 专业风 |
| 协作 | ✅ 实时 | ❌ |
| 开源 | ✅ | ✅ |
| 功能丰富度 | 中 | 高 |

---

## 📚 社区资源

### 库 (Libraries)
- **官方库**: https://libraries.excalidraw.com
- 包含: AWS, Azure, GCP, UML, Flowchart 等

### 教程
- "Create Diagrams with ChatGPT, Mermaid, and Excalidraw"
- "Excalidraw User Guide" (University of Toronto)

---

## 🔗 追踪渠道

- GitHub Issues: https://github.com/excalidraw/excalidraw/issues
- Discussions: https://github.com/excalidraw/excalidraw/discussions
- Discord: https://discord.gg/UexuTaE
