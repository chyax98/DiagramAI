# UMLet 语法规则详解

> **渲染引擎**: UMLet
> **文档类型**: 语法规则和标记语言

---

## 📐 基础标记语言

UMLet 使用简化的 Markdown 风格标记语言来定义 UML 元素属性。

### 核心原则

1. **每行一个属性**: 文本的每一行代表一个元素属性
2. **特殊符号**: 使用特殊符号控制格式和布局
3. **自动解析**: UMLet 自动识别和应用规则

---

## 🔤 类图语法

### 1. 类元素结构

```
ClassName
--
attributes
--
methods
--
properties
```

**结构说明**:

- **第一行**: 类名（自动居中显示）
- **`--`**: 分隔线（双横线）
- **后续行**: 属性/方法（左对齐）
- **最后**: 可选的属性设置

### 2. 文本格式

#### 斜体（抽象）

```
/AbstractClass/      # 抽象类
/abstractMethod()/   # 抽象方法
```

#### 下划线（静态）

```
_staticField_        # 静态字段
_staticMethod()_     # 静态方法
```

#### 可见性符号

```
+ public
- private
# protected
~ package
```

### 3. 完整示例

```
/AbstractShape/
--
-color: String
#size: int
_count: int_
--
+draw(): void
/+calculate(): int/
_+getCount(): int_
--
bg=lightblue
```

**渲染结果**:

- 类名斜体（抽象类）
- `-color` 私有属性
- `_count_` 静态下划线
- `/calculate()/` 抽象方法斜体

---

## 🔗 关系语法

### 1. 关联关系

**属性面板配置**:

```
r1=RoleName1         # 第一端角色名
r2=RoleName2         # 第二端角色名
m1=1                 # 第一端多重性
m2=*                 # 第二端多重性
q1=qualifier         # 第一端限定符
q2=                  # 第二端限定符（空）
```

### 2. 关系类型标记

```
lt=<<                # 继承关系（空心三角箭头）
lt=<                 # 实现关系（虚线空心箭头）
lt=<-                # 依赖关系（虚线箭头）
lt=-                 # 关联关系（实线）
lt=<<-               # 组合关系（实心菱形）
lt=<<.               # 聚合关系（空心菱形）
```

### 3. 关系示例

```
关联关系元素属性:
r1=employer
r2=employee
m1=1
m2=*
lt=-
```

---

## 📊 时序图语法

### All-in-One 时序图元素

**基础语法**:

```
_actorName~actorID_
_objectName~objectID_

actorID->objectID:message1
objectID->actorID:message2
```

### 泳道定义

```
_Alice~a_            # 定义参与者 Alice，ID 为 a
_Bob~b_              # 定义参与者 Bob，ID 为 b
_System~s_           # 定义对象 System，ID 为 s
```

### 消息定义

```
a->b:Hello           # 同步消息
a-->b:Async          # 异步消息（虚线）
b->a:Response        # 返回消息
a->a:Self call       # 自调用
```

### 激活框

```
a->b:request
=b                   # b 开始激活
b->s:query
=s                   # s 开始激活
s->b:result
destroy s            # 销毁 s
b->a:response
destroy b            # 销毁 b
```

### 完整示例

```
_Client~c_
_Server~s_
_Database~d_

c->s:GET /api/data
=s
s->d:SELECT * FROM table
=d
d->s:result set
destroy d
s->c:200 OK (JSON)
destroy s
```

---

## 🎯 活动图语法

### All-in-One 活动图元素

**基础语法**:

```
Activity 1
--
Activity 2
--
Decision?
--
TAB Yes: Activity 3
--
TAB No: Activity 4
```

### 分支控制

**使用 TAB 缩进**:

```
Start
--
Check Condition?
--
TAB True: Process A
--
TAB TAB Sub-Process A1
--
TAB False: Process B
--
End
```

### 并发活动

```
Activity 1
--
Fork
--
TAB Parallel Task 1
--
TAB Parallel Task 2
--
Join
--
Activity 2
```

---

## 🎨 样式属性

### 1. 颜色设置

```
bg=colorName         # 背景颜色
fg=colorName         # 前景颜色（文本/边框）
```

**预定义颜色**:

```
red, green, blue, yellow
orange, pink, purple, gray
white, black, cyan, magenta
```

**HTML 颜色代码**:

```
bg=#FF0000           # 红色
bg=#00FF00           # 绿色
bg=#0000FF           # 蓝色
```

### 2. 透明度

```
transparency=0       # 完全不透明
transparency=50      # 半透明
transparency=100     # 完全透明
```

### 3. 字体设置

```
fontsize=14          # 字体大小
fontfamily=SansSerif # 字体家族
fontstyle=bold       # 字体样式
fontstyle=italic
fontstyle=bold,italic
```

### 4. 边框设置

```
lw=2                 # 线宽（Line Width）
lt=.                 # 虚线类型（Line Type）
lt=-                 # 实线
lt=..                # 点线
```

---

## 📝 注释和说明

### 单行注释

```
//这是注释，不会显示
ClassName
--
attribute1
//这也是注释
method1()
```

### 多行注释

```
/*
这是多行注释
不会在图表中显示
*/
ClassName
```

### 文档注释

```
# 这是标题注释
## 这是子标题
### 这是更小的标题
```

---

## 🔧 特殊元素语法

### 1. 用例图

**用例元素**:

```
Use Case Name
--
Extension Points:
name: location
```

**参与者元素**:

```
<<actor>>
Actor Name
```

### 2. 状态图

**状态元素**:

```
StateName
--
entry / action1
do / action2
exit / action3
```

**转换**:

```
event [guard] / action
```

### 3. 包元素

```
<<package>>
PackageName
```

---

## 🎯 对齐和布局

### 文本对齐

```
类名自动居中：
ClassName           # 自动居中

属性方法左对齐：
-attribute          # 自动左对齐
+method()           # 自动左对齐
```

### 手动对齐

```
使用空格调整：
    Centered Text   # 前面加空格
Text                # 左对齐
        Right Text  # 右对齐效果
```

### 垂直间距

```
ClassName
--

                    # 空行增加间距
-attribute1
-attribute2
```

---

## 🔢 多重性语法

### 标准多重性

```
1                   # 恰好一个
*                   # 零个或多个
0..1                # 零个或一个
1..*                # 一个或多个
5..10               # 5到10个
```

### 使用示例

```
关联关系属性:
m1=1
m2=0..*
r1=company
r2=employees
```

---

## 📐 尺寸控制

### 自动调整大小

UMLet 元素默认自动调整大小以适应内容。

### 固定尺寸

```
在自定义元素中:
allowResize(false, false)  # 禁止调整大小
```

### 最小尺寸

```
minWidth=100
minHeight=50
```

---

## 🎨 高级样式

### 渐变背景

```
bgstyle=gradient     # 渐变背景
bg=color1            # 起始颜色
bg2=color2           # 结束颜色
```

### 阴影效果

```
shadow=true          # 启用阴影
shadowsize=5         # 阴影大小
```

### 圆角

```
rounded=true         # 圆角矩形
roundedsize=10       # 圆角大小
```

---

## 🔄 自定义元素语法

### Java 代码片段

```java
// 访问属性文本
String firstLine = textlines.get(0);
int lines = textlines.size();

// 绘图方法
printLeft(text, x, y);
printCenter(text, y);
drawRect(x, y, width, height);
drawLine(x1, y1, x2, y2);
```

### 全局变量

```java
textlines              // 文本行列表
width, height          // 元素尺寸
```

### 示例：自定义类元素

```java
// 第一行是类名
printCenter(textlines.get(0), 10);
drawRect(0, 0, width, 20);

// 后续行是属性
for (int i = 1; i < textlines.size(); i++) {
    printLeft(textlines.get(i), 5, 20 + i * 15);
}
```

---

## ⚙️ 配置选项

### 全局设置

```
File > Options:
- Default Font Size
- Default Line Width
- Grid Spacing
- Auto-Save Interval
```

### 元素特定设置

```
右键元素 > Properties:
- Layer (图层)
- Group (分组)
- Lock (锁定)
```

---

## 📊 导出选项语法

### 命令行参数

```bash
-action=convert      # 转换动作
-format=pdf          # 输出格式
-filename=input.uxf  # 输入文件
-output=output/      # 输出目录
```

### 支持格式

```
svg, pdf, eps, jpg, png, bmp, gif
```

---

## 🔍 查找和替换

### 查找语法

```
Ctrl+F: 查找文本
支持：
- 精确匹配
- 区分大小写
- 正则表达式
```

### 批量替换

```
Ctrl+H: 查找替换
示例：
Find: bg=red
Replace: bg=blue
```

---

## 🎯 最佳实践规则

### 1. 保持一致性

```
统一使用：
- 相同的分隔符 (---)
- 相同的可见性符号 (+, -, #)
- 相同的颜色方案
```

### 2. 合理使用空行

```
ClassName
--
                    # 空行分组
-field1
-field2
                    # 空行分组
+method1()
+method2()
```

### 3. 注释习惯

```
//Section: Attributes
-attribute1
-attribute2

//Section: Methods
+method1()
+method2()
```

---

## 🚫 常见语法错误

### 错误 1: 分隔符数量

```
错误:
ClassName
-              # 单横线无效
attributes

正确:
ClassName
--             # 双横线
attributes
```

### 错误 2: 可见性符号位置

```
错误:
attribute1 +   # 符号在后面

正确:
+ attribute1   # 符号在前面
```

### 错误 3: 斜体语法

```
错误:
\AbstractClass\  # 使用反斜杠

正确:
/AbstractClass/  # 使用正斜杠
```

---

**最后更新**: 2025-10-13
**适用版本**: UMLet 15.1+
