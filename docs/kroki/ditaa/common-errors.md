# Ditaa 常见错误和解决方案

## 渲染错误

### 1. 形状无法识别

#### 错误现象
```
// 输入
+-----+
|     |
+----

// 输出: 只显示线条,不是矩形
```

#### 原因
- 形状未完全闭合
- 缺少角落连接符

#### 解决方案
```
// 正确写法
+-----+
|     |
+-----+  ✅ 完整闭合
```

**检查清单**:
- ✅ 四个角都有 `+` 或 `/\`
- ✅ 边缘线条连续无断点
- ✅ 左右对齐正确

### 2. 颜色不生效

#### 错误现象
```
// 输入
+-----+
cRED
+-----+

// 输出: 无颜色
```

#### 原因
- 颜色代码在形状外部
- 颜色代码格式错误

#### 解决方案
```
// 方法 1: 颜色在形状内
+-----+
|cRED |  ✅
+-----+

// 方法 2: 与文本同行
+-----+
|cRED Text|  ✅
+-----+

// 错误写法
cRED +-----+  ❌ 在形状外
     |     |
     +-----+
```

**颜色规则**:
- ✅ 必须在闭合形状内
- ✅ 格式: `cXXX` (X 为 0-9 或 A-F)
- ✅ 或使用预定义: `cRED`, `cBLU`, `cGRE` 等

### 3. 虚线未正确渲染

#### 错误现象
```
// 期望虚线,实际显示实线
+-----+
|     |
+-----+
```

#### 原因
- 未使用虚线标记符 (`:` 或 `=`)
- 标记符位置错误

#### 解决方案
```
// 水平虚线 (使用 =)
+-=---+
|     |
+-----+  ✅

// 垂直虚线 (使用 :)
+-----+
:     :
+-----+  ✅

// 完全虚线
+-=---+
:     :
+-=---+  ✅
```

**虚线技巧**:
- 只需一个标记符即可使整条线变虚线
- `:` 用于垂直线
- `=` 用于水平线
- 对角线不支持虚线

### 4. 标签不起作用

#### 错误现象
```
// 输入 {d} 标签期望文档形状
+-----+
| {d} |
+-----+

// 输出: 普通矩形,非文档符号
```

#### 可能原因及解决方案

##### 原因 1: 标签拼写错误
```
// 错误
+-----+
| {D} |  ❌ 大写
+-----+

// 正确
+-----+
| {d} |  ✅ 小写
+-----+
```

##### 原因 2: 标签位置错误
```
// 错误
{d}
+-----+
|     |
+-----+  ❌ 标签在形状外

// 正确
+-----+
| {d} |  ✅ 标签在形状内
+-----+
```

##### 原因 3: 不支持的标签
```
// 支持的标签
{c}   - Choice/Decision
{d}   - Document
{io}  - Input/Output
{mo}  - Manual Operation
{o}   - Ellipse
{s}   - Storage
{tr}  - Trapezoid

// 其他标签无效
{x}   ❌ 不存在的标签
```

### 5. 箭头方向错误

#### 错误现象
```
// 期望向右箭头
--->

// 实际: 箭头消失或方向错误
```

#### 解决方案
```
// 向右箭头 ✅
--->
---->
----->

// 向左箭头 ✅
<---
<----
<-----

// 双向箭头 ✅
<--->
<---->

// 向下箭头 ✅
|
v

// 向上箭头 ✅
^
|
```

**箭头规则**:
- 箭头符号 (`>`, `<`, `v`, `^`) 必须在线条末端
- 至少需要 3 个 `-` 才能形成水平箭头
- 垂直箭头使用 `|` 加方向符

### 6. 字符编码问题

#### 错误现象
```
// 中文乱码或无法显示
+--------+
|  中文  |
+--------+
```

#### 原因
- 文件编码不是 UTF-8
- 未配置支持的字体

#### 解决方案

##### 1. 确保 UTF-8 编码
```bash
# 检查文件编码
file -i diagram.ditaa

# 转换为 UTF-8
iconv -f GBK -t UTF-8 diagram.ditaa > diagram_utf8.ditaa
```

##### 2. 指定字体
```bash
# 命令行指定字体
java -jar ditaa.jar -f /usr/share/fonts/truetype/wqy-microhei.ttc diagram.ditaa

# 或配置 ~/.ditaarc
[ditaa]
fontpath = /usr/share/fonts/truetype/wqy-microhei.ttc
```

##### 3. 推荐中文字体
- **Linux**: WenQuanYi Micro Hei
- **Windows**: Microsoft YaHei
- **macOS**: PingFang SC

### 7. 圆角不渲染

#### 错误现象
```
// 期望圆角,实际直角
/-----\
|     |
\-----/
```

#### 原因及解决方案

##### 原因 1: 字符不连续
```
// 错误
/-----\
|      |  ❌ 宽度不匹配
\-----/

// 正确
/-----\
|     |  ✅ 宽度匹配
\-----/
```

##### 原因 2: 使用了 + 而非 / \
```
// 直角
+-----+
|     |
+-----+  → 直角矩形

// 圆角
/-----\
|     |
\-----/  → 圆角矩形
```

### 8. 点标记未显示

#### 错误现象
```
// 期望显示点标记
*----*

// 实际: 星号被当作普通文本
```

#### 原因
- `*` 位于线条末端
- `*` 周围缺少线条

#### 解决方案
```
// 正确: * 在线条中间
*----*  ✅

// 错误: * 在末端
----*   ❌
*       ❌

// 多个点标记
*--*--*  ✅
```

**注意**: 点标记功能仍为实验性,可能不稳定。

## 性能问题

### 9. 渲染速度慢

#### 症状
- 生成图片耗时过长
- Java 进程占用大量内存

#### 可能原因及解决方案

##### 原因 1: 图表过大
```
// 解决: 拆分为多个小图
// 原来: 一个大图 100x100
// 改为: 4 个小图 25x25
```

##### 原因 2: 过多颜色
```
// 避免过多颜色变化
+----+----+----+
|cRED|cBLU|cGRE|  ❌ 每个格子不同颜色
+----+----+----+

// 简化颜色
+----+----+----+
|cRED|cRED|cBLU|  ✅ 减少颜色数量
+----+----+----+
```

##### 原因 3: Java 内存不足
```bash
# 增加堆内存
java -Xmx512m -jar ditaa.jar large_diagram.ditaa

# 或更大
java -Xmx1g -jar ditaa.jar large_diagram.ditaa
```

### 10. 输出文件损坏

#### 症状
- 生成的 PNG 无法打开
- 图片显示不完整

#### 解决方案

##### 1. 检查磁盘空间
```bash
df -h
```

##### 2. 验证 Java 版本
```bash
java -version
# 推荐 JRE 1.5 或更高
```

##### 3. 重新生成
```bash
# 删除旧文件
rm output.png

# 强制覆盖
java -jar ditaa.jar -o input.ditaa output.png
```

## 语法解析错误

### 11. 特殊字符冲突

#### 错误: 冒号在文本中
```
// 问题
+----------------+
| Time: 10:30 AM |
+----------------+

// 冒号被误认为虚线标记
```

#### 解决方案
```
// 方法 1: 避免单独的冒号在垂直线附近
+------------------+
| Time - 10:30 AM  |
+------------------+

// 方法 2: 使用空格分隔
+------------------+
| Time : 10:30 AM  |
+------------------+

// 方法 3: 使用其他符号
+------------------+
| Time = 10:30 AM  |
+------------------+
```

### 12. 对齐问题

#### 错误现象
```
// 输入看起来对齐
+-----+
| Box |
 +-----+  ← 左侧多一个空格

// 输出: 形状断裂
```

#### 解决方案
```
// 使用等宽字体编辑器
// 推荐工具:
- VS Code (启用 ruler)
- Vim (set list)
- Emacs (whitespace-mode)

// 正确对齐
+-----+
| Box |
+-----+  ✅ 完全对齐
```

### 13. Tab 字符问题

#### 错误现象
```
// 使用了 Tab 导致对齐混乱
+-----+	+-----+
|  A  |	|  B  |  ← Tab 字符
+-----+	+-----+
```

#### 解决方案
```bash
# 方法 1: 转换 Tab 为空格
expand -t 4 input.ditaa > output.ditaa

# 方法 2: 指定 Tab 宽度
java -jar ditaa.jar -t 4 input.ditaa

# 方法 3: 编辑器设置
# VS Code: "editor.insertSpaces": true
# Vim: set expandtab
```

**最佳实践**: 永远使用空格,不用 Tab。

## 集成工具错误

### 14. PlantUML 集成问题

#### 错误: PNG only 警告
```
// PlantUML 仅支持 PNG
@startditaa
// 图表内容
@endditaa
```

#### 解决方案
- PlantUML 不支持 SVG 输出
- 如需 SVG,直接使用 ditaa.jar
- 或使用 Kroki 服务

### 15. HTML 模式问题

#### 错误: 图表未被识别
```html
<!-- 错误: class 名称错误 -->
<pre class="diagram">
+-----+
| Box |
+-----+
</pre>
```

#### 解决方案
```html
<!-- 正确: 使用 textdiagram -->
<pre class="textdiagram">
+-----+
| Box |
+-----+
</pre>

<!-- 或使用 id 指定输出文件名 -->
<pre class="textdiagram" id="my_diagram">
+-----+
| Box |
+-----+
</pre>
```

### 16. Kroki 编码问题

#### 错误: URL 过长或无效
```
// 问题: 复杂图表导致 URL 过长
```

#### 解决方案
```
// 简化图表
// 或使用 Kroki POST API
curl -X POST https://kroki.io/ditaa/png \
  -H "Content-Type: text/plain" \
  -d @diagram.ditaa
```

## 调试方法

### 通用调试流程

1. **启用调试网格**
```bash
java -jar ditaa.jar -d diagram.ditaa
```

2. **分步测试**
```bash
# 最简图形
echo "+---+" > test.ditaa
echo "| A |" >> test.ditaa
echo "+---+" >> test.ditaa
java -jar ditaa.jar test.ditaa
```

3. **验证编码**
```bash
file -i diagram.ditaa  # 应显示 utf-8
```

4. **检查 Java 版本**
```bash
java -version  # 推荐 1.5+
```

5. **查看详细输出**
```bash
java -jar ditaa.jar -v diagram.ditaa
```

### 常见问题检查清单

- [ ] 文件编码是 UTF-8
- [ ] 使用空格而非 Tab
- [ ] 形状完全闭合
- [ ] 颜色/标签在形状内
- [ ] 虚线标记正确 (`:` 或 `=`)
- [ ] 箭头符号位于线条末端
- [ ] 字体路径配置正确(多语言)
- [ ] Java 版本满足要求
- [ ] 输出目录有写权限

## 错误代码参考

### Java 异常

#### OutOfMemoryError
```
java.lang.OutOfMemoryError: Java heap space
```
**解决**: 增加堆内存 `-Xmx512m` 或更大

#### FileNotFoundException
```
java.io.FileNotFoundException: input.ditaa
```
**解决**: 检查文件路径和权限

#### UnsupportedEncodingException
```
java.io.UnsupportedEncodingException
```
**解决**: 使用 `-e UTF-8` 指定编码

### Ditaa 特定警告

#### "Unknown tag"
```
Warning: Unknown tag {xyz}
```
**解决**: 使用支持的标签或移除无效标签

#### "Cannot parse diagram"
```
Error: Cannot parse diagram
```
**解决**: 检查语法,确保形状闭合

## 获取帮助

### 官方资源
- GitHub Issues: https://github.com/stathissideris/ditaa/issues
- SourceForge: https://sourceforge.net/p/ditaa/bugs/

### 社区支持
- Stack Overflow: tag `[ditaa]`
- PlantUML 论坛: https://forum.plantuml.net/

### 报告 Bug
提供以下信息:
1. Ditaa 版本
2. Java 版本
3. 操作系统
4. 完整错误信息
5. 最小复现示例
