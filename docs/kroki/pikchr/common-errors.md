# Pikchr 常见错误

## 1. 语法错误

### 1.1 缺少续行符

**错误示例**:

```pikchr
arrow from B1.s
  down 1cm
  then right 2cm  # ❌ 换行会终止语句
```

**错误信息**:

```
Parse error: unexpected token 'down'
```

**解决方案**:

```pikchr
# ✓ 正确: 使用反斜杠续行
arrow from B1.s \\
  down 1cm \\
  then right 2cm
```

---

### 1.2 对象类型拼写错误

**错误示例**:

```pikchr
rectangle "My Box"  # ❌ 应该是 box
square "My Box"     # ❌ 没有 square 类型
```

**错误信息**:

```
Parse error: unknown object type 'rectangle'
```

**正确的对象类型**:

```pikchr
box         # ✓ 矩形
circle      # ✓ 圆形
ellipse     # ✓ 椭圆
oval        # ✓ 椭圆 (端帽为半圆)
diamond     # ✓ 菱形
cylinder    # ✓ 圆柱体
file        # ✓ 文件图标
```

---

### 1.3 前向引用错误

**错误示例**:

```pikchr
arrow from Box1 to Box2  # ❌ Box2 未定义
Box1: box
Box2: circle
```

**错误信息**:

```
Error: undefined object 'Box2'
```

**解决方案**:

```pikchr
# ✓ 正确: 先定义对象
Box1: box
Box2: circle
arrow from Box1 to Box2
```

---

### 1.4 标签命名错误

**错误示例**:

```pikchr
box1: box       # ❌ 标签必须大写开头
my-box: circle  # ❌ 不能包含连字符
```

**错误信息**:

```
Parse error: expected label, got variable name
```

**解决方案**:

```pikchr
# ✓ 正确: 标签规则
Box1: box        # 大写开头
My_Box: circle   # 可以用下划线
START: oval      # 全大写也可以
```

---

## 2. 位置和布局错误

### 2.1 单位缺失导致尺寸错误

**错误示例**:

```pikchr
box width 2     # ❌ 默认单位是英寸 (可能太大)
circle radius 3 # ❌ 3 英寸的圆形
```

**问题**: 图表超出预期大小

**解决方案**:

```pikchr
# ✓ 正确: 明确指定单位
box width 2cm
circle radius 3cm
oval wid 50mm ht 25mm
```

---

### 2.2 锚点拼写错误

**错误示例**:

```pikchr
Box1: box
arrow from Box1.south to Box1.east  # ❌ 应该用缩写
```

**错误信息**:

```
Parse error: '.south' should be '.s' or use 'south of'
```

**解决方案**:

```pikchr
# ✓ 正确: 使用点号必须用缩写
arrow from Box1.s to Box1.e

# ✓ 或使用 'of' 形式
arrow from south of Box1 to east of Box1
```

---

### 2.3 相对位置语法错误

**错误示例**:

```pikchr
circle at 2cm, right of previous  # ❌ 语法混淆
```

**解决方案**:

```pikchr
# ✓ 正确: 绝对位置
circle at 2cm, 1cm

# ✓ 正确: 相对位置
circle at 2cm right of previous

# ✓ 正确: 复合位置
circle at (previous.x + 2cm, previous.y)
```

---

### 2.4 布局方向未生效

**错误示例**:

```pikchr
down
box "A"; box "B"; box "C"  # ❌ 分号在同一行，方向已改变
```

**问题**: 对象仍然水平排列

**原因**: `down` 语句改变方向，但同一行的后续对象没有使用新方向

**解决方案**:

```pikchr
# ✓ 正确: 方向语句独立一行
down
box "A"
box "B"
box "C"

# ✓ 或明确使用换行
down; box "A"; box "B"; box "C"  # 但不推荐
```

---

## 3. 路径定义错误

### 3.1 缺少 from 起点

**错误示例**:

```pikchr
arrow to C1  # ❌ 缺少起点
```

**错误信息**:

```
Error: line has 'to' but no 'from'
```

**解决方案**:

```pikchr
# ✓ 正确: 提供起点
arrow from B1 to C1

# ✓ 或使用自动定位
B1: box
arrow    # 从 B1.end 开始
C1: circle
```

---

### 3.2 路径命令顺序错误

**错误示例**:

```pikchr
arrow then right 2cm from B1.s  # ❌ from 必须在最前面
```

**错误信息**:

```
Parse error: 'from' must come before path commands
```

**解决方案**:

```pikchr
# ✓ 正确: from 在最前
arrow from B1.s then right 2cm
```

---

### 3.3 heading 角度错误

**错误示例**:

```pikchr
arrow go 2cm heading north  # ❌ heading 需要数字角度
```

**错误信息**:

```
Parse error: expected number after 'heading'
```

**解决方案**:

```pikchr
# ✓ 正确: 使用数字角度
arrow go 2cm heading 90    # 90° = 北

# ✓ 或直接使用方向
arrow go 2cm north
arrow go 2cm n
```

---

### 3.4 close 用在非线条对象

**错误示例**:

```pikchr
box close  # ❌ box 不能 close
```

**错误信息**:

```
Error: 'close' only valid for lines
```

**解决方案**:

```pikchr
# ✓ 正确: 只用于线条
line go 2cm \\
  then down 1cm \\
  then left 2cm \\
  close fill lightblue
```

---

## 4. 文本和样式错误

### 4.1 文本属性位置错误

**错误示例**:

```pikchr
box bold "Text"  # ❌ 属性必须在文本之后
```

**错误信息**:

```
Parse error: unexpected string after 'bold'
```

**解决方案**:

```pikchr
# ✓ 正确: 文本在前，属性在后
box "Text" bold
box "Title" big bold "Subtitle" italic below
```

---

### 4.2 颜色格式错误

**错误示例**:

```pikchr
box fill #FF0000      # ❌ 缺少 0x 前缀
box color rgb(255,0,0) # ❌ 不支持 RGB 函数
```

**错误信息**:

```
Parse error: expected color value
```

**解决方案**:

```pikchr
# ✓ 正确: 颜色名
box fill red
box color lightblue

# ✓ 正确: 十六进制 (整数格式)
box fill 0xFF0000
box color 0x3366FF

# ✓ 透明
box fill None
box fill Off
box fill -1
```

---

### 4.3 文本行数超限

**错误示例**:

```pikchr
box "Line1" "Line2" "Line3" "Line4" "Line5" "Line6"  # ❌ 最多 5 行
```

**错误信息**:

```
Error: too many text lines (max 5)
```

**解决方案**:

```pikchr
# ✓ 正确: 最多 5 行
box "Line1" "Line2" "Line3" "Line4" "Line5"

# ✓ 或合并内容
box "Line1 & Line2" "Line3" "Line4" "Line5"
```

---

### 4.4 aligned 用在块对象

**错误示例**:

```pikchr
box "Text" aligned  # ❌ aligned 只用于线条
```

**错误信息**:

```
Error: 'aligned' only valid for lines
```

**解决方案**:

```pikchr
# ✓ 正确: 只用于线条
arrow "Label" aligned above

# ✓ 块对象用其他对齐
box "Text" ljust
box "Text" rjust
```

---

## 5. 变量和表达式错误

### 5.1 变量命名错误

**错误示例**:

```pikchr
BoxWidth = 2cm   # ❌ 变量不能大写开头
my-width = 2cm   # ❌ 不能包含连字符
```

**解决方案**:

```pikchr
# ✓ 正确: 小写开头
boxwidth = 2cm
my_width = 2cm
$temp = 1cm
@count = 3
```

---

### 5.2 除零错误

**错误示例**:

```pikchr
x = 10 / 0  # ❌ 除零
```

**错误信息**:

```
Error: division by zero
```

**解决方案**:

```pikchr
# ✓ 使用条件检查 (通过宏)
define safediv {
  # 在宏中可以用参数判断
}
```

---

### 5.3 函数参数错误

**错误示例**:

```pikchr
x = sqrt(-1)     # ❌ 负数的平方根
x = dist(B1)     # ❌ dist 需要两个参数
```

**错误信息**:

```
Error: invalid argument to sqrt
Error: dist() requires 2 arguments
```

**解决方案**:

```pikchr
# ✓ 正确使用
x = sqrt(4)           # 2
x = abs(-5)           # 5
x = dist(B1, C1)      # 两点距离
```

---

## 6. 容器和宏错误

### 6.1 容器定位错误

**错误示例**:

```pikchr
[
  box "A"
] at B1  # ❌ B1 在容器外部未定义
```

**解决方案**:

```pikchr
# ✓ 正确: 先定义外部对象
B1: box "Reference"

Container: [
  box "A"
] at 2cm right of B1
```

---

### 6.2 宏参数错误

**错误示例**:

```pikchr
define mybox {
  box "$1" "$2"
}

mybox("Only one arg")  # ❌ $2 未提供
```

**问题**: $2 显示为空字符串

**解决方案**:

```pikchr
# ✓ 正确: 提供所有参数
mybox("Title", "Subtitle")

# ✓ 或使用默认值 (在宏中处理)
define mybox {
  box "$1"
  # $2 如果为空则忽略
}
```

---

### 6.3 宏嵌套错误

**错误示例**:

```pikchr
define outer {
  define inner {  # ❌ 不能嵌套定义
    box
  }
}
```

**错误信息**:

```
Error: macros cannot be defined inside macros
```

**解决方案**:

```pikchr
# ✓ 正确: 宏定义在顶层
define inner {
  box
}

define outer {
  inner()
}
```

---

## 7. 平台特定错误

### 7.1 字符编码问题

**问题**: 中文或特殊字符显示为方框

**原因**: 文件编码不是 UTF-8

**解决方案**:

```bash
# 检查文件编码
file -I diagram.pikchr

# 转换为 UTF-8
iconv -f GB2312 -t UTF-8 diagram.pikchr -o diagram_utf8.pikchr
```

---

### 7.2 SVG 渲染问题

**问题**: 生成的 SVG 在某些浏览器中显示异常

**原因**: SVG 版本兼容性

**解决方案**:

```pikchr
# 使用简单样式
box fill lightblue  # 避免复杂渐变

# 避免过细的线条
thickness = 0.02    # 不要太细
```

---

## 8. 集成错误

### 8.1 Markdown 代码块未识别

**错误示例**:

````markdown
```pic
box "Hello"
```
````

**问题**: 渲染器不识别 `pic`

**解决方案**:

````markdown
# ✓ 正确: 使用 pikchr

```pikchr
box "Hello"
```
````

---

### 8.2 Fossil Wiki 语法错误

**错误示例**:

```
<verbatim>
box "Hello"
</verbatim>
```

**问题**: 缺少 type 属性

**解决方案**:

```
# ✓ 正确
<verbatim type="pikchr">
box "Hello"
</verbatim>
```

---

### 8.3 C 集成内存泄漏

**错误示例**:

```c
char *svg = pikchr("box", NULL, 0, NULL, NULL);
// ❌ 忘记释放
```

**解决方案**:

```c
# ✓ 正确: 记得释放
char *svg = pikchr("box", NULL, 0, NULL, NULL);
printf("%s", svg);
pikchr_free(svg);  // 必须调用
```

---

## 9. 性能问题

### 9.1 复杂图表渲染慢

**问题**: 超过 100 个对象的图表生成缓慢

**优化策略**:

```pikchr
# ✓ 策略 1: 使用容器分组
Component1: [
  # 多个对象
]

Component2: [
  # 多个对象
]

# ✓ 策略 2: 简化样式
# 避免过多的颜色和文本
box fill white
# 而不是
box fill 0xF5F5F5 color 0x333333 "Long" big bold "Text" italic
```

---

### 9.2 SVG 文件过大

**问题**: 生成的 SVG 文件超过预期

**原因**: 过多的文本和样式

**解决方案**:

```pikchr
# ✓ 减少文本注释
box "简短"
# 而不是
box "非常长的文本描述，包含很多细节"

# ✓ 复用样式
boxfill = lightblue
box fill boxfill
circle fill boxfill
```

---

## 10. 调试技巧

### 10.1 使用 print 调试

```pikchr
B1: box at 2cm, 1cm
print "B1 position:", B1.x, B1.y
print "B1 size:", B1.wid, B1.ht
```

**输出** (在 stderr):

```
B1 position: 2 1
B1 size: 0.75 0.5
```

---

### 10.2 使用 assert 验证

```pikchr
B1: box width 2cm
assert(B1.wid == 2cm)  # 验证宽度

C1: circle at 3cm, 0
assert(C1.x == 3cm)    # 验证位置
```

如果断言失败，会显示错误信息。

---

### 10.3 可视化锚点

```pikchr
B1: box "Box"

# 显示所有锚点
dot at B1.n color red "n" above
dot at B1.ne color red "ne" above ljust
dot at B1.e color blue "e" rjust
dot at B1.se color blue "se" below ljust
dot at B1.s color green "s" below
dot at B1.sw color green "sw" below rjust
dot at B1.w color yellow "w" ljust
dot at B1.nw color yellow "nw" above rjust
dot at B1.c color black "c"
```

---

### 10.4 逐步构建

```pikchr
# 从简单开始
box "A"

# 逐步添加
# box "A"
# circle "B" at 2cm right of previous

# 继续添加
# box "A"
# circle "B" at 2cm right of previous
# arrow from 1st box to 1st circle
```

---

## 11. 常见问题 FAQ

**Q: 为什么文本对齐不起作用?**

A: 检查文本是在线条上还是块对象上:

```pikchr
# 线条: aligned 有效
arrow "Label" aligned above

# 块对象: ljust/rjust 有效
box "Text" ljust
```

---

**Q: 如何让对象紧密排列?**

A: 调整默认间距:

```pikchr
linewid = 0
box "A"
box "B"  # 紧邻
```

---

**Q: 箭头方向反了怎么办?**

A: 使用 `<-` 反转方向:

```pikchr
arrow from B1 to C1 <-  # 箭头在 B1
```

---

**Q: 如何绘制虚线箭头?**

A: 组合 dashed 和 arrow:

```pikchr
arrow dashed from B1 to C1
```

---

**Q: 支持中文吗?**

A: 支持，但需要:

1. 文件编码为 UTF-8
2. SVG 查看器支持中文字体
3. 可能需要调整 `charwid` 和 `charht`

```pikchr
charwid = 0.15  # 中文字符更宽
box "中文文本" fit
```

---

**Q: 如何导出为 PNG?**

A: Pikchr 只生成 SVG，需要转换:

```bash
# 使用 ImageMagick
convert diagram.svg diagram.png

# 使用 Inkscape
inkscape diagram.svg --export-png=diagram.png

# 使用 rsvg-convert
rsvg-convert -o diagram.png diagram.svg
```

---

## 12. 错误信息对照表

| 错误信息                                | 可能原因      | 解决方案       |
| --------------------------------------- | ------------- | -------------- |
| `Parse error: unexpected token`         | 语法错误      | 检查拼写和语法 |
| `Error: undefined object`               | 前向引用      | 先定义对象     |
| `Error: division by zero`               | 表达式除零    | 检查表达式     |
| `Error: too many text lines`            | 文本超过 5 行 | 减少文本行数   |
| `Error: 'aligned' only valid for lines` | 属性用错对象  | 检查对象类型   |
| `Error: macros cannot be nested`        | 宏嵌套定义    | 宏定义在顶层   |

---

## 13. 获取帮助

1. **官方文档**: https://pikchr.org/home/doc/trunk/doc/userman.md
2. **Fossil 论坛**: https://fossil-scm.org/forum
3. **GitHub Issues**: https://github.com/drhsqlite/pikchr/issues
4. **邮件列表**: fossil-users@lists.fossil-scm.org

**提问模板**:

````
环境:
- Pikchr 版本: [如果知道]
- 集成平台: [Fossil/Markdown/Other]
- 浏览器: [Chrome/Firefox/Safari]

问题描述:
[详细描述]

最小示例:
```pikchr
[示例代码]
````

预期结果:
[应该显示什么]

实际结果:
[实际显示什么/错误信息]

```

```
