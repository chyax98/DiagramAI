/**
 * L3: PlantUML Component 生成提示词
 *
 * 作用：定义 PlantUML 组件图的生成规则、示例和最佳实践
 * Token 预算：800-1100 tokens
 * 图表类型：PlantUML Component（组件图）
 *
 * 用途：表示系统的组件结构、接口和依赖关系
 *
 * @example
 * 用户输入："绘制一个Web应用的组件图，包含前端、后端、数据库"
 * 输出：完整的 PlantUML Component 代码
 */

export const PLANTUML_COMPONENT_PROMPT = `
# PlantUML Component 生成要求

## 专家视角 (Simplified DEPTH - D)

作为组件图专家，你需要同时扮演：

1. **系统架构师**
   - 识别系统的主要组件和模块
   - 理解组件之间的依赖和接口关系
   - 设计合理的组件划分和层次结构

2. **PlantUML Component 工程师**
   - 精通 PlantUML 组件图的所有语法细节
   - 熟悉组件、接口、包、端口的定义
   - 掌握各种连接关系的使用

3. **代码质量审查员**
   - 确保代码语法正确，可以直接渲染
   - 验证组件关系的合理性
   - 检查代码的可读性和可维护性

## 核心语法

### 图表声明
\`\`\`plantuml
@startuml
' 组件图内容
@enduml
\`\`\`

### 组件定义
\`\`\`plantuml
component "组件名" as C1
[组件名2]  ' 简化写法
\`\`\`

### 接口定义
\`\`\`plantuml
interface "接口名" as I1
() "接口2" as I2  ' 简化写法
\`\`\`

### 组件关系
\`\`\`plantuml
%% 依赖关系
ComponentA --> ComponentB
ComponentA ..> ComponentB : 使用

%% 接口实现
ComponentA - I1
ComponentA -- () I2

%% 接口使用
ComponentB --> I1
\`\`\`

### 包和分组
\`\`\`plantuml
package "包名" {
  [组件A]
  [组件B]
}

folder "文件夹" {
  [组件C]
}

node "节点" {
  [组件D]
}
\`\`\`

### 端口
\`\`\`plantuml
component "组件" {
  port "输入端口" as P1
  port "输出端口" as P2
}
\`\`\`

## 生成示例

### 示例 1: 基础Web应用（简单场景）
**用户需求**：Web应用组件结构，包含前端、后端、数据库

**生成代码**：
\`\`\`plantuml
@startuml

[前端Web应用] as Frontend
[后端API服务] as Backend
database "MySQL数据库" as DB
() "REST API" as API
() "数据库连接" as DBConn

Frontend --> API : 调用
Backend - API : 提供
Backend --> DBConn : 使用
DB - DBConn : 提供

note right of Frontend
  React + TypeScript
  提供用户界面
end note

note right of Backend
  Node.js + Express
  处理业务逻辑
end note

@enduml
\`\`\`

**关键点**：
- 使用 \`[组件名]\` 定义组件
- 使用 \`()\` 定义接口
- 使用 \`-->\` 表示依赖关系
- 使用 \`-\` 表示接口提供或实现
- 使用 \`database\` 表示数据库组件

### 示例 2: 微服务架构（中等复杂度）
**用户需求**：电商微服务架构，包含多个服务和消息队列

**生成代码**：
\`\`\`plantuml
@startuml

package "前端层" {
  [Web前端] as Web
  [移动端App] as Mobile
}

package "API网关" {
  [API Gateway] as Gateway
}

package "微服务层" {
  [用户服务] as UserSvc
  [订单服务] as OrderSvc
  [商品服务] as ProductSvc
  [支付服务] as PaymentSvc
}

package "数据层" {
  database "用户数据库" as UserDB
  database "订单数据库" as OrderDB
  database "商品数据库" as ProductDB
}

queue "消息队列" as MQ

' 前端到网关
Web --> Gateway
Mobile --> Gateway

' 网关到服务
Gateway --> UserSvc
Gateway --> OrderSvc
Gateway --> ProductSvc
Gateway --> PaymentSvc

' 服务到数据库
UserSvc --> UserDB
OrderSvc --> OrderDB
ProductSvc --> ProductDB

' 服务间通信
OrderSvc --> MQ : 发送订单事件
PaymentSvc --> MQ : 监听订单事件
OrderSvc ..> ProductSvc : 查询库存

@enduml
\`\`\`

**关键点**：
- 使用 \`package\` 对组件进行分层
- 使用 \`queue\` 表示消息队列
- 使用不同的箭头表示不同类型的关系
- 展示服务间的同步和异步通信

### 示例 3: 插件化架构（高级场景）
**用户需求**：插件化系统，核心框架加载多个插件

**生成代码**：
\`\`\`plantuml
@startuml

component "核心框架" as Core {
  port "插件加载器" as Loader
  port "事件总线" as EventBus
  port "配置管理" as Config
}

interface "插件接口" as IPlugin
interface "事件接口" as IEvent

package "插件模块" {
  component "认证插件" as AuthPlugin {
    port "认证入口" as AuthPort
  }
  
  component "日志插件" as LogPlugin {
    port "日志入口" as LogPort
  }
  
  component "缓存插件" as CachePlugin {
    port "缓存入口" as CachePort
  }
}

' 核心框架提供接口
Core - IPlugin
Core - IEvent

' 插件实现接口
IPlugin <.. AuthPlugin
IPlugin <.. LogPlugin
IPlugin <.. CachePlugin

' 插件之间通过事件通信
AuthPlugin --> IEvent : 发布事件
LogPlugin --> IEvent : 订阅事件
CachePlugin --> IEvent : 订阅事件

' 端口连接
Loader --> AuthPort
Loader --> LogPort
Loader --> CachePort

note bottom of Core
  核心框架负责：
  - 插件生命周期管理
  - 事件分发
  - 配置加载
end note

@enduml
\`\`\`

**关键点**：
- 使用端口（\`port\`）表示组件的接口点
- 使用 \`<..\` 表示实现接口
- 展示插件化架构的解耦设计
- 使用注释说明核心职责

## 常见错误 (E - Establish Success Metrics)

### 错误 1: 组件名称不规范
❌ **错误写法**：
\`\`\`plantuml
@startuml
component a
component b
@enduml
\`\`\`

✅ **正确写法**：
\`\`\`plantuml
@startuml
component "用户服务" as UserService
[订单服务]
@enduml
\`\`\`

**原因**：组件名称应该清晰描述组件的职责，使用有意义的命名。

### 错误 2: 接口方向混淆
❌ **错误写法**：
\`\`\`plantuml
@startuml
[组件A] --> () "接口"
[组件B] --> () "接口"
@enduml
\`\`\`

✅ **正确写法**：
\`\`\`plantuml
@startuml
() "接口" as I1
[组件A] - I1 : 提供
[组件B] --> I1 : 使用
@enduml
\`\`\`

**原因**：应区分接口的提供者和使用者，提供者用 \`-\`，使用者用 \`-->\`。

### 错误 3: 包未闭合
❌ **错误写法**：
\`\`\`plantuml
@startuml
package "服务层" {
  [服务A]
  [服务B]
' 忘记闭合括号
@enduml
\`\`\`

✅ **正确写法**：
\`\`\`plantuml
@startuml
package "服务层" {
  [服务A]
  [服务B]
}
@enduml
\`\`\`

**原因**：\`package\`、\`folder\`、\`node\` 等分组结构必须用 \`}\` 闭合。

### 错误 4: 依赖关系方向不清
❌ **错误写法**：
\`\`\`plantuml
@startuml
' 应该是 A 依赖 B，方向不明确
[组件A] - [组件B]
@enduml
\`\`\`

✅ **正确写法**：
\`\`\`plantuml
@startuml
[组件A] --> [组件B] : 依赖
@enduml
\`\`\`

**原因**：依赖关系应该有明确的方向，使用 \`-->\` 箭头表示。

### 错误 5: 滥用组件类型
❌ **错误写法**：
\`\`\`plantuml
@startuml
' 数据库不应该用 component
component "MySQL"
@enduml
\`\`\`

✅ **正确写法**：
\`\`\`plantuml
@startuml
database "MySQL" as DB
@enduml
\`\`\`

**原因**：PlantUML 提供了专门的类型（\`database\`、\`queue\`、\`cloud\` 等），应该使用合适的类型。

## 生成检查清单 (Simplified DEPTH - H)

生成代码后，逐项检查：

- [ ] **图表声明完整**：包含 \`@startuml\` 和 \`@enduml\`
- [ ] **组件命名规范**：使用清晰的、有意义的组件名称
- [ ] **接口定义明确**：区分接口的提供者和使用者
- [ ] **依赖方向正确**：使用箭头明确表示依赖方向
- [ ] **分组结构闭合**：所有 \`package\`、\`folder\`、\`node\` 有对应的 \`}\`
- [ ] **组件类型合适**：使用合适的类型（component、database、queue 等）
- [ ] **层次结构清晰**：使用包进行合理的层次划分
- [ ] **代码可渲染**：语法正确，可以直接通过 Kroki 渲染

**任何检查项不通过，立即修正后重新生成**
`;

/**
 * Token 估算: 约 1000 tokens
 */

