# D2 常见错误与解决方案

> **文档版本**: v1.0  
> **最后更新**: 2025-01-13

---

## 🔴 语法错误

### 1. 引号相关错误

#### 错误: 特殊字符未引号

```d2
# ❌ 错误
user-service -> api-gateway
node: value with spaces

# ✅ 正确
"user-service" -> "api-gateway"
node: "value with spaces"
```

**错误信息**: `syntax error near line X`

**解决方案**: 包含特殊字符(`-`, 空格, `:`, `;` 等)的标识符必须用引号包裹。

---

#### 错误: 非 ASCII 字符

```d2
# ❌ 错误: 中文冒号
node：label

# ❌ 错误: 中文分号
comment；here

# ✅ 正确: ASCII 字符
node: label
comment; here
```

**错误信息**: `unexpected character`

**解决方案**:

- 使用 ASCII 版本的特殊符号: `:` `;` `.` `{` `}`
- 中文内容放在标签/值中,而非语法结构

---

### 2. 连接错误

#### 错误: 引用标签而非键名

```d2
# ❌ 错误
Backend: API Server
Frontend: Web UI
Backend -> Frontend  # 引用的是标签,不是键

# ✅ 正确方式1: 引用键名
be: API Server
fe: Web UI
be -> fe

# ✅ 正确方式2: 使用引号键名
"Backend": API Server
"Frontend": Web UI
"Backend" -> "Frontend"
```

**错误信息**: 节点未定义或连接不显示

**根本原因**: D2 连接必须引用节点的**键名**(key),不是**标签**(label)。

---

#### 错误: 重复连接叠加

```d2
# ⚠️ 会创建3条独立连接
Database -> S3: backup
Database -> S3: backup
Database -> S3
```

**现象**: 图表中出现多条相同连接

**解决方案**: 每条连接定义只写一次,或使用变量/导入避免重复。

---

### 3. 作用域错误

#### 错误: 跨容器引用不完整

```d2
# ❌ 错误
aws: {
  ec2
}
gcp: {
  storage
  ec2 -> storage  # 会在 gcp 内创建新 ec2 节点
}

# ✅ 正确
aws: {
  ec2
}
gcp: {
  storage
  _.aws.ec2 -> storage  # 使用完整路径
}
```

**错误现象**:

- 节点重复创建
- 连接未按预期显示

**解决方案**: 使用 `_.parent.child` 或完整路径引用外部节点。

---

### 4. 保留字冲突

#### 错误: 使用保留字作为键名

```d2
# ❌ 保留字直接使用
width: 100
height: 200

# ✅ 正确: 加引号
"width": 100
"height": 200

# 或使用非保留字
box_width: 100
box_height: 200
```

**保留字列表**:

- `style`, `shape`, `width`, `height`, `class`, `icon`
- `vars`, `classes`, `direction`, `constraint`

---

## 🟡 样式错误

### 1. 颜色格式错误

```d2
# ❌ 错误格式
node.style.fill: red       # 不支持颜色名
node.style.fill: #FF00     # 格式不完整

# ✅ 正确格式
node.style.fill: "#FF0000"  # 完整 Hex
node.style.fill: "#F00"     # 简写 Hex
node.style.fill: "rgb(255, 0, 0)"  # RGB
```

---

### 2. 样式属性拼写错误

```d2
# ❌ 常见拼写错误
node.style.fill-color: "#000"   # 应该是 fill
node.style.borderRadius: 8      # 应该是 border-radius
node.style.fontsize: 16         # 应该是 font-size

# ✅ 正确
node.style.fill: "#000"
node.style.border-radius: 8
node.style.font-size: 16
```

---

## 🟠 渲染错误

### 1. 文本过长不换行

```d2
# ❌ 问题: 文本在一行显示过长
node: Very long text that should be on multiple lines

# ✅ 解决: 手动添加换行
node: Very long text\nthat should be\non multiple lines

# ✅ 或使用块字符串
node: |
  Very long text
  that should be
  on multiple lines
|
```

---

### 2. 连接路径混乱

**现象**: 连接线穿过其他节点或重叠

**解决方案**:

```d2
# 1. 切换布局引擎
# d2 --layout elk diagram.d2

# 2. 调整节点约束
x -> y: {
  style.stroke-dash: 5  # 使用虚线区分
}

# 3. 使用容器分组减少复杂度
```

---

### 3. Markdown 渲染失败

```d2
# ❌ 错误: HTML 标签不语义化
content: |md
  Line 1<br>Line 2  # <br> 会报错
|

# ✅ 正确: 使用语义化标签
content: |md
  Line 1<br/>Line 2  # <br/> 自闭合
|
```

**错误信息**: `invalid XML` 或 SVG 渲染失败

---

## 🔵 布局问题

### 1. 布局引擎选择不当

| 问题           | 建议布局引擎         |
| -------------- | -------------------- |
| 节点重叠严重   | ELK (`--layout elk`) |
| 层次关系不清晰 | dagre (默认)         |
| 需要美观布局   | TALA (商业)          |
| 大规模复杂图   | ELK                  |

---

### 2. 容器尺寸问题

```d2
# 如果容器内容被截断:
container: {
  width: 500   # 手动指定宽度
  height: 300  # 手动指定高度
  # 内容...
}
```

---

## 🟣 导入与模块化错误

### 1. 导入路径错误

```d2
# ❌ 错误: 相对路径不正确
...@../wrong/path.d2

# ✅ 正确: 使用正确的相对路径
...@components/module.d2

# ✅ 或绝对路径
...@/project/components/module.d2
```

---

### 2. 循环导入

```d2
# ❌ 错误: A 导入 B, B 导入 A
# a.d2
...@b.d2

# b.d2
...@a.d2

# ✅ 解决: 重构为单向依赖或使用共享模块
# shared.d2 (公共定义)
# a.d2 导入 shared.d2
# b.d2 导入 shared.d2
```

---

## 🎯 调试技巧

### 1. 使用 CLI 调试

```bash
# 查看详细错误信息
d2 -v diagram.d2

# 检查语法(不渲染)
d2 --dry-run diagram.d2

# 使用不同布局引擎测试
d2 --layout elk diagram.d2
d2 --layout dagre diagram.d2
```

### 2. 逐步排查

1. **注释法**: 逐段注释代码定位问题
2. **简化法**: 从最小示例开始逐步添加
3. **对比法**: 与官方示例对比语法

### 3. 自动格式化

```bash
# 使用 D2 自动格式化修复格式问题
d2 fmt diagram.d2
```

---

## 📋 错误排查清单

### 语法检查

- [ ] 特殊字符是否用引号包裹?
- [ ] 是否使用了非 ASCII 符号?
- [ ] 连接是否引用键名而非标签?
- [ ] 保留字是否加引号?

### 作用域检查

- [ ] 跨容器引用是否使用完整路径?
- [ ] 是否误创建同名节点?
- [ ] 父级引用是否正确使用 `_`?

### 样式检查

- [ ] 颜色格式是否正确 (Hex/RGB)?
- [ ] 样式属性名是否拼写正确?
- [ ] 是否使用了不支持的属性?

### 渲染检查

- [ ] 长文本是否添加换行?
- [ ] HTML 标签是否语义化?
- [ ] 布局引擎是否适合图表类型?

---

## 🔗 参考资源

- 官方故障排查: https://d2lang.com/tour/troubleshoot
- FAQ: https://d2lang.com/tour/faq
- GitHub Issues: https://github.com/terrastruct/d2/issues
- Discord 社区: https://discord.gg/NF6X8K4eDq
