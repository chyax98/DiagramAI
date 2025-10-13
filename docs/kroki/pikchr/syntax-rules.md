# Pikchr 语法规则

## 文件结构

Pikchr 脚本是一系列语句的序列，语句之间用**换行符**或**分号**分隔。

```pikchr
statement1
statement2; statement3
statement4
```

## 1. 注释

### 单行注释

```pikchr
# TCL 风格注释
// C++ 风格注释
```

### 块注释

```pikchr
/* C 风格块注释
   可以跨多行
*/
```

### 注意事项

- 注释中的换行符不会终止语句
- 块注释可以嵌套 (与标准 C 不同)

## 2. 语句类型

### 2.1 对象定义语句

```pikchr
对象类型 属性1 属性2 ...
```

**对象类型**:
- `box` - 矩形
- `circle` - 圆形
- `ellipse` - 椭圆
- `oval` - 椭圆 (端帽为半圆)
- `cylinder` - 圆柱体
- `file` - 文件 (右上角折叠)
- `diamond` - 菱形
- `line` - 直线
- `arrow` - 箭头
- `spline` - 平滑曲线
- `dot` - 点
- `arc` - 弧线
- `text` - 纯文本
- `move` - 不可见的线 (用于间隔)

### 2.2 方向语句

```pikchr
right
down
left
up
```

改变后续对象的自动布局方向。

### 2.3 变量赋值语句

```pikchr
变量名 = 表达式
变量名 += 表达式
变量名 -= 表达式
变量名 *= 表达式
变量名 /= 表达式
```

### 2.4 标签定义

```pikchr
Label: 对象定义
Label: 位置
```

### 2.5 宏定义

```pikchr
define 宏名 {
  语句列表
}
```

### 2.6 调试语句

```pikchr
print 表达式, "文本", ...
assert(表达式 == 表达式)
assert(位置 == 位置)
```

## 3. 标识符规则

### 3.1 标签 (LABEL)

- **规则**: 大写字母开头，后跟字母/数字/下划线
- **示例**: `Box1`, `START`, `My_Label`
- **用法**: 对象引用

```pikchr
DB: cylinder "Database"
API: box "API Server"
arrow from DB to API
```

### 3.2 变量 (VARIABLE)

- **规则**: 小写字母或 `$`/`@` 开头，后跟字母/数字/下划线
- **示例**: `boxwid`, `my_var`, `$temp`, `@count`
- **用法**: 配置和计算

```pikchr
boxwid = 2cm
boxht = 1cm
box width boxwid height boxht
```

### 3.3 预定义变量

**尺寸变量**:
- `boxwid`, `boxht`, `boxrad`
- `circlerad`, `circlewid`, `circleht`
- `ellipsewid`, `ellipseht`
- `linewid`, `lineht`
- `arrowwid`, `arrowht`, `arrowhead`
- 等等 (每种对象类型都有对应的变量)

**全局变量**:
- `charwid` - 字符宽度估计
- `charht` - 字符高度估计
- `thickness` - 默认线宽

## 4. 数值和单位

### 4.1 数值格式

```pikchr
42          # 整数
3.14        # 浮点数
0xFF        # 十六进制 (用于颜色)
```

### 4.2 单位

```pikchr
1in         # 英寸 (默认)
2.54cm      # 厘米
25.4mm      # 毫米
72px        # 像素
72pt        # 点
6pc         # pica
```

**换算**:
- 1 in = 2.54 cm = 25.4 mm
- 1 in = 72 pt = 6 pc = 96 px (默认)

### 4.3 无单位数值

如果省略单位，默认为英寸:

```pikchr
box width 2      # 2 英寸
box width 2in    # 明确指定，推荐
```

## 5. 对象属性

### 5.1 尺寸属性

```pikchr
width <值>    或 wid <值>
height <值>   或 ht <值>
radius <值>   或 rad <值>
diameter <值> 或 diam <值>
thickness <值>
```

**百分比调整**:

```pikchr
box width 150%      # 默认宽度的 150%
circle radius 75%   # 默认半径的 75%
```

### 5.2 颜色属性

```pikchr
color <颜色>
fill <颜色>
```

**颜色格式**:

```pikchr
color red                # 颜色名 (不区分大小写)
color 0xFF0000           # 十六进制 RGB
fill lightblue           # 填充色
fill None                # 透明 (也可用 Off 或负数)
```

### 5.3 线条样式

```pikchr
solid                    # 实线 (默认)
dashed                   # 虚线
dashed <长度>            # 自定义虚线长度
dotted                   # 点线
dotted <间距>            # 自定义点间距
invisible                # 不可见
invis                    # invisible 的缩写

thick                    # 加粗
thin                     # 变细
```

### 5.4 箭头属性 (仅线条)

```pikchr
->                       # 箭头在末端
<-                       # 箭头在起点
<->                      # 双向箭头
```

### 5.5 位置属性

#### at 定位

```pikchr
at <位置>
with <锚点> at <位置>
```

示例:

```pikchr
box at 2cm, 1cm
circle with .w at 3cm, 0.5cm
```

#### from-to 定位 (仅线条)

```pikchr
from <位置>
to <位置>
then to <位置>
```

#### 相对移动 (仅线条)

```pikchr
go <方向> <距离>
go <距离> heading <角度>
go <距离> <罗盘方向>
<方向> <距离>
<距离> heading <角度>
```

**方向**:
- `right`, `left`, `up`, `down`

**罗盘方向**:
- `n`, `north`
- `ne`, `e`, `east`, `se`
- `s`, `south`
- `sw`, `w`, `west`, `nw`

**角度**: 0° = 东, 90° = 北, 180° = 西, 270° = 南

示例:

```pikchr
arrow go right 2cm
arrow go 1cm heading 45
arrow 3cm north
```

#### 对齐语法

```pikchr
<方向> until even with <位置>
```

示例:

```pikchr
arrow from B1.s down 1cm then right until even with C1 then to C1.s
```

### 5.6 其他属性

```pikchr
same                     # 复制前一个对象的样式
same as <对象>           # 复制指定对象的样式
fit                      # 自动调整大小以适应文本
close                    # 闭合路径 (形成多边形)
chop                     # 修剪线条端点
cw                       # 顺时针 (弧线)
ccw                      # 逆时针 (弧线)
behind <对象>            # 置于对象后面
```

## 6. 文本注释

### 6.1 基本语法

```pikchr
对象 "文本1" "文本2" "文本3"
```

最多 5 行文本。

### 6.2 文本属性

**位置**:
- `above` - 上方
- `below` - 下方
- `ljust` - 左对齐
- `rjust` - 右对齐
- `center` - 居中 (取消之前的对齐)

**样式**:
- `bold` - 粗体
- `italic` - 斜体
- `mono` / `monospace` - 等宽字体
- `big` - 大字体 (可重复最多 2 次)
- `small` - 小字体 (可重复最多 2 次)
- `aligned` - 与线条对齐 (仅线条)

### 6.3 示例

```pikchr
box "Title" big bold "Subtitle" italic below
arrow "Label" above aligned
```

## 7. 位置表达式

### 7.1 绝对位置

```pikchr
<x>, <y>
(<x>, <y>)
```

### 7.2 对象引用

```pikchr
<对象>                   # 对象中心
<对象>.<锚点>            # 对象锚点
<锚点> of <对象>         # 同上
```

**锚点**:
- `.n`, `.north`, `.t`, `.top`
- `.ne`
- `.e`, `.east`, `.right`
- `.se`
- `.s`, `.south`, `.bot`, `.bottom`
- `.sw`
- `.w`, `.west`, `.left`
- `.nw`
- `.c`, `.center`
- `.start`, `.end` (根据布局方向)

### 7.3 相对位置

```pikchr
<位置> + <x>, <y>
<位置> - <x>, <y>
<位置> + (<x>, <y>)
<位置> - (<x>, <y>)
```

### 7.4 投影位置

```pikchr
(<位置1>, <位置2>)       # (x1, y2)
```

### 7.5 插值位置

```pikchr
<分数> of the way between <位置1> and <位置2>
<分数> way between <位置1> and <位置2>
<分数> between <位置1> and <位置2>
<分数> < <位置1>, <位置2> >
```

示例:

```pikchr
0.5 < B1, C1 >          # 中点
1/3 between B1 and C1   # 1/3 处
```

### 7.6 方向位置

```pikchr
<距离> <方向> of <位置>
<距离> heading <角度> from <位置>
```

示例:

```pikchr
1cm right of B1
2cm heading 45 from C1
```

## 8. 对象引用

### 8.1 标签引用

```pikchr
Label
Label.锚点
Label.属性
```

### 8.2 相对引用

```pikchr
previous                 # 上一个对象
last                     # 同 previous
first                    # 第一个对象
1st                      # 同 first
```

### 8.3 类型引用

```pikchr
last <类型>
<序数> <类型>
<序数> last <类型>
```

示例:

```pikchr
last box
2nd circle
3rd last arrow
```

### 8.4 容器引用

```pikchr
last []
2nd []
previous []
```

### 8.5 嵌套引用

```pikchr
<对象> in <容器>
<对象> of <容器>
```

示例:

```pikchr
Container: [
  Inner: box "Inner"
]

arrow from Inner in Container to ...
```

### 8.6 顶点引用 (仅线条)

```pikchr
<序数> vertex of <线条>
```

示例:

```pikchr
arrow go right 1cm then up 1cm then right 1cm
dot at 2nd vertex of previous
```

## 9. 表达式

### 9.1 算术运算

```pikchr
<expr> + <expr>
<expr> - <expr>
<expr> * <expr>
<expr> / <expr>
-<expr>
+<expr>
```

### 9.2 函数

```pikchr
abs(<expr>)              # 绝对值
cos(<expr>)              # 余弦 (弧度)
sin(<expr>)              # 正弦 (弧度)
sqrt(<expr>)             # 平方根
int(<expr>)              # 取整
max(<expr>, <expr>)      # 最大值
min(<expr>, <expr>)      # 最小值
dist(<位置>, <位置>)     # 两点距离
```

### 9.3 对象属性访问

```pikchr
<对象>.x                 # X 坐标
<对象>.y                 # Y 坐标
<对象>.wid               # 宽度
<对象>.width
<对象>.ht                # 高度
<对象>.height
<对象>.rad               # 半径
<对象>.radius
<对象>.diam              # 直径
<对象>.diameter
<对象>.thickness         # 线宽
<对象>.color             # 颜色值
<对象>.fill              # 填充色值
<对象>.dashed            # 虚线长度 (0=实线)
<对象>.dotted            # 点线间距 (0=实线)
```

## 10. 容器 (Subdiagrams)

### 10.1 基本语法

```pikchr
[
  语句1
  语句2
  ...
] 属性列表
```

### 10.2 特性

- 独立坐标系统 (原点在 (0,0))
- 可以整体定位
- 支持嵌套
- 可以有自己的标签

### 10.3 示例

```pikchr
Component1: [
  box "A"
  arrow
  circle "B"
] with .w at 0,0

Component2: [
  box "C"
  arrow
  circle "D"
] at 3cm right of Component1
```

## 11. 宏

### 11.1 定义

```pikchr
define 宏名 {
  语句列表
  # 可以使用 $1, $2, ... $9 作为参数
}
```

### 11.2 调用

```pikchr
宏名("参数1", "参数2", ...)
```

### 11.3 示例

```pikchr
define server {
  [
    box "$1" fit
    line invisible from last box.s down 0.5
    cylinder "DB" fit
  ]
}

server("Web Server")
move
server("API Server")
```

## 12. 特殊语法

### 12.1 反斜杠续行

```pikchr
arrow from B1.s \\
  down 1cm \\
  then right 2cm \\
  then up 1cm
```

反斜杠后的换行符被视为空格。

### 12.2 字符串

```pikchr
"文本"
```

- 使用双引号
- 反斜杠转义: `\\"` 表示引号, `\\\\` 表示反斜杠
- 支持换行 (但不推荐)

### 12.3 括号分组

```pikchr
(<表达式>)
(<位置>)
```

## 13. 语法限制

### 13.1 不支持的特性

- **if/else 条件**: 没有条件语句
- **循环**: 没有 for/while 循环
- **用户函数**: 只有预定义函数
- **字符串操作**: 字符串只能用作文本标签

### 13.2 单遍解析限制

- **前向引用**: 只能引用已定义的对象
- **对象修改**: 对象定义后不可修改
- **顺序依赖**: 语句顺序很重要

## 14. 最佳实践

### 14.1 命名约定

```pikchr
# ✓ 好: 描述性标签
StartNode: circle "Start"
ProcessBox: box "Process"

# ✗ 差: 模糊标签
A: circle "Start"
B: box "Process"
```

### 14.2 对齐和间距

```pikchr
# ✓ 好: 使用变量
spacing = 2cm
box "A"
move spacing
box "B"

# ✗ 差: 硬编码
box "A"
move 2cm
box "B"
```

### 14.3 复杂图表组织

```pikchr
# ✓ 好: 使用容器和宏
define layer {
  [
    box "$1"
    # ...
  ]
}

Frontend: layer("Frontend")
Backend: layer("Backend") at 3cm right of Frontend
```

### 14.4 注释

```pikchr
# ✓ 好: 清晰的注释
# 数据库层
DB: cylinder "Database"

# API 层
API: box "REST API" at 2cm right of DB

# 连接
arrow from DB to API "HTTP" above
```

## 15. 调试技巧

### 15.1 使用 print

```pikchr
B1: box
print "B1 center:", B1.x, B1.y
print "B1 width:", B1.wid
```

### 15.2 使用 assert

```pikchr
B1: box at 1cm, 2cm
assert(B1.x == 1cm)
assert(B1.y == 2cm)
```

### 15.3 可视化调试

```pikchr
# 显示锚点
B1: box
dot at B1.n color red
dot at B1.e color blue
dot at B1.s color green
dot at B1.w color yellow
```

## 16. 常见错误

### 16.1 忘记续行

```pikchr
# ❌ 错误
arrow from B1
  to C1

# ✓ 正确
arrow from B1 \\
  to C1
```

### 16.2 单位混淆

```pikchr
# ❌ 错误
box width 2     # 2 英寸 (可能太大)

# ✓ 正确
box width 2cm   # 明确单位
```

### 16.3 前向引用

```pikchr
# ❌ 错误
arrow from B1 to B2  # B2 未定义
B1: box
B2: circle

# ✓ 正确
B1: box
B2: circle
arrow from B1 to B2
```

### 16.4 属性顺序

```pikchr
# ❌ 错误
box at 2cm, 1cm "Text"  # at 必须在文本之后

# ✓ 正确
box "Text" at 2cm, 1cm
```
