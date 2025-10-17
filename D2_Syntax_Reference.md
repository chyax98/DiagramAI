# D2 语法参考文档

> D2 (Declarative Diagramming) - 现代化的图表脚本语言
>
> 官方网站: https://d2lang.com
> GitHub: https://github.com/terrastruct/d2

---

## 目录

1. [核心概念](#核心概念)
2. [基础语法](#基础语法)
3. [形状 (Shapes)](#形状-shapes)
4. [连接 (Connections)](#连接-connections)
5. [容器 (Containers)](#容器-containers)
6. [样式系统 (Styles)](#样式系统-styles)
7. [特殊对象类型](#特殊对象类型)
8. [文本与代码](#文本与代码)
9. [注释](#注释)
10. [字符串处理](#字符串处理)
11. [最佳实践](#最佳实践)

---

## 核心概念

### D2的设计哲学

- **声明式**: 描述你想要的图表，D2自动生成布局
- **简洁语法**: 尽量减少引号、括号等语法噪音
- **类型丰富**: 支持流程图、时序图、ER图、类图、网格图等多种类型
- **高度可定制**: 完整的样式系统，支持主题、动画、交互

### 基本原则

1. **键值对定义**: 所有内容都是键值对 `key: value`
2. **连接定义关系**: 使用箭头符号定义形状之间的连接
3. **层次结构**: 使用缩进或点号表示嵌套关系
4. **大小写不敏感**: 键名不区分大小写

---

## 基础语法

### Hello World

```d2
x -> y: hello world
```

- 定义了两个形状 `x` 和 `y`
- 它们之间有一个连接，标签为 "hello world"

### 键值对语法

```d2
# 定义形状
myShape

# 定义形状并设置标签
myShape: My Shape Label

# 设置形状属性
myShape.shape: rectangle
myShape.style.fill: blue
```

### 多种命名方式

```d2
# 以下命名方式都有效
imAShape
im_a_shape
im a shape
i'm a shape
a-shape
```

**注意**: 键名大小写不敏感，`postgresql` 和 `postgreSQL` 引用同一个形状

---

## 形状 (Shapes)

### 基础形状定义

```d2
# 方式1: 直接声明
shape1

# 方式2: 设置标签
shape2: Label Text

# 方式3: 使用分号在同行定义多个
shape1; shape2; shape3
```

### 形状类型 (shape属性)

```d2
box: Box
box.shape: rectangle

circle: Circle
circle.shape: circle

database: Database
database.shape: cylinder

person: Person
person.shape: person
```

### 完整形状类型目录

**基础形状**:

- `rectangle` (默认)
- `square`
- `circle`
- `oval`
- `diamond`
- `hexagon`

**专业形状**:

- `cylinder` - 数据库
- `queue` - 消息队列
- `package` - 软件包
- `step` - 流程步骤
- `callout` - 标注框
- `stored_data` - 存储数据
- `person` - 人物
- `document` - 文档
- `parallelogram` - 平行四边形
- `page` - 页面
- `cloud` - 云服务

**特殊形状** (后面详述):

- `sql_table` - SQL表格
- `class` - UML类图
- `sequence_diagram` - 时序图
- `text` - 纯文本
- `image` - 图片
- `code` - 代码块

### 1:1 比例形状

某些形状保持1:1的宽高比:

- `circle` - 圆形
- `square` - 正方形

这些形状的宽度和高度始终相等。如果标签很长导致变宽，高度也会自动调整。

---

## 连接 (Connections)

### 基础连接语法

```d2
# 4种有效的连接方式
x -- y        # 无方向连接
x -> y        # 单向箭头 (x指向y)
x <- y        # 反向箭头 (y指向x)
x <-> y       # 双向箭头
```

### 连接标签

```d2
# 设置连接标签
x -> y: connection label

# 引用连接并修改属性
(x -> y)[0].style.stroke: red
```

### 连接链式定义

```d2
# 可读性更好的链式连接
a -> b -> c -> d

# 等同于
a -> b
b -> c
c -> d
```

### 重复连接

重复声明连接不会覆盖，而是创建新连接:

```d2
Database -> S3: backup
Database -> S3: backup  # 创建第二条连接
```

### 箭头头部样式

通过 `source-arrowhead` 和 `target-arrowhead` 自定义箭头:

```d2
x -> y: {
  source-arrowhead: triangle  # 起点箭头
  target-arrowhead: diamond   # 终点箭头
}
```

**箭头类型**:

- `triangle` (默认) - 可设置 `style.filled: false`
- `arrow` - 更尖的三角形
- `diamond` - 菱形，可设置 `style.filled: true`
- `circle` - 圆形，可设置 `style.filled: true`
- `box` - 方框，可设置 `style.filled: true`
- `cf-one`, `cf-one-required` - 鸦爪符号（单个）
- `cf-many`, `cf-many-required` - 鸦爪符号（多个）
- `cross` - 十字

### 箭头标签

```d2
x -> y: main label {
  source-arrowhead: * (label)
  target-arrowhead: 1..* (another label)
}
```

**注意**: 箭头标签应保持简短，否则可能与其他对象碰撞

### 引用连接

通过索引引用已定义的连接:

```d2
x -> y: hi
x -> y: hello

# 引用第一条连接
(x -> y)[0].style.stroke: red
# 引用第二条连接
(x -> y)[1].style.stroke: blue
```

### 循环连接

D2支持循环关系:

```d2
Stage One -> Stage Two -> Stage Three -> Stage Four
Stage Four -> Stage One: repeat
```

### 连接注意事项

1. **必须使用键名**: 连接必须引用形状的key，不能用label
2. **自动创建形状**: 连接中引用的未声明形状会自动创建
3. **方向性**: 箭头方向决定关系方向

---

## 容器 (Containers)

### 嵌套语法

```d2
# 方式1: 点号语法
server.process
server.database

# 方式2: 花括号嵌套
server: {
  process
  database
}
```

### 容器标签

```d2
# 方式1: 简写标签
clouds: {
  aws: AWS Cloud
}

# 方式2: 使用label关键字
clouds: {
  aws: {
    label: AWS Cloud
  }
}
```

### 引用父级

使用下划线 `_` 引用父容器:

```d2
christmas: {
  presents

  birthday: {
    presents

    # 连接到父容器的presents
    _.presents -> presents: regift
  }
}
```

### 跨容器连接

```d2
clouds: {
  aws: {
    load_balancer
    api
  }
  gcp: {
    database
  }
}

# 跨容器连接
clouds.aws.api -> clouds.gcp.database
```

### 容器示例

```d2
cloud: {
  users
  ci

  AWS: {
    load_balancer
    api
    db
  }

  Google Cloud: {
    auth
    db
  }
}

users -> cloud.AWS.load_balancer
ci -> cloud.AWS.api: deploys
```

---

## 样式系统 (Styles)

### 基础样式语法

```d2
shape_name: {
  style.property: value
}

# 或简写
shape_name.style.property: value
```

### 完整样式属性目录

#### 通用样式

**不透明度** (`opacity`):

```d2
x.style.opacity: 0.5  # 0到1之间的浮点数
```

**边框颜色** (`stroke`):

```d2
x.style.stroke: red
x.style.stroke: "#FF0000"
x.style.stroke: "linear-gradient(red, blue)"
```

**填充颜色** (`fill`):

```d2
x.style.fill: blue
x.style.fill: "#0000FF"
x.style.fill: transparent
```

**填充图案** (`fill-pattern`):

```d2
x.style.fill-pattern: dots    # 点状
x.style.fill-pattern: lines   # 线条
x.style.fill-pattern: grain   # 颗粒
x.style.fill-pattern: none    # 无
```

**边框宽度** (`stroke-width`):

```d2
x.style.stroke-width: 3  # 1到15的整数
```

**边框虚线** (`stroke-dash`):

```d2
x.style.stroke-dash: 5  # 0到10的整数
```

**圆角** (`border-radius`):

```d2
x.style.border-radius: 8  # 0到20的整数

# 创建胶囊效果
pill.style.border-radius: 20
```

#### 形状特有样式

**阴影** (`shadow`) - 仅形状:

```d2
x.style.shadow: true
```

**3D效果** (`3d`) - 仅矩形/正方形:

```d2
x.style.3d: true
```

**多重效果** (`multiple`) - 仅形状:

```d2
x.style.multiple: true
```

**双边框** (`double-border`) - 矩形/椭圆:

```d2
x.style.double-border: true
```

#### 文本样式

**字体** (`font`):

```d2
x.style.font: mono  # 目前仅支持mono
```

**字体大小** (`font-size`):

```d2
x.style.font-size: 20  # 8到100的整数
```

**字体颜色** (`font-color`):

```d2
x.style.font-color: white
x.style.font-color: "#FFFFFF"
```

**文本样式** (`bold`, `italic`, `underline`):

```d2
x.style.bold: true
x.style.italic: true
x.style.underline: true
```

**文本转换** (`text-transform`):

```d2
x.style.text-transform: uppercase   # 全大写
x.style.text-transform: lowercase   # 全小写
x.style.text-transform: title       # 标题格式
x.style.text-transform: none        # 无转换
```

#### 动画

**动画效果** (`animated`):

```d2
x -> y: {
  style.animated: true
}
```

#### 根级样式

图表全局样式通过根级 `style` 设置:

```d2
style.fill: lightgray              # 背景颜色
style.fill-pattern: grain          # 背景图案
style.stroke: black                # 边框
style.stroke-width: 2              # 边框宽度
style.stroke-dash: 3               # 边框虚线
style.double-border: true          # 双边框

# 图表内容
x -> y
```

### SQL表格和类图样式

对于 `sql_table` 和 `class` 形状:

- `stroke` 应用于表体填充
- `fill` 应用于表头填充
- `font-color` 应用于表头文本

```d2
my_table: {
  shape: sql_table
  style.stroke: lightblue    # 表体背景
  style.fill: darkblue       # 表头背景
  style.font-color: white    # 表头文字
}
```

---

## 特殊对象类型

### SQL表格 (sql_table)

```d2
my_table: {
  shape: sql_table

  id: int {constraint: primary_key}
  name: varchar(100) {constraint: unique}
  user_id: int {constraint: foreign_key}
  created_at: timestamp
}
```

**约束简写**:

- `primary_key` → `PK`
- `foreign_key` → `FK`
- `unique` → `UNQ`

**多个约束**:

```d2
column: type {constraint: [primary_key, unique]}
```

**转义保留字**:

```d2
"type": varchar  # 使用引号转义SQL保留字
```

**外键连接**:

```d2
objects: {
  shape: sql_table
  id: int {constraint: PK}
  disk: int {constraint: FK}
}

disks: {
  shape: sql_table
  id: int {constraint: PK}
}

objects.disk -> disks.id
```

### UML类图 (class)

```d2
MyClass: {
  shape: class

  # 字段
  +field: []string
  -privateField: int
  #protectedField: bool

  # 方法
  +method(a uint64): (x, y int)
  -privateMethod(): void
  #protectedMethod()
}
```

**可见性前缀**:

- 无前缀 = `public`
- `+` = `public`
- `-` = `private`
- `#` = `protected`

**方法定义**:

- 包含 `(` 的键被识别为方法
- 值为返回类型
- 无值表示 `void` 返回

**示例**:

```d2
D2 Parser: {
  shape: class

  +reader: io.RuneReader
  +readerPos: d2ast.Position
  -lookahead: []rune
  #lookaheadPos: d2ast.Position

  +peek(): (r rune, eof bool)
  +rewind(): void
  +commit(): void
  #peekn(n int): (s string, eof bool)
}
```

### 时序图 (sequence_diagram)

```d2
my_sequence: {
  shape: sequence_diagram

  alice
  bob

  alice -> bob: What does it mean\nto be well-adjusted?
  bob -> alice: The ability to play bridge\nor golf as if they were games.
}
```

**时序图特殊规则**:

1. **共享作用域**: 时序图内的所有actor共享同一作用域
2. **顺序重要**: 定义顺序决定显示顺序

**Span (生命周期)**:

```d2
my_sequence: {
  shape: sequence_diagram

  alice
  bob

  alice."Critical Section": {
    bob -> alice: message
  }
}
```

**Group (分组)**:

```d2
my_sequence: {
  shape: sequence_diagram

  alice
  bob

  shower thoughts: {
    alice -> bob: A physicist is an atom's way\nof knowing about atoms.
  }

  life advice: {
    alice -> bob: Today is the first day\nof the rest of your life.
  }
}
```

**Notes (注释)**:

```d2
my_sequence: {
  shape: sequence_diagram

  alice
  bob

  alice."important insight": Chocolate chip.
  bob."reflection": In the eyes of my dog, I'm a man.
}
```

**Self-messages (自引用)**:

```d2
my_sequence: {
  shape: sequence_diagram

  son
  father

  son -> father: Can I borrow your car?
  father -> son: Never lend your car to anyone\nto whom you have given birth.
  son -> son: internal debate ensues
}
```

### 网格图 (Grid Diagrams)

```d2
my_grid: {
  grid-rows: 3
  grid-columns: 2

  a
  b
  c
  d
  e
  f
}
```

**关键属性**:

- `grid-rows`: 行数
- `grid-columns`: 列数
- `grid-gap`: 间距（同时设置水平和垂直）
- `horizontal-gap`: 水平间距
- `vertical-gap`: 垂直间距

**填充方向**:

- 先定义 `grid-rows` → 先填充行
- 先定义 `grid-columns` → 先填充列

**宽度和高度**:

```d2
my_grid: {
  grid-rows: 2
  grid-columns: 3

  a.width: 100
  a.height: 50
  b
  c
  d
  e
  f
}
```

**零间距创建紧密布局**:

```d2
table: {
  grid-rows: 3
  grid-columns: 3
  grid-gap: 0

  Element
  Atomic Number
  Atomic Mass

  Hydrogen
  1
  1.008

  Carbon
  6
  12.011
}
```

---

## 文本与代码

### Markdown文本

```d2
explanation: |md
  # I can do headers
  - lists
  - lists

  And other normal markdown stuff
|
```

### 代码块

```d2
my_code: |go
  awsSession := From(c.Request.Context())
  client := s3.New(awsSession)

  ctx, cancelFn := context.WithTimeout(c.Request.Context(), AWS_TIMEOUT)
  defer cancelFn()
|
```

**支持的语言**: 参见 [Chroma library](https://github.com/alecthomas/chroma) 完整列表

**常用别名**:

- `md` → `markdown`
- `tex` → `latex`
- `js` → `javascript`
- `go` → `golang`
- `py` → `python`
- `rb` → `ruby`
- `ts` → `typescript`

### LaTeX数学公式

```d2
formula: |tex
  \lim_{x \to \infty} \frac{1}{x} = 0
|
```

**LaTeX插件支持**:

- amscd
- braket
- cancel
- color
- gensymb
- mhchem
- physics
- multiline

**字体大小控制** (在LaTeX内部):

- `\tiny{ }`
- `\small{ }`
- `\normal{ }`
- `\large{ }`
- `\huge{ }`

### 纯文本 (非Markdown)

```d2
plain_text: {
  shape: text
  # 不会被解析为Markdown
}
```

### 图标和图片

```d2
# 图标
server: Server {
  icon: https://icons.terrastruct.com/aws/Compute/EC2.svg
}

# 独立图片
logo: {
  shape: image
  icon: https://example.com/logo.png
}

# 本地图片 (CLI)
local_img: {
  icon: ./my_image.png
}
```

**图标资源**: https://icons.terrastruct.com

---

## 注释

### 行注释

```d2
# 这是行注释
x -> y  # 行尾注释
```

### 块注释

```d2
"""
这是块注释
可以跨越多行
"""

x -> y
```

---

## 字符串处理

### 无引号字符串

D2尽量减少引号使用。大多数情况下不需要引号:

```d2
x: This is a label without quotes
x -> y: Connection label without quotes
```

**特点**:

- 自动去除首尾空格
- 不能包含特殊符号（语法高亮会提示）

### 引号字符串

当需要特殊字符时使用引号:

```d2
x: "String with: special -> characters"
x: 'Single quotes work too'

# 转义
x: "String with \"quotes\" inside"
```

### 块字符串

使用管道符定义多行字符串:

```d2
x: |
  Line 1
  Line 2
  Line 3
|
```

**多重管道**:
如果内容包含单个管道符，使用多个:

```d2
x: ||
  Content with | pipe symbol
||

x: |||
  Content with || double pipes
|||
```

**自定义分隔符**:
可以在管道后使用任意非字母数字符号:

```d2
x: |@
  Custom delimiter
@|
```

---

## 最佳实践

### 1. 命名规范

```d2
# ✅ 推荐：使用描述性名称
user_service
payment_gateway
authentication_module

# ❌ 避免：无意义的名称
x1
temp
thing
```

### 2. 组织结构

```d2
# ✅ 推荐：逻辑分组
frontend: {
  ui
  components
}

backend: {
  api
  database
}

frontend.ui -> backend.api

# ❌ 避免：平面结构混乱
ui
components
api
database
ui -> api
```

### 3. 样式一致性

```d2
# ✅ 推荐：定义样式变量或使用类
*.style.fill: lightblue
*.style.stroke: darkblue

# ❌ 避免：每个形状单独设置
a.style.fill: lightblue
b.style.fill: lightblue
c.style.fill: lightblue
```

### 4. 连接可读性

```d2
# ✅ 推荐：使用链式连接
user -> auth -> api -> database

# ⚠️ 可行但不够清晰
user -> auth
auth -> api
api -> database
```

### 5. 标签清晰度

```d2
# ✅ 推荐：简洁明确的标签
x -> y: Sends request

# ❌ 避免：过长或模糊的标签
x -> y: This is a very long label that describes every detail
```

### 6. 特殊字符处理

```d2
# ✅ 推荐：使用引号包裹特殊字符
"user-name": User Name
"type": Type  # SQL关键字需要引号

# ❌ 避免：直接使用可能导致解析错误
user-name: User Name  # 连字符可能有问题
```

### 7. 容器深度

```d2
# ✅ 推荐：适度嵌套（2-3层）
cloud.region.service

# ⚠️ 避免：过深嵌套
cloud.provider.region.zone.cluster.namespace.pod.container
```

### 8. 连接引用

```d2
# ✅ 推荐：引用形状的key
user -> database

# ❌ 错误：不能引用label
"User" -> "Database"  # 如果这些是labels，连接会失败
```

### 9. 颜色使用

```d2
# ✅ 推荐：使用命名颜色或十六进制
x.style.fill: blue
y.style.fill: #FF6B6B

# ✅ 也支持渐变
z.style.fill: linear-gradient(red, blue)
```

### 10. 注释实践

```d2
# ✅ 推荐：为复杂逻辑添加注释
# 用户认证流程
user -> auth: login
auth -> database: verify credentials

# 数据处理管道
api -> processor: raw data
processor -> storage: processed data
```

---

## 常见错误与解决方案

### 错误1: 连接引用label而非key

```d2
# ❌ 错误
a: User
b: Database
"User" -> "Database"  # 无法工作

# ✅ 正确
a: User
b: Database
a -> b
```

### 错误2: 忘记设置shape属性

```d2
# ❌ 错误：期望SQL表格，但未设置shape
my_table: {
  id: int
  name: varchar
}

# ✅ 正确
my_table: {
  shape: sql_table
  id: int {constraint: PK}
  name: varchar
}
```

### 错误3: 箭头标签位置错误

```d2
# ❌ 错误：没有终点箭头时，设置target-arrowhead无效
x -- y: {
  target-arrowhead.label: 1
}

# ✅ 正确：使用有箭头的连接
x -> y: {
  target-arrowhead.label: 1
}
```

### 错误4: 网格图顺序错误

```d2
# ❌ 容易混淆：先columns后rows
my_grid: {
  grid-columns: 3  # 第二定义
  grid-rows: 2     # 第一定义
  # 元素会先填充行（因为rows先定义）
}

# ✅ 推荐：保持一致的定义顺序
my_grid: {
  grid-rows: 2
  grid-columns: 3
  # 明确先填充行
}
```

### 错误5: 1:1形状比例问题

```d2
# ❌ 期望：宽的椭圆
circle: {
  shape: circle
  width: 200
  height: 100
}
# 实际：会变成200x200的圆（保持1:1）

# ✅ 正确：使用oval
oval_shape: {
  shape: oval
  width: 200
  height: 100
}
```

---

## 进阶特性

### 变量和替换

```d2
vars: {
  primary_color: blue
  db_icon: https://icons.terrastruct.com/aws/Database/RDS.svg
}

database: {
  style.fill: ${primary_color}
  icon: ${db_icon}
}
```

### Globs通配符

```d2
# 为所有形状设置默认样式
*.style.fill: lightgray
*.style.stroke: black

# 为所有连接设置样式
**.style.stroke-dash: 2
```

### 类 (Classes)

```d2
classes: {
  important: {
    style.fill: red
    style.bold: true
  }
}

critical_server: {
  class: important
}
```

### 图层 (Layers)

```d2
layers: {
  architecture: {
    frontend -> backend
  }

  details: {
    frontend.ui -> backend.api
  }
}
```

### 场景 (Scenarios)

```d2
scenarios: {
  normal_load: {
    server.style.fill: green
  }

  high_load: {
    server.style.fill: red
  }
}
```

### 尺寸控制

```d2
box: {
  width: 200
  height: 100
}

# 仅设置一个维度，另一个自动计算
circle: {
  shape: circle
  width: 100  # 高度也会是100（1:1比例）
}
```

### 位置控制

```d2
# near关键字定位图标和标签
icon_box: {
  icon: https://example.com/icon.svg
  icon.near: top-left
}
```

---

## 主题系统

D2内置多个专业主题:

```bash
# 使用主题
d2 --theme=cool-classics input.d2 output.svg
```

**可用主题**:

- `neutral-default` (默认)
- `cool-classics`
- `mixed-berry-blue`
- `grape-soda`
- `aubergine`
- `colorblind-clear`
- `vanilla-nitro-cola`
- `orange-creamsicle`
- `shirley-temple`
- `earth-tones`
- `flagship-terrastruct`
- `terminal`
- `terminal-grayscale`

### Sketch模式

手绘风格:

```bash
d2 --sketch input.d2 output.svg
```

---

## 布局引擎

D2支持多个布局引擎，适用于不同场景:

```bash
# DAGRE (默认) - 适合流程图
d2 --layout=dagre input.d2 output.svg

# ELK - 适合复杂层次结构
d2 --layout=elk input.d2 output.svg

# TALA - 商业引擎，更智能的布局
d2 --layout=tala input.d2 output.svg
```

---

## 输出格式

```bash
# SVG (默认)
d2 input.d2 output.svg

# PNG
d2 input.d2 output.png

# PDF
d2 input.d2 output.pdf
```

---

## 完整示例

### 示例1: 系统架构图

```d2
direction: right

users: Users {
  shape: person
  style.multiple: true
}

frontend: Frontend {
  style.fill: lightblue

  ui: UI Components
  router: Router
}

backend: Backend {
  style.fill: lightgreen

  api: REST API {
    shape: hexagon
  }

  auth: Auth Service {
    icon: https://icons.terrastruct.com/aws/Security%2C%20Identity%2C%20%26%20Compliance/AWS-IAM.svg
  }

  business: Business Logic
}

database: Database {
  shape: cylinder
  style.fill: orange
}

cache: Redis Cache {
  shape: cylinder
  style.stroke: red
}

users -> frontend.ui: browse
frontend.ui -> frontend.router
frontend.router -> backend.api: HTTP requests

backend.api -> backend.auth: authenticate
backend.api -> backend.business: process

backend.business -> database: read/write
backend.business -> cache: cache data

database -> cache: cache miss {
  style.stroke-dash: 3
}
```

### 示例2: ER图

```d2
users: {
  shape: sql_table

  id: int {constraint: primary_key}
  username: varchar(50) {constraint: unique}
  email: varchar(100) {constraint: unique}
  created_at: timestamp
}

posts: {
  shape: sql_table

  id: int {constraint: primary_key}
  user_id: int {constraint: foreign_key}
  title: varchar(200)
  content: text
  published_at: timestamp
}

comments: {
  shape: sql_table

  id: int {constraint: primary_key}
  post_id: int {constraint: foreign_key}
  user_id: int {constraint: foreign_key}
  text: text
  created_at: timestamp
}

posts.user_id -> users.id
comments.post_id -> posts.id
comments.user_id -> users.id
```

### 示例3: 时序图

```d2
login_sequence: {
  shape: sequence_diagram

  user: User
  frontend: Frontend
  backend: Backend API
  database: Database

  user -> frontend: Enter credentials
  frontend -> backend: POST /auth/login

  backend -> database: Query user
  database -> backend: User data

  backend -> backend: Verify password

  alt: {
    success: {
      backend -> frontend: JWT token
      frontend -> user: Login successful
    }

    failure: {
      backend -> frontend: 401 Unauthorized
      frontend -> user: Invalid credentials
    }
  }
}
```

---

## 总结

D2是一个功能强大的现代化图表脚本语言，具有以下优势:

✅ **简洁语法**: 减少语法噪音，提高可读性
✅ **类型丰富**: 支持流程图、ER图、类图、时序图、网格图等
✅ **高度可定制**: 完整的样式系统和主题支持
✅ **专业输出**: 多种布局引擎和输出格式
✅ **开发友好**: 支持本地CLI、在线playground、编辑器插件

D2特别适合:

- 软件架构图
- 数据库ER图
- 流程图和决策树
- 技术文档插图
- 团队协作图表

---

## 相关资源

- 官方文档: https://d2lang.com/tour/intro
- GitHub仓库: https://github.com/terrastruct/d2
- 在线Playground: https://play.d2lang.com
- 图标库: https://icons.terrastruct.com
- Discord社区: https://discord.com/invite/pbUXgvmTpU

---

**文档版本**: 2025-10-17
**基于**: D2官方文档 d2lang.com
**整理目的**: 用于DiagramAI项目的Prompt审查和优化
