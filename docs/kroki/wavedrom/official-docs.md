# WaveDrom 官方文档

> 收集时间: 2025-10-13
> 来源: https://wavedrom.com/tutorial.html, https://github.com/wavedrom/wavedrom

## 概述

WaveDrom 是一个免费开源的在线数字时序图渲染引擎,使用 JavaScript、HTML5 和 SVG 将 WaveJSON 输入描述转换为 SVG 矢量图形。

## 基本语法

### 信号定义

每个信号由 `signal` 数组定义,包含多个 WaveLane(波形通道):

```json
{
  "signal": [
    { "name": "clk", "wave": "p......" },
    { "name": "bus", "wave": "x.34.5x", "data": ["head", "body", "tail"] },
    { "name": "wire", "wave": "0.1..0." }
  ]
}
```

**必需字段**:

- `name`: 信号名称
- `wave`: 波形字符串,每个字符代表一个时间周期

### 波形字符

| 字符  | 含义       | 说明             |
| ----- | ---------- | ---------------- |
| `0`   | 低电平     | 逻辑 0           |
| `1`   | 高电平     | 逻辑 1           |
| `.`   | 延续       | 延续上一状态     |
| `x`   | 未知态     | 不确定状态       |
| `z`   | 高阻态     | 三态             |
| `=`   | 数据       | 从 data 数组取值 |
| `u`   | 未定义     | 未定义状态       |
| `d`   | 下降沿数据 |                  |
| `2-9` | 数据值     | 多位数据         |

### 时钟信号

时钟信号有特殊字符,每周期变化两次:

| 字符 | 含义   | 说明              |
| ---- | ------ | ----------------- |
| `p`  | 正时钟 | 小写,上升沿有标记 |
| `P`  | 正时钟 | 大写,上升沿有标记 |
| `n`  | 负时钟 | 小写,下降沿有标记 |
| `N`  | 负时钟 | 大写,下降沿有标记 |
| `h`  | 半高   |                   |
| `l`  | 半低   |                   |
| `H`  | 全高   |                   |
| `L`  | 全低   |                   |

示例:

```json
{
  "signal": [
    { "name": "pclk", "wave": "p......." },
    { "name": "nclk", "wave": "n......." },
    { "name": "clk0", "wave": "phnlPHNL" }
  ]
}
```

## 高级特性

### 1. 分组 (Groups)

使用数组嵌套创建信号分组:

```json
{
  "signal": [
    { "name": "clk", "wave": "p..Pp..P" },
    [
      "Master",
      ["ctrl", { "name": "write", "wave": "01.0...." }, { "name": "read", "wave": "0...1..0" }],
      { "name": "addr", "wave": "x3.x4..x", "data": "A1 A2" }
    ],
    {},
    [
      "Slave",
      ["ctrl", { "name": "ack", "wave": "x01x0.1x" }],
      { "name": "rdata", "wave": "x.....4x", "data": "Q2" }
    ]
  ]
}
```

### 2. 间隔和间隙 (Spacers and Gaps)

- 空对象 `{}` 创建空行间隔
- 波形中的 `|` 创建垂直分隔线

```json
{
  "signal": [
    { "name": "clk", "wave": "p.....|..." },
    { "name": "Data", "wave": "x.345x|=.x", "data": ["head", "body", "tail", "data"] },
    {},
    { "name": "Acknowledge", "wave": "1.....|01." }
  ]
}
```

### 3. 周期和相位 (Period and Phase)

使用 `period` 和 `phase` 调整时序:

```json
{
  "signal": [
    { "name": "CK", "wave": "P.......", "period": 2 },
    {
      "name": "CMD",
      "wave": "x.3x=x4x=x=x=x=x",
      "data": "RAS NOP CAS NOP NOP NOP NOP",
      "phase": 0.5
    },
    { "name": "DQS", "wave": "z.......0.1010z." }
  ]
}
```

### 4. 箭头和边缘 (Arrows and Edges)

使用 `node` 和 `edge` 创建箭头标注:

```json
{
  "signal": [
    { "name": "A", "wave": "01........0....", "node": ".a........j" },
    { "name": "B", "wave": "0.1.......0.1..", "node": "..b.......i" },
    { "name": "C", "wave": "0..1....0...1..", "node": "...c....h.." }
  ],
  "edge": [
    "a~b t1", // 曲线箭头
    "c-~a t2", // 虚线曲线
    "c-~>d time 3", // 带箭头
    "b-|a t1", // 直角线
    "a-|c t2", // 直角箭头
    "g<->h 3 ms" // 双向箭头
  ]
}
```

**箭头类型**:

- 曲线: `~`, `-~`, `<~>`, `<-~>`, `~>`, `-~>`, `~->`
- 直线: `-`, `-|`, `-|-`, `<->`, `<-|>`, `->`, `-|>`, `|->`

### 5. 配置选项 (Config)

使用 `config` 对象控制渲染:

```json
{
  signal: [...],
  config: {
    hscale: 2,          // 水平缩放 (1, 2, 3...)
    skin: 'narrow'      // 皮肤 ('default', 'narrow')
  }
}
```

### 6. 头部和脚部 (Head/Foot)

添加标题和时间轴标记:

```json
{
  signal: [...],
  head: {
    text: 'WaveDrom Example',
    tick: 0,            // 时间轴标记位置
    every: 2            // 每 N 个周期显示一次
  },
  foot: {
    text: 'Figure 100',
    tock: 9             // 底部时间轴标记
  }
}
```

**文本样式** (使用 JsonML):

```json
{
  "head": {
    "text": [
      "tspan",
      ["tspan", { "class": "error h1" }, "error "],
      ["tspan", { "class": "warning h2" }, "warning "],
      ["tspan", { "fill": "pink", "font-weight": "bold" }, "custom"]
    ]
  }
}
```

预定义样式类:

- 字体大小: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`
- 颜色: `error`, `warning`, `info`, `success`, `muted`

## 数据类型

### 1. 时序图 (Timing Diagram)

标准数字波形:

```json
{
  "signal": [
    { "name": "clk", "wave": "P......" },
    { "name": "bus", "wave": "x.==.=x", "data": ["head", "body", "tail"] },
    { "name": "wire", "wave": "0.1..0." }
  ]
}
```

### 2. 寄存器图 (Register Diagram)

使用 `reg` 类型:

```json
{
  "reg": [
    { "bits": 8, "name": "IPO" },
    { "bits": 7, "name": "BRK", "type": 4 },
    { "bits": 5, "name": "CPK", "type": 5 },
    { "bits": 12, "name": "MPK", "type": 2 }
  ],
  "config": { "lanes": 4, "vflip": true }
}
```

### 3. 位字段图 (Bitfield Diagram)

详细的寄存器位定义:

```json
{
  "reg": [
    { "bits": 1, "name": "EN" },
    { "bits": 3, "name": "MODE", "attr": ["RW", "default: 0"] },
    { "bits": 4, "name": "ADDR", "attr": "RW" }
  ]
}
```

## 实用技巧

### 1. 动态生成

使用 JavaScript 动态生成波形:

```javascript
(function (bits, ticks) {
  var arr = [];
  for (var i = 0; i < bits; i++) {
    arr.push({ name: i + "", wave: "" });
    var state = 1;
    for (var t = 0; t < ticks; t++) {
      var gray = (((t >> 1) ^ t) >> i) & 1;
      arr[i].wave += gray === state ? "." : gray + "";
      state = gray;
    }
  }
  return { signal: arr };
})(5, 16);
```

### 2. 复杂数据标注

使用 HTML 标签格式化数据:

```json
{
  "signal": [
    {
      "name": "Data",
      "wave": "x345x",
      "data": ["<sub>subscript</sub>", "<sup>superscript</sup>", "normal"]
    }
  ]
}
```

### 3. 皮肤定制

WaveDrom 支持两种内置皮肤:

- `default`: 标准彩色皮肤
- `narrow`: 紧凑黑白皮肤 (适合长波形)
- `lowkey`: 单色皮肤 (适合打印)

```json
{
  signal: [...],
  config: { skin: 'narrow' }
}
```

## 集成使用

### Web 页面集成

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/wavedrom/3.1.0/skins/default.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/wavedrom/3.1.0/wavedrom.min.js"></script>

<body onload="WaveDrom.ProcessAll()">
  <script type="WaveDrom">
    { signal: [
      { name: "clk", wave: "p......" },
      { name: "bus", wave: "x.34.5x", data: ["head", "body", "tail"] }
    ]}
  </script>
</body>
```

### Node.js 使用

```javascript
const nomnoml = require("nomnoml");
const src = "[nomnoml] is -> [awesome]";
console.log(nomnoml.renderSvg(src));
```

## 常见应用场景

1. **硬件设计**: 数字电路时序验证
2. **协议分析**: 通信协议时序展示
3. **文档编写**: 技术文档中的波形图
4. **教学演示**: 数字逻辑教学
5. **调试分析**: 信号时序问题定位

## 官方资源

- **官网**: https://wavedrom.com
- **在线编辑器**: https://wavedrom.com/editor.html
- **GitHub**: https://github.com/wavedrom/wavedrom
- **教程**: https://wavedrom.com/tutorial.html
- **WaveJSON 规范**: https://github.com/wavedrom/schema/blob/master/WaveJSON.md

## 许可证

MIT License - 可商用、可修改、可分发
