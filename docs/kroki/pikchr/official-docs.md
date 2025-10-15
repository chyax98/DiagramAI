# Pikchr 官方文档

## 项目概述

**Pikchr** (发音: "picture") 是一个受 PIC 启发的标记语言，专为技术文档中的线图设计。它由 SQLite 和 Fossil 的作者 D. Richard Hipp 开发。

- **官方网站**: https://pikchr.org
- **开发者**: D. Richard Hipp (SQLite 作者)
- **设计目标**: 嵌入 Markdown 的代码块中
- **输出格式**: SVG
- **核心特性**: 零依赖、单文件实现、易于集成

## 核心特性

### 1. 简洁设计

- 单遍解析器，简单直观
- 受 Kernighan 的 PIC 语言启发
- 相对定位，避免硬编码坐标

### 2. Markdown 集成

设计为嵌入 Markdown 的 fenced code blocks:

````markdown
```pikchr
box "Hello" "World"
arrow
circle "Done"
```
````

### 3. 零依赖

- 纯 C 实现，单个源文件
- 不依赖外部库
- 直接生成 SVG
- 易于集成到其他系统

### 4. 相对布局

- 自动对象堆叠
- 相对位置引用
- 动态尺寸计算
- 避免绝对坐标

## 基本语法

### 对象类型

Pikchr 支持以下图形对象:

```pikchr
box        # 矩形
circle     # 圆形
ellipse    # 椭圆
oval       # 椭圆形 (短边有半圆帽)
cylinder   # 圆柱体
file       # 文件图标 (带折角)
diamond    # 菱形
line       # 直线
arrow      # 箭头
spline     # 曲线
dot        # 点
arc        # 弧线
text       # 纯文本
move       # 不可见移动
```

### 简单示例

```pikchr
# 最简单的图表
line
box "Hello," "World!"
arrow
```

### 布局方向

默认方向是从左到右 (`right`)，可以改变:

```pikchr
down    # 向下
box "A"
move
box "B"
move
box "C"
```

支持的方向: `right`, `down`, `left`, `up`

## 对象属性

### 尺寸属性

```pikchr
box width 2cm height 1cm
circle diameter 1.5cm
ellipse wid 3cm ht 1.5cm
```

**支持的单位**:

- `in` - 英寸 (默认)
- `cm` - 厘米
- `mm` - 毫米
- `px` - 像素
- `pt` - 点
- `pc` - pica

### 位置属性

```pikchr
box at 1cm, 2cm
circle with .center at 3cm, 1cm
oval with .w at 2cm right of last box
```

### 颜色属性

```pikchr
box fill lightblue color navy
line color red thickness 0.05
```

**颜色格式**:

- 颜色名: `red`, `lightblue`, `AliceBlue`
- 十六进制: `0xFF0000` (注意是整数格式)
- 负数或 "None"/"Off": 透明

### 线条样式

```pikchr
line dashed
arrow dotted
box thick
circle thin
oval invisible
```

## 锚点系统

每个块对象有 9 个锚点:

```
.nw  .n  .ne
.w   .c  .e
.sw  .s  .se
```

另外还有:

- `.start` 和 `.end` - 根据布局方向变化
- `.t`, `.top` - 等同于 `.n`
- `.bot`, `.bottom` - 等同于 `.s`
- `.left` - 等同于 `.w`
- `.right` - 等同于 `.e`

## 对象引用

### 相对引用

```pikchr
box "A"
circle "B" at 1cm right of previous
oval "C" at 2cm below last box
```

关键词:

- `previous` / `last` - 上一个对象
- `first` / `1st` - 第一个对象
- `2nd`, `3rd`, `4th` ... - 序数引用

### 标签引用

```pikchr
B1: box "Box 1"
C1: circle "Circle 1" at 1cm right of B1
arrow from B1.e to C1.w
```

标签规则:

- 以大写字母开头
- 后跟字母、数字或下划线
- 以冒号结尾

### 类型引用

```pikchr
box "A"
circle "B"
box "C"

arrow from 1st box to 2nd box
arrow from last circle to last box
```

## 路径定义

### 线条路径

```pikchr
arrow from B1.s \\
  down 1cm \\
  then right until even with C1 \\
  then to C1.s
```

**路径命令**:

- `from` _位置_ - 起点
- `to` _位置_ - 终点
- `then to` _位置_ - 中间点
- `go` _方向_ _距离_ - 相对移动
- `heading` _角度_ - 指定方向 (0°=东, 90°=北)
- `until even with` _对象_ - 延伸到对齐

### 闭合路径

```pikchr
line go 3cm heading 150 \\
  then 3cm west \\
  close \\
  fill lightgreen color darkgreen
```

`close` 关键字将路径转换为多边形。

## 文本注释

### 基本文本

```pikchr
box "Single line"
box "Line 1" "Line 2" "Line 3"
arrow "Label" above
```

### 文本属性

**位置**:

- `above` - 上方
- `below` - 下方
- `ljust` - 左对齐
- `rjust` - 右对齐
- `center` - 居中 (默认)

**样式**:

- `bold` - 粗体
- `italic` - 斜体
- `mono` / `monospace` - 等宽字体
- `big` - 大字体
- `small` - 小字体
- `aligned` - 与线条对齐 (仅线条)

### 示例

```pikchr
box "Bold text" bold "Italic text" italic
arrow "Above label" above "Below label" below
```

## 容器 (Subdiagrams)

使用 `[]` 创建子图:

```pikchr
[
  box "A"
  arrow
  circle "B"
] with .w at 2cm, 1cm

arrow from previous.e
box "C"
```

容器特性:

- 独立坐标系统 (原点在 0,0)
- 可作为整体定位
- 支持嵌套

## 宏定义

```pikchr
define component {
  [
    box wid 150% ht 75%
    text "$1" at last box.c
  ]
}

component("Database")
move
component("API Server")
```

## 变量与表达式

### 变量赋值

```pikchr
boxwid = 2cm
boxht = 1cm
thickness = 0.05

box width boxwid height boxht
```

### 表达式

```pikchr
box width 2*boxwid height boxht/2
circle radius sqrt(2)*0.5cm
```

**支持的函数**:

- `abs(x)` - 绝对值
- `cos(x)` - 余弦 (弧度)
- `sin(x)` - 正弦 (弧度)
- `sqrt(x)` - 平方根
- `int(x)` - 取整
- `max(x,y)` - 最大值
- `min(x,y)` - 最小值
- `dist(p1,p2)` - 两点距离

### 位置算术

```pikchr
circle at (B1.x + 2cm, B1.y - 1cm)
oval at 0.5<B1,C1>  # B1 和 C1 的中点
```

## 高级特性

### fit 属性

自动调整尺寸以适应文本:

```pikchr
box "Auto-fit text" fit
box "Wider margin" fit width 125%
```

### same 属性

复制前一个对象的属性:

```pikchr
box fill lightblue
circle same  # 相同的填充色
oval same    # 相同的填充色
```

### chop 属性

修剪线条以避免穿透对象:

```pikchr
arrow from B1 to C1 chop
```

### behind 属性

将对象放置在其他对象后面:

```pikchr
circle at B1 behind B1
```

## Pikchr 与 PIC 的区别

### 增强功能

1. **单位支持**: Pikchr 支持 cm, mm, px 等，PIC 只支持英寸
2. **fit 属性**: 自动尺寸调整
3. **until even with**: 简化对齐语法
4. **improved text**: 更好的文本处理
5. **color names**: 支持颜色名称

### 简化功能

1. **无 .PS/.PE**: 不需要包装标记
2. **单遍解析**: 简化的语法
3. **零依赖**: 不需要 troff

### 完整对比

参见官方文档: https://pikchr.org/home/doc/trunk/doc/differences.md

## 在 Markdown 中使用

### Fenced Code Blocks

````markdown
```pikchr
box "Hello"
arrow
circle "World"
```
````

### Fossil Wiki

```
<verbatim type="pikchr">
box "Hello"
arrow
circle "World"
</verbatim>
```

### 额外参数

````markdown
```pikchr center
box "Centered diagram"
```

```pikchr toggle
# 可点击切换显示源码
```
````

## 集成指南

### C/C++ 集成

```c
#include "pikchr.h"

char *svg = pikchr(
  "box; arrow; circle",
  "pikchr",      // class name
  0,             // mFlags
  NULL,          // pnWidth
  NULL           // pnHeight
);

printf("%s", svg);
pikchr_free(svg);
```

### Python 集成

```python
import ctypes

lib = ctypes.CDLL('./pikchr.so')
lib.pikchr.restype = ctypes.c_char_p

svg = lib.pikchr(b"box; arrow; circle", None, 0, None, None)
print(svg.decode('utf-8'))
```

### Web 集成

```javascript
// 使用 Pikchr WASM
import pikchr from "pikchr-wasm";

const svg = pikchr("box; arrow; circle");
document.body.innerHTML = svg;
```

## 命令行工具

Pikchr 主要设计为库，但可以作为命令行工具:

```bash
# 从文件读取
pikchr < diagram.pikchr > output.svg

# 从字符串
echo "box; arrow; circle" | pikchr > output.svg
```

## 最佳实践

### 1. 使用相对定位

```pikchr
# ✓ 好
B1: box
C1: circle at 1cm right of B1

# ✗ 差
box at 0,0
circle at 3,0
```

### 2. 使用标签

```pikchr
# ✓ 好
DB: cylinder "Database"
API: box "API" at 2cm right of DB
arrow from DB to API

# ✗ 差
cylinder "Database"
box "API" at 2cm right of previous
arrow from 1st cylinder to 1st box
```

### 3. 利用 fit

```pikchr
# ✓ 好
box "Long text that needs space" fit width 120%

# ✗ 差
box "Long text that needs space" width 5cm
```

### 4. 组织复杂图表

```pikchr
# 使用容器
Database: [
  cylinder "Users"
  move
  cylinder "Orders"
]

API: [
  box "Auth"
  move
  box "Business Logic"
] at 3cm right of Database
```

## 实用示例

### 流程图

```pikchr
Start: oval "Start" fit
arrow
Process: box "Process Data" fit
arrow
Decision: diamond "Valid?" fit
arrow from Decision.s "No" ljust
Error: box "Error" fit
arrow from Decision.e "Yes" above
Success: oval "Success" fit
arrow from Error.s then to Success.s
```

### 架构图

```pikchr
Client: box "Client" fit
arrow <->
LB: box "Load Balancer" fit
arrow <-> "HTTPS" above
Server: box "Server" ht 150% fit
arrow <-> from Server.s
DB: cylinder "Database" fit
```

### 时序图

```pikchr
A: box "Alice" fit
B: box "Bob" at 3cm right of A fit

arrow from A.s down 0.5 then right until even with B then to B.s "Request" above
arrow from B.s down 0.5 then left until even with A then down 0.2 "Response" above
```

## 参考资源

### 官方文档

- **主页**: https://pikchr.org
- **用户手册**: https://pikchr.org/home/doc/trunk/doc/userman.md
- **语法规范**: https://pikchr.org/home/doc/trunk/doc/grammar.md
- **Fossil 集成**: https://fossil-scm.org/home/doc/tip/www/pikchr.md

### 学习资源

- **Kernighan PIC**: https://pikchr.org/home/uv/pic.pdf
- **DPIC 文档**: https://pikchr.org/home/uv/dpic-doc.pdf
- **示例库**: https://pikchr.org/home/pikchrshow
- **SQLite 语法图**: https://pikchr.org/home/doc/trunk/doc/sqlitesyntax.md

### 相关项目

- **Fossil SCM**: https://fossil-scm.org (原生支持)
- **SQLite**: https://sqlite.org (用于语法图)
- **Kroki**: https://kroki.io (多图表工具集成)

## 社区与支持

- **Fossil 论坛**: https://fossil-scm.org/forum
- **GitHub 镜像**: https://github.com/drhsqlite/pikchr
- **邮件列表**: fossil-users@lists.fossil-scm.org
