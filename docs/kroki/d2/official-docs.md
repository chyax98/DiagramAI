# D2 官方文档汇总

> **更新时间**: 2025-01-13  
> **官方网站**: https://d2lang.com  
> **GitHub**: https://github.com/terrastruct/d2

---

## 📚 核心文档资源

### 1. 官方文档中心
- **完整教程**: https://d2lang.com/tour/
- **语言设计**: https://d2lang.com/tour/design/
- **FAQ**: https://d2lang.com/tour/faq/
- **故障排查**: https://d2lang.com/tour/troubleshoot/

### 2. GitHub 资源
- **主仓库**: https://github.com/terrastruct/d2
- **文档仓库**: https://github.com/terrastruct/d2-docs
- **问题跟踪**: https://github.com/terrastruct/d2/issues
- **讨论区**: https://github.com/terrastruct/d2/discussions

---

## 🎯 语法核心

### 基础语法
```d2
# 节点定义
server
database
client

# 连接关系
client -> server: HTTPS
server -> database: SQL Query

# 容器分组
backend: {
  api
  auth
  api -> auth
}
```

### 字符串处理规则
- **无引号** (默认): 适用于简单标识符
- **单/双引号**: 包含特殊字符时使用
- **块字符串**: `|` 或 `||` 用于多行文本

### 形状类型 (20+ 种)
- 基础: `rectangle`, `circle`, `oval`, `diamond`
- 技术: `cylinder`, `queue`, `package`, `cloud`
- UML: `class`, `sql_table`, `person`, `step`

### 样式系统
```d2
node: {
  style.fill: "#1E90FF"
  style.stroke: "#000"
  style.border-radius: 8
  style.font-size: 16
}
```

---

## 🔧 高级特性

### 1. SQL 表格定义
```d2
users: {
  shape: sql_table
  id: int {constraint: primary_key}
  email: varchar {constraint: unique}
}
```

### 2. Markdown 嵌入
```d2
docs: |md
  # Title
  **Bold** and *italic*
|
```

### 3. 变量系统
```d2
vars: {
  color: "#FF6B6B"
}
node.style.fill: ${color}
```

### 4. 导入模块
```d2
...@components/database.d2
```

---

## 🎨 布局引擎

| 引擎 | 特点 | 场景 |
|------|------|------|
| **dagre** | 默认，层次化 | 通用流程图 |
| **elk** | 复杂图优化 | 大规模架构 |
| **tala** | 商业高级引擎 | 美观度优先 |

```bash
d2 --layout elk diagram.d2
```

---

## 📦 工具生态

### CLI 工具
```bash
# 渲染
d2 input.d2 output.svg

# 实时预览
d2 --watch input.d2

# 指定主题
d2 --theme 200 input.d2
```

### 编辑器插件
- **VSCode**: https://marketplace.visualstudio.com/items?itemName=terrastruct.d2
- **Vim**: https://github.com/terrastruct/d2-vim

### 在线工具
- **Playground**: https://play.d2lang.com
- **图标库**: https://icons.terrastruct.com

---

## 🌟 设计哲学

1. **简洁优先**: 无需引号，自动格式化
2. **内容分离**: 描述系统而非设计图表
3. **版本控制友好**: 纯文本，易diff
4. **可扩展**: 插件、多布局、自定义主题

---

## 📚 学习路径

### 入门 (1-2小时)
1. 基础语法: https://d2lang.com/tour/intro
2. 特殊对象: https://d2lang.com/tour/special-objects
3. 在线练习: https://play.d2lang.com

### 进阶 (3-5小时)
1. 样式定制: https://d2lang.com/tour/customization
2. 布局引擎: https://d2lang.com/tour/layouts
3. 组合导入: https://d2lang.com/tour/composition

### 精通 (10+小时)
1. 深入理解: https://d2lang.com/tour/in-depth
2. API 开发: https://d2lang.com/tour/api
3. 社区贡献: https://github.com/terrastruct/d2

---

## 🔗 重要链接

- 官网: https://d2lang.com
- GitHub: https://github.com/terrastruct/d2
- Discord: https://discord.gg/NF6X8K4eDq
- 图标: https://icons.terrastruct.com
- Playground: https://play.d2lang.com
