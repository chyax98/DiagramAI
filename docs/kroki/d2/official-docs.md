# D2 官方文档参考

> 来源: https://d2lang.com/ | 最后更新: 2025-10-13

---

## 📚 核心概念

### D2 是什么?

**D2 (Declarative Diagramming)** 是一种现代化的图表脚本语言,将文本转换为图表。它专为软件文档和架构图设计,具有简洁的声明式语法。

**核心特点**:
- ✅ 声明式语法,描述"想要什么"而非"如何绘制"
- ✅ 轻量级语法,专注可读性而非紧凑性
- ✅ 支持多种布局引擎 (DAGRE, ELK, TALA)
- ✅ 内置多种主题和手绘风格
- ✅ 完整的语言工具支持 (自动格式化、语法高亮、错误提示)

---

## 🎯 基础语法

### 1. 形状 (Shapes)

```d2
# 基本形状声明
imAShape
im_a_shape
im a shape
i'm a shape
a-shape  # 注意: 单连字符不是连接

# 使用分号定义多个形状
SQLite; Cassandra

# 自定义标签
pg: PostgreSQL

# 指定形状类型
Cloud: my cloud
Cloud.shape: cloud
```

**形状类型**:
- `rectangle` (默认)
- `circle`, `square` (1:1 比例)
- `cloud`, `cylinder`, `diamond`, `hexagon`
- `person`, `package`, `page`
- `stored_data` (带波浪线的矩形)
- 更多类型见 [Shape Catalog](https://d2lang.com/tour/shapes)

**注意事项**:
- ⚠️ 键名不区分大小写 (`postgresql` 和 `PostgreSQL` 引用同一形状)
- ⚠️ 1:1 比例形状 (circle/square) 会自动保持宽高相等

---

### 2. 连接 (Connections)

```d2
# 4 种连接方式
Write Replica Canada <-> Write Replica Australia  # 双向
Read Replica <- Master                            # 左向
Write Replica -> Master                           # 右向
Read Replica 1 -- Read Replica 2                  # 无向

# 连接标签
Read Replica 1 -- Read Replica 2: Kept in sync

# 必须使用键名,不能使用标签
be: Backend
fe: Frontend
be -> fe  # 正确
Backend -> Frontend  # 错误,会创建新形状

# 连接链
High Mem Instance -> EC2 <- High CPU Instance: Hosted By

# 重复连接 (不会覆盖,会创建新连接)
Database -> S3: backup
Database -> S3
Database -> S3: backup  # 创建第三条连接
```

**箭头头部自定义**:
```d2
a -> b: To err is human {
  source-arrowhead: 1
  target-arrowhead: * {
    shape: diamond
    style.filled: true
  }
}
```

箭头类型: `triangle`, `arrow`, `diamond`, `circle`, `box`, `cf-one`, `cf-many`, `cross`

---

### 3. 容器 (Containers)

```d2
# 嵌套结构
network: {
  cell tower: {
    satellites: {
      shape: stored_data
      style.multiple: true
    }
    transmitter
  }

  online portal: {
    ui: {shape: hexagon}
  }
}

# 跨容器连接 (使用完整路径)
network.cell tower.transmitter -> network.online portal.ui
```

**父级引用**:
```d2
christmas: {
  presents
}
birthdays: {
  presents
  _.christmas.presents -> presents: regift  # _ 表示父级
}
```

---

### 4. 样式 (Styles)

```d2
# 全局样式
style: {
  fill: "#ACE1AF"
  stroke: "#000000"
  stroke-width: 2
  font-size: 20
}

# 单个元素样式
x: {
  style: {
    fill: red
    stroke: blue
    opacity: 0.5
    border-radius: 5
    shadow: true
    multiple: true  # 显示为多个重叠
  }
}

# 连接样式
x -> y: {
  style: {
    stroke: red
    stroke-width: 4
    stroke-dash: 3
    animated: true
  }
}
```

**主题**:
```bash
d2 --theme=300 --dark-theme=200 input.d2
```

常用主题: `0` (默认), `100-108` (中性色系), `200-208` (彩色系), `300` (Terrastruct)

**手绘风格**:
```bash
d2 --sketch input.d2
```

---

### 5. 字符串 (Strings)

```d2
# 无引号字符串 (推荐)
x -> y: hello world

# 单/双引号字符串
x: 'I\'m a string'
y: "Contains \"quotes\""

# 块字符串 (支持 Markdown)
explanation: |md
  # Heading
  **Bold text**

  - List item 1
  - List item 2
|

# 管道符块字符串
code: |go
  func main() {
    fmt.Println("Hello")
  }
|
```

**注意**:
- ⚠️ 使用 ASCII 特殊字符 (`:`, `;`, `.`) 而非全角字符 (`：`, `；`, `。`)
- ⚠️ 包含特殊字符时必须加引号

---

### 6. SQL 表格

```d2
my_table: {
  shape: sql_table
  id: int {constraint: primary_key}
  name: varchar(255)
  created_at: timestamp
}
```

---

### 7. 类图 (Class Diagrams)

```d2
MyClass: {
  shape: class

  # 字段
  -privateField: int
  +publicField: string

  # 方法
  -privateMethod(): void
  +publicMethod(param: string): bool
}
```

访问修饰符: `-` (private), `+` (public), `#` (protected), `~` (package)

---

### 8. 序列图 (Sequence Diagrams)

```d2
shape: sequence_diagram

alice -> bob: Hello
bob -> alice: Hi there
```

---

## 🎨 高级特性

### 1. 图标 (Icons)

```d2
server: {
  icon: https://icons.terrastruct.com/aws/Compute/EC2.svg
  # 或使用内置图标
  icon: https://icons.terrastruct.com/essentials/004-squares.svg
}
```

内置图标库: https://icons.terrastruct.com

---

### 2. 多个图表 (Multiple Diagrams)

```d2
layers: {
  architecture: {
    # 架构图内容
  }
  sequence: {
    # 序列图内容
  }
}
```

生成: `d2 input.d2 output/`

---

### 3. 变量 (Variables)

```d2
vars: {
  primary-color: "#4A90E2"
  font-size: 16
}

x: {
  style.fill: ${primary-color}
  style.font-size: ${font-size}
}
```

---

### 4. 导入 (Imports)

```d2
# base.d2
...@common.d2

user -> api
```

`common.d2`:
```d2
api: API Server
database: PostgreSQL
```

---

### 5. Globs 和过滤

```d2
# 选择所有形状
*: {style.fill: lightblue}

# 选择所有连接
(* -> *)[*]: {style.stroke: red}

# 暂停/取消暂停
*: suspend
api: unsuspend
```

---

## 🔧 布局引擎

### DAGRE (免费,开源)
```bash
d2 -l dagre input.d2
```
- 适用: 简单层次图
- 限制: 基础布局算法

### ELK (免费,开源)
```bash
d2 -l elk input.d2
```
- 适用: 复杂嵌套图
- 优势: 更好的层次布局

### TALA (付费)
```bash
d2 -l tala input.d2
```
- 适用: 专业图表
- 优势: 最优布局质量

---

## 📝 注释

```d2
# 单行注释

# 多行注释
# 每行以 # 开头
```

---

## ⚙️ CLI 命令

```bash
# 基本用法
d2 input.d2 output.svg

# 监听模式 (自动刷新)
d2 --watch input.d2 output.svg

# 指定主题和布局
d2 --theme=300 -l elk input.d2

# 手绘风格
d2 --sketch input.d2

# 设置内边距
d2 --pad=0 input.d2

# 导出为 PNG/PDF
d2 input.d2 output.png
d2 input.d2 output.pdf
```

---

## 🔗 官方资源

- **官网**: https://d2lang.com/
- **GitHub**: https://github.com/terrastruct/d2
- **Playground**: https://play.d2lang.com/
- **文档**: https://d2lang.com/tour/intro/
- **图标库**: https://icons.terrastruct.com/
- **Discord**: https://discord.com/invite/pbUXgvmTpU

---

## 📚 扩展阅读

- [设计决策](https://d2lang.com/tour/design/)
- [C4 模型支持](https://d2lang.com/blog/c4/)
- [示例库](https://d2lang.com/examples/overview/)
- [发布日志](https://d2lang.com/releases/intro/)
- [API 使用](https://d2lang.com/tour/api/)

---

**最后更新**: 2025-10-13
**文档版本**: D2 v0.6+
