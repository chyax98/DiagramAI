# Nomnoml 语法规则

> 更新时间: 2025-10-13

## 基本结构

### 节点定义

Nomnoml 使用方括号 `[]` 定义节点:

```nomnoml
[NodeName]                 // 基本节点
[<type> NodeName]          // 带类型的节点
[Name|attributes]          // 带属性的节点
[Name|attributes|methods]  // 完整结构
```

**规则**:

1. 节点名称必须用方括号包裹
2. 类型标记用尖括号 `<>` 包裹
3. 使用 `|` 分隔不同部分
4. 空格会被保留在节点名称中

### 关系定义

使用特定符号连接节点:

```nomnoml
[A] - [B]                  // 关联
[A] -> [B]                 // 单向关联
[A] <-> [B]                // 双向关联
```

**规则**:

1. 关系符号必须在节点之间
2. 符号两侧建议加空格(可选)
3. 支持链式连接: `[A] -> [B] -> [C]`

## 关系类型完整列表

### 基本关联

| 语法  | 说明     | 用途     |
| ----- | -------- | -------- |
| `-`   | 关联     | 普通关系 |
| `->`  | 单向关联 | A 知道 B |
| `<->` | 双向关联 | 相互知道 |

### 依赖关系

| 语法   | 说明     | 用途     |
| ------ | -------- | -------- |
| `-->`  | 依赖     | A 依赖 B |
| `<-->` | 双向依赖 | 相互依赖 |

### 泛化和实现

| 语法   | 说明     | 用途          |
| ------ | -------- | ------------- |
| `-:>`  | 泛化     | B 继承 A      |
| `<:-`  | 反向泛化 | A 继承 B      |
| `--:>` | 实现     | B 实现 A 接口 |
| `<:--` | 反向实现 | A 实现 B 接口 |

### 聚合和组合

| 语法  | 说明     | 用途       |
| ----- | -------- | ---------- |
| `+-`  | 组合     | 强拥有关系 |
| `+->` | 单向组合 | A 拥有 B   |
| `o-`  | 聚合     | 弱拥有关系 |
| `o->` | 单向聚合 | A 聚合 B   |

### 特殊关系

| 语法   | 说明     | 用途         |
| ------ | -------- | ------------ |
| `-o)`  | 球窝     | 特殊连接     |
| `o<-)` | 反向球窝 |              |
| `->o`  | 球窝箭头 |              |
| `--`   | 注释线   | 连接注释     |
| `-/-`  | 隐藏     | 不显示的关系 |

## 节点类型

### UML 类图类型

```nomnoml
[class]                    // 普通类(默认)
[<abstract>]               // 抽象类
[<instance>]               // 实例对象
[<reference>]              // 引用
```

**抽象类规则**:

- 类名通常用斜体显示
- 可包含抽象方法

**实例规则**:

- 表示类的具体实例
- 名称通常带下划线

### 包和框架

```nomnoml
[<package>]                // 包
[<frame>]                  // 框架
[<note>]                   // 注释
```

**包规则**:

- 可包含其他节点
- 用于组织相关类

**框架规则**:

- 表示系统边界
- 通常包含完整的子系统

### 组件图类型

```nomnoml
[Component]                // 组件
[<socket>]                 // 接口(插座)
[<lollipop>]               // 提供接口(棒棒糖)
```

**组件连接规则**:

```nomnoml
[Component] - [<socket>]   // 组件需要接口
[<lollipop>] - [Component] // 组件提供接口
```

### 流程图类型

```nomnoml
[<start>]                  // 开始(圆形)
[<end>]                    // 结束(圆形)
[<state>]                  // 状态(圆角矩形)
[<choice>]                 // 选择(菱形)
[<sync>]                   // 同步(黑条)
[<input>]                  // 输入(平行四边形)
```

**流程图规则**:

1. 单一开始节点
2. 可以有多个结束节点
3. 选择节点通常有多个出口

### 用例图类型

```nomnoml
[<actor>]                  // 参与者(火柴人)
[<usecase>]                // 用例(椭圆)
```

**用例图规则**:

- 参与者在系统边界外
- 用例在系统边界内
- 使用关联线连接

### 数据存储类型

```nomnoml
[<database>]               // 数据库(圆柱形)
[<pipe>]                   // 管道
[<table>]                  // 表格
```

**表格语法**:

```nomnoml
[<table> TableName|
  col1 | value1 |
  | col2 | value2 |
]
```

### 其他类型

```nomnoml
[<hidden>]                 // 隐藏节点
[<sender>]                 // 发送器
[<receiver>]               // 接收器
[<transceiver>]            // 收发器
```

## 节点内容结构

### 三段式结构

```nomnoml
[ClassName|
  attributes
  |
  methods
]
```

**规则**:

1. 第一段: 类名(必需)
2. 第二段: 属性(可选)
3. 第三段: 方法(可选)
4. 使用 `|` 分隔

### 属性格式

```nomnoml
[User|
  - id: int;
  - name: string;
  + email: string
]
```

**可见性符号**:

- `+`: public
- `-`: private
- `#`: protected
- `~`: package

**属性规则**:

- 格式: `[可见性] 名称: 类型`
- 多个属性用分号 `;` 或换行分隔
- 分号可选(推荐使用)

### 方法格式

```nomnoml
[User|
  |
  + getName(): string;
  + setName(name: string): void;
  - validateEmail(): boolean
]
```

**方法规则**:

- 格式: `[可见性] 名称(参数): 返回类型`
- 参数格式: `name: type`
- 多个参数用逗号 `,` 分隔

## 注释规则

### 单行注释

```nomnoml
// 这是注释
[A] -> [B]
```

**规则**:

1. 必须在行首(前面不能有其他字符)
2. `//` 后的所有内容都是注释
3. 不支持行尾注释

### 注释陷阱

```nomnoml
[A] -> [B]  // 错误:这不是注释!
            // 这会导致语法错误

// 正确:注释在行首
[A] -> [B]
```

## ID 属性

### 基本用法

```nomnoml
[<id=node1> User]
[<id=node2> User]
[node1] -> [node2]
```

**规则**:

1. ID 必须唯一
2. 格式: `<id=identifier>`
3. 可与类型同时使用: `<class,id=user1>`

### 复合类型

```nomnoml
[<abstract,id=base> BaseClass]
[<id=impl1> ConcreteA]
[<id=impl2> ConcreteA]

[impl1] -:> [base]
[impl2] -:> [base]
```

## 指令系统

### 全局指令

```nomnoml
#directive: value
```

**布局指令**:

```nomnoml
#direction: down           // 方向: down | right
#gravity: 1                // 重力强度
#gutter: 5                 // 节点间距
#edgeMargin: 0             // 边缘边距
#spacing: 40               // 元素间距
```

**外观指令**:

```nomnoml
#background: transparent   // 背景色
#fill: #eee8d5; #fdf6e3    // 填充色(交替)
#stroke: #33322E           // 描边色
#font: Calibri             // 字体
#fontSize: 12              // 字体大小
#leading: 1.35             // 行高
#lineWidth: 3              // 线宽
#padding: 8                // 内边距
```

**箭头指令**:

```nomnoml
#arrowSize: 1              // 箭头大小
#fillArrows: false         // 填充箭头
#edges: hard               // 边缘样式: hard | rounded
#bendSize: 0.3             // 弯曲程度
```

**算法指令**:

```nomnoml
#acyclicer: greedy         // 无环算法: greedy
#ranker: network-simplex   // 排序算法
```

**其他指令**:

```nomnoml
#import: filename          // 导入文件
#title: diagram_name       // 标题
#zoom: 1                   // 缩放级别
```

### 样式类定义

使用 `.` 定义自定义样式:

```nomnoml
#.styleName: property1 property2 key=value
```

**示例**:

```nomnoml
#.primary: fill=#2196F3 bold
#.secondary: fill=#4CAF50 stroke=#388E3C
#.danger: fill=#F44336 dashed

[<primary> Login]
[<secondary> Success]
[<danger> Error]
```

**样式属性**:

**颜色属性**:

- `fill=<color>`: 填充色
- `stroke=<color>`: 描边色

**修饰符**:

- `dashed`: 虚线边框
- `empty`: 无填充

**对齐**:

- `align=center`: 居中
- `align=left`: 左对齐

**方向**:

- `direction=right`: 内容向右
- `direction=down`: 内容向下

**视觉样式**:

- `visual=<type>`: 改变节点形状

**文本样式**:

- `title=<modifiers>`: 标题样式
- `body=<modifiers>`: 正文样式

**文本修饰符**:

- `bold`: 粗体
- `italic`: 斜体
- `underline`: 下划线
- `center`: 居中
- `left`: 左对齐

## 导入规则

### 基本导入

```nomnoml
#import: filename.nomnoml
```

**规则**:

1. 文件名可以包含路径
2. 扩展名可选
3. 支持相对路径

### 导入顺序

```nomnoml
#import: styles.nomnoml    // 先导入样式
#import: components.nomnoml

// 主图内容
[App] -> [Component]
```

**最佳实践**:

1. 样式文件优先导入
2. 组件定义其次
3. 主图逻辑最后

### 导入作用域

```nomnoml
// styles.nomnoml
#.box: fill=#f0f0f0
#fontSize: 14

// main.nomnoml
#import: styles.nomnoml
// 所有样式和指令都已加载
[<box> StyledBox]
```

## 表格语法

### 基本表格

```nomnoml
[<table> TableName|
  header1 | header2 |
  | data1 | data2 |
]
```

**规则**:

1. 使用 `|` 分隔列
2. 使用 `||` 分隔行
3. 第一列前的 `|` 可选

### 复杂表格

```nomnoml
[<table> Metrics|
  Metric | Value | Unit |
  | CPU | 45 | % |
  | Memory | 2.3 | GB |
  | Disk | 500 | GB |
]
```

## 语法约束

### 强制规则

1. **节点定义**:
   - 必须用 `[]` 包裹
   - 类型标记必须在 `<>` 内
   - 不能有未闭合的括号

2. **关系定义**:
   - 必须连接两个节点
   - 箭头符号不能单独存在

3. **注释**:
   - 必须在行首
   - `//` 前不能有其他字符

4. **指令**:
   - 必须以 `#` 开头
   - 格式: `#key: value`

### 推荐规则

1. **命名规范**:
   - 类名用 PascalCase
   - 属性用 camelCase
   - ID 用 kebab-case

2. **格式化**:
   - 每个关系一行
   - 指令放在文件开头
   - 相关节点靠近放置

3. **可读性**:
   - 添加空行分隔逻辑块
   - 使用注释说明复杂部分
   - 保持缩进一致(虽然不是必需)

## 布局算法

### Direction 指令

```nomnoml
#direction: down           // 垂直布局(默认)
#direction: right          // 水平布局
```

**影响**:

- `down`: 节点从上到下排列
- `right`: 节点从左到右排列

### Ranker 算法

```nomnoml
#ranker: network-simplex   // 网络单纯形(默认)
#ranker: tight-tree        // 紧凑树
#ranker: longest-path      // 最长路径
```

**选择指南**:

- `network-simplex`: 通用,效果好
- `tight-tree`: 更紧凑的布局
- `longest-path`: 强调层次结构

### Acyclicer 算法

```nomnoml
#acyclicer: greedy         // 贪心算法(默认)
```

**作用**: 处理循环引用

## 特殊字符处理

### 转义规则

Nomnoml 不需要特殊的转义,大部分字符可直接使用:

```nomnoml
[Class<T>]                 // 泛型
[name@domain.com]          // 邮箱
[price: $99.99]            // 特殊符号
```

### 保留字符

需要注意的字符:

- `[` `]`: 节点定义
- `|`: 分隔符
- `<` `>`: 类型标记
- `-` `+` `o`: 关系符号的一部分

### 多行文本

```nomnoml
[ClassName|
  long
  attribute
  name
]
```

**规则**: 直接换行即可,不需要特殊标记

## 颜色规范

### 颜色格式

支持的颜色格式:

```nomnoml
#fill: red                 // 颜色名
#fill: #ff0000             // 十六进制
#fill: rgb(255,0,0)        // RGB
#fill: rgba(255,0,0,0.5)   // RGBA
```

### 多颜色填充

```nomnoml
#fill: #eee8d5; #fdf6e3    // 两种颜色交替
```

**规则**:

- 用分号 `;` 分隔
- 奇数节点用第一种颜色
- 偶数节点用第二种颜色

## 最佳实践

### 1. 文件组织

```nomnoml
// config.nomnoml
#fontSize: 12
#direction: down

// styles.nomnoml
#import: config.nomnoml
#.primary: fill=#2196F3

// main.nomnoml
#import: styles.nomnoml
[<primary> App]
```

### 2. 命名约定

```nomnoml
// 类名: PascalCase
[UserService]

// 实例: camelCase
[<instance> userService]

// ID: kebab-case
[<id=user-service> UserService]
```

### 3. 结构化

```nomnoml
// 指令区
#direction: down
#fontSize: 14

// 样式定义
#.controller: fill=#e3f2fd

// 节点定义
[<controller> UserController]
[UserService]

// 关系定义
[UserController] -> [UserService]
```

### 4. 注释规范

```nomnoml
// ==============================
// User Management System
// ==============================

// Controllers
[UserController]

// Services
[UserService]

// Relationships
[UserController] -> [UserService]
```

## 验证检查清单

### 语法检查

- [ ] 所有 `[` 都有对应的 `]`
- [ ] 所有 `<` 都有对应的 `>`
- [ ] 关系符号两端都有节点
- [ ] 注释都在行首
- [ ] 指令格式正确(`#key: value`)

### 语义检查

- [ ] ID 都是唯一的
- [ ] 引用的节点都已定义
- [ ] 样式类都已声明
- [ ] 导入的文件存在

### 样式检查

- [ ] 颜色值有效
- [ ] 字体名称正确
- [ ] 数值在合理范围内
- [ ] 布局算法存在

## 错误处理

### 常见错误

1. **未闭合括号**:

   ```nomnoml
   [Node    // 错误
   ```

2. **无效关系**:

   ```nomnoml
   ->       // 错误: 缺少节点
   ```

3. **错误的注释**:
   ```nomnoml
   [A] // comment  // 错误: 注释不在行首
   ```

### 调试技巧

1. 检查括号配对
2. 逐行注释排查
3. 使用在线编辑器实时验证
4. 分离指令和内容测试

## 参考资源

- [Nomnoml 官网](https://www.nomnoml.com)
- [GitHub 仓库](https://github.com/skanaar/nomnoml)
- [在线编辑器](https://www.nomnoml.com) (首页即编辑器)
