# WaveDrom 语法规则

> 更新时间: 2025-10-13

## JSON 结构规范

### 根对象

WaveDrom 图表必须是一个合法的 JSON 对象:

```json
{
  "signal": [...],      // 必需: 信号数组
  "config": {...},      // 可选: 配置选项
  "head": {...},        // 可选: 头部配置
  "foot": {...}         // 可选: 脚部配置
}
```

**重要**:
- 所有 JSON 键名推荐使用双引号(虽然单引号在某些实现中也能工作)
- 对象最后一个属性后不要有逗号
- 字符串必须用引号包裹

### Signal 数组规则

#### 基本信号对象

```json
{
  "name": "signal_name",    // 必需: 信号名称
  "wave": "01.x",           // 必需: 波形字符串
  "data": ["D1", "D2"],     // 可选: 数据标签
  "node": ".a.b",           // 可选: 节点标记
  "period": 2,              // 可选: 周期倍数
  "phase": 0.5              // 可选: 相位偏移
}
```

#### 波形字符规则

| 类别 | 字符 | 说明 | 示例 |
|-----|------|------|------|
| **逻辑电平** | `0` | 低电平 | `wave: "0..."` |
| | `1` | 高电平 | `wave: "1..."` |
| | `x` | 不确定态 | `wave: "x..."` |
| | `z` | 高阻态 | `wave: "z..."` |
| | `.` | 延续上一状态 | `wave: "0.1."` |
| **数据信号** | `=` | 从 data 取值 | `wave: "x=x", data: ["A"]` |
| | `2-9` | 直接显示数字 | `wave: "x234x"` |
| | `u` | 未定义数据 | `wave: "u..."` |
| | `d` | 下降沿数据 | `wave: "d..."` |
| **时钟信号** | `p` | 正时钟(小写) | `wave: "p..."` |
| | `P` | 正时钟(大写) | `wave: "P..."` |
| | `n` | 负时钟(小写) | `wave: "n..."` |
| | `N` | 负时钟(大写) | `wave: "N..."` |
| | `h` | 半高电平 | `wave: "h..."` |
| | `l` | 半低电平 | `wave: "l..."` |
| | `H` | 全高电平 | `wave: "H..."` |
| | `L` | 全低电平 | `wave: "L..."` |
| **特殊** | `\|` | 垂直分隔线 | `wave: "p...\|..."` |

### 分组规则

使用数组创建信号分组:

```json
{
  "signal": [
    { "name": "clk", "wave": "p..." },
    ["Group Name",              // 分组名称(可选)
      { "name": "sig1", "wave": "01.." },
      { "name": "sig2", "wave": "0.1." }
    ],
    {},                         // 空对象创建空行
    ["Nested Group",            // 支持嵌套分组
      ["Sub Group",
        { "name": "sig3", "wave": "x..." }
      ]
    ]
  ]
}
```

**分组规则**:
1. 数组第一个元素是字符串时为分组名称
2. 后续元素是信号对象或子分组
3. 支持任意层级嵌套
4. 空对象 `{}` 创建间隔行

## 配置选项 (Config)

### 布局配置

```json
{
  "config": {
    "hscale": 2,              // 水平缩放倍数 (默认: 1)
    "skin": "narrow"          // 皮肤样式
  }
}
```

**hscale 规则**:
- 必须是正整数
- 值越大,图表越宽
- 推荐范围: 1-5

**skin 选项**:
- `"default"`: 默认彩色皮肤
- `"narrow"`: 紧凑皮肤(适合长波形)
- `"lowkey"`: 单色皮肤(适合打印)

### 边缘配置

```json
{
  "config": {
    "edges": "hard",          // 边缘类型
    "background": "white"     // 背景色
  }
}
```

## 头部和脚部规则

### Head 配置

```json
{
  "head": {
    "text": "Title",          // 标题文本
    "tick": 0,                // 时间轴起始值
    "every": 2,               // 每 N 个周期显示一次
    "tock": 0                 // 可选: 底部刻度
  }
}
```

### Foot 配置

```json
{
  "foot": {
    "text": "Figure 1",       // 脚注文本
    "tock": 9                 // 底部时间轴结束值
  }
}
```

### 文本样式规则 (JsonML)

使用 JsonML 格式化文本:

```json
{
  "text": ["tspan",
    ["tspan", {"class": "h1"}, "大标题"],
    ["tspan", {"class": "error"}, "错误文本"],
    ["tspan", {
      "fill": "blue",
      "font-weight": "bold",
      "font-size": "16"
    }, "自定义样式"]
  ]
}
```

**预定义 CSS 类**:
- 字体大小: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`
- 颜色: `error`, `warning`, `info`, `success`, `muted`

**支持的 SVG 属性**:
- `fill`: 填充色
- `stroke`: 描边色
- `font-weight`: `normal`, `bold`
- `font-style`: `normal`, `italic`
- `font-size`: 数字(像素)
- `text-decoration`: `underline`, `overline`
- `baseline-shift`: `sub`, `super`

## 箭头和边缘规则

### 节点定义

在信号中使用 `node` 定义节点:

```json
{
  "signal": [
    { "name": "A", "wave": "01..", "node": ".a.." },
    { "name": "B", "wave": "0.1.", "node": "..b." }
  ]
}
```

**节点字符规则**:
- `.` 表示无节点
- `a-z` 或 `A-Z` 定义节点名称
- 节点位置与波形字符对应

### 边缘定义

使用 `edge` 数组定义箭头:

```json
{
  "edge": [
    "a~b label",              // 节点a到b的曲线箭头,带标签
    "b-|c",                   // 节点b到c的直角线
    "c->d time"               // 节点c到d的箭头,带标签
  ]
}
```

### 箭头类型语法

| 语法 | 类型 | 说明 |
|-----|------|------|
| `a-b` | 直线 | 实线 |
| `a~b` | 曲线 | 平滑曲线 |
| `a->b` | 箭头 | 单向箭头 |
| `a<->b` | 双向箭头 | 双向 |
| `a-\|b` | 直角线 | 垂直转折 |
| `a-\|-b` | 直角连线 | 带转折 |
| `a<-\|>b` | 直角箭头 | 带箭头的直角 |
| `a~>b` | 曲线箭头 | 平滑箭头 |
| `a-~>b` | 虚线曲线箭头 | 虚线+曲线 |

**标签规则**:
- 箭头定义后可跟空格和标签文本
- 标签会显示在箭头旁边
- 示例: `"a->b delay 2ns"`

## 数据数组规则

### 基本数据

```json
{
  "signal": [
    {
      "name": "bus",
      "wave": "x===x",
      "data": ["A", "B", "C"]    // 按顺序分配给 = 字符
    }
  ]
}
```

**数据分配规则**:
- 波形中每个 `=` 从 data 数组顺序取值
- data 数组长度应匹配 `=` 的数量
- 多余的 data 会被忽略
- 不足的 data 会显示为空

### 格式化数据

支持 HTML 子标签:

```json
{
  "data": [
    "plain",
    "<sub>下标</sub>",
    "<sup>上标</sup>",
    "<b>粗体</b>"
  ]
}
```

## 周期和相位规则

### Period 规则

```json
{
  "name": "CK",
  "wave": "P.......",
  "period": 2              // 周期倍数
}
```

**period 规则**:
- 必须是正数(可以是小数)
- period=2 表示信号周期是标准周期的 2 倍
- 影响信号的时间缩放
- 不同信号可以有不同的 period

### Phase 规则

```json
{
  "name": "CMD",
  "wave": "x.3x",
  "phase": 0.5            // 相位偏移
}
```

**phase 规则**:
- 取值范围: 0-1 (0.5 表示半个周期的偏移)
- 正值向右偏移
- 可用于对齐不同频率的信号
- 常用于 DDR 等双沿时序

## 寄存器图规则

### 基本寄存器

```json
{
  "reg": [
    { "bits": 8, "name": "Field1" },
    { "bits": 4, "name": "Field2", "type": 2 },
    { "bits": 4 }                        // 保留位
  ]
}
```

**字段规则**:
- `bits`: 必需,位宽
- `name`: 可选,字段名称
- `type`: 可选,类型编号(影响颜色)
- `attr`: 可选,属性标签

### 位字段属性

```json
{
  "reg": [
    {
      "bits": 1,
      "name": "EN",
      "attr": "RO"                      // 单个属性
    },
    {
      "bits": 3,
      "name": "MODE",
      "attr": ["RW", "default: 0"]      // 多个属性
    }
  ]
}
```

**常用属性**:
- `RO`: 只读
- `RW`: 读写
- `WO`: 只写
- `default: <value>`: 默认值

### 寄存器配置

```json
{
  "reg": [...],
  "config": {
    "lanes": 4,            // 每行显示的位数
    "vflip": true,         // 垂直翻转
    "hflip": false         // 水平翻转
  }
}
```

## 语法最佳实践

### 1. JSON 格式规范

```json
// ✅ 正确
{
  "signal": [
    { "name": "clk", "wave": "p..." }
  ]
}

// ❌ 错误 - 多余的逗号
{
  "signal": [
    { "name": "clk", "wave": "p..." },
  ]
}

// ❌ 错误 - 缺少引号
{
  signal: [
    { name: "clk", wave: "p..." }
  ]
}
```

### 2. 波形长度一致性

```json
// ✅ 正确 - 所有波形等长
{
  "signal": [
    { "name": "A", "wave": "01.0" },
    { "name": "B", "wave": "0.10" }
  ]
}

// ⚠️ 不推荐 - 长度不一致(虽然能工作)
{
  "signal": [
    { "name": "A", "wave": "01.0" },
    { "name": "B", "wave": "0.1" }
  ]
}
```

### 3. 数据数组匹配

```json
// ✅ 正确 - 数据数量匹配
{
  "signal": [
    { "wave": "x===x", "data": ["A", "B", "C"] }
  ]
}

// ⚠️ 警告 - 数据不足
{
  "signal": [
    { "wave": "x===x", "data": ["A", "B"] }  // 第三个=会显示为空
  ]
}
```

### 4. 节点命名规范

```json
// ✅ 正确 - 使用唯一的节点名
{
  "signal": [
    { "wave": "01..", "node": ".a.." },
    { "wave": "0.1.", "node": "..b." }
  ],
  "edge": ["a->b"]
}

// ❌ 错误 - 重复的节点名
{
  "signal": [
    { "wave": "01..", "node": ".a.." },
    { "wave": "0.1.", "node": ".a.." }  // 节点a重复
  ]
}
```

### 5. 特殊字符转义

在文本中使用特殊字符:

```json
{
  "head": {
    "text": ["tspan",
      "Normal text",
      ["tspan", {}, " | "],              // 使用 tspan 包裹特殊字符
      "More text"
    ]
  }
}
```

## 兼容性说明

### WaveDrom 版本

- **v2.x**: 支持基本时序图和寄存器图
- **v3.x**: 增加皮肤系统和更多配置选项

### JSON5 支持

某些实现支持 JSON5 格式:
- 可以省略引号
- 支持单引号
- 允许尾随逗号
- 支持注释

**建议**: 优先使用标准 JSON 以确保最大兼容性

## 参考资源

- [WaveJSON 完整规范](https://github.com/wavedrom/schema/blob/master/WaveJSON.md)
- [WaveDrom 官方教程](https://wavedrom.com/tutorial.html)
- [在线编辑器](https://wavedrom.com/editor.html)
