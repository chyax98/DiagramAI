# D2 语法规则详解

> **文档版本**: v1.0  
> **适用 D2 版本**: v0.6.x  
> **最后更新**: 2025-01-13

---

## 🎯 核心语法规则

### 1. 节点定义

#### 基础节点

```d2
# 简单节点 (无引号)
server
database
cache

# 带标签的节点
api: API Gateway
db: Production Database
```

#### 引号使用规则

```d2
# ❌ 错误: 包含特殊字符但无引号
user-service

# ✅ 正确: 使用引号包裹
"user-service"
'user-service'

# ❌ 错误: 非 ASCII 冒号
node：label  # 中文冒号

# ✅ 正确: ASCII 冒号
node: label  # 英文冒号
```

### 2. 连接语法

#### 基础连接

```d2
# 无标签连接
A -> B

# 带标签连接
A -> B: HTTP Request

# 双向连接
A <-> B

# 无箭头连接
A -- B
```

#### 连接链式

```d2
# 链式定义 (标签应用于所有连接)
A -> B -> C: flow

# 等价于:
A -> B: flow
B -> C: flow
```

#### 多连接处理

```d2
# ⚠️ 重复连接会创建新连接,不会覆盖
Database -> S3: backup
Database -> S3: backup  # 创建第2条连接
Database -> S3  # 创建第3条连接
```

### 3. 容器与作用域

#### 容器定义

```d2
aws: {
  ec2
  rds
  s3
  ec2 -> rds
}

gcp: {
  compute
  storage
}
```

#### 跨容器引用

```d2
# ✅ 正确: 完整路径
aws.ec2 -> gcp.storage

# ❌ 错误: 不在同一作用域
aws: {
  ec2 -> storage  # 会在 aws 下创建新 storage 节点
}
```

#### 引用父级 (\_)

```d2
outer: {
  inner: {
    node
    _.outer_node -> node  # 引用父级的 outer_node
  }
  outer_node
}
```

---

## 📝 字符串处理

### 1. 无引号字符串

```d2
# 支持: 字母、数字、下划线、连字符
simple_node
node123
node-with-dash

# 不支持特殊字符: : ; { } [ ] | # < > @ 等
```

### 2. 引号字符串

```d2
# 单引号
'node with spaces'
'node: with: colons'

# 双引号
"another node"
"node with 'quotes' inside"

# 转义
"node with \"escaped\" quotes"
```

### 3. 块字符串

```d2
# 单行块字符串
description: |
  This is a single line
|

# 多行块字符串
docs: ||
  Line 1
  Line 2
  Line 3
||

# Markdown 块
content: |md
  # Heading
  **Bold** text
|
```

---

## 🎨 样式规则

### 1. 样式属性

```d2
node: {
  style: {
    # 颜色
    fill: "#1E90FF"           # 填充色
    stroke: "#000000"         # 边框色
    font-color: "#FFFFFF"     # 文字色

    # 边框
    stroke-width: 2           # 边框宽度
    stroke-dash: 5            # 虚线间距
    border-radius: 8          # 圆角

    # 字体
    font-size: 16             # 字号
    bold: true                # 加粗
    italic: true              # 斜体
    underline: true           # 下划线

    # 特效
    shadow: true              # 阴影
    opacity: 0.8              # 透明度
    multiple: true            # 多层效果
  }
}
```

### 2. 连接样式

```d2
connection: {
  style: {
    stroke: "#FF0000"
    stroke-width: 3
    stroke-dash: 5
    animated: true           # 动画
  }
}
```

### 3. 全局样式

```d2
# 应用于所有同类对象
*.style.fill: "#F0F0F0"
```

---

## 🔲 形状系统

### 基础形状

```d2
rect: {shape: rectangle}    # 矩形
circle: {shape: circle}     # 圆形
oval: {shape: oval}         # 椭圆
diamond: {shape: diamond}   # 菱形
```

### 技术形状

```d2
db: {shape: cylinder}       # 数据库
queue: {shape: queue}       # 队列
package: {shape: package}   # 包
cloud: {shape: cloud}       # 云
```

### SQL 表格

```d2
users: {
  shape: sql_table
  id: int {constraint: primary_key}
  name: varchar(255)
  email: varchar(255) {constraint: unique}
  created_at: timestamp
}
```

---

## 🔄 高级语法

### 1. 变量替换

```d2
vars: {
  primary: "#1E90FF"
  secondary: "#FF6B6B"
  db_name: "production"
}

api.style.fill: ${primary}
database: ${db_name} {
  style.fill: ${secondary}
}
```

### 2. 类系统

```d2
classes: {
  important: {
    style.fill: "#FF0000"
    style.font-color: "#FFF"
  }
}

critical_node.class: important
```

### 3. 导入系统

```d2
# 导入整个文件
...@components/network.d2

# 导入到特定节点
backend: {
  ...@services/api.d2
}
```

### 4. 图标

```d2
aws: {
  icon: https://icons.terrastruct.com/aws/...
}

# 本地图标
custom: {
  icon: /path/to/icon.svg
}
```

---

## 🚨 常见错误

### 1. 引用错误

```d2
# ❌ 连接引用标签而非键
Backend: API Server
Frontend: Web App
Backend -> Frontend  # ❌ 找不到这些节点

# ✅ 正确: 引用键名
be: API Server
fe: Web App
be -> fe  # ✅ 正确
```

### 2. 作用域错误

```d2
# ❌ 跨容器引用不完整
container1: {
  node1
}
container2: {
  node2
  node1 -> node2  # ❌ 会创建新 node1
}

# ✅ 正确: 完整路径
container1: {
  node1
}
container2: {
  node2
  _.container1.node1 -> node2  # ✅
}
```

### 3. 特殊字符错误

```d2
# ❌ 使用非 ASCII 字符
node：label  # 中文冒号
node；comment  # 中文分号

# ✅ 正确: ASCII 字符
node: label  # 英文冒号
node; comment  # 英文分号
```

---

## 📋 语法检查清单

- [ ] 所有特殊字符都用引号包裹
- [ ] 跨容器引用使用完整路径
- [ ] 连接引用节点的键名,不是标签
- [ ] 使用 ASCII 版本的特殊符号 (`:` `;` `.`)
- [ ] 重复连接会创建多条,非覆盖
- [ ] 保留字用引号包裹
- [ ] HTML 标签在 Markdown 中语义正确 (`<br/>` 而非 `<br>`)

---

## 🔗 参考资源

- 官方语法指南: https://d2lang.com/tour/intro
- 字符串文档: https://d2lang.com/tour/strings
- 故障排查: https://d2lang.com/tour/troubleshoot
- 样式参考: https://d2lang.com/tour/customization
