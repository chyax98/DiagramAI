# PacketDiag 语法规则详解

## 语法结构

### 基本格式

```
packetdiag {
  // 全局配置
  配置项 = 值

  // 字段定义
  位范围: 字段名 [属性]
}
```

## 核心语法规则

### 1. 全局配置项

#### colwidth（列宽）
```
colwidth = 8   // 8 位宽度
colwidth = 16  // 16 位宽度（常用）
colwidth = 32  // 32 位宽度（默认）
```

**规则**:
- 必须是 2 的幂次方（8, 16, 32）
- 决定了图表的列划分
- 影响字段如何排列

#### node_height（节点高度）
```
node_height = 40   // 小型图表
node_height = 72   // 标准高度（推荐）
node_height = 100  // 大型图表
```

**规则**:
- 单位为像素
- 影响文字显示清晰度
- 建议 40-100 之间

### 2. 字段定义语法

#### 基本格式
```
起始位-结束位: 字段名
```

#### 位范围规则

**单比特字段**:
```
0: Flag         // 第 0 位
15: Bit15       // 第 15 位
```

**多比特字段**:
```
0-7: Byte1      // 8 位字段
0-15: Word1     // 16 位字段
32-63: DWord    // 32 位字段
```

**位编号规则**:
- 起始位必须 ≤ 结束位
- 位编号从 0 开始
- 按从左到右、从上到下排列
- 不允许位重叠

### 3. 字段属性

#### rotate（旋转）
```
106: URG [rotate = 270]   // 逆时针旋转 270 度
107: ACK [rotate = 90]    // 顺时针旋转 90 度
```

**规则**:
- 仅支持 90, 180, 270 度
- 常用于单比特标志位
- 270 度表示垂直向上文字

#### colheight（列高度）
```
192-223: Payload [colheight = 3]   // 占 3 行高度
```

**规则**:
- 整数值，表示行数
- 用于可变长度字段
- 视觉上更突出

### 4. 注释规则

```
packetdiag {
  // 单行注释
  colwidth = 32  // 行尾注释

  /*
   * 多行注释
   * 支持详细说明
   */
  0-15: Field
}
```

## 高级语法特性

### 1. 连续字段定义

```
packetdiag {
  colwidth = 32

  // 连续定义
  0-15: Source Port
  16-31: Destination Port
  32-63: Sequence Number
  64-95: Acknowledgment Number
}
```

### 2. 特殊字符处理

```
0-15: Source Port           // 普通文本
16-31: (Optional Field)     // 括号表示可选
32-63: Reserved/Unused      // 斜杠分隔
64-95: Data [Variable]      // 方括号说明
```

### 3. 位宽计算

```
字段宽度 = 结束位 - 起始位 + 1

示例:
0-7   → 8 位
0-15  → 16 位
32-63 → 32 位
```

### 4. 行列布局

```
// colwidth = 32 时的布局
0-15: Field1       | 16-31: Field2      // 第 1 行
32-63: Field3                           // 第 2 行（跨整行）
64-79: F4 | 80-95: F5 | 96-111: F6      // 第 3 行（3 个字段）
```

## 语法约束

### 必须遵守的规则

1. **唯一性**: 每个位只能被一个字段占用
2. **连续性**: 建议按位顺序定义字段
3. **对齐**: 字段边界应对齐到列宽
4. **命名**: 字段名不能包含特殊字符（`,`, `;`, `{`, `}`）

### 推荐但非强制的规则

1. **位编号升序**: 从小到大定义字段
2. **列宽对齐**: 字段宽度是 colwidth 的整数倍
3. **标准位宽**: 优先使用 8/16/32 位字段
4. **注释说明**: 复杂字段添加注释

## 错误语法示例

### ❌ 位重叠
```
0-15: Field1
10-25: Field2    // 错误：与 Field1 重叠
```

### ❌ 位顺序错误
```
15-0: Field      // 错误：起始位 > 结束位
```

### ❌ 无效属性值
```
0-15: Field [rotate = 45]    // 错误：仅支持 90/180/270
```

### ❌ 缺少冒号
```
0-15 Field       // 错误：缺少冒号分隔符
```

## 正确语法示例

### ✅ 标准 IPv4 头部
```
packetdiag {
  colwidth = 32
  node_height = 72

  0-3: Version
  4-7: IHL
  8-15: Type of Service
  16-31: Total Length
  32-47: Identification
  48-50: Flags
  51-63: Fragment Offset
  64-71: TTL
  72-79: Protocol
  80-95: Header Checksum
  96-127: Source Address
  128-159: Destination Address
}
```

### ✅ 使用旋转和高度
```
packetdiag {
  colwidth = 32
  node_height = 72

  0-99: Data Offset
  100: Reserved [rotate = 270]
  101: Reserved [rotate = 270]
  102: Reserved [rotate = 270]
  103: NS [rotate = 270]
  104: CWR [rotate = 270]
  105: ECE [rotate = 270]
  160-191: Options [colheight = 2]
}
```

## 语法检查清单

- [ ] 是否定义了 `packetdiag { }` 块
- [ ] colwidth 值是否合法（8/16/32）
- [ ] 位范围是否连续无重叠
- [ ] 起始位是否 ≤ 结束位
- [ ] 字段名是否避免特殊字符
- [ ] rotate 值是否为 90/180/270
- [ ] colheight 值是否为正整数
- [ ] 是否有语法错误（缺少冒号、括号不匹配）

## 语法参考速查

| 元素 | 语法 | 示例 |
|------|------|------|
| 配置块 | `packetdiag { }` | `packetdiag { ... }` |
| 列宽 | `colwidth = N` | `colwidth = 32` |
| 节点高度 | `node_height = N` | `node_height = 72` |
| 字段定义 | `start-end: name` | `0-15: Port` |
| 单比特 | `bit: name` | `0: Flag` |
| 旋转 | `[rotate = N]` | `[rotate = 270]` |
| 列高 | `[colheight = N]` | `[colheight = 3]` |
| 注释 | `// ...` 或 `/* ... */` | `// Comment` |

## 参考资源

- [BlockDiag 语法指南](http://blockdiag.com/en/nwdiag/)
- [PacketDiag 示例集](http://blockdiag.com/en/nwdiag/packetdiag-examples.html)
