# D2 常见错误与解决方案

> 基于社区问题和官方故障排查整理 | 最后更新: 2025-10-13

---

## 🚨 语法错误

### 1. 全角字符问题

**错误现象**:
```d2
# ❌ 使用中文输入法的全角符号
x：label
a；b
c。d
```

**错误信息**:
```
Error: syntax error near line 1
```

**原因**:
- 中文输入法的全角冒号 `：` ≠ ASCII 冒号 `:`
- D2 仅识别 ASCII 特殊字符

**解决方案**:
```d2
# ✅ 切换到英文输入法
x: label
a; b
c.d
```

**预防措施**:
- ⚠️ 编写 D2 代码时始终使用英文输入法
- ⚠️ 特别注意: `:`, `;`, `.`, `-`, `_` 等符号
- ⚠️ 标签内容可以使用中文,但语法符号必须是 ASCII

---

### 2. 引用标签而非键名

**错误现象**:
```d2
# ❌ 错误示例
backend: Backend Server
frontend: Frontend Application

# 尝试连接 (会创建新形状而非引用已有形状)
Backend Server -> Frontend Application
```

**结果**:
- 创建了 4 个形状而非 2 个
- 原有的 `backend` 和 `frontend` 未连接

**解决方案**:
```d2
# ✅ 正确: 使用键名
backend: Backend Server
frontend: Frontend Application

backend -> frontend
# 或带标签
backend -> frontend: API calls
```

**最佳实践**:
```d2
# 方案 1: 键名和标签相同
Backend -> Frontend

# 方案 2: 键名简短,标签描述性
be: Backend Server
fe: Frontend Application
be -> fe: API calls
```

---

### 3. 路径引用错误

**错误现象**:
```d2
# ❌ 跨容器引用不完整
network: {
  api
}
database: {
  db
}
api -> db  # 错误: 创建新的顶层 api 和 db
```

**解决方案**:
```d2
# ✅ 使用完整路径
network: {
  api
}
database: {
  db
}
network.api -> database.db
```

---

### 4. 单连字符误用

**错误现象**:
```d2
# ❌ 期望连接但实际创建形状
x - y  # 这是一个键名为 "x - y" 的形状,不是连接
```

**解决方案**:
```d2
# ✅ 连接必须使用双连字符或箭头
x -- y   # 无向连接
x -> y   # 右向箭头
x <- y   # 左向箭头
x <-> y  # 双向箭头
```

---

### 5. 特殊字符未引用

**错误现象**:
```d2
# ❌ 标签包含特殊字符但未加引号
x: Hello: World
y -> z: Error; here
```

**错误信息**:
```
Error: syntax error near ':'
Error: syntax error near ';'
```

**解决方案**:
```d2
# ✅ 包含特殊字符时加引号
x: "Hello: World"
y -> z: "Error; here"

# 或使用单引号
x: 'Hello: World'
y -> z: 'Error; here'
```

**需要引号的场景**:
- 包含: `:`, `;`, `.`, `{`, `}`, `[`, `]`, `|`, `#`
- 前后有空格的标签

---

## 🎨 样式错误

### 6. 颜色格式错误

**错误现象**:
```d2
# ❌ 缺少引号的 RGB/RGBA
x.style.fill: rgb(255, 0, 0)
y.style.fill: rgba(0, 255, 0, 0.5)
```

**错误信息**:
```
Error: invalid color format
```

**解决方案**:
```d2
# ✅ RGB/RGBA 必须加引号
x.style.fill: "rgb(255, 0, 0)"
y.style.fill: "rgba(0, 255, 0, 0.5)"

# ✅ 十六进制可不加引号
z.style.fill: "#FF0000"
z.style.fill: red  # 颜色名也可不加引号
```

---

### 7. 样式属性名错误

**错误现象**:
```d2
# ❌ 使用 CSS 属性名
x.style.background: red
x.style.color: blue
x.style.border: 1px solid black
```

**解决方案**:
```d2
# ✅ 使用 D2 样式属性名
x.style.fill: red             # 不是 background
x.style.font-color: blue      # 不是 color
x.style.stroke: black         # 不是 border-color
x.style.stroke-width: 1       # 不是 border-width
```

**常用映射**:
| CSS | D2 |
|-----|-----|
| `background` | `fill` |
| `color` | `font-color` |
| `border-color` | `stroke` |
| `border-width` | `stroke-width` |
| `border-style: dashed` | `stroke-dash: 3` |

---

### 8. 布尔值大写错误

**错误现象**:
```d2
# ❌ 大写布尔值
x.style.bold: True
y.style.italic: FALSE
z.style.shadow: 1
```

**解决方案**:
```d2
# ✅ 小写布尔值
x.style.bold: true
y.style.italic: false
z.style.shadow: true  # 不能用 1/0
```

---

## 🔗 连接错误

### 9. 重复连接误解

**错误现象**:
```d2
# 用户期望: 更新连接标签
Database -> S3: backup
Database -> S3: daily backup  # 期望替换标签
```

**实际结果**:
- 创建了两条独立的连接
- 第一条标签 "backup",第二条标签 "daily backup"

**解决方案**:
```d2
# 方案 1: 只定义一次
Database -> S3: daily backup

# 方案 2: 引用并修改特定连接
Database -> S3: backup
Database -> S3: daily backup
(Database -> S3)[0].style.stroke: red   # 第一条
(Database -> S3)[1].style.stroke: blue  # 第二条
```

---

### 10. 箭头头部未生效

**错误现象**:
```d2
# ❌ 连接没有端点,箭头头部不显示
x -> y: {
  source-arrowhead.shape: diamond  # 但 x -> y 有源端点
}

a -- b: {
  source-arrowhead.shape: diamond  # 无效: -- 无方向
}
```

**解决方案**:
```d2
# ✅ 确保连接有对应端点
x -> y: {
  source-arrowhead.shape: diamond  # ✅ -> 有源端点
  target-arrowhead.shape: circle   # ✅ -> 有目标端点
}

# ✅ 无向连接无法设置箭头
a -- b  # 正确: 不尝试设置箭头
```

---

## 📐 布局错误

### 11. 元素重叠

**错误现象**:
- 节点互相重叠
- 文本被遮挡
- 连线穿过形状

**原因**:
- 使用了不合适的布局引擎
- 形状尺寸设置过大/过小
- 复杂嵌套结构

**解决方案**:
```bash
# 尝试不同布局引擎
d2 -l dagre input.d2   # 默认,适合简单图
d2 -l elk input.d2     # 适合复杂嵌套
d2 -l tala input.d2    # 最优质量 (付费)
```

```d2
# 调整间距
vars: {
  d2-config: {
    layout-engine: elk
  }
}

# 手动设置尺寸
large_node: {
  width: 200
  height: 100
}
```

---

### 12. 文本过长

**错误现象**:
- 标签文本超出形状边界
- 文本显示被截断

**解决方案**:
```d2
# 方案 1: 添加换行符
x: "Very long text\nbroken into\nmultiple lines"

# 方案 2: 使用块字符串
x: |
  Very long text
  broken into
  multiple lines
|

# 方案 3: 增加形状宽度
x: Very long text {
  width: 300
}
```

---

### 13. 连线混乱

**错误现象**:
- 连线穿过无关对象
- 连线交叉过多
- 布局不清晰

**解决方案**:
```d2
# 方案 1: 使用 ELK 布局引擎
vars: {
  d2-config: {
    layout-engine: elk
  }
}

# 方案 2: 调整节点顺序和分组
# 将相关节点放在同一容器中
frontend: {
  ui
  router
}
backend: {
  api
  database
}

# 方案 3: 使用 direction 控制流向
direction: down  # 或 up, left, right
```

---

## 🖼️ 渲染错误

### 14. SVG 无交互性

**错误现象**:
- 在某些环境中 SVG 的链接和工具提示不工作

**原因**:
- SVG 被作为 `<img>` 标签嵌入,禁用了交互性

**解决方案**:
```html
<!-- ❌ 作为图片嵌入 (无交互) -->
<img src="diagram.svg">

<!-- ✅ 作为对象嵌入 (有交互) -->
<object data="diagram.svg" type="image/svg+xml"></object>

<!-- ✅ 直接内联 SVG -->
<div>
  <!-- SVG 内容 -->
</div>
```

---

### 15. HTML 在 Markdown 中断裂

**错误现象**:
```d2
# ❌ 非语义化 HTML
description: |md
  Line 1<br>
  Line 2<br>
  Line 3
|
```

**错误信息**:
```
SVG parse error: unclosed tag <br>
```

**解决方案**:
```d2
# ✅ 使用语义化 HTML
description: |md
  Line 1<br/>
  Line 2<br/>
  Line 3
|
```

**规则**:
- 使用 `<br/>` 而非 `<br>`
- 使用 `<img/>` 而非 `<img>`
- 所有标签必须闭合

---

## 🔧 CLI 错误

### 16. 监听模式不刷新

**错误现象**:
```bash
d2 --watch input.d2 output.svg
# 文件修改后图像不更新
```

**原因**:
- 文件系统事件未触发
- 输出文件被其他程序锁定

**解决方案**:
```bash
# 方案 1: 使用更短的轮询间隔
d2 --watch --watch-interval 100 input.d2

# 方案 2: 手动保存文件触发
# 在编辑器中确保保存成功

# 方案 3: 检查文件权限
ls -la input.d2 output.svg
```

---

### 17. 主题不生效

**错误现象**:
```bash
d2 --theme 300 input.d2 output.svg
# 图像仍使用默认主题
```

**原因**:
- 文件中已定义 `vars.d2-config.theme-id`
- CLI 参数被覆盖

**解决方案**:
```bash
# 方案 1: 移除文件中的主题配置
# input.d2 中删除:
vars: {
  d2-config: {
    theme-id: 100  # 删除此行
  }
}

# 方案 2: 使用 --force-theme (如果支持)
d2 --theme 300 --force input.d2
```

---

## 💡 最佳实践

### 错误预防

1. **使用语法高亮编辑器**
   - VSCode: 安装 D2 扩展
   - Vim: 安装 D2 插件

2. **启用自动格式化**
   ```bash
   d2 fmt input.d2
   ```

3. **使用 Playground 验证**
   - https://play.d2lang.com/
   - 快速测试语法正确性

4. **保持文件小而简单**
   - 超过 100 个节点时考虑拆分
   - 使用 `imports` 组织大型图表

5. **渐进式构建**
   ```d2
   # 第 1 步: 定义形状
   api; database; cache

   # 第 2 步: 定义连接
   api -> database
   api -> cache

   # 第 3 步: 添加样式
   api.style.fill: blue
   ```

---

## 🔍 调试技巧

### 1. 使用详细输出

```bash
d2 -v input.d2  # 显示详细日志
```

### 2. 增量测试

```d2
# 注释掉部分代码,逐步启用
# x -> y
# y -> z
z -> a  # 从这里开始测试
```

### 3. 检查输出格式

```bash
# 确认 D2 版本
d2 --version

# 查看支持的输出格式
d2 --help
```

### 4. 社区求助

- **Discord**: https://discord.com/invite/pbUXgvmTpU
- **GitHub Issues**: https://github.com/terrastruct/d2/issues
- **Stack Overflow**: 使用 `[d2lang]` 标签

---

## 📚 参考资源

- **故障排查指南**: https://d2lang.com/tour/troubleshoot/
- **常见问题 FAQ**: https://d2lang.com/tour/faq/
- **语法规则**: https://d2lang.com/tour/strings/
- **社区讨论**: https://github.com/terrastruct/d2/discussions

---

**最后更新**: 2025-10-13
