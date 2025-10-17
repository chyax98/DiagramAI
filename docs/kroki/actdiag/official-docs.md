# ActDiag 官方文档

> **来源**: http://blockdiag.com/en/actdiag/
> **开发者**: Takeshi Komiya
> **License**: Apache License 2.0
> **最后更新**: 2025-01-13

---

## 📋 概述

ActDiag 是一个活动图(Activity Diagram)生成工具,可以从类似 Graphviz DOT 的文本描述生成活动图,特别适合绘制带泳道的流程图。

**核心特性**:

- 从类似 DOT 的文本生成活动图
- 支持泳道(Swimlane)布局
- 支持多语言节点标签 (UTF-8)
- 支持 Sphinx 文档嵌入
- 支持 SVG/PNG 多种输出格式

**典型用途**:

- 业务流程图
- 跨部门协作流程
- 系统交互流程
- 用户操作流程

---

## 🔧 安装和使用

### 安装

```bash
# 使用 pip 安装
pip install actdiag

# 使用 easy_install 安装
easy_install actdiag
```

### 基本用法

```bash
# 生成 PNG 图像
actdiag simple.diag

# 生成 SVG 图像
actdiag -Tsvg simple.diag

# 指定字体
actdiag -f /usr/share/fonts/truetype/ttf-dejavu/DejaVuSerif.ttf simple.diag
```

### 字体配置

创建 `$HOME/.blockdiagrc` 配置文件:

```ini
[actdiag]
fontpath = /usr/share/fonts/truetype/ttf-dejavu/DejaVuSerif.ttf
```

---

## 📝 基本语法

### 1. 简单活动图

```actdiag
actdiag {
  write -> convert -> image

  lane user {
    label = "User"
    write [label = "Writing reST"];
    image [label = "Get diagram IMAGE"];
  }

  lane actdiag {
    convert [label = "Convert reST to Image"];
  }
}
```

**解释**:

- `actdiag { }`: 顶层容器
- `->`: 活动流向
- `lane`: 泳道(Swimlane)
- `[label = "..."]`: 活动标签

### 2. 基本流程

```actdiag
actdiag {
  A -> B -> C -> D;

  A [label = "Start"];
  B [label = "Process"];
  C [label = "Review"];
  D [label = "End"];
}
```

**流程符号**:

- `->`: 单向流
- 活动按定义顺序排列

---

## 🏊 泳道(Lane)

### 基本泳道

```actdiag
actdiag {
  // 定义流程
  request -> process -> response;

  // 定义泳道
  lane client {
    label = "Client"
    request [label = "Send Request"];
    response [label = "Receive Response"];
  }

  lane server {
    label = "Server"
    process [label = "Process Request"];
  }
}
```

**泳道属性**:

- `label`: 泳道名称
- 自动包含该泳道的所有活动

### 多泳道流程

```actdiag
actdiag {
  // 流程定义
  order -> check -> approve -> ship;

  // 客户泳道
  lane customer {
    label = "Customer"
    order [label = "Place Order"];
  }

  // 销售泳道
  lane sales {
    label = "Sales Team"
    check [label = "Check Inventory"];
    approve [label = "Approve Order"];
  }

  // 物流泳道
  lane logistics {
    label = "Logistics"
    ship [label = "Ship Product"];
  }
}
```

---

## 🎨 活动属性

### 活动标签

```actdiag
actdiag {
  A -> B;

  A [label = "Start Process"];
  B [label = "End Process"];
}
```

### 活动颜色

```actdiag
actdiag {
  A -> B -> C;

  A [label = "Start", color = "green"];
  B [label = "Process", color = "lightblue"];
  C [label = "End", color = "red"];
}
```

### 活动形状

```actdiag
actdiag {
  start -> process -> end;

  start [shape = circle, label = "Start"];
  process [shape = box, label = "Process"];
  end [shape = circle, label = "End"];
}
```

**支持的形状**:

- `box`: 矩形(默认)
- `circle`: 圆形
- `ellipse`: 椭圆
- `diamond`: 菱形
- `roundedbox`: 圆角矩形

---

## 🔀 分支和合并

### 条件分支

```actdiag
actdiag {
  // 主流程
  start -> check;
  check -> process_yes;
  check -> process_no;
  process_yes -> end;
  process_no -> end;

  start [label = "Start"];
  check [label = "Check Condition", shape = diamond];
  process_yes [label = "Process (Yes)"];
  process_no [label = "Process (No)"];
  end [label = "End"];
}
```

### 并行流程

```actdiag
actdiag {
  start -> fork;
  fork -> task1;
  fork -> task2;
  task1 -> join;
  task2 -> join;
  join -> end;

  start [label = "Start"];
  fork [label = "Fork", shape = diamond];
  task1 [label = "Task 1"];
  task2 [label = "Task 2"];
  join [label = "Join", shape = diamond];
  end [label = "End"];
}
```

---

## 🎯 高级特性

### 1. 带泳道的分支

```actdiag
actdiag {
  // 流程
  request -> validate;
  validate -> process_valid;
  validate -> reject_invalid;
  process_valid -> response;
  reject_invalid -> error;

  // 用户泳道
  lane user {
    label = "User"
    request [label = "Submit Request"];
    response [label = "Receive Response"];
    error [label = "Receive Error"];
  }

  // 系统泳道
  lane system {
    label = "System"
    validate [label = "Validate", shape = diamond];
    process_valid [label = "Process"];
    reject_invalid [label = "Reject"];
  }
}
```

### 2. 复杂业务流程

```actdiag
actdiag {
  // 订单处理流程
  order -> validate -> approve -> process -> notify -> complete;

  lane customer {
    label = "Customer"
    order [label = "Place Order"];
    notify [label = "Receive Notification"];
  }

  lane sales {
    label = "Sales"
    validate [label = "Validate Order"];
    approve [label = "Approve"];
  }

  lane warehouse {
    label = "Warehouse"
    process [label = "Prepare Shipment"];
  }

  lane system {
    label = "System"
    complete [label = "Complete Order"];
  }
}
```

### 3. 异常处理流程

```actdiag
actdiag {
  start -> process;
  process -> success;
  process -> error;
  error -> retry;
  retry -> process;
  success -> end;

  start [label = "Start"];
  process [label = "Execute Task"];
  success [label = "Success Path", color = "lightgreen"];
  error [label = "Error Path", color = "pink"];
  retry [label = "Retry", shape = diamond];
  end [label = "End"];
}
```

---

## 🎨 样式定制

### 活动颜色

```actdiag
actdiag {
  A -> B -> C -> D;

  A [label = "Start", color = "#90EE90"];      // 浅绿
  B [label = "Process", color = "#87CEEB"];    // 天蓝
  C [label = "Review", color = "#FFD700"];     // 金色
  D [label = "End", color = "#FFB6C1"];        // 粉红
}
```

### 泳道颜色

```actdiag
actdiag {
  A -> B;

  lane frontend {
    label = "Frontend"
    color = "#E6F3FF"
    A [label = "UI Action"];
  }

  lane backend {
    label = "Backend"
    color = "#FFE6E6"
    B [label = "API Call"];
  }
}
```

### 活动背景

```actdiag
actdiag {
  A -> B -> C;

  A [label = "Input", background = "#E8F5E9"];
  B [label = "Process", background = "#FFF3E0"];
  C [label = "Output", background = "#E3F2FD"];
}
```

---

## 📋 最佳实践

### 1. 清晰的泳道划分

```actdiag
// ✅ 好: 清晰的职责划分
actdiag {
  request -> validate -> process -> respond;

  lane user {
    label = "User"
    request; respond;
  }

  lane system {
    label = "System"
    validate; process;
  }
}

// ❌ 避免: 混乱的活动分配
actdiag {
  A -> B -> C;
  lane l1 { A; C; }  // 不连续的活动
  lane l2 { B; }
}
```

### 2. 使用描述性标签

```actdiag
// ✅ 好: 清晰的标签
actdiag {
  submit -> review -> approve;

  submit [label = "Submit Purchase Request"];
  review [label = "Manager Review"];
  approve [label = "Finance Approval"];
}

// ❌ 避免: 模糊的标签
actdiag {
  A -> B -> C;
  A [label = "Step 1"];
  B [label = "Step 2"];
  C [label = "Step 3"];
}
```

### 3. 合理使用颜色

```actdiag
actdiag {
  start -> process -> decision;
  decision -> success;
  decision -> failure;
  failure -> retry;
  retry -> process;
  success -> end;

  start [label = "Start", color = "lightblue"];
  process [label = "Process"];
  decision [label = "Check Result", shape = diamond, color = "yellow"];
  success [label = "Success", color = "lightgreen"];
  failure [label = "Failure", color = "pink"];
  retry [label = "Retry", color = "orange"];
  end [label = "End", color = "lightblue"];
}
```

### 4. 保持流程简洁

```actdiag
// ✅ 好: 简洁的主流程
actdiag {
  request -> process -> response;

  lane client {
    label = "Client"
    request; response;
  }

  lane server {
    label = "Server"
    process;
  }
}

// ❌ 避免: 过于复杂
actdiag {
  A -> B -> C -> D -> E -> F -> G -> H -> I -> J;
  // 太多步骤,考虑分解为多个图表
}
```

---

## 🔧 Sphinx 集成

### 配置

```python
# conf.py
extensions = [
    'sphinxcontrib.actdiag',
]

actdiag_fontpath = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
actdiag_antialias = True
```

### reStructuredText 用法

```rst
.. actdiag::

   actdiag {
     write -> convert -> image

     lane user {
       label = "User"
       write [label = "Writing reST"];
       image [label = "Get diagram IMAGE"];
     }

     lane actdiag {
       convert [label = "Convert reST to Image"];
     }
   }
```

---

## 🔗 PlantUML 集成

ActDiag 也可以在 PlantUML 中使用(通过 Asciidoctor Diagram 扩展):

```asciidoc
[actdiag, format="png"]
----
actdiag {
  write -> convert -> image

  lane user {
    label = "User"
    write [label = "Writing reST"];
  }

  lane actdiag {
    convert [label = "Convert reST to Image"];
  }
}
----
```

---

## 📊 实际应用示例

### 用户注册流程

```actdiag
actdiag {
  start -> input -> validate;
  validate -> create_account;
  validate -> show_error;
  create_account -> send_email -> confirm -> end;
  show_error -> input;

  lane user {
    label = "User"
    start [label = "访问注册页"];
    input [label = "填写信息"];
    show_error [label = "查看错误"];
    confirm [label = "确认邮箱"];
    end [label = "完成注册"];
  }

  lane system {
    label = "System"
    validate [label = "验证信息", shape = diamond];
    create_account [label = "创建账户"];
    send_email [label = "发送验证邮件"];
  }
}
```

### 订单处理流程

```actdiag
actdiag {
  order -> check_stock;
  check_stock -> process_payment;
  check_stock -> notify_unavailable;
  process_payment -> prepare_shipment -> ship -> notify_shipped -> end;
  notify_unavailable -> refund -> end;

  lane customer {
    label = "Customer"
    order [label = "下单"];
    notify_shipped [label = "收到发货通知"];
    end [label = "完成"];
  }

  lane inventory {
    label = "Inventory"
    check_stock [label = "检查库存", shape = diamond];
    prepare_shipment [label = "准备发货"];
  }

  lane payment {
    label = "Payment"
    process_payment [label = "处理支付"];
    refund [label = "退款"];
  }

  lane logistics {
    label = "Logistics"
    ship [label = "发货"];
  }

  lane notification {
    label = "Notification"
    notify_shipped [label = "发货通知"];
    notify_unavailable [label = "缺货通知"];
  }
}
```

### 代码审查流程

```actdiag
actdiag {
  create_pr -> auto_check;
  auto_check -> assign_reviewer;
  auto_check -> fix_issues;
  fix_issues -> auto_check;
  assign_reviewer -> review;
  review -> approve;
  review -> request_changes;
  request_changes -> update_code -> review;
  approve -> merge -> deploy -> close;

  lane developer {
    label = "Developer"
    create_pr [label = "创建 PR"];
    update_code [label = "更新代码"];
    close [label = "关闭 PR"];
  }

  lane ci_cd {
    label = "CI/CD"
    auto_check [label = "自动检查", shape = diamond];
    fix_issues [label = "修复问题"];
    deploy [label = "部署"];
  }

  lane reviewer {
    label = "Reviewer"
    assign_reviewer [label = "分配审查"];
    review [label = "代码审查"];
    approve [label = "批准", color = "lightgreen"];
    request_changes [label = "请求修改", color = "orange"];
  }

  lane git {
    label = "Git"
    merge [label = "合并代码"];
  }
}
```

---

## 🔗 相关资源

### 官方文档

- **主页**: http://blockdiag.com/en/actdiag/
- **示例**: http://blockdiag.com/en/actdiag/examples.html
- **Asciidoctor 集成**: https://docs.asciidoctor.org/diagram-extension/latest/diagram_types/actdiag/

### GitHub

- **源码**: https://github.com/blockdiag/actdiag

### 依赖

- Python 2.6, 2.7, 3.2, 3.3+
- Pillow 2.2.1+
- funcparserlib 0.3.6+
- setuptools / distribute

---

## 📚 完整参考

### 基本结构

```actdiag
actdiag {
  // 流程定义
  <activity1> -> <activity2> -> <activity3>;

  // 活动属性
  <activity1> [
    label = "Activity Label",
    color = "lightblue",
    shape = "box"
  ];

  // 泳道定义
  lane <lane_name> {
    label = "Lane Label"
    color = "lightgray"
    <activity1>;
    <activity2>;
  }
}
```

### 支持的属性

**活动属性**:

- `label`: 活动标签
- `color`: 活动颜色
- `shape`: 活动形状 (box, circle, diamond, ellipse)
- `background`: 背景颜色

**泳道属性**:

- `label`: 泳道标签
- `color`: 泳道背景色

---

## 🎯 使用技巧

### 1. 垂直布局

ActDiag 默认水平布局,但可以通过样式调整:

```actdiag
actdiag {
  orientation = portrait  // 垂直布局

  A -> B -> C;

  lane l1 {
    label = "Lane 1"
    A; B;
  }

  lane l2 {
    label = "Lane 2"
    C;
  }
}
```

### 2. 活动分组

```actdiag
actdiag {
  // 使用泳道实现分组
  lane input_phase {
    label = "Input Phase"
    A; B;
  }

  lane process_phase {
    label = "Process Phase"
    C; D;
  }

  lane output_phase {
    label = "Output Phase"
    E;
  }

  A -> B -> C -> D -> E;
}
```

---

_文档整理: DiagramAI 项目 | 基于官方文档和社区资料_
