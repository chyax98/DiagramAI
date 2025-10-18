# ActDiag 语法规则详解

> **文档目的**: 详细说明 ActDiag 的语法规则和最佳实践
> **最后更新**: 2025-01-13

---

## 📐 基本结构

### 1. 顶层结构

```actdiag
actdiag {
  // 所有内容必须在 actdiag { } 块内
  <activity> -> <activity>;

  lane <name> {
    // 泳道定义
  }
}
```

**规则**:

- ✅ 必须以 `actdiag {` 开始,以 `}` 结束
- ✅ 内部可以包含活动定义、流程定义、泳道定义
- ❌ 不能在 `actdiag {}` 外定义元素

### 2. 注释

```actdiag
actdiag {
  // 单行注释

  /* 多行注释
     可以跨越多行 */

  A -> B;  // 行尾注释
}
```

**支持的注释方式**:

- `//` 单行注释
- `/* */` 多行注释

---

## 🔄 流程定义

### 基本流程语法

```actdiag
actdiag {
  // 单向流程
  A -> B;

  // 链式流程
  A -> B -> C -> D;

  // 多个独立流程
  A -> B;
  C -> D;
}
```

### 流程符号

| 符号 | 含义     | 示例      |
| ---- | -------- | --------- |
| `->` | 单向流   | `A -> B`  |
| `;`  | 语句结束 | `A -> B;` |

### 流程规则

```actdiag
actdiag {
  // ✅ 正确: 明确的流向
  start -> process -> end;

  // ✅ 正确: 分支流程
  A -> B;
  A -> C;
  B -> D;
  C -> D;

  // ❌ 错误: 缺少分号
  A -> B
  B -> C

  // ❌ 错误: 双向流(不支持)
  A <-> B
}
```

---

## 📝 活动定义

### 基本语法

```actdiag
actdiag {
  A -> B;

  <activity_name> [<attribute1> = "<value1>", <attribute2> = "<value2>"];
}
```

### 活动属性

| 属性         | 类型    | 说明     | 示例                       |
| ------------ | ------- | -------- | -------------------------- |
| `label`      | string  | 活动标签 | `"Process Data"`           |
| `color`      | color   | 活动颜色 | `"lightblue"`, `"#FF0000"` |
| `shape`      | keyword | 活动形状 | `box`, `circle`, `diamond` |
| `background` | color   | 背景颜色 | `"#E8F5E9"`                |

### 示例

```actdiag
actdiag {
  A -> B -> C;

  A [label = "Start", color = "lightgreen", shape = "circle"];
  B [label = "Process", color = "lightblue"];
  C [label = "End", color = "pink", shape = "circle"];
}
```

---

## 🏊 泳道(Lane)

### 基本泳道语法

```actdiag
actdiag {
  // 流程定义
  A -> B -> C;

  // 泳道定义
  lane <lane_name> {
    label = "<display_name>"
    <activity1>;
    <activity2>;
  }
}
```

### 泳道属性

| 属性    | 类型   | 说明         | 示例        |
| ------- | ------ | ------------ | ----------- |
| `label` | string | 泳道显示名称 | `"User"`    |
| `color` | color  | 泳道背景色   | `"#E6F3FF"` |

### 泳道规则

```actdiag
actdiag {
  A -> B -> C;

  // ✅ 正确: 完整的泳道定义
  lane user {
    label = "User"
    A; C;
  }

  lane system {
    label = "System"
    B;
  }

  // ❌ 错误: 缺少 label
  lane error {
    A;  // 泳道必须有 label
  }

  // ❌ 错误: 活动重复
  lane duplicate {
    label = "Test"
    A;  // A 已在 user 泳道中
  }
}
```

**关键规则**:

- ✅ 每个泳道必须有 `label` 属性
- ✅ 每个活动只能属于一个泳道
- ✅ 活动必须先在流程中定义
- ❌ 不能有重复的活动分配

---

## 🎨 活动形状

### 支持的形状

```actdiag
actdiag {
  A -> B -> C -> D -> E;

  A [shape = "box", label = "Box (默认)"];
  B [shape = "circle", label = "Circle"];
  C [shape = "ellipse", label = "Ellipse"];
  D [shape = "diamond", label = "Diamond"];
  E [shape = "roundedbox", label = "Rounded Box"];
}
```

### 形状用途

| 形状         | 典型用途       |
| ------------ | -------------- |
| `box`        | 普通活动(默认) |
| `circle`     | 开始/结束节点  |
| `diamond`    | 决策/分支节点  |
| `ellipse`    | 特殊活动       |
| `roundedbox` | 子流程         |

### 形状示例

```actdiag
actdiag {
  start -> check -> process -> end;

  start [
    shape = "circle",
    label = "Start",
    color = "lightgreen"
  ];

  check [
    shape = "diamond",
    label = "Valid?",
    color = "yellow"
  ];

  process [
    shape = "box",
    label = "Process Data"
  ];

  end [
    shape = "circle",
    label = "End",
    color = "pink"
  ];
}
```

---

## 🎨 颜色定义

### 颜色格式

```actdiag
actdiag {
  A -> B -> C;

  // 命名颜色
  A [color = "lightblue"];

  // 十六进制颜色
  B [color = "#FF6B6B"];

  // RGB 颜色
  C [background = "rgb(144, 238, 144)"];
}
```

**支持的格式**:

- 命名颜色: `"lightblue"`, `"pink"`, `"lightgreen"`
- 十六进制: `"#FF0000"`, `"#F00"`
- RGB: `"rgb(255, 0, 0)"`

### 常用颜色方案

#### 状态颜色

```actdiag
actdiag {
  start -> processing -> success;
  processing -> error;

  start [label = "开始", color = "lightblue"];
  processing [label = "处理中", color = "lightyellow"];
  success [label = "成功", color = "lightgreen"];
  error [label = "错误", color = "pink"];
}
```

#### 泳道颜色

```actdiag
actdiag {
  A -> B -> C;

  lane frontend {
    label = "Frontend"
    color = "#E3F2FD"  // 浅蓝
    A;
  }

  lane backend {
    label = "Backend"
    color = "#F3E5F5"  // 浅紫
    B;
  }

  lane database {
    label = "Database"
    color = "#E8F5E9"  // 浅绿
    C;
  }
}
```

---

## 🔀 分支和合并

### 条件分支

```actdiag
actdiag {
  // 分支流程
  start -> check;
  check -> yes_path;
  check -> no_path;
  yes_path -> merge;
  no_path -> merge;
  merge -> end;

  start [label = "Start"];
  check [label = "Condition?", shape = "diamond", color = "yellow"];
  yes_path [label = "Yes Branch", color = "lightgreen"];
  no_path [label = "No Branch", color = "pink"];
  merge [label = "Merge"];
  end [label = "End"];
}
```

### 并行流程

```actdiag
actdiag {
  start -> fork;
  fork -> task1;
  fork -> task2;
  fork -> task3;
  task1 -> join;
  task2 -> join;
  task3 -> join;
  join -> end;

  start [label = "Start"];
  fork [label = "Fork", shape = "diamond"];
  task1 [label = "Task 1"];
  task2 [label = "Task 2"];
  task3 [label = "Task 3"];
  join [label = "Join", shape = "diamond"];
  end [label = "End"];
}
```

### 循环流程

```actdiag
actdiag {
  start -> process -> check;
  check -> success;
  check -> retry;
  retry -> process;  // 循环回去
  success -> end;

  start [label = "Start"];
  process [label = "Execute"];
  check [label = "Success?", shape = "diamond"];
  success [label = "Success Path", color = "lightgreen"];
  retry [label = "Retry", color = "orange"];
  end [label = "End"];
}
```

---

## ✏️ 文本和标签

### 标签规则

```actdiag
actdiag {
  A -> B;

  // ✅ 正确: 使用引号
  A [label = "Process Data"];

  // ✅ 正确: 多行文本(使用 \n)
  B [label = "Step 1\nStep 2\nStep 3"];

  // ❌ 错误: 缺少引号
  // C [label = Process];

  // ❌ 错误: 单引号(不支持)
  // D [label = 'Process'];
}
```

### 标签最佳实践

```actdiag
// ✅ 好: 清晰的动词标签
actdiag {
  A -> B -> C;

  A [label = "Receive Request"];
  B [label = "Validate Data"];
  C [label = "Send Response"];
}

// ❌ 避免: 模糊的名词标签
actdiag {
  A -> B -> C;

  A [label = "Request"];
  B [label = "Validation"];
  C [label = "Response"];
}
```

---

## 🔧 命名规则

### 有效的活动名

```actdiag
actdiag {
  // ✅ 正确的命名
  start_process -> validate_input -> process_data -> send_result;

  // ✅ 驼峰命名
  startProcess -> validateInput -> processData -> sendResult;

  // ❌ 错误: 包含连字符
  // start-process -> validate-input;

  // ❌ 错误: 包含空格
  // start process -> validate input;

  // ❌ 错误: 以数字开头
  // 1_process -> 2_validate;
}
```

**命名规则**:

- ✅ 字母、数字、下划线
- ✅ 以字母开头
- ❌ 不能包含连字符 `-`
- ❌ 不能包含空格
- ❌ 不能以数字开头

### 泳道命名

```actdiag
actdiag {
  A -> B;

  // ✅ 正确: 描述性名称
  lane user_interface {
    label = "User Interface"
    A;
  }

  lane business_logic {
    label = "Business Logic"
    B;
  }

  // ❌ 避免: 单字符名称
  lane a {
    label = "A"
    // 不清晰
  }
}
```

---

## 📋 最佳实践

### 1. 流程组织

```actdiag
// ✅ 好: 先定义流程,后定义属性
actdiag {
  // 1. 流程定义
  A -> B -> C -> D;

  // 2. 活动属性
  A [label = "Start"];
  B [label = "Process"];
  C [label = "Review"];
  D [label = "End"];

  // 3. 泳道定义
  lane user {
    label = "User"
    A; D;
  }

  lane system {
    label = "System"
    B; C;
  }
}
```

### 2. 泳道对齐

```actdiag
// ✅ 好: 按职责划分泳道
actdiag {
  request -> validate -> process -> respond;

  lane client {
    label = "Client"
    request [label = "Send Request"];
    respond [label = "Receive Response"];
  }

  lane server {
    label = "Server"
    validate [label = "Validate"];
    process [label = "Process"];
  }
}

// ❌ 避免: 混乱的泳道分配
actdiag {
  A -> B -> C -> D;

  lane l1 {
    label = "Lane 1"
    A; C;  // 不连续的活动
  }

  lane l2 {
    label = "Lane 2"
    B; D;
  }
}
```

### 3. 颜色使用

```actdiag
actdiag {
  start -> process -> check;
  check -> success;
  check -> error;
  success -> end;
  error -> retry;
  retry -> process;

  // 使用语义化颜色
  start [label = "Start", color = "lightblue"];
  process [label = "Process"];
  check [label = "Check", shape = "diamond", color = "yellow"];
  success [label = "Success", color = "lightgreen"];
  error [label = "Error", color = "pink"];
  retry [label = "Retry", color = "orange"];
  end [label = "End", color = "lightblue"];
}
```

### 4. 决策节点标识

```actdiag
actdiag {
  A -> decision;
  decision -> option1;
  decision -> option2;

  A [label = "Input"];

  // 使用菱形 + 问号标识决策
  decision [
    label = "Valid?",
    shape = "diamond",
    color = "yellow"
  ];

  option1 [label = "Yes", color = "lightgreen"];
  option2 [label = "No", color = "pink"];
}
```

---

## 🚫 常见错误

### 1. 活动未定义就分配到泳道

```actdiag
// ❌ 错误
actdiag {
  lane user {
    label = "User"
    A;  // A 未在流程中定义
  }
}

// ✅ 正确
actdiag {
  A -> B;  // 先定义流程

  lane user {
    label = "User"
    A;  // 然后分配到泳道
  }
}
```

### 2. 活动重复分配

```actdiag
// ❌ 错误
actdiag {
  A -> B;

  lane l1 {
    label = "Lane 1"
    A;
  }

  lane l2 {
    label = "Lane 2"
    A;  // A 已在 l1 中
  }
}

// ✅ 正确
actdiag {
  A -> B;

  lane l1 {
    label = "Lane 1"
    A;
  }

  lane l2 {
    label = "Lane 2"
    B;  // 不同的活动
  }
}
```

### 3. 泳道缺少 label

```actdiag
// ❌ 错误
actdiag {
  A -> B;

  lane user {
    // 缺少 label
    A;
  }
}

// ✅ 正确
actdiag {
  A -> B;

  lane user {
    label = "User"  // 必须有 label
    A;
  }
}
```

### 4. 使用不支持的流向符号

```actdiag
// ❌ 错误: 双向流
actdiag {
  A <-> B;
}

// ❌ 错误: 反向流
actdiag {
  A <- B;
}

// ✅ 正确: 单向流
actdiag {
  A -> B;
  B -> A;  // 两个单向流
}
```

---

## 🔄 布局控制

### 方向设置

```actdiag
actdiag {
  // 默认水平布局
  orientation = landscape;  // 或省略

  A -> B -> C;
}

actdiag {
  // 垂直布局
  orientation = portrait;

  A -> B -> C;
}
```

### 泳道顺序

```actdiag
actdiag {
  A -> B -> C;

  // 泳道按定义顺序显示(从上到下)
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

## 📚 完整语法参考

### 基本模板

```actdiag
actdiag {
  // 1. 流程定义
  <start> -> <process> -> <end>;

  // 2. 活动属性
  <start> [
    label = "Start",
    color = "lightblue",
    shape = "circle"
  ];

  <process> [
    label = "Process Data",
    color = "lightyellow"
  ];

  <end> [
    label = "End",
    color = "pink",
    shape = "circle"
  ];

  // 3. 泳道定义
  lane <lane_name> {
    label = "Lane Display Name"
    color = "lightgray"
    <activity1>;
    <activity2>;
  }
}
```

### 属性快速参考

**活动属性**:

```actdiag
activity [
  label = "text",           // 活动标签
  color = "color",          // 前景色
  background = "color",     // 背景色
  shape = "box|circle|diamond|ellipse|roundedbox"
];
```

**泳道属性**:

```actdiag
lane name {
  label = "text"            // 泳道标签
  color = "color"           // 泳道背景色
  activity1; activity2;     // 包含的活动
}
```

**流程定义**:

```actdiag
A -> B;                     // 单个流程
A -> B -> C -> D;          // 链式流程
A -> B; A -> C;            // 分支流程
```

---

## 🔍 调试技巧

### 1. 逐步构建

```actdiag
// Step 1: 基本流程
actdiag {
  A -> B;
}

// Step 2: 添加属性
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
```

### 2. 使用注释定位问题

```actdiag
actdiag {
  A -> B -> C;

  A [label = "Start"];
  B [label = "Process"];
  C [label = "End"];

  /* 暂时注释问题部分
  lane problematic {
    label = "Test"
    A; B; C;
  }
  */
}
```

### 3. 检查清单

- [ ] 所有大括号 `{}` 都正确闭合
- [ ] 所有流程定义以分号 `;` 结束
- [ ] 所有字符串用双引号 `"` 包围
- [ ] 活动名不包含连字符、空格
- [ ] 所有泳道都有 `label` 属性
- [ ] 活动不重复分配到多个泳道
- [ ] 流程中的活动都已定义

---

## 📊 复杂示例

### 完整业务流程

```actdiag
actdiag {
  // 流程定义
  submit -> validate;
  validate -> approve_yes;
  validate -> reject_no;
  approve_yes -> process -> notify -> complete;
  reject_no -> notify_reject -> end_reject;

  // 活动属性
  submit [label = "Submit Request"];
  validate [label = "Validate", shape = "diamond", color = "yellow"];
  approve_yes [label = "Approve", color = "lightgreen"];
  reject_no [label = "Reject", color = "pink"];
  process [label = "Process"];
  notify [label = "Send Approval"];
  notify_reject [label = "Send Rejection"];
  complete [label = "Complete", shape = "circle"];
  end_reject [label = "End", shape = "circle"];

  // 泳道定义
  lane requester {
    label = "Requester"
    color = "#E3F2FD"
    submit;
    complete;
    end_reject;
  }

  lane manager {
    label = "Manager"
    color = "#F3E5F5"
    validate;
    approve_yes;
    reject_no;
  }

  lane system {
    label = "System"
    color = "#E8F5E9"
    process;
    notify;
    notify_reject;
  }
}
```

---

## 🔗 参考资源

- **官方文档**: http://blockdiag.com/en/actdiag/introduction.html
- **示例集合**: http://blockdiag.com/en/actdiag/examples.html
- **Asciidoctor 集成**: https://docs.asciidoctor.org/diagram-extension/latest/diagram_types/actdiag/

---

_文档整理: DiagramAI 项目 | 语法规则详解_
