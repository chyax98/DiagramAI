# WaveDrom 常见错误

> 更新时间: 2025-10-13

## JSON 语法错误

### 1. 非法 JSON 格式

**错误**: JSON 解析失败

```json
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

// ❌ 错误 - 单引号(标准JSON不支持)
{
  'signal': [
    { 'name': 'clk', 'wave': 'p...' }
  ]
}
```

**解决方案**:
```json
// ✅ 正确
{
  "signal": [
    { "name": "clk", "wave": "p..." }
  ]
}
```

**调试技巧**:
1. 使用 JSON 验证器检查格式
2. 确保所有键名使用双引号
3. 检查尾随逗号
4. 使用代码编辑器的语法高亮

### 2. 缺少必需字段

**错误**: 信号未正确显示

```json
// ❌ 错误 - 缺少 wave 字段
{
  "signal": [
    { "name": "clk" }
  ]
}

// ❌ 错误 - 缺少 signal 数组
{
  "config": { "hscale": 2 }
}
```

**解决方案**:
```json
// ✅ 正确 - 包含必需字段
{
  "signal": [
    { "name": "clk", "wave": "p..." }
  ]
}
```

**必需字段清单**:
- 根对象必须有 `signal` 数组
- 每个信号对象必须有 `name` 和 `wave`

## 波形字符错误

### 3. 无效的波形字符

**错误**: 波形显示异常或报错

```json
// ❌ 错误 - 使用了不支持的字符
{
  "signal": [
    { "name": "sig", "wave": "0a1b0" }  // a, b 不是有效字符
  ]
}

// ❌ 错误 - 大小写混淆
{
  "signal": [
    { "name": "clk", "wave": "P0.1" }  // P 只能用于时钟
  ]
}
```

**解决方案**:
```json
// ✅ 正确 - 使用有效字符
{
  "signal": [
    { "name": "sig", "wave": "01.10" },
    { "name": "clk", "wave": "p...." }
  ]
}
```

**有效字符列表**:
- 逻辑: `0`, `1`, `x`, `z`, `.`
- 数据: `2-9`, `=`, `u`, `d`
- 时钟: `p`, `P`, `n`, `N`, `h`, `l`, `H`, `L`
- 特殊: `|`

### 4. 波形长度不一致

**错误**: 图表对齐问题

```json
// ⚠️ 不推荐 - 长度不一致
{
  "signal": [
    { "name": "A", "wave": "01.0" },     // 长度 4
    { "name": "B", "wave": "0.1" },      // 长度 3
    { "name": "C", "wave": "01.01.0" }   // 长度 7
  ]
}
```

**解决方案**:
```json
// ✅ 正确 - 统一长度
{
  "signal": [
    { "name": "A", "wave": "01.0..." },
    { "name": "B", "wave": "0.1...." },
    { "name": "C", "wave": "01.01.0" }
  ]
}
```

**最佳实践**:
- 所有信号的 wave 字符串应等长
- 使用 `.` 填充较短的信号
- 可以用变量统一管理长度

## 数据数组错误

### 5. 数据数量不匹配

**错误**: 数据显示不完整

```json
// ❌ 错误 - 数据不足
{
  "signal": [
    {
      "name": "bus",
      "wave": "x===x",              // 3个=号
      "data": ["A", "B"]            // 只有2个数据
    }
  ]
}

// ❌ 错误 - 数据过多
{
  "signal": [
    {
      "name": "bus",
      "wave": "x=x",                // 1个=号
      "data": ["A", "B", "C"]       // 3个数据
    }
  ]
}
```

**解决方案**:
```json
// ✅ 正确 - 数量匹配
{
  "signal": [
    {
      "name": "bus",
      "wave": "x===x",
      "data": ["A", "B", "C"]       // 3个数据对应3个=
    }
  ]
}
```

**调试方法**:
1. 计算 wave 中 `=` 的数量
2. 确保 data 数组长度匹配
3. 考虑使用数字字符 `2-9` 代替

### 6. 数据格式错误

**错误**: 数据显示异常

```json
// ❌ 错误 - 使用了对象而非字符串
{
  "signal": [
    {
      "wave": "x=x",
      "data": [{ "value": "A" }]    // 对象不会正确显示
    }
  ]
}

// ❌ 错误 - 数字未转字符串
{
  "signal": [
    {
      "wave": "x=x",
      "data": [123]                 // 数字可能显示异常
    }
  ]
}
```

**解决方案**:
```json
// ✅ 正确 - 使用字符串
{
  "signal": [
    {
      "wave": "x==x",
      "data": ["A", "123"]          // 全部字符串
    }
  ]
}
```

## 箭头和边缘错误

### 7. 节点未定义

**错误**: 箭头不显示

```json
// ❌ 错误 - 边缘引用了不存在的节点
{
  "signal": [
    { "wave": "01..", "node": ".a.." }
  ],
  "edge": [
    "a->b"                          // 节点b未定义
  ]
}
```

**解决方案**:
```json
// ✅ 正确 - 定义所有节点
{
  "signal": [
    { "wave": "01..", "node": ".a.." },
    { "wave": "0.1.", "node": "..b." }
  ],
  "edge": [
    "a->b"
  ]
}
```

**检查清单**:
- 确保 edge 中的所有节点都在 node 中定义
- 节点名区分大小写
- 节点位置要与波形对齐

### 8. 节点位置错误

**错误**: 箭头位置不正确

```json
// ❌ 错误 - 节点位置与波形不对应
{
  "signal": [
    {
      "name": "A",
      "wave": "01.0",              // 长度4
      "node": ".a.."               // 位置2
    },
    {
      "name": "B",
      "wave": "0.10",              // 长度4
      "node": "..b"                // 长度3,位置不匹配
    }
  ]
}
```

**解决方案**:
```json
// ✅ 正确 - 节点字符串与波形等长
{
  "signal": [
    {
      "name": "A",
      "wave": "01.0",
      "node": ".a.."               // 长度4,位置2
    },
    {
      "name": "B",
      "wave": "0.10",
      "node": "..b."               // 长度4,位置3
    }
  ]
}
```

### 9. 无效的箭头语法

**错误**: 箭头样式错误

```json
// ❌ 错误 - 错误的箭头语法
{
  "edge": [
    "a=>b",                        // => 不是有效语法
    "a<~b",                        // 顺序错误
    "a--b"                         // 双横线无效
  ]
}
```

**解决方案**:
```json
// ✅ 正确 - 使用有效语法
{
  "edge": [
    "a->b",                        // 直线箭头
    "a~>b",                        // 曲线箭头
    "a<->b",                       // 双向箭头
    "a-|b"                         // 直角线
  ]
}
```

**有效箭头类型**:
- 直线: `-`, `->`, `<->`
- 曲线: `~`, `~>`, `<~>`
- 直角: `-|`, `-|>`, `<-|->`
- 组合: `-~>`, `<-~>`

## 配置错误

### 10. 无效的配置值

**错误**: 配置不生效

```json
// ❌ 错误 - hscale 为负数
{
  "signal": [...],
  "config": {
    "hscale": -1                   // 必须是正数
  }
}

// ❌ 错误 - 无效的 skin 名称
{
  "config": {
    "skin": "dark"                 // 不存在的皮肤
  }
}
```

**解决方案**:
```json
// ✅ 正确
{
  "signal": [...],
  "config": {
    "hscale": 2,                   // 正整数
    "skin": "narrow"               // 有效的皮肤名
  }
}
```

**有效配置值**:
- `hscale`: 正整数 (推荐 1-5)
- `skin`: `"default"`, `"narrow"`, `"lowkey"`

### 11. Period/Phase 类型错误

**错误**: 时序显示异常

```json
// ❌ 错误 - period 使用了字符串
{
  "signal": [
    {
      "name": "CK",
      "wave": "P.......",
      "period": "2"                // 应该是数字
    }
  ]
}

// ❌ 错误 - phase 超出范围
{
  "signal": [
    {
      "name": "CMD",
      "wave": "x.3x",
      "phase": 1.5                 // 应该在 0-1 之间
    }
  ]
}
```

**解决方案**:
```json
// ✅ 正确
{
  "signal": [
    {
      "name": "CK",
      "wave": "P.......",
      "period": 2                  // 数字
    },
    {
      "name": "CMD",
      "wave": "x.3x",
      "phase": 0.5                 // 0-1之间
    }
  ]
}
```

## 分组和布局错误

### 12. 分组语法错误

**错误**: 分组不显示

```json
// ❌ 错误 - 分组格式错误
{
  "signal": [
    "Group Name",                  // 字符串不能单独存在
    { "name": "sig1", "wave": "01.." }
  ]
}

// ❌ 错误 - 嵌套错误
{
  "signal": [
    ["Group",
      "SubGroup",                  // 应该是数组
      { "name": "sig", "wave": "01.." }
    ]
  ]
}
```

**解决方案**:
```json
// ✅ 正确 - 使用数组包裹分组
{
  "signal": [
    ["Group Name",
      { "name": "sig1", "wave": "01.." },
      { "name": "sig2", "wave": "0.1." }
    ]
  ]
}

// ✅ 正确 - 嵌套分组
{
  "signal": [
    ["Group",
      ["SubGroup",
        { "name": "sig", "wave": "01.." }
      ]
    ]
  ]
}
```

### 13. 空行语法错误

**错误**: 间隔不生效

```json
// ❌ 错误 - 使用了 null
{
  "signal": [
    { "name": "A", "wave": "01.." },
    null,                          // 应该用空对象
    { "name": "B", "wave": "0.1." }
  ]
}

// ❌ 错误 - 使用了空字符串
{
  "signal": [
    { "name": "A", "wave": "01.." },
    "",                            // 无效
    { "name": "B", "wave": "0.1." }
  ]
}
```

**解决方案**:
```json
// ✅ 正确 - 使用空对象
{
  "signal": [
    { "name": "A", "wave": "01.." },
    {},                            // 空对象创建间隔
    { "name": "B", "wave": "0.1." }
  ]
}
```

## 寄存器图错误

### 14. 位宽不匹配

**错误**: 寄存器显示不完整

```json
// ❌ 错误 - 总位宽不是32位
{
  "reg": [
    { "bits": 8, "name": "A" },
    { "bits": 8, "name": "B" }     // 总共16位,不足32位
  ]
}
```

**解决方案**:
```json
// ✅ 正确 - 总位宽32位
{
  "reg": [
    { "bits": 8, "name": "A" },
    { "bits": 8, "name": "B" },
    { "bits": 16 }                 // 补足到32位
  ],
  "config": { "lanes": 4 }
}
```

**注意事项**:
- 默认寄存器宽度为32位
- 使用 config.lanes 可以改变每行显示的位数
- 总位宽应该是 lanes 的倍数

### 15. Type 值错误

**错误**: 颜色显示异常

```json
// ❌ 错误 - type 值过大
{
  "reg": [
    { "bits": 8, "name": "A", "type": 10 }  // type 只支持 0-7
  ]
}
```

**解决方案**:
```json
// ✅ 正确 - type 在有效范围内
{
  "reg": [
    { "bits": 8, "name": "A", "type": 2 },
    { "bits": 8, "name": "B", "type": 4 }
  ]
}
```

**type 有效值**: 0-7 (对应不同的颜色)

## 文本格式错误

### 16. JsonML 格式错误

**错误**: 样式不生效

```json
// ❌ 错误 - 缺少 tspan 标签
{
  "head": {
    "text": [
      {"class": "h1"},             // 缺少标签名
      "Title"
    ]
  }
}

// ❌ 错误 - 属性格式错误
{
  "head": {
    "text": ["tspan",
      ["tspan", "class=h1", "Title"]  // 属性应该是对象
    ]
  }
}
```

**解决方案**:
```json
// ✅ 正确
{
  "head": {
    "text": ["tspan",
      ["tspan", {"class": "h1"}, "Title"],
      " - ",
      ["tspan", {"class": "muted"}, "subtitle"]
    ]
  }
}
```

**JsonML 规则**:
1. 第一个元素是标签名 (`"tspan"`)
2. 第二个元素是属性对象 (可选)
3. 后续元素是子内容

### 17. 特殊字符未转义

**错误**: 特殊字符显示错误

```json
// ❌ 错误 - HTML标签未转义
{
  "signal": [
    {
      "name": "<clock>",           // <> 会被当作HTML
      "wave": "p...."
    }
  ]
}
```

**解决方案**:
```json
// ✅ 正确 - 使用 HTML 实体
{
  "signal": [
    {
      "name": "&lt;clock&gt;",     // HTML实体
      "wave": "p...."
    }
  ]
}

// 或使用 Unicode
{
  "signal": [
    {
      "name": "\u003Cclock\u003E",
      "wave": "p...."
    }
  ]
}
```

## 渲染和显示错误

### 18. 图表不显示

**可能原因**:
1. JavaScript 未加载
2. WaveDrom 库版本不兼容
3. DOM 元素未正确初始化

**检查步骤**:
```html
<!-- 1. 确认库已加载 -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/wavedrom/3.1.0/skins/default.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/wavedrom/3.1.0/wavedrom.min.js"></script>

<!-- 2. 确认初始化代码 -->
<body onload="WaveDrom.ProcessAll()">
  <script type="WaveDrom">
    { signal: [{ name: "clk", wave: "p...." }] }
  </script>
</body>

<!-- 3. 检查控制台错误 -->
<script>
  window.onerror = function(msg, url, line) {
    console.error('Error: ' + msg + ' at ' + url + ':' + line);
  };
</script>
```

### 19. 图表显示不完整

**错误**: 部分信号或箭头不显示

**可能原因**:
1. 容器宽度不足
2. CSS 样式冲突
3. SVG 渲染问题

**解决方案**:
```css
/* 确保容器足够大 */
.wavedrom-container {
  width: 100%;
  min-width: 800px;
  overflow-x: auto;
}

/* 清除可能的样式冲突 */
.wavedrom-container svg {
  max-width: none !important;
}
```

### 20. Canvas 导出失败

**错误**: 无法导出 PNG

**解决方案**:
```javascript
// 使用正确的导出方法
var canvas = document.getElementById('canvas');
var source = { signal: [{ name: "clk", wave: "p...." }] };

// 确保 canvas 足够大
canvas.width = 1000;
canvas.height = 400;

// 渲染
WaveDrom.renderWaveForm(0, source, canvas);

// 导出
canvas.toBlob(function(blob) {
  // 处理 blob
});
```

## 调试技巧

### 通用调试流程

1. **验证 JSON 格式**
   ```javascript
   try {
     JSON.parse(sourceCode);
   } catch(e) {
     console.error('JSON Error:', e.message);
   }
   ```

2. **检查必需字段**
   ```javascript
   const obj = JSON.parse(sourceCode);
   if (!obj.signal || !Array.isArray(obj.signal)) {
     console.error('Missing or invalid signal array');
   }
   ```

3. **验证波形字符**
   ```javascript
   const validChars = '01xz.23456789=udpPnNhlHL|';
   obj.signal.forEach(sig => {
     const invalid = sig.wave.split('').filter(c => !validChars.includes(c));
     if (invalid.length > 0) {
       console.error(`Invalid characters in ${sig.name}:`, invalid);
     }
   });
   ```

4. **使用在线编辑器**
   - 访问 https://wavedrom.com/editor.html
   - 粘贴代码查看实时错误提示

5. **查看浏览器控制台**
   - F12 打开开发者工具
   - 查看 Console 选项卡的错误信息

## 错误速查表

| 错误类型 | 常见症状 | 快速修复 |
|---------|---------|---------|
| JSON 格式错误 | 完全不显示 | 检查引号、逗号、括号 |
| 缺少字段 | 部分不显示 | 添加 name 和 wave |
| 无效字符 | 波形异常 | 检查 wave 字符串 |
| 数据不匹配 | 标签缺失 | 对齐 = 和 data 数量 |
| 节点未定义 | 箭头不显示 | 检查 node 和 edge |
| 配置错误 | 样式异常 | 验证 config 值 |
| 分组错误 | 结构混乱 | 使用数组包裹 |
| JsonML 错误 | 样式不生效 | 检查 tspan 格式 |

## 参考资源

- [WaveDrom GitHub Issues](https://github.com/wavedrom/wavedrom/issues)
- [在线编辑器](https://wavedrom.com/editor.html)
- [官方教程](https://wavedrom.com/tutorial.html)
