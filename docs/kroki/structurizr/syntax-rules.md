# Structurizr DSL Syntax Rules

> **Last Updated**: 2025-10-13
> **Reference**: [Structurizr DSL Language Reference](https://docs.structurizr.com/dsl/language)

---

## Core Syntax Rules

### 1. Workspace Structure

**必需结构**:
```structurizr
workspace [name] [description] {
  model {
    // 定义元素和关系
  }

  views {
    // 定义视图
  }
}
```

**规则**:
- `workspace` 是顶层结构，必须包含 `model` 块
- `views` 块是可选的，但强烈推荐
- `name` 和 `description` 可选

---

### 2. 格式规则

#### 基本格式

```structurizr
// ✅ 正确
softwareSystem "System Name"

// ✅ 正确 (无空格可省略引号)
softwareSystem SystemName

// ❌ 错误 (有空格必须加引号)
softwareSystem System Name
```

**关键规则**:
- 行尾换行符很重要
- 长行可用 `\` 续行 (必须是行尾最后一个字符)
- Token 之间必须有空白符
- 空白符数量不重要 (缩进仅为美观)
- 关键字**不区分大小写** (`softwareSystem` = `softwaresystem`)
- 有空格的文本必须用双引号 `"..."`
- 左大括号 `{` 必须在同一行
- 右大括号 `}` 必须独占一行
- 仅当有子内容时才需要大括号

---

### 3. 命名唯一性

**唯一性要求**:
```structurizr
model {
  // ✅ 正确 - 不同类型可同名
  user = person "System"
  system = softwareSystem "System"

  // ❌ 错误 - 同一级别人员名称重复
  admin = person "User"
  guest = person "User"  // 错误!

  system1 = softwareSystem "S1" {
    api = container "API"
  }

  system2 = softwareSystem "S2" {
    // ✅ 正确 - 不同系统内可同名
    api = container "API"
  }
}
```

**规则**:
- 人员 (person) 名称必须全局唯一
- 软件系统 (softwareSystem) 名称必须全局唯一
- 容器 (container) 名称在同一软件系统内唯一
- 组件 (component) 名称在同一容器内唯一
- 部署节点 (deploymentNode) 名称在父级上下文内唯一
- 基础设施节点 (infrastructureNode) 名称在父级上下文内唯一
- 从 A 到 B 的所有关系描述必须唯一

---

### 4. 标识符 (Identifiers)

#### 扁平标识符 (默认)

```structurizr
model {
  user = person "User"
  system = softwareSystem "System"
  user -> system "Uses"
}
```

**规则**:
- 标识符全局作用域
- 允许字符: `a-zA-Z_0-9`
- 必须全局唯一

#### 分层标识符 (推荐)

```structurizr
workspace {
  !identifiers hierarchical

  model {
    user = person "User"
    system = softwareSystem "System" {
      webapp = container "Web App" {
        controller = component "Controller"
      }
    }
  }

  views {
    // 使用点号访问
    component system.webapp {
      include *
    }
  }
}
```

**规则**:
- 使用 `!identifiers hierarchical` 启用
- 标识符作用域限定在父级元素内
- 使用点号访问: `parent.child.grandchild`
- 不同父级下可以有同名标识符
- 仅影响元素标识符，关系标识符不受影响

---

### 5. 元素定义

#### Person

```structurizr
// 基本语法
identifier = person <name> [description] [tags] {
  [properties]
}

// 示例
user = person "User" "End user" "External" {
  url "https://example.com"
}
```

#### Software System

```structurizr
// 基本语法
identifier = softwareSystem <name> [description] [tags] {
  [containers]
  [relationships]
}

// 示例
system = softwareSystem "E-commerce" "Online store" {
  webapp = container "Web App"
  api = container "API"
}
```

#### Container

```structurizr
// 基本语法
identifier = container <name> [description] [technology] [tags] {
  [components]
  [relationships]
}

// 示例
api = container "API" "REST API" "Node.js + Express" {
  controller = component "Controller"
}
```

#### Component

```structurizr
// 基本语法
identifier = component <name> [description] [technology] [tags] {
  [relationships]
}

// 示例
controller = component "Controller" "HTTP handler" "Spring MVC"
```

---

### 6. 关系定义

#### 显式关系

```structurizr
// 基本语法
<source> -> <destination> [description] [technology] [tags]

// 示例
user -> system "Uses" "HTTPS"
user -> system "Uses" "HTTPS" {
  tags "Synchronous"
  url "https://docs.example.com"
}
```

#### 隐式关系 (在元素块内)

```structurizr
user = person "User" {
  -> system "Uses"
  -> system.webapp "Interacts with" "HTTPS"
}
```

#### 关系唯一性

```structurizr
// ✅ 正确 - 不同描述
user -> system "Browses"
user -> system "Purchases"

// ❌ 错误 - 相同描述重复
user -> system "Uses"
user -> system "Uses"  // 错误!
```

---

### 7. 视图定义

#### System Landscape

```structurizr
views {
  systemLandscape [key] [title] {
    include <*|identifiers|expression>
    [exclude identifiers]
    [autoLayout direction]
  }
}
```

#### System Context

```structurizr
views {
  systemContext <software-system> [key] [title] {
    include <*|identifiers|expression>
    [autoLayout direction]
  }
}
```

#### Container

```structurizr
views {
  container <software-system> [key] [title] {
    include <*|identifiers|expression>
    [autoLayout direction]
  }
}
```

#### Component

```structurizr
views {
  component <container> [key] [title] {
    include <*|identifiers|expression>
    [autoLayout direction]
  }
}
```

---

### 8. Include/Exclude 表达式

```structurizr
views {
  systemContext system {
    // 包含所有直接关系
    include *

    // 包含特定元素
    include user system.webapp

    // 包含关系表达式
    include "->system.api->"  // API 的所有入站和出站
    include "->system.api"     // API 的入站关系
    include "system.api->"     // API 的出站关系

    // 排除元素
    exclude system.internalComponent
  }
}
```

---

### 9. 自动布局

```structurizr
views {
  systemContext system {
    include *
    autoLayout [direction] [rankSeparation] [nodeSeparation]
  }
}
```

**参数**:
- `direction`: `lr` (左右), `rl`, `tb` (上下), `bt`
- `rankSeparation`: 层级间距离 (像素, 默认 300)
- `nodeSeparation`: 节点间距离 (像素, 默认 300)

**示例**:
```structurizr
autoLayout lr        // 左右，默认间距
autoLayout tb 200    // 上下，层级间距 200px
autoLayout lr 200 100 // 左右，层级 200px，节点 100px
```

---

### 10. 样式定义

#### 元素样式

```structurizr
views {
  styles {
    element <tag> {
      [shape <shape>]
      [background <color>]
      [color <color>]
      [fontSize <size>]
      [width <pixels>]
      [height <pixels>]
      [icon <url>]
    }
  }
}
```

**可用形状**: `Box`, `RoundedBox`, `Circle`, `Ellipse`, `Hexagon`, `Cylinder`, `Component`, `Person`, `Robot`, `Folder`, `WebBrowser`, `MobileDevicePortrait`, `MobileDeviceLandscape`, `Pipe`

#### 关系样式

```structurizr
views {
  styles {
    relationship <tag> {
      [thickness <pixels>]
      [color <color>]
      [dashed <true|false>]
      [routing <Routing>]
      [fontSize <size>]
    }
  }
}
```

---

### 11. 部署模型

```structurizr
model {
  deploymentEnvironment <name> {
    deploymentNode <name> [description] [technology] [tags] {
      [deploymentNode ...]  // 嵌套节点
      [containerInstance container]
      [softwareSystemInstance system]
      [infrastructureNode ...]
    }
  }
}
```

**示例**:
```structurizr
deploymentEnvironment "Production" {
  deploymentNode "AWS" {
    deploymentNode "ECS" {
      containerInstance webapp
    }

    infrastructureNode "Load Balancer" "ALB"
  }
}
```

---

### 12. 动态视图

```structurizr
views {
  dynamic <scope> [key] [description] {
    <identifier> -> <identifier> [description]
    [autoLayout direction]
  }
}
```

**示例**:
```structurizr
dynamic system "Login" "User login flow" {
  user -> webapp "1. Submits credentials"
  webapp -> database "2. Validates"
  database -> webapp "3. Returns result"
  webapp -> user "4. Shows dashboard"

  autoLayout lr
}
```

---

### 13. 主题

```structurizr
views {
  themes <url>
}
```

**示例**:
```structurizr
views {
  themes https://static.structurizr.com/themes/amazon-web-services-2023.04.30/theme.json
  themes https://static.structurizr.com/themes/microsoft-azure-2023.01.24/theme.json
}
```

---

### 14. 包含文件

```structurizr
workspace {
  !include model.dsl
  !include views.dsl
  !include styles.dsl
}
```

**规则**:
- 相对路径或绝对路径
- 文件内容会被插入到 `!include` 位置
- 可嵌套包含
- 防止循环包含

---

### 15. 常量和变量

```structurizr
// 定义常量
!const NAME "value"

// 使用常量
workspace {
  !const ORG_NAME "My Company"

  model {
    group "${ORG_NAME}" {
      system = softwareSystem "System"
    }
  }
}

// 环境变量
// 使用 ${ENV_VAR_NAME}
```

**规则**:
- 常量名只能包含: `a-zA-Z0-9-_.`
- 未找到的变量不会被替换
- 支持环境变量

---

### 16. 注释

```structurizr
// 单行注释 (样式 1)

# 单行注释 (样式 2)

/* 单行注释 (样式 3) */

/*
  多行注释
  可以跨行
*/
```

**注意**: 括号内的行注释或紧跟右括号的注释会导致语法错误

---

### 17. 标签 (Tags)

```structurizr
// 元素标签
element {
  tags "Tag1,Tag2,Tag3"
}

// 关系标签
source -> destination "Description" {
  tags "Async,Important"
}
```

**规则**:
- 逗号分隔
- 无空格
- 用于样式匹配

---

### 18. 属性 (Properties)

```structurizr
element {
  properties {
    "key1" "value1"
    "key2" "value2"
  }
}
```

---

### 19. 透视 (Perspectives)

```structurizr
element {
  perspectives {
    "Security" "ISO 27001 compliant"
    "Performance" "< 200ms response"
  }
}
```

---

### 20. Workspace 扩展

```structurizr
// base.dsl
workspace {
  model {
    system = softwareSystem "System"
  }
}

// extended.dsl
workspace extends base.dsl {
  model {
    !element system {
      container = container "New Container"
    }
  }
}
```

---

## Structurizr vs C4-PlantUML

### 核心差异

| 特性 | Structurizr DSL | C4-PlantUML |
|------|----------------|-------------|
| **语法类型** | 专用 DSL | PlantUML 宏 |
| **模型概念** | 单一模型，多视图 | 每个图表独立 |
| **关系管理** | 自动隐含关系 | 必须显式声明 |
| **标识符** | 分层标识符支持 | 无 |
| **布局控制** | 自动布局 (Graphviz) | PlantUML 布局 |
| **导出格式** | 多种 (PlantUML/Mermaid/DOT) | PNG/SVG |
| **工具链** | Structurizr Lite/CLI | PlantUML |
| **文档集成** | 原生 Markdown/ADR | 无 |
| **主题** | JSON 主题文件 | 样式命令 |

### 语法对比示例

**Structurizr DSL**:
```structurizr
workspace {
  model {
    user = person "User"
    system = softwareSystem "System" {
      webapp = container "Web App"
      api = container "API"
    }
    user -> webapp "Uses"
    webapp -> api "Calls"
  }

  views {
    container system {
      include *
      autoLayout lr
    }
  }
}
```

**C4-PlantUML**:
```plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

Person(user, "User")
System_Boundary(system, "System") {
  Container(webapp, "Web App")
  Container(api, "API")
}

Rel(user, webapp, "Uses")
Rel(webapp, api, "Calls")

@enduml
```

---

## 关键语法陷阱

### 1. 前向引用不支持

```structurizr
// ❌ 错误 - b 尚未定义
model {
  a = softwareSystem "A"
  a -> b  // 错误!
  b = softwareSystem "B"
}

// ✅ 正确 - 按顺序定义
model {
  a = softwareSystem "A"
  b = softwareSystem "B"
  a -> b
}
```

### 2. 大括号位置

```structurizr
// ❌ 错误
softwareSystem "System"
{  // 错误! 大括号必须在同一行
}

// ✅ 正确
softwareSystem "System" {
}
```

### 3. 占位符使用

```structurizr
// 跳过可选参数用 ""
container "Name" "" "Technology"  // 跳过 description
```

---

## 最佳实践

1. **使用分层标识符** - 对于复杂模型
2. **显式指定视图键** - 防止布局丢失
3. **按顺序定义元素** - 避免前向引用错误
4. **保持元素名称唯一** - 遵守作用域规则
5. **使用 !include** - 模块化大型模型
6. **应用主题** - 专业外观
7. **文档化决策** - 使用 ADR
8. **版本控制 DSL** - 像代码一样管理
9. **用 Structurizr Lite 验证** - 本地测试
10. **稳定视图键** - 保留布局信息

---

## Kroki 支持

### 支持的输出格式

| 格式 | 支持 |
|------|------|
| SVG | ✅ |
| PNG | ✅ |
| PDF | ❌ |
| TXT | ✅ |
| BASE64 | ✅ |

### Kroki 限制

1. **样式支持**: 有限的元素形状和样式
2. **主题**: 不支持 Structurizr 主题
3. **交互性**: 无缩放、导航功能
4. **布局**: 仅自动布局，不保留手动布局
5. **视图**: 一次只能渲染一个视图

### Kroki 使用建议

- **简单图表**: 优先使用 Kroki
- **复杂模型**: 使用 Structurizr Lite/Cloud
- **文档嵌入**: Kroki 适合静态文档
- **交互探索**: 使用 Structurizr 平台

---

## 参考资源

- **语言参考**: https://docs.structurizr.com/dsl/language
- **基础教程**: https://docs.structurizr.com/dsl/basics
- **标识符文档**: https://docs.structurizr.com/dsl/identifiers
- **FAQ**: https://docs.structurizr.com/dsl/faq
- **Cookbook**: https://docs.structurizr.com/dsl/cookbook

---

**Structurizr DSL** - 架构即代码的专业选择
