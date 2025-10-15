# PacketDiag 常见错误及解决方案

## 错误分类

### 1. 语法错误（Syntax Errors）

#### 错误 1.1: 缺少冒号分隔符

**错误示例**:

```
packetdiag {
  0-15 Source Port    // ❌ 缺少冒号
}
```

**错误信息**:

```
SyntaxError: invalid syntax
```

**解决方案**:

```
packetdiag {
  0-15: Source Port   // ✅ 添加冒号
}
```

#### 错误 1.2: 括号不匹配

**错误示例**:

```
packetdiag {
  0-15: Field [rotate = 270    // ❌ 缺少右括号
```

**错误信息**:

```
ParseError: unmatched bracket
```

**解决方案**:

```
packetdiag {
  0-15: Field [rotate = 270]   // ✅ 补全括号
}
```

#### 错误 1.3: 缺少外层大括号

**错误示例**:

```
packetdiag
  colwidth = 32     // ❌ 缺少大括号
  0-15: Field
```

**解决方案**:

```
packetdiag {       // ✅ 添加大括号
  colwidth = 32
  0-15: Field
}
```

### 2. 位范围错误（Bit Range Errors）

#### 错误 2.1: 位重叠

**错误示例**:

```
packetdiag {
  0-15: Field1
  10-25: Field2     // ❌ 与 Field1 重叠（10-15）
}
```

**错误信息**:

```
ValueError: overlapping bit ranges
```

**解决方案**:

```
packetdiag {
  0-15: Field1
  16-31: Field2     // ✅ 无重叠
}
```

#### 错误 2.2: 起始位大于结束位

**错误示例**:

```
packetdiag {
  31-0: Field       // ❌ 31 > 0
}
```

**错误信息**:

```
ValueError: start bit must be <= end bit
```

**解决方案**:

```
packetdiag {
  0-31: Field       // ✅ 正确顺序
}
```

#### 错误 2.3: 位编号为负数

**错误示例**:

```
packetdiag {
  -1-7: Field       // ❌ 负数位
}
```

**解决方案**:

```
packetdiag {
  0-7: Field        // ✅ 从 0 开始
}
```

### 3. 属性错误（Attribute Errors）

#### 错误 3.1: 无效的旋转角度

**错误示例**:

```
packetdiag {
  0: Flag [rotate = 45]    // ❌ 不支持 45 度
}
```

**错误信息**:

```
ValueError: rotate must be 90, 180, or 270
```

**解决方案**:

```
packetdiag {
  0: Flag [rotate = 270]   // ✅ 使用支持的角度
}
```

#### 错误 3.2: colheight 非正整数

**错误示例**:

```
packetdiag {
  0-31: Data [colheight = 0]      // ❌ 0 无效
  32-63: Data2 [colheight = -1]   // ❌ 负数无效
  64-95: Data3 [colheight = 1.5]  // ❌ 小数无效
}
```

**解决方案**:

```
packetdiag {
  0-31: Data [colheight = 1]      // ✅ 正整数
  32-63: Data2 [colheight = 2]
  64-95: Data3 [colheight = 3]
}
```

### 4. 配置错误（Configuration Errors）

#### 错误 4.1: colwidth 值无效

**错误示例**:

```
packetdiag {
  colwidth = 20     // ❌ 不是 2 的幂次方
}
```

**错误信息**:

```
ValueError: colwidth must be 8, 16, or 32
```

**解决方案**:

```
packetdiag {
  colwidth = 16     // ✅ 有效值：8, 16, 32
}
```

#### 错误 4.2: node_height 超出范围

**错误示例**:

```
packetdiag {
  node_height = 5       // ❌ 太小，文字不可读
  node_height = 1000    // ❌ 太大，图像过大
}
```

**建议值**:

```
packetdiag {
  node_height = 72      // ✅ 推荐值（40-100）
}
```

### 5. 逻辑错误（Logical Errors）

#### 错误 5.1: 位范围不连续

**问题示例**:

```
packetdiag {
  0-15: Field1
  32-47: Field2     // 跳过了 16-31
}
```

**说明**: 不是语法错误，但会导致图表有空白区域

**改进方案**:

```
packetdiag {
  0-15: Field1
  16-31: Reserved   // ✅ 填充空白区域
  32-47: Field2
}
```

#### 错误 5.2: 字段宽度不对齐

**问题示例**:

```
packetdiag {
  colwidth = 32
  0-10: Field1      // 11 位，不对齐
  11-31: Field2     // 21 位，不对齐
}
```

**改进方案**:

```
packetdiag {
  colwidth = 32
  0-15: Field1      // 16 位，对齐
  16-31: Field2     // 16 位，对齐
}
```

### 6. 渲染错误（Rendering Errors）

#### 错误 6.1: 字段名过长

**问题示例**:

```
packetdiag {
  0-7: Very Long Field Name That Does Not Fit
}
```

**解决方案**:

```
packetdiag {
  0-7: VL Field     // ✅ 缩写
  // 或使用更宽的字段
  0-31: Very Long Field Name That Does Not Fit
}
```

#### 错误 6.2: 单比特字段未旋转

**问题示例**:

```
packetdiag {
  0: Flag1          // 文字可能无法显示
  1: Flag2
}
```

**改进方案**:

```
packetdiag {
  0: Flag1 [rotate = 270]   // ✅ 垂直显示
  1: Flag2 [rotate = 270]
}
```

## 调试技巧

### 1. 分步验证

```
# 步骤 1: 最小化测试
packetdiag {
  0-15: Test
}

# 步骤 2: 逐步添加字段
packetdiag {
  0-15: Field1
  16-31: Field2
}

# 步骤 3: 添加配置
packetdiag {
  colwidth = 32
  0-15: Field1
  16-31: Field2
}
```

### 2. 使用注释隔离错误

```
packetdiag {
  0-15: Field1
  // 16-31: Problematic Field    // 注释掉可疑部分
  32-47: Field3
}
```

### 3. 检查位范围连续性

```python
# 辅助脚本检查位连续性
fields = [
    (0, 15, "Field1"),
    (16, 31, "Field2"),
    (32, 63, "Field3")
]

for i in range(len(fields) - 1):
    if fields[i][1] + 1 != fields[i+1][0]:
        print(f"Gap between {fields[i][2]} and {fields[i+1][2]}")
```

### 4. 验证位宽计算

```python
# 计算字段位宽
def bit_width(start, end):
    return end - start + 1

# 检查是否对齐 colwidth
colwidth = 32
for start, end, name in fields:
    width = bit_width(start, end)
    if width % colwidth != 0 and width < colwidth:
        print(f"{name}: width {width} not aligned to {colwidth}")
```

## 错误预防清单

### 编写前检查

- [ ] 确定 colwidth（8/16/32）
- [ ] 规划所有字段的位范围
- [ ] 列出字段清单及位宽
- [ ] 检查位范围是否连续
- [ ] 确认是否需要旋转属性

### 编写时检查

- [ ] 每个字段都有冒号
- [ ] 位范围格式正确（start-end）
- [ ] 起始位 ≤ 结束位
- [ ] 属性值合法（rotate: 90/180/270）
- [ ] 括号配对正确

### 编写后检查

- [ ] 运行语法检查工具
- [ ] 预览渲染结果
- [ ] 验证字段对齐
- [ ] 检查文字可读性
- [ ] 确认无空白间隙（除非有意为之）

## 常见问题 FAQ

### Q1: 为什么我的图表显示不完整?

**A**: 检查位范围是否超出 colwidth 的倍数范围，或者 node_height 设置过小。

### Q2: 如何处理可变长度字段?

**A**: 使用 `colheight` 属性扩展字段高度：

```
0-31: Variable Data [colheight = 3]
```

### Q3: 多个单比特标志如何排列?

**A**: 使用 rotate 属性垂直显示：

```
0: F1 [rotate = 270]
1: F2 [rotate = 270]
```

### Q4: 如何表示保留/未使用字段?

**A**: 使用明确命名：

```
16-31: Reserved
32-47: (Unused)
```

### Q5: 位编号必须连续吗?

**A**: 不强制，但建议连续以避免视觉空白。

## 工具支持

### 在线验证工具

- Kroki Live Editor: https://kroki.io/
- BlockDiag Playground: http://interactive.blockdiag.com/

### 本地验证

```bash
# 安装 nwdiag
pip install nwdiag

# 验证语法
packetdiag --help

# 生成图表并检查错误
packetdiag test.diag
```

## 参考资源

- [BlockDiag 错误处理](http://blockdiag.com/en/)
- [Python 语法错误调试](https://realpython.com/python-exceptions/)
- [PacketDiag 示例](http://blockdiag.com/en/nwdiag/packetdiag-examples.html)
