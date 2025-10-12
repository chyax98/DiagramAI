# Mermaid 官方文档资源

> 最后更新: 2025-10-13
> 验证方式: Tavily 搜索引擎

---

## 📚 官方文档链接

### 主站
- **官方网站**: https://mermaid.js.org/
- **官方文档**: https://mermaid.js.org/intro/
- **Getting Started**: https://mermaid.js.org/intro/getting-started.html
- **在线编辑器**: https://mermaid.live/

### GitHub 仓库
- **主仓库**: https://github.com/mermaid-js/mermaid
- **Issue Tracker**: https://github.com/mermaid-js/mermaid/issues
- **Releases**: https://github.com/mermaid-js/mermaid/releases
- **社区讨论**: https://github.com/mermaid-js/mermaid/discussions

### MermaidChart 商业版
- **文档站**: https://docs.mermaidchart.com/
- **VS Code 插件**: https://marketplace.visualstudio.com/items?itemName=vstirbu.vscode-mermaid-preview

---

## 🔢 版本信息

### 最新版本 (2025-10)
- **Mermaid.js**: v11.4.1 (2025-04 发布)
- **主要特性**:
  - 支持 14 种图表类型
  - OAuth 集成 (MermaidChart)
  - 多图标库支持 (MDI, Logos)
  - 改进的 Mindmap 渲染 (多布局、新形状)
  - GitHub Copilot Chat 集成

### 最近更新 (v11.x)
- **v11.4.1** (2025-04): 修复 class diagram 换行渲染、自动编号箭头问题
- **v11.x**: 支持 Block Diagram、优化 Gantt Chart、ELK/TIDY TREE 布局

---

## 🎨 支持的图表类型

Mermaid 支持 14+ 种图表类型:

1. **Flowchart** - 流程图
2. **Sequence Diagram** - 时序图
3. **Class Diagram** - 类图
4. **State Diagram** - 状态图
5. **Entity Relationship Diagram** - ER 图
6. **User Journey** - 用户旅程图
7. **Gantt Chart** - 甘特图
8. **Pie Chart** - 饼图
9. **Quadrant Chart** - 象限图
10. **Requirement Diagram** - 需求图
11. **Gitgraph** - Git 分支图
12. **Mindmap** - 思维导图
13. **Timeline** - 时间线
14. **XY Chart** - XY 坐标图
15. **Block Diagram** - 块状图 (v11.10+)

---

## 🔗 Kroki 集成

### Kroki 官方文档
- **Kroki 主站**: https://kroki.io/
- **Kroki 文档**: https://docs.kroki.io/kroki/
- **GitHub**: https://github.com/yuzutech/kroki
- **示例页面**: https://kroki.io/examples.html

### Kroki 对 Mermaid 的支持
- **支持状态**: ✅ 官方支持
- **渲染服务**: 独立 Docker 容器 (`yuzutech/kroki-mermaid`)
- **默认端口**: 8002 (内部容器通信)
- **输出格式**: SVG, PNG, PDF

### Docker Compose 配置示例
```yaml
services:
  core:
    image: yuzutech/kroki
    environment:
      - KROKI_MERMAID_HOST=mermaid
    ports:
      - "8000:8000"
  mermaid:
    image: yuzutech/kroki-mermaid
    expose:
      - "8002"
```

### Kroki API 端点
- **格式**: `https://kroki.io/mermaid/{output_format}/{encoded_diagram}`
- **编码方式**: deflate + base64url
- **输出格式**: svg, png, pdf

---

## 📦 安装方式

### NPM 安装
```bash
npm i mermaid
yarn add mermaid
pnpm add mermaid
```

### CDN 引入
```html
<script type="module">
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
</script>
```

### 版本选择
- **最新版**: `https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.esm.min.mjs`
- **指定版本**: `https://cdn.jsdelivr.net/npm/mermaid@<version>/dist/mermaid.esm.min.mjs`

---

## 🛠️ 工具集成

### IDE 插件
- **VS Code**: Mermaid Preview (v2.1.2, 2025-07)
- **IntelliJ IDEA**: Mermaid Plugin
- **Sublime Text**: Mermaid Support
- **Atom**: Markdown Preview Enhanced

### 文档平台
- **GitBook**: 原生支持
- **MkDocs**: mermaid2 插件
- **Docusaurus**: @docusaurus/plugin-mermaid
- **Confluence**: Mermaid Macro
- **Notion**: 不支持 (需使用 Kroki 代理)

### CI/CD 集成
- **GitHub Actions**: mermaid-cli
- **GitLab CI**: Kroki 集成
- **Jenkins**: Mermaid Plugin

---

## 📖 学习资源

### 官方教程
- **Syntax Guide**: https://mermaid.js.org/intro/syntax-reference.html
- **Configuration**: https://mermaid.js.org/config/configuration.html
- **Theming**: https://mermaid.js.org/config/theming.html

### 社区资源
- **Mermaid Live Editor**: https://mermaid.live/
- **Community Guide** (Swimm): https://swimm.io/learn/mermaid-js/mermaid-js-a-complete-guide
- **Medium 教程**: https://medium.com/@bluebirz/mermaid-draws-diagrams-1010677f23a3

### 示例库
- **官方示例**: https://mermaid.js.org/syntax/examples.html
- **Kroki 示例**: https://kroki.io/examples.html#mermaid
- **GitHub Topic**: https://github.com/topics/mermaid

---

## 🔒 安全与限制

### 安全特性
- **XSS 防护**: 默认启用 sanitization
- **CSP 支持**: Content Security Policy 兼容
- **安全配置**: `securityLevel: 'strict'`

### 渲染限制
- **最大节点数**: 配置项 `maxTextSize`
- **最大边数**: 配置项 `maxEdges`
- **超时控制**: 可配置渲染超时时间

---

## 📞 获取帮助

### 官方渠道
- **Discord**: https://discord.gg/mermaid (官方社区)
- **Zulip Chat**: https://mermaid.zulipchat.com/
- **Stack Overflow**: 标签 `mermaid`

### 问题报告
1. **Bug 报告**: GitHub Issues
2. **功能请求**: GitHub Discussions
3. **安全问题**: SECURITY.md 指引

---

## 🔄 版本兼容性

### Kroki 兼容性
- **Kroki v0.28.0**: 使用 Mermaid v11.x
- **Kroki v0.27.x**: 使用 Mermaid v10.x
- **升级建议**: 定期更新 Kroki 镜像以获取最新 Mermaid 版本

### 浏览器兼容性
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### Node.js 兼容性
- **Node.js**: 16+ (推荐 18+)
- **NPM**: 8+

---

**信息来源**:
- Mermaid 官方网站 (https://mermaid.js.org)
- Kroki 官方文档 (https://docs.kroki.io)
- GitHub 官方仓库 (https://github.com/mermaid-js/mermaid)
- Tavily 搜索引擎验证 (2025-10-13)
