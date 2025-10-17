# ActDiag 常见错误和解决方案

> **文档目的**: 汇总 ActDiag 使用中的常见错误和解决方法
> **最后更新**: 2025-01-13

---

## 🚨 语法错误

### 1. 活动未定义就分配到泳道

**错误示例**:

```actdiag
actdiag {
  lane user {
    label = "User"
    process_request;  // ❌ 活动未在流程中定义
  }
}
```

**错误信息**:

```
Error: Activity 'process_request' not found in flow
```

**原因**:

- 活动必须先在流程中定义,才能分配到泳道
- ActDiag 需要知道活动的流向关系

**解决方案**:

```actdiag
actdiag {
  // ✅ 先定义流程
  start -> process_request -> end;

  // 然后分配到泳道
  lane user {
    label = "User"
    process_request;
  }
}
```

---

### 2. 活动重复分配到多个泳道

**错误示例**:

```actdiag
actdiag {
  A -> B -> C;

  lane user {
    label = "User"
    A;
  }

  lane system {
    label = "System"
    A;  // ❌ A 已经在 user 泳道中
  }
}
```

**错误信息**:

```
Error: Activity 'A' assigned to multiple lanes
```

**原因**:

- 每个活动只能属于一个泳道
- 这是泳道图的基本规则

**解决方案**:

```actdiag
actdiag {
  A -> B -> C;

  lane user {
    label = "User"
    A;  // ✅ A 只在这里
  }

  lane system {
    label = "System"
    B; C;  // ✅ 使用其他活动
  }
}
```

---

### 3. 泳道缺少 label 属性

**错误示例**:

```actdiag
actdiag {
  A -> B;

  lane user {
    // ❌ 缺少 label 属性
    A;
  }
}
```

**错误信息**:

```
Error: Lane must have a 'label' attribute
```

**解决方案**:

```actdiag
actdiag {
  A -> B;

  lane user {
    label = "User"  // ✅ 添加 label
    A;
  }
}
```

---

### 4. 缺少分号

**错误示例**:

```actdiag
actdiag {
  A -> B -> C  // ❌ 缺少分号

  A [label = "Start"]  // ❌ 缺少分号
}
```

**错误信息**:

```
Syntax error: unexpected token
```

**解决方案**:

```actdiag
actdiag {
  A -> B -> C;  // ✅ 添加分号

  A [label = "Start"];  // ✅ 添加分号
}
```

---

### 5. 使用不支持的流向符号

**错误示例**:

```actdiag
actdiag {
  A <-> B;  // ❌ 不支持双向流
  C <- D;   // ❌ 不支持反向流
}
```

**错误信息**:

```
Syntax error: invalid flow direction
```

**解决方案**:

```actdiag
actdiag {
  // ✅ 使用单向流
  A -> B;
  B -> A;  // 需要双向时,定义两个单向流

  D -> C;  // ✅ 反向时调换顺序
}
```

---

## 🎨 布局问题

### 6. 泳道顺序混乱

**问题描述**:
泳道显示顺序与预期不符。

**错误示例**:

```actdiag
actdiag {
  A -> B -> C;

  lane third {
    label = "Should be third"
    C;
  }

  lane first {
    label = "Should be first"
    A;
  }

  lane second {
    label = "Should be second"
    B;
  }
}
```

**现象**:

- 泳道按定义顺序显示,而非逻辑顺序
- 显示顺序: third → first → second

**解决方案**: 按期望顺序定义泳道

```actdiag
actdiag {
  A -> B -> C;

  // ✅ 按显示顺序定义
  lane first {
    label = "First Lane"
    A;
  }

  lane second {
    label = "Second Lane"
    B;
  }

  lane third {
    label = "Third Lane"
    C;
  }
}
```

---

### 7. 活动不在任何泳道中

**问题描述**:
活动定义了但没有分配到泳道,显示在图表外。

**错误示例**:

```actdiag
actdiag {
  A -> B -> C;

  lane user {
    label = "User"
    A;
  }

  // ❌ B 和 C 没有分配到任何泳道
}
```

**现象**:

- B 和 C 显示在泳道之外
- 布局混乱

**解决方案**: 确保所有活动都分配到泳道

```actdiag
actdiag {
  A -> B -> C;

  lane user {
    label = "User"
    A;
  }

  lane system {
    label = "System"
    B; C;  // ✅ 分配 B 和 C
  }
}
```

---

### 8. 泳道间活动不连续

**问题描述**:
同一泳道的活动在流程中不连续,导致布局奇怪。

**示例**:

```actdiag
actdiag {
  A -> B -> C -> D;

  lane user {
    label = "User"
    A; C;  // 不连续: A 和 C 之间有 B
  }

  lane system {
    label = "System"
    B; D;
  }
}
```

**问题**:

- 可能产生交叉的流程线
- 布局不清晰

**最佳实践**: 尽量保持泳道活动连续

```actdiag
actdiag {
  request -> process -> respond;

  lane user {
    label = "User"
    request;  // ✅ 开始
    respond;  // ✅ 结束
  }

  lane system {
    label = "System"
    process;  // ✅ 中间处理
  }
}
```

---

## 🔧 属性问题

### 9. 引号不匹配

**错误示例**:

```actdiag
actdiag {
  A -> B;

  A [label = "Start'];  // ❌ 引号不匹配
  B [label = 'End"];    // ❌ 引号不匹配
}
```

**错误信息**:

```
Syntax error: unclosed string
```

**解决方案**:

```actdiag
actdiag {
  A -> B;

  A [label = "Start"];  // ✅ 双引号匹配
  B [label = "End"];    // ✅ 双引号匹配
}
```

---

### 10. 无效的形状名称

**错误示例**:

```actdiag
actdiag {
  A -> B;

  A [shape = "square"];   // ❌ 无效形状
  B [shape = "triangle"]; // ❌ 无效形状
}
```

**错误信息**:

```
Error: Invalid shape 'square'
```

**解决方案**: 使用支持的形状

```actdiag
actdiag {
  A -> B -> C -> D -> E;

  // ✅ 支持的形状
  A [shape = "box"];        // 矩形(默认)
  B [shape = "circle"];     // 圆形
  C [shape = "diamond"];    // 菱形
  D [shape = "ellipse"];    // 椭圆
  E [shape = "roundedbox"]; // 圆角矩形
}
```

---

### 11. 颜色格式错误

**错误示例**:

```actdiag
actdiag {
  A -> B;

  A [color = "light blue"];  // ❌ 颜色名有空格
  B [color = "#GG0000"];     // ❌ 无效十六进制
}
```

**解决方案**:

```actdiag
actdiag {
  A -> B -> C;

  // ✅ 正确的颜色格式
  A [color = "lightblue"];     // 无空格的颜色名
  B [color = "#00FF00"];       // 有效十六进制
  C [color = "rgb(0,0,255)"]; // RGB 格式
}
```

---

## 🏊 泳道相关错误

### 12. 空泳道

**问题描述**:
定义了泳道但没有分配任何活动。

**错误示例**:

```actdiag
actdiag {
  A -> B;

  lane user {
    label = "User"
    A;
  }

  lane empty {
    label = "Empty Lane"
    // ❌ 没有活动
  }
}
```

**现象**:

- 显示空白泳道
- 浪费空间

**解决方案**: 删除空泳道或添加活动

```actdiag
actdiag {
  A -> B;

  lane user {
    label = "User"
    A;
  }

  lane system {
    label = "System"
    B;  // ✅ 添加活动
  }

  // ✅ 或者删除 empty 泳道
}
```

---

### 13. 泳道颜色冲突

**问题描述**:
泳道颜色太浅或与活动颜色冲突,导致可读性差。

**错误示例**:

```actdiag
actdiag {
  A -> B;

  lane light {
    label = "Light Lane"
    color = "white"  // ❌ 太浅,看不清
    A [color = "yellow"];  // ❌ 与浅色背景冲突
  }
}
```

**解决方案**: 使用对比色

```actdiag
actdiag {
  A -> B;

  lane visible {
    label = "Visible Lane"
    color = "#E3F2FD"  // ✅ 浅蓝背景
    A [color = "#1976D2"];  // ✅ 深蓝文字,对比明显
  }
}
```

---

## 🔄 流程问题

### 14. 循环流程未标识

**问题描述**:
循环流程中缺少明确的退出条件标识。

**错误示例**:

```actdiag
actdiag {
  A -> B -> A;  // ❌ 无限循环,无退出

  A [label = "Process"];
  B [label = "Check"];
}
```

**解决方案**: 添加明确的决策和退出

```actdiag
actdiag {
  start -> process -> check;
  check -> success;
  check -> retry;
  retry -> process;  // 循环
  success -> end;

  start [label = "Start"];
  process [label = "Process"];
  check [label = "Success?", shape = "diamond", color = "yellow"];
  success [label = "Yes", color = "lightgreen"];
  retry [label = "Retry", color = "orange"];
  end [label = "End"];
}
```

---

### 15. 分支未合并

**问题描述**:
分支流程后没有合并点,导致多个结束点。

**示例**:

```actdiag
actdiag {
  start -> check;
  check -> path1 -> end1;
  check -> path2 -> end2;  // 两个结束点

  start [label = "Start"];
  check [label = "Check", shape = "diamond"];
  path1 [label = "Path 1"];
  path2 [label = "Path 2"];
  end1 [label = "End 1"];
  end2 [label = "End 2"];
}
```

**建议**: 如果逻辑上应该合并,添加合并点

```actdiag
actdiag {
  start -> check;
  check -> path1;
  check -> path2;
  path1 -> merge;
  path2 -> merge;
  merge -> end;

  start [label = "Start"];
  check [label = "Check", shape = "diamond"];
  path1 [label = "Path 1"];
  path2 [label = "Path 2"];
  merge [label = "Merge"];
  end [label = "End"];
}
```

---

## 📝 文本问题

### 16. 标签过长

**问题描述**:
活动标签太长,导致布局混乱。

**错误示例**:

```actdiag
actdiag {
  A -> B;

  A [label = "This is a very long activity label that will cause layout issues"];
}
```

**解决方案**: 使用换行符缩短标签

```actdiag
actdiag {
  A -> B;

  A [label = "This is a very long\nactivity label that\nwill cause layout issues"];
  // ✅ 使用 \n 换行
}
```

**最佳实践**: 保持标签简洁

```actdiag
actdiag {
  A -> B;

  // ✅ 更好的方式: 简化标签
  A [label = "Validate\nUser Input"];
}
```

---

### 17. 特殊字符处理

**问题描述**:
标签中包含特殊字符导致解析错误。

**错误示例**:

```actdiag
actdiag {
  A -> B;

  A [label = "Process "quoted" text"];  // ❌ 内部引号冲突
}
```

**解决方案**: 转义特殊字符

```actdiag
actdiag {
  A -> B;

  A [label = "Process 'quoted' text"];  // ✅ 使用单引号
  B [label = "Process \"quoted\" text"]; // ✅ 或转义双引号
}
```

---

## 🔧 配置问题

### 18. 字体未找到

**问题描述**:
系统找不到合适的字体渲染文本。

**错误信息**:

```
Font not found
```

**解决方案 1**: 指定字体路径

```bash
actdiag -f /usr/share/fonts/truetype/dejavu/DejaVuSans.ttf diagram.diag
```

**解决方案 2**: 配置 .blockdiagrc

```ini
[actdiag]
fontpath = /usr/share/fonts/truetype/dejavu/DejaVuSans.ttf
```

---

### 19. 图像生成超时

**问题描述**:
复杂图表生成时间过长导致超时。

**错误信息**:

```
Timeout error
```

**解决方案**:

1. **简化图表**: 减少活动和泳道数量

```actdiag
// ❌ 过于复杂
actdiag {
  A -> B -> C -> D -> E -> F -> G -> H -> I -> J;
  // ... 30+ 个活动
}

// ✅ 分解为多个图表
// 图表 1: 请求阶段
actdiag {
  request -> validate -> process;
}

// 图表 2: 响应阶段
actdiag {
  process -> format -> respond;
}
```

2. **优化泳道**: 减少泳道数量

```actdiag
// ❌ 太多泳道
actdiag {
  lane l1 { label = "L1" A; }
  lane l2 { label = "L2" B; }
  lane l3 { label = "L3" C; }
  // ... 10+ 个泳道
}

// ✅ 合并相关泳道
actdiag {
  lane frontend {
    label = "Frontend"
    A; B;
  }

  lane backend {
    label = "Backend"
    C; D;
  }
}
```

---

## 🐛 Kroki 集成问题

### 20. URL 编码错误

**问题描述**:
Kroki URL 编码不正确导致渲染失败。

**错误信息**:

```
Invalid diagram data
```

**解决方案**: 使用正确的编码流程

```javascript
// ✅ 正确的 Kroki 编码
import pako from 'pako';

function encodeActDiag(code: string): string {
  // 1. Deflate 压缩
  const compressed = pako.deflate(code, { level: 9 });

  // 2. Base64 编码
  const base64 = btoa(String.fromCharCode(...compressed));

  // 3. URL 安全转换
  const urlSafe = base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return urlSafe;
}

// 生成 URL
const encoded = encodeActDiag(actdiagCode);
const url = `https://kroki.io/actdiag/svg/${encoded}`;
```

---

### 21. CORS 问题

**问题描述**:
浏览器 CORS 限制阻止 Kroki 请求。

**错误信息**:

```
CORS policy error
```

**解决方案**: 使用代理

```typescript
// DiagramAI 的解决方案
const krokiUrl = "/api/kroki/actdiag/svg/" + encodedCode;
// 通过 Next.js API 代理到 Kroki
```

---

## 🔍 调试技巧

### 22. 逐步构建图表

**策略**: 从简单开始,逐步添加复杂性

```actdiag
// Step 1: 基本流程
actdiag {
  A -> B;
}

// Step 2: 添加活动属性
actdiag {
  A -> B;
  A [label = "Start"];
  B [label = "End"];
}

// Step 3: 添加泳道
actdiag {
  A -> B;
  A [label = "Start"];
  B [label = "End"];

  lane user {
    label = "User"
    A;
  }

  lane system {
    label = "System"
    B;
  }
}

// Step 4: 添加样式
actdiag {
  A -> B;
  A [label = "Start", color = "lightblue"];
  B [label = "End", color = "pink"];

  lane user {
    label = "User"
    color = "#E3F2FD"
    A;
  }

  lane system {
    label = "System"
    color = "#F3E5F5"
    B;
  }
}
```

---

### 23. 使用注释定位问题

```actdiag
actdiag {
  A -> B -> C;

  A [label = "Start"];
  B [label = "Process"];
  C [label = "End"];

  /* 暂时注释问题部分
  lane problematic {
    label = "Problem Lane"
    // 问题代码
  }
  */

  lane working {
    label = "Working Lane"
    A; B; C;
  }
}
```

---

### 24. 检查清单

**语法检查**:

- [ ] 所有大括号 `{}` 都正确闭合
- [ ] 所有流程定义以分号 `;` 结束
- [ ] 所有字符串用双引号 `"` 包围
- [ ] 活动名不包含连字符、空格
- [ ] 使用正确的流向符号 `->`

**泳道检查**:

- [ ] 所有泳道都有 `label` 属性
- [ ] 活动先在流程中定义,再分配到泳道
- [ ] 每个活动只分配到一个泳道
- [ ] 没有空泳道

**布局检查**:

- [ ] 泳道按期望顺序定义
- [ ] 泳道内活动尽量连续
- [ ] 所有活动都分配到泳道

**样式检查**:

- [ ] 颜色格式正确
- [ ] 形状名称有效
- [ ] 标签长度合理
- [ ] 颜色对比明显

---

## 📊 性能优化

### 25. 减少活动数量

```actdiag
// ❌ 过多活动
actdiag {
  A1 -> A2 -> A3 -> A4 -> A5 -> A6 -> A7 -> A8 -> A9 -> A10;
  // ... 50+ 个活动
}

// ✅ 合并相关活动
actdiag {
  input -> validate -> process -> output;

  input [label = "Input Phase"];
  validate [label = "Validation"];
  process [label = "Processing"];
  output [label = "Output"];
}
```

---

### 26. 优化泳道结构

```actdiag
// ❌ 过多泳道
actdiag {
  lane l1 { label = "L1" a; }
  lane l2 { label = "L2" b; }
  lane l3 { label = "L3" c; }
  // ... 15+ 个泳道
}

// ✅ 合并泳道
actdiag {
  lane client_tier {
    label = "Client Tier"
    a; b;
  }

  lane server_tier {
    label = "Server Tier"
    c; d;
  }
}
```

---

## 📝 错误报告模板

````markdown
### 问题描述

[简要描述问题]

### 复现代码

```actdiag
[最小化的复现代码]
```
````

### 错误信息

```
[完整的错误信息]
```

### 环境信息

- ActDiag 版本: [版本号]
- Kroki 版本: [版本号]
- 浏览器: [如适用]

### 预期结果

[描述预期行为]

### 实际结果

[描述实际行为]

```

---

## 🔗 参考资源

### 官方资源
- **ActDiag 文档**: http://blockdiag.com/en/actdiag/introduction.html
- **示例集合**: http://blockdiag.com/en/actdiag/examples.html

### DiagramAI 文档
- **官方文档**: `/docs/kroki/actdiag/official-docs.md`
- **语法规则**: `/docs/kroki/actdiag/syntax-rules.md`
- **社区问题**: `/docs/kroki/actdiag/community-issues.md`

---

*文档整理: DiagramAI 项目 | 常见错误汇总*
```
