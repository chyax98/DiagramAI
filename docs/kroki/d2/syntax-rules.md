# D2 语法规则与约束

> 基于官方文档整理 | 最后更新: 2025-10-13

---

## 📏 命名规则

### 1. 键名 (Key Names)

**允许的格式**:
```d2
# ✅ 有效的键名
imAShape
im_a_shape
im a shape
i'm a shape
a-shape           # 单连字符 (非连接符号)
my-cool-shape_123
```

**规则**:
- ✅ 允许: 字母、数字、下划线、空格、连字符、撇号
- ✅ 不区分大小写 (`PostgreSQL` = `postgresql`)
- ❌ 禁止: 双连字符 `--`, 箭头 `->`, `<-`, `<->`
- ❌ 禁止: 特殊符号开头 (`.`, `:`, `;` 等)

**最佳实践**:
```d2
# 推荐: 选择一种命名规范并保持一致
auth_service      # snake_case
auth-service      # kebab-case
authService       # camelCase
AuthService       # PascalCase
```

---

### 2. 标签 (Labels)

```d2
# 键名 vs 标签
backend: Backend Server  # backend 是键, "Backend Server" 是标签

# 连接必须使用键名
be: Backend
fe: Frontend
be -> fe           # ✅ 正确
Backend -> Frontend # ❌ 错误: 创建新形状,不是引用已有形状
```

**重要**:
- ⚠️ 连接引用的是**键名**,不是标签
- ⚠️ 标签仅用于显示,不能用于引用

---

## 🔗 连接语法

### 1. 连接符号

**4 种有效连接**:
```d2
x -- y   # 无向连接
x -> y   # 右向箭头
x <- y   # 左向箭头
x <-> y  # 双向箭头
```

**无效写法**:
```d2
x - y    # ❌ 单连字符 (会被识别为形状键名)
x => y   # ❌ 粗箭头不支持
x ~> y   # ❌ 波浪箭头不支持
```

---

### 2. 连接标签

```d2
# ✅ 正确
a -> b: label text
a -> b: "label with: special chars"
a -> b: 'label with; special chars'

# ❌ 错误
a -> b label text      # 缺少冒号
a -> : invalid         # 目标为空
-> b: invalid          # 源为空
```

---

### 3. 连接链 (Connection Chaining)

```d2
# ✅ 正确: 标签应用于每个连接
a -> b -> c: shared label
# 等价于:
# a -> b: shared label
# b -> c: shared label

# ✅ 混合方向
a -> b <- c: label
# 等价于:
# a -> b: label
# c -> b: label
```

---

### 4. 重复连接

```d2
# 重复连接不会覆盖,而是创建新连接
Database -> S3: backup
Database -> S3          # 第 2 条连接
Database -> S3: backup  # 第 3 条连接 (即使标签相同)

# 引用特定连接
(Database -> S3)[0].style.stroke: red   # 第 1 条
(Database -> S3)[1].style.stroke: blue  # 第 2 条
(Database -> S3)[2].style.stroke: green # 第 3 条
```

---

## 🏗️ 容器与嵌套

### 1. 嵌套结构

```d2
# ✅ 正确
parent: {
  child1
  child2: {
    grandchild
  }
}

# ✅ 点号引用
parent.child1
parent.child2.grandchild
```

---

### 2. 跨容器连接

```d2
# ✅ 必须使用完整路径
network.api -> database.postgresql

# ❌ 错误: 不能使用部分路径
api -> postgresql  # 如果这些是嵌套在容器中的
```

---

### 3. 父级引用

```d2
outer: {
  inner: {
    # _ 引用父容器 (outer)
    _.sibling -> inner: cross reference
  }
  sibling
}
```

**规则**:
- `_` 引用直接父级容器
- `_._.sibling` 引用祖父级容器中的元素

---

## 🎨 样式属性

### 1. 样式声明方式

```d2
# 方式 1: 内联对象
x: {
  style.fill: red
  style.stroke: blue
}

# 方式 2: 嵌套对象
x: {
  style: {
    fill: red
    stroke: blue
  }
}

# 两者等价
```

---

### 2. 有效样式属性

**形状样式**:
```d2
shape: {
  style.fill: "#4A90E2"            # 填充色
  style.stroke: "#000000"          # 边框色
  style.stroke-width: 2            # 边框宽度
  style.stroke-dash: 3             # 虚线间距
  style.opacity: 0.5               # 透明度 (0-1)
  style.border-radius: 5           # 圆角半径
  style.shadow: true               # 阴影
  style.multiple: true             # 多重显示
  style.3d: true                   # 3D 效果
  style.font-size: 16              # 字体大小
  style.font-color: "#FFFFFF"      # 字体颜色
  style.bold: true                 # 粗体
  style.italic: true               # 斜体
  style.underline: true            # 下划线
}
```

**连接样式**:
```d2
a -> b: {
  style.stroke: red
  style.stroke-width: 4
  style.stroke-dash: 5
  style.animated: true    # 动画效果
}
```

---

### 3. 颜色格式

```d2
# ✅ 支持的颜色格式
style.fill: red                    # 颜色名
style.fill: "#FF0000"              # 十六进制
style.fill: "rgb(255, 0, 0)"       # RGB
style.fill: "rgba(255, 0, 0, 0.5)" # RGBA

# 常用颜色名
# red, blue, green, yellow, orange, purple
# gray, black, white, transparent
```

---

## 📝 字符串规则

### 1. 无引号字符串

```d2
# ✅ 无引号字符串 (推荐)
x: hello world
x -> y: simple label

# ❌ 包含特殊字符时必须加引号
x: hello: world     # 错误: 冒号会被解析
x: "hello: world"   # 正确
```

**禁用字符** (无引号时):
- `:`, `;`, `.`, `{`, `}`, `[`, `]`, `(`, `)`, `|`, `#`

---

### 2. 引号字符串

```d2
# 单引号
x: 'I\'m a string'
x: 'Contains "double quotes"'

# 双引号
x: "I'm a string"
x: "Contains \"escaped quotes\""

# 选择原则:
# - 包含单引号 → 用双引号
# - 包含双引号 → 用单引号
# - 两者都有 → 用双引号 + 转义
```

---

### 3. 块字符串

```d2
# 管道符块字符串
description: |
  Line 1
  Line 2
  Line 3
|

# Markdown 块
explanation: |md
  # Heading
  **Bold text**
|

# 代码块
code: |go
  func main() {
    fmt.Println("Hello")
  }
|
```

**规则**:
- ✅ 管道符 `|` 后可跟语言标识符 (`md`, `go`, `js`, `sql` 等)
- ✅ 自动保留缩进
- ⚠️ 结束管道符 `|` 必须单独一行

---

## 🔢 数据类型

### 1. 布尔值

```d2
# ✅ 有效布尔值
style.bold: true
style.italic: false

# ❌ 无效
style.bold: True   # 大写不支持
style.bold: 1      # 数字不支持
```

---

### 2. 数字

```d2
# ✅ 整数和浮点数
style.font-size: 16
style.opacity: 0.5

# ❌ 无效
style.opacity: .5   # 缺少前导零
```

---

### 3. Null

```d2
# 删除属性
x: {
  label: null  # 移除标签
}
```

---

## 🚫 常见语法错误

### 1. 特殊字符错误

```d2
# ❌ 全角字符 (中文输入法)
x：label           # 全角冒号
x；y               # 全角分号
x。y               # 全角句号

# ✅ ASCII 字符 (英文输入法)
x: label
x; y
```

---

### 2. 箭头方向错误

```d2
# ✅ 正确
a -> b: forward
b <- a: backward
a <-> b: bidirectional
a -- b: undirected

# ❌ 错误
a => b   # 粗箭头不支持
a ~> b   # 波浪箭头不支持
```

---

### 3. 引用错误

```d2
# ❌ 引用标签而非键名
backend: Backend Server
frontend: Frontend App
Backend Server -> Frontend App  # 错误: 创建新形状

# ✅ 引用键名
backend -> frontend
```

---

### 4. 嵌套错误

```d2
# ❌ 缺少完整路径
network: {
  api
}
database: {
  db
}
api -> db  # 错误: 引用不明确

# ✅ 使用完整路径
network.api -> database.db
```

---

## 📊 特殊对象规则

### 1. SQL 表格

```d2
users: {
  shape: sql_table
  # 字段格式: name: type {constraint}
  id: int {constraint: primary_key}
  username: varchar(255) {constraint: unique}
  created_at: timestamp
}
```

**约束类型**:
- `primary_key`, `foreign_key`, `unique`, `not_null`

---

### 2. 类图

```d2
MyClass: {
  shape: class

  # 访问修饰符
  -privateField: int        # - = private
  +publicField: string      # + = public
  #protectedField: bool     # # = protected
  ~packageField: float      # ~ = package

  -privateMethod()
  +publicMethod(param: string): bool
}
```

---

### 3. 序列图

```d2
shape: sequence_diagram

alice -> bob: Hello
bob -> alice: Hi there
alice -> bob: How are you?
```

**限制**:
- ⚠️ 必须设置 `shape: sequence_diagram`
- ⚠️ 仅支持简单消息流

---

## ✅ 最佳实践

### 1. 保持一致性

```d2
# ✅ 统一命名规范
auth_service
user_service
payment_service

# ❌ 混乱命名
authService
user-service
PaymentService
```

---

### 2. 分离结构和样式

```d2
# ✅ 先定义结构
api: API Server
database: Database
cache: Redis

# 然后定义连接
api -> database
api -> cache

# 最后应用样式
api.style.fill: blue
database.style.fill: green
```

---

### 3. 使用注释

```d2
# 架构图 - 2025-10-13
# 负责人: John Doe

# 前端层
frontend: {
  # ...
}

# 后端层
backend: {
  # ...
}
```

---

### 4. 合理使用容器

```d2
# ✅ 逻辑分组
production: {
  api_server
  database
  cache
}

staging: {
  api_server
  database
}

# 跨环境连接
production.api_server -> staging.api_server: sync
```

---

## 🔍 语法验证

### 自动格式化

```bash
# D2 内置格式化工具
d2 fmt input.d2

# 自动修复缩进、空格、引号
```

---

### 错误提示

D2 解析器提供详细错误信息:
```
Error: line 5: syntax error near ':'
  x:: invalid
    ^
```

---

## 📚 参考资源

- **语法规范**: https://d2lang.com/tour/strings/
- **样式属性**: https://d2lang.com/tour/style/
- **连接规则**: https://d2lang.com/tour/connections/
- **容器嵌套**: https://d2lang.com/tour/containers/

---

**最后更新**: 2025-10-13
