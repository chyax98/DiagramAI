# Erd 常见错误

## 1. 语法错误

### 1.1 全局指令位置错误

**错误示例**:
```erd
[Person]
name

title {label: "My Diagram"}  # ❌ 错误: title 必须在最前面
```

**错误信息**:
```
Parse error: title directive must appear before any entities
```

**解决方案**:
```erd
# ✓ 正确: 全局指令在最前面
title {label: "My Diagram"}

[Person]
name
```

---

### 1.2 关系基数缺失

**错误示例**:
```erd
Person -- Address  # ❌ 缺少基数符号
```

**错误信息**:
```
Parse error: relationship must specify cardinality
```

**解决方案**:
```erd
# ✓ 正确: 明确指定基数
Person *--1 Address
Person 1--* Order
Student *--* Course
```

---

### 1.3 实体名称格式错误

**错误示例**:
```erd
[User Account]  # ❌ 包含空格但未使用引号
```

**错误信息**:
```
Parse error: unexpected token 'Account'
```

**解决方案**:
```erd
# ✓ 正确: 使用引号包裹
[`User Account`]
['User Account']
["User Account"]
```

---

### 1.4 格式化花括号位置错误

**错误示例**:
```erd
[Person]
{bgcolor: "#fff"}  # ❌ 花括号不在同一行
```

**错误信息**:
```
Parse error: formatting options must start on same line as entity
```

**解决方案**:
```erd
# ✓ 正确: 花括号在同一行
[Person] {bgcolor: "#fff"}

# 或多行格式 (花括号仍在同一行开始)
[Person] {
  bgcolor: "#fff",
  size: "16"
}
```

---

### 1.5 属性键值格式错误

**错误示例**:
```erd
[Person] {bgcolor=#fff}  # ❌ 缺少引号
[Person] {bgcolor: #fff}  # ❌ 值缺少引号
```

**解决方案**:
```erd
# ✓ 正确: 值必须用双引号
[Person] {bgcolor: "#fff"}
[Person] {size: "16"}
```

---

## 2. 关系定义错误

### 2.1 引用不存在的实体

**错误示例**:
```erd
[Person]
name

Person *--1 Address  # ❌ Address 未定义
```

**错误信息**:
```
Error: entity 'Address' not found
```

**解决方案**:
```erd
# ✓ 正确: 先定义实体
[Person]
name

[Address]
street

Person *--1 Address
```

---

### 2.2 非法的基数组合

**错误示例**:
```erd
Person 2--3 Address  # ❌ 不支持数字基数
```

**解决方案**:
```erd
# ✓ 正确: 使用标准基数符号
# ?: 0 或 1
# 1: 恰好 1
# *: 0 或多个
# +: 1 或多个

Person 1--* Address
```

---

### 2.3 自引用关系语法错误

**错误示例**:
```erd
Employee ?--1 Employee  # ✓ 技术上正确，但可能语义不明
```

**最佳实践**:
```erd
# ✓ 更好: 添加标签说明
Employee ?--1 Employee {label: "reports to"}
Employee *--1 Employee {label: "manages"}
```

---

## 3. 格式化错误

### 3.1 颜色值格式错误

**错误示例**:
```erd
[Person] {bgcolor: #fff}      # ❌ 缺少引号
[Person] {bgcolor: "fff"}     # ❌ 缺少 # 号
[Person] {color: rgb(0,0,0)}  # ❌ 不支持 RGB 函数
```

**解决方案**:
```erd
# ✓ 正确: 使用十六进制
[Person] {bgcolor: "#ffffff"}
[Person] {color: "#000000"}

# ✓ 或使用颜色名
[Person] {bgcolor: "AliceBlue"}
[Person] {color: "Black"}
```

---

### 3.2 字体名称错误

**错误示例**:
```erd
[Person] {font: "Arial"}  # ❌ GraphViz 可能不支持
```

**解决方案**:
```erd
# ✓ 正确: 使用 GraphViz 标准字体
[Person] {font: "Times-Roman"}
[Person] {font: "Helvetica"}
[Person] {font: "Courier"}
```

---

### 3.3 尺寸单位错误

**错误示例**:
```erd
[Person] {size: 16}     # ❌ 缺少引号
[Person] {size: "16px"} # ❌ 不支持 px 单位
```

**解决方案**:
```erd
# ✓ 正确: 字体大小为纯数字字符串
[Person] {size: "16"}
[Person] {size: "20"}
```

---

## 4. 属性定义错误

### 4.1 主键/外键符号错误

**错误示例**:
```erd
[Person]
* person_id  # ❌ 空格分隔
+birth_id    # ❌ 应该是复合键时使用 *+
```

**解决方案**:
```erd
# ✓ 正确: 符号紧邻属性名
[Person]
*person_id        # 主键
+birth_place_id   # 外键
*+order_id        # 复合主键/外键
```

---

### 4.2 属性标签格式错误

**错误示例**:
```erd
[Person]
*person_id label: "varchar, not null"  # ❌ 缺少花括号
```

**解决方案**:
```erd
# ✓ 正确
[Person]
*person_id {label: "varchar, not null"}
```

---

## 5. 配置文件错误

### 5.1 配置文件路径错误

**错误示例**:
```bash
erd -c ~/.erd.yml -i schema.er  # ❌ 扩展名应该是 .yaml
```

**解决方案**:
```bash
# ✓ 正确
erd -c ~/.erd.yaml -i schema.er

# 或使用自定义路径
erd -c ./myconfig.yaml -i schema.er
```

---

### 5.2 配置文件不存在

**错误信息**:
```
Error: config file not found: ~/.erd.yaml
```

**解决方案**:
```bash
# 生成默认配置文件
erd -c > ~/.erd.yaml

# 或不使用配置文件
erd -i schema.er -o output.pdf
```

---

## 6. GraphViz 相关错误

### 6.1 GraphViz 未安装

**错误信息**:
```
Error: dot command not found
```

**解决方案**:
```bash
# macOS
brew install graphviz

# Ubuntu/Debian
sudo apt-get install graphviz

# Fedora
sudo dnf install graphviz
```

---

### 6.2 文本格式化问题 (macOS)

**问题**: 粗体和斜体不显示

**原因**: GraphViz 缺少 Pango 支持

**解决方案**:
```bash
# 重新安装带 Pango 的 GraphViz
brew uninstall graphviz
brew install graphviz

# 验证 Pango 支持
dot -v | grep pango
```

参考: [GraphViz Issue 1636](https://gitlab.com/graphviz/graphviz/issues/1636)

---

## 7. 输出格式错误

### 7.1 不支持的输出格式

**错误示例**:
```bash
erd -i schema.er -f webp  # ❌ 不支持 webp
```

**错误信息**:
```
Error: unsupported format 'webp'
```

**支持的格式**:
```bash
# ✓ 矢量格式
erd -f pdf
erd -f svg
erd -f eps

# ✓ 位图格式
erd -f png
erd -f jpg

# ✓ 其他格式
erd -f dot
erd -f plain
```

---

### 7.2 文件扩展名推断错误

**错误示例**:
```bash
erd -i schema.er -o output.jpeg  # ❌ 应该是 .jpg
```

**解决方案**:
```bash
# ✓ 使用标准扩展名
erd -i schema.er -o output.jpg

# ✓ 或明确指定格式
erd -i schema.er -o output.jpeg -f jpg
```

---

## 8. 边样式错误

### 8.1 不支持的边类型

**错误示例**:
```bash
erd -e bezier  # ❌ 不支持
```

**支持的边类型**:
```bash
erd -e compound
erd -e noedge
erd -e ortho
erd -e poly
erd -e spline  # 默认
```

---

### 8.2 不支持的边样式

**错误示例**:
```bash
erd -p double  # ❌ 不支持
```

**支持的边样式**:
```bash
erd -p solid   # 实线
erd -p dashed  # 虚线
erd -p dotted  # 点线
```

---

## 9. 符号系统错误

### 9.1 不支持的符号系统

**错误示例**:
```bash
erd -n crow  # ❌ 不支持鸦爪符号
```

**支持的符号系统**:
```bash
erd -n ie   # Information Engineering (默认)
erd -n uml  # UML 符号
```

---

## 10. Docker 使用错误

### 10.1 文件路径映射错误

**错误示例**:
```bash
docker run -i ghcr.io/burntsushi/erd:latest schema.er  # ❌ 无法读取文件
```

**解决方案**:
```bash
# ✓ 使用标准输入
docker run -i ghcr.io/burntsushi/erd:latest < schema.er > output.pdf

# ✓ 或挂载卷
docker run -i -v $(pwd):/data ghcr.io/burntsushi/erd:latest < /data/schema.er > /data/output.pdf
```

---

## 调试技巧

### 1. 逐步构建
从最简单的例子开始:
```erd
[Person]
name
```

逐步添加复杂性:
```erd
[Person]
*person_id
name

[Address]
*address_id

Person *--1 Address
```

### 2. 使用 DOT 中间格式
```bash
# 生成 DOT 文件查看中间结果
erd -i schema.er -o schema.dot

# 手动调用 GraphViz
dot -Tsvg schema.dot -o output.svg
```

### 3. 检查 GraphViz 版本
```bash
dot -V
```

确保版本 >= 2.38

### 4. 查看详细错误
```bash
# 重定向错误到文件
erd -i schema.er 2> errors.log

# 或使用 verbose 模式 (如果支持)
erd -i schema.er --verbose
```

### 5. 验证配置文件
```bash
# 导出当前默认配置
erd -c > current-config.yaml

# 对比差异
diff ~/.erd.yaml current-config.yaml
```

## 常见问题 FAQ

**Q: 为什么我的图表中文字重叠?**

A: 可能是字体大小设置不当，尝试调整:
```erd
entity {size: "12"}  # 减小字体
```

**Q: 关系线为什么穿过实体?**

A: 尝试不同的边类型:
```bash
erd -e ortho  # 正交边
erd -e spline # 曲线边
```

**Q: 如何让图表更紧凑?**

A: 使用配置文件调整间距，或使用 DOT 输出手动调整。

**Q: 支持中文吗?**

A: 理论上支持 UTF-8，但需要确保 GraphViz 配置了正确的字体。
