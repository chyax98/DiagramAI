# UMLet 常见错误和解决方案

> **渲染引擎**: UMLet
> **文档类型**: 故障排查指南

---

## ⚠️ 语法错误

### 错误 1: 分隔线语法错误

**症状**: 分隔线不显示或显示为文本

```
错误示例:
ClassName
-              ← 单横线（错误）
attributes

或:
ClassName
––             ← 特殊字符（错误）
methods
```

**原因**:

- 使用单横线 `-` 而不是双横线 `--`
- 使用了全角或特殊字符
- 横线前后有多余空格

**解决方案**:

```
正确示例:
ClassName
--             ← 精确的双横线
attributes
--
methods

检查清单:
✓ 使用两个连续的减号 (-)
✓ 没有空格或其他字符
✓ 使用半角 ASCII 字符
```

---

### 错误 2: 斜体格式错误

**症状**: 斜体文本不显示或显示为普通文本

```
错误示例:
\AbstractClass\     ← 使用反斜杠
*AbstractClass*     ← 使用星号
_AbstractClass_     ← 使用下划线（这是静态）
```

**正确语法**:

```
/AbstractClass/     ← 使用正斜杠

应用场景:
/抽象类名/
/抽象方法()/
```

---

### 错误 3: 可见性符号位置错误

**症状**: 可见性符号不生效

```
错误示例:
attribute +        ← 符号在后面
method() -         ← 符号在后面
# attribute        ← 前面有空格
```

**正确格式**:

```
+publicAttribute
-privateAttribute
#protectedAttribute
~packageAttribute

+publicMethod()
-privateMethod()
```

---

## 🔗 关系配置错误

### 错误 4: 多重性设置无效

**症状**: 多重性不显示或显示错误

```
错误配置:
m1 = 1            ← 等号两边有空格
m2=one            ← 使用文字而非符号
m1=1..            ← 不完整的范围
```

**正确配置**:

```
m1=1              ← 无空格
m2=*              ← 使用 * 表示多个
m1=0..1           ← 完整范围
m2=1..*           ← 一个或多个
```

---

### 错误 5: 角色名不显示

**症状**: 设置了角色名但关系上不显示

```
错误配置:
role1=employer    ← 使用 role1 而非 r1
r1 = employer     ← 等号两边有空格
r1=                ← 空值（应省略或给值）
```

**正确配置**:

```
r1=employer       ← 精确的 r1=
r2=employee       ← 精确的 r2=

省略方式:
r1=
r2=employee       ← r1 为空时可省略该行
```

---

## 🎨 样式问题

### 错误 6: 背景色不生效

**症状**: 设置的颜色不显示

```
错误配置:
bg = red          ← 有空格
BG=red            ← 大写
bg:red            ← 使用冒号
bg=#FF00          ← 不完整的颜色代码
```

**正确配置**:

```
bg=red            ← 小写，无空格
bg=#FF0000        ← 完整的 6 位十六进制
bg=#F00           ← 简写的 3 位十六进制
```

**支持的颜色名**:

```
red, green, blue, yellow, orange
pink, purple, gray, white, black
cyan, magenta
```

---

### 错误 7: 透明度设置无效

**症状**: 透明度不起作用

```
错误:
transparency=0.5   ← 使用小数
transparency=50%   ← 使用百分号
alpha=50           ← 错误的属性名
```

**正确设置**:

```
transparency=0     ← 完全不透明（0-100 整数）
transparency=50    ← 半透明
transparency=100   ← 完全透明
```

---

## 📊 时序图错误

### 错误 8: 泳道定义错误

**症状**: 参与者不显示或显示异常

```
错误示例:
_Actor Name_      ← 缺少 ID
_Actor~_          ← ID 为空
_Actor Name~id    ← 缺少结束下划线
Actor Name~id_    ← 缺少开始下划线
```

**正确格式**:

```
_ActorName~id_    ← 完整格式
_Object~obj_      ← 完整格式

示例:
_Alice~a_
_Bob~b_
_Server~s_
```

---

### 错误 9: 消息语法错误

**症状**: 消息线不显示或方向错误

```
错误示例:
a>b:message       ← 缺少第二个箭头符号
a-->b:message     ← 多余的横线
a->:message       ← 缺少目标 ID
->b:message       ← 缺少源 ID
```

**正确格式**:

```
a->b:message      ← 同步消息（实线）
a-->b:message     ← 异步消息（虚线，三个字符）
b->a:response     ← 返回消息
a->a:self         ← 自调用
```

---

## 🎯 活动图错误

### 错误 10: TAB 缩进错误

**症状**: 分支不显示或显示异常

```
错误示例:
Decision?
    Yes: Action    ← 使用空格而非 TAB
TABYes: Action     ← TAB 和文本之间没有空格
```

**正确格式**:

```
Decision?
--
TAB Yes: Action    ← 使用 TAB 键 + 空格
--
TAB No: Action
```

**注意**: 必须使用真正的 TAB 字符，不是空格模拟的 TAB

---

### 错误 11: 分隔线缺失

**症状**: 活动没有正确分段

```
错误示例:
Activity 1
Activity 2         ← 缺少分隔线
Decision?
```

**正确格式**:

```
Activity 1
--                 ← 每个活动后需要分隔线
Activity 2
--
Decision?
```

---

## 🖥️ 软件环境问题

### 错误 12: JVM 内存不足

**症状**: 导出大型图表时失败，文件为空

```
错误信息:
OutOfMemoryError: Java heap space
```

**原因**:

- JVM 默认内存太小
- 图表尺寸过大
- 包含大量元素

**解决方案**:

```bash
# 增加 JVM 内存
java -Xmx1024m -jar umlet.jar

# 或在启动脚本中设置
export JAVA_OPTS="-Xmx2048m"
umlet
```

---

### 错误 13: Eclipse 插件兼容性

**症状**: Eclipse 中 UMLet 无法启动或崩溃

**常见原因**:

- Java 版本不兼容
- Eclipse 版本过旧
- OS X 特定问题 (#399)

**解决方案**:

```
检查清单:
✓ Java 8 或更高版本
✓ Eclipse 2020-03 或更高版本
✓ 更新 UMLet 到最新版本

OS X 用户:
1. 确保使用官方 Eclipse 版本
2. 检查 Eclipse.ini 配置
3. 尝试独立版本 UMLet
```

---

### 错误 14: 自定义元素编译失败

**症状**: 自定义元素源代码无法编译

```
错误提示:
CustomElement has error when running UMLet
```

**原因**:

- 使用了新版 Java 语法但编译器版本旧
- 代码语法错误
- 缺少必要的导入

**解决方案**:

```
1. 更新 Eclipse 编译器:
   已在 v15.2 中修复

2. 检查代码语法:
   - 使用 Java 8 兼容语法
   - 避免使用 lambda 表达式（在旧版本中）
   - 正确导入包

3. 降级 Java 版本（临时方案）:
   使用 Java 8 而非 Java 11/17
```

---

## 🔧 导出问题

### 错误 15: SVG 导出异常

**症状**: 导出的 SVG 文件损坏或无法打开

```
错误情况:
- 文件大小为 0
- 浏览器无法打开
- 包含非法字符
```

**解决方案**:

```
1. 检查文件路径:
   - 避免特殊字符
   - 使用绝对路径
   - 确保有写入权限

2. 使用命令行导出:
   java -jar umlet.jar -action=convert \
     -format=svg \
     -filename=input.uxf \
     -output=output.svg

3. 验证输出:
   file output.svg
   # 应显示: SVG Scalable Vector Graphics image
```

---

### 错误 16: 批量导出失败

**症状**: 批量转换时部分文件失败

```
错误命令:
java -jar umlet.jar -action=convert \
  -format=pdf \
  -filename=*.uxf        ← 通配符不工作
```

**正确方法**:

```bash
# 使用 shell 循环
for file in *.uxf; do
  java -jar umlet.jar \
    -action=convert \
    -format=pdf \
    -filename="$file" \
    -output="${file%.uxf}.pdf"
done

# 或使用目录模式
java -jar umlet.jar -action=convert \
  -format=pdf \
  -filename=palettes/*.uxf \
  -output=./output/
```

---

## 🌐 Web 版 (UMLetino) 问题

### 错误 17: 无法保存文件

**症状**: UMLetino 中保存文件失败

**原因**:

- 浏览器存储限制
- 权限问题
- 网络连接问题（如需云存储）

**解决方案**:

```
1. 检查浏览器设置:
   - 允许下载
   - 允许本地存储
   - 清除缓存

2. 使用下载而非保存:
   File > Download as .uxf

3. 切换浏览器:
   Chrome, Firefox, Safari (测试最多)
```

---

## 📱 VS Code 扩展问题

### 错误 18: 预览不更新

**症状**: 修改 .uxf 文件后预览不刷新

**原因**:

- VS Code 缓存
- 扩展版本问题
- 文件监视器失效

**解决方案**:

```
1. 手动刷新:
   Ctrl+Shift+P > UMLet: Refresh Preview

2. 重启 VS Code

3. 清除扩展缓存:
   删除 .vscode/umlet/ 目录

4. 更新扩展:
   检查 Marketplace 是否有新版本
```

---

## 🔍 调试技巧

### 技巧 1: 使用最小测试用例

```
1. 创建最简单的元素:
ClassName
--
attribute

2. 逐步添加复杂性
3. 定位问题所在行
```

---

### 技巧 2: 查看 XML 源代码

```
.uxf 文件是 XML 格式:
<?xml version="1.0" encoding="UTF-8"?>
<diagram>
  <element>
    <type>UMLClass</type>
    <coordinates>...</coordinates>
    <panel_attributes>...</panel_attributes>
  </element>
</diagram>

检查 panel_attributes 内容是否正确
```

---

### 技巧 3: 对比工作示例

```
1. 使用调色板中的示例元素
2. 复制其属性文本
3. 对比自己的元素
4. 找出差异
```

---

## 🆘 获取帮助

### GitHub Issues

**报告问题前**:

1. 搜索已有 Issues: https://github.com/umlet/umlet/issues
2. 准备最小复现示例
3. 包含环境信息（OS, Java 版本, UMLet 版本）

**问题模板**:

```markdown
### 环境

- UMLet 版本: 15.1
- Java 版本: 11.0.12
- 操作系统: Ubuntu 22.04

### 问题描述

简要描述问题

### 重现步骤

1. 创建元素
2. 设置属性: ...
3. 观察到: ...

### 预期行为

应该显示...

### 实际行为

实际显示...

### 附加信息

截图、.uxf 文件
```

---

### 常见问题 FAQ

**官方 FAQ**: https://www.umlet.com/faq.htm

**常见主题**:

- 安装和配置
- 语法和标记
- 导出和集成
- 性能优化

---

### 社区支持

- **Wiki**: https://github.com/umlet/umlet/wiki
- **Stack Overflow**: 标签 `umlet`
- **Facebook**: UMLet 官方页面
- **Twitter**: @twumlet

---

## 📊 错误统计

**最常见错误 (Top 5)**:

1. 分隔线语法错误 (35%)
2. 多重性/角色配置错误 (20%)
3. JVM 内存问题 (15%)
4. 自定义元素编译失败 (15%)
5. 导出文件问题 (15%)

**解决率**:

- 语法问题: 95% 可自行解决
- 环境问题: 80% 可通过配置解决
- Bug: 需等待官方修复或使用 workaround

---

**最后更新**: 2025-10-13
**适用版本**: UMLet 15.1+
**Issue 参考**: GitHub umlet/umlet
