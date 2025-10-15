# Nomnoml 官方文档

> 收集时间: 2025-10-13
> 来源: https://www.nomnoml.com/, https://github.com/skanaar/nomnoml

## 概述

Nomnoml 是一个基于简洁文本语法绘制 UML 图表的工具。它的设计理念是让语法尽可能接近最终生成的 UML 图,而不使用 ASCII 艺术。

**特点**:

- 简洁直观的语法
- 实时在线编辑器
- SVG 输出
- 多种 UML 图表支持
- 自定义样式系统

## 基本语法

### 关联类型 (Association Types)

定义节点之间的关系:

| 语法         | 类型            | 说明         |
| ------------ | --------------- | ------------ |
| `[A]-[B]`    | association     | 关联         |
| `[A]->[B]`   | association     | 关联(带方向) |
| `[A]<->[B]`  | association     | 双向关联     |
| `[A]-->[B]`  | dependency      | 依赖         |
| `[A]<-->[B]` | dependency      | 双向依赖     |
| `[A]-:>[B]`  | generalization  | 泛化(继承)   |
| `[A]<:-[B]`  | generalization  | 反向泛化     |
| `[A]--:>[B]` | implementation  | 实现         |
| `[A]<:--[B]` | implementation  | 反向实现     |
| `[A]+-[B]`   | composition     | 组合         |
| `[A]+->[B]`  | composition     | 组合(带方向) |
| `[A]o-[B]`   | aggregation     | 聚合         |
| `[A]o->[B]`  | aggregation     | 聚合(带方向) |
| `[A]-o)[B]`  | ball and socket | 球窝关联     |
| `[A]o<-)[B]` | ball and socket | 反向球窝     |
| `[A]->o[B]`  | ball and socket | 球窝箭头     |
| `[A]--[B]`   | note            | 注释线       |
| `[A]-/-[B]`  | hidden          | 隐藏关联     |

### 分类器类型 (Classifier Types)

#### 基本类型

```nomnoml
[class]                    // 普通类
[<abstract>]               // 抽象类
[<instance>]               // 实例
[<reference>]              // 引用
[<note>]                   // 注释
[<package>]                // 包
[<frame>]                  // 框架
```

#### UML 类图类型

```nomnoml
[<class> ClassName]        // 类
[<abstract> AbstractClass] // 抽象类
[<instance> object]        // 对象实例
```

#### 组件图类型

```nomnoml
[Component] - [<socket>]   // 组件和接口
[<lollipop>] - [Component] // 棒棒糖接口
```

#### 流程图类型

```nomnoml
[<start>]                  // 开始
[<end>]                    // 结束
[<state>]                  // 状态
[<choice>]                 // 选择
[<sync>]                   // 同步
[<input>]                  // 输入
[<sender>]                 // 发送者
[<receiver>]               // 接收者
[<transceiver>]            // 收发器
```

#### 用例图类型

```nomnoml
[<actor>]                  // 参与者
[<usecase>]                // 用例
```

#### 其他类型

```nomnoml
[<database>]               // 数据库
[<pipe>]                   // 管道
[<table> | a | 5 || b | 7] // 表格
[<hidden>]                 // 隐藏节点
```

## 高级特性

### 1. 类的属性和方法

使用 `|` 分隔类名、属性和方法:

```nomnoml
[<class> Customer|
  id: int;
  name: string
  |
  + getName(): string;
  + setName(name: string): void
]
```

**格式**:

```
[<type> ClassName|
  attributes
  |
  methods
]
```

### 2. 注释 (Comments)

注释必须在行首:

```nomnoml
// 这是注释
[A] -> [B]

[C] // 这不是注释,会被解析
```

### 3. ID 属性

相同名称的节点可通过 ID 区分:

```nomnoml
[<id=user1> User]
[<id=user2> User]
[user1] -- [user2]
```

**应用场景**:

- 多个同名类的不同实例
- 避免节点混淆
- 复杂图表中的精确引用

### 4. 指令 (Directives)

使用 `#` 开头的指令控制图表样式:

#### 基本指令

```nomnoml
#import: filename          // 导入其他文件
#arrowSize: 1              // 箭头大小
#bendSize: 0.3             // 弯曲程度
#direction: down | right   // 布局方向
#gutter: 5                 // 节点间距
#edgeMargin: 0             // 边缘边距
#gravity: 1                // 重力强度
#edges: hard | rounded     // 边缘样式
#background: transparent   // 背景色
#fill: #eee8d5; #fdf6e3    // 填充色
#fillArrows: false         // 填充箭头
#font: Calibri             // 字体
#fontSize: 12              // 字体大小
#leading: 1.35             // 行高
#lineWidth: 3              // 线宽
#padding: 8                // 内边距
#spacing: 40               // 间距
#stroke: #33322E           // 描边色
#title: filename           // 标题
#zoom: 1                   // 缩放
#acyclicer: greedy         // 无环算法
#ranker: network-simplex   // 排序算法
```

#### Ranker 选项

```nomnoml
#ranker: network-simplex   // 网络单纯形(默认)
#ranker: tight-tree        // 紧凑树
#ranker: longest-path      // 最长路径
```

### 5. 自定义样式

使用 `.` 开头定义分类器样式:

```nomnoml
#.box: fill=#8f8 dashed
#.blob: visual=ellipse title=bold

[<box> GreenBox]
[<blob> Blobby]
```

#### 样式修饰符

```nomnoml
dashed                     // 虚线
empty                      // 空白
```

#### 样式属性

**颜色**:

```nomnoml
fill=(any css color)       // 填充色
stroke=(any css color)     // 描边色
```

**对齐**:

```nomnoml
align=center               // 居中对齐
align=left                 // 左对齐
```

**方向**:

```nomnoml
direction=right            // 右侧布局
direction=down             // 下方布局
```

**可视化类型**:

```nomnoml
visual=actor               // 参与者
visual=class               // 类
visual=database            // 数据库
visual=ellipse             // 椭圆
visual=end                 // 结束
visual=frame               // 框架
visual=hidden              // 隐藏
visual=input               // 输入
visual=none                // 无
visual=note                // 注释
visual=package             // 包
visual=pipe                // 管道
visual=receiver            // 接收器
visual=rhomb               // 菱形
visual=roundrect           // 圆角矩形
visual=sender              // 发送器
visual=start               // 开始
visual=sync                // 同步
visual=table               // 表格
visual=transceiver         // 收发器
```

**文本样式**:

```nomnoml
title=left,italic,bold     // 标题样式
body=center,italic,bold    // 正文样式
```

**文本修饰符**:

- `bold`: 粗体
- `center`: 居中
- `italic`: 斜体
- `left`: 左对齐
- `underline`: 下划线

## 实用示例

### 1. 类图

```nomnoml
#stroke: #a86128
[<frame>Decorator pattern|
  [<abstract>Component||+ operation()]
  [Client] depends --> [Component]
  [Decorator|- next: Component]
  [Decorator] decorates -- [ConcreteComponent]
  [Component] <:- [Decorator]
  [Component] <:- [ConcreteComponent]
]
```

### 2. 用例图

```nomnoml
[<actor> User]
[<usecase> Login]
[<usecase> Register]
[<usecase> Update Profile]

[User] --> [Login]
[User] --> [Register]
[Login] --> [Update Profile]
```

### 3. 流程图

```nomnoml
#direction: down
[<start> Start]
[<state> Process Data]
[<choice> Valid?]
[<state> Save]
[<end> End]

[Start] -> [Process Data]
[Process Data] -> [Valid?]
[Valid?] yes -> [Save]
[Valid?] no -> [Process Data]
[Save] -> [End]
```

### 4. 组件图

```nomnoml
[Web App] -> [API Gateway]
[API Gateway] --> [Auth Service]
[API Gateway] --> [User Service]
[User Service] --> [<database> Users DB]
```

### 5. 序列图(时序图)

```nomnoml
#direction: right
[Client] -> [Server]: request
[Server] -> [Database]: query
[Database] -> [Server]: result
[Server] -> [Client]: response
```

### 6. 状态图

```nomnoml
[<start>] -> [Idle]
[Idle] -> [Processing]
[Processing] -> [Success]
[Processing] -> [Error]
[Success] -> [<end>]
[Error] -> [Idle]
```

### 7. 数据库 ER 图

```nomnoml
[<table> Users|
  id: int;
  name: string;
  email: string
]

[<table> Orders|
  id: int;
  user_id: int;
  total: decimal
]

[Users] 1 -- 0..* [Orders]
```

### 8. 系统架构图

```nomnoml
#direction: down
[<frame> System Architecture|
  [<package> Frontend|
    [Web UI]
    [Mobile App]
  ]

  [<package> Backend|
    [API Layer]
    [Business Logic]
    [Data Access]
  ]

  [<package> Infrastructure|
    [<database> Database]
    [Cache]
    [Queue]
  ]

  [Frontend] --> [Backend]
  [Backend] --> [Infrastructure]
]
```

## 实用技巧

### 1. 文件导入

将复杂图表拆分为多个文件:

**main.nomnoml**:

```nomnoml
#import: styles.nomnoml
#import: components.nomnoml

[App] -> [Components]
```

**styles.nomnoml**:

```nomnoml
#.component: fill=#e3f2fd
```

**components.nomnoml**:

```nomnoml
[<component> Header]
[<component> Footer]
```

### 2. 使用表格

```nomnoml
[<table> Metrics|
  CPU | 45% |
  | Memory | 2.3GB |
  | Disk | 87% |
]
```

**格式**: 使用 `|` 分隔列,`||` 分隔行

### 3. 布局优化

**垂直布局**:

```nomnoml
#direction: down
[A] -> [B] -> [C]
```

**水平布局**:

```nomnoml
#direction: right
[A] -> [B] -> [C]
```

**紧凑布局**:

```nomnoml
#fontSize: 8
#spacing: 12
#padding: 3
[A] -> [B]
```

### 4. 颜色主题

**浅色主题**:

```nomnoml
#fill: #eee8d5; #fdf6e3
#stroke: #33322E
```

**深色主题**:

```nomnoml
#fill: #2d2d2d; #3d3d3d
#stroke: #ffffff
#background: #1e1e1e
```

**自定义配色**:

```nomnoml
#.primary: fill=#2196F3 stroke=#1976D2
#.secondary: fill=#4CAF50 stroke=#388E3C
#.danger: fill=#F44336 stroke=#D32F2F

[<primary> Login]
[<secondary> Success]
[<danger> Error]
```

## 集成使用

### Web 集成

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://unpkg.com/graphre/dist/graphre.js"></script>
    <script src="https://unpkg.com/nomnoml/dist/nomnoml.js"></script>
  </head>
  <body>
    <canvas id="canvas"></canvas>
    <script>
      var source = "[A] -> [B]";
      var canvas = document.getElementById("canvas");
      nomnoml.draw(canvas, source);
    </script>
  </body>
</html>
```

### Node.js 使用

```javascript
const nomnoml = require("nomnoml");

const source = `
  [<frame>Decorator pattern|
    [<abstract>Component||+ operation()]
    [Client] depends --> [Component]
  ]
`;

// 渲染 SVG
const svg = nomnoml.renderSvg(source);
console.log(svg);

// 带数据属性的 SVG
// 节点名称会附加到 data-name 属性
```

### 命令行使用

```bash
# 安装
npm install -g nomnoml

# 渲染文件
nomnoml input.nomnoml output.svg

# 使用 import 指令
nomnoml main.nomnoml output.svg
```

### TypeScript 集成

```typescript
import nomnoml from "nomnoml";

interface DiagramSource {
  source: string;
}

function renderDiagram({ source }: DiagramSource): string {
  return nomnoml.renderSvg(source);
}
```

## 常见模式

### 1. MVC 模式

```nomnoml
[Model|data: any|getData();setData()]
[View|template: string|render()]
[Controller|model: Model;view: View|update()]

[Controller] -> [Model]
[Controller] -> [View]
[View] ..> [Model]
```

### 2. 微服务架构

```nomnoml
#direction: down
[API Gateway]
[Service A]
[Service B]
[<database> DB A]
[<database> DB B]

[Client] --> [API Gateway]
[API Gateway] --> [Service A]
[API Gateway] --> [Service B]
[Service A] --> [DB A]
[Service B] --> [DB B]
```

### 3. 观察者模式

```nomnoml
[Subject|observers: List|attach();detach();notify()]
[Observer||update()]
[ConcreteObserver|state|update()]

[Subject] o-> 0..* [Observer]
[Observer] <:- [ConcreteObserver]
```

## 最佳实践

### 1. 命名规范

- 类名使用 PascalCase: `[UserService]`
- 接口名使用 I 前缀: `[IUserRepository]`
- 抽象类使用 Abstract 前缀: `[<abstract>AbstractController]`

### 2. 布局建议

- 简单图表用 `direction: down`
- 时序图用 `direction: right`
- 复杂图表拆分为多个子图

### 3. 样式一致性

- 定义全局样式指令
- 使用自定义样式类
- 保持配色协调

### 4. 可维护性

- 使用 `#import` 拆分大文件
- 添加注释说明
- 使用有意义的节点名称

## 官方资源

- **官网**: https://www.nomnoml.com
- **GitHub**: https://github.com/skanaar/nomnoml
- **NPM**: https://www.npmjs.com/package/nomnoml
- **在线编辑器**: https://www.nomnoml.com (首页即编辑器)

## 许可证

MIT License - 可商用、可修改、可分发

## 相关工具

- **PlantUML**: 更强大的 UML 工具
- **Mermaid**: 支持更多图表类型
- **GraphViz**: 底层图形库
- **D2**: 现代化的图表语言
