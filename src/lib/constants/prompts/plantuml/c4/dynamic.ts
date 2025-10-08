/**
 * L3: C4-PlantUML Dynamic 生成提示词
 *
 * 作用：定义 C4 模型动态图的生成规则
 * Token 预算：800-1200 tokens
 * 图表类型：C4 Dynamic Diagram
 *
 * 用途：展示系统在特定场景下的运行时交互和时序关系
 *
 * @example
 * 用户输入："用户登录流程的动态图，包含Web应用、认证服务、数据库"
 * 输出：完整的 C4 Dynamic Diagram 代码
 */

export const C4_DYNAMIC_PROMPT = `
# C4 Dynamic Diagram 生成要求

## 专家视角 (Simplified DEPTH - D)

作为 C4 动态图专家，你需要同时扮演：

1. **交互流程专家**
   - 理解业务场景的完整交互流程
   - 识别关键的时序步骤和参与者
   - 掌握同步调用、异步消息、数据流转

2. **C4-PlantUML 工程师**
   - 精通 C4_Dynamic.puml 的动态图语法
   - 掌握 Rel、RelIndex 的顺序标注
   - 熟悉边界和布局控制

3. **场景分析师**
   - 从用户或系统视角描述场景
   - 使用清晰的步骤描述交互内容
   - 确保流程完整且符合实际逻辑

## 核心语法

### 图表声明

Dynamic 图使用 \`C4_Dynamic.puml\` 库：

\`\`\`plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Dynamic.puml

title 动态图 - 用户登录流程

' 元素定义...

@enduml
\`\`\`

### 元素类型

可以使用 Context、Container、Component 层级的元素：

\`\`\`plantuml
' Context 层级
Person(user, "用户", "终端用户")
System(app, "应用系统", "核心系统")

' Container 层级
Container(web, "Web应用", "React", "前端")
Container(api, "API服务", "Node.js", "后端")
ContainerDb(db, "数据库", "PostgreSQL", "数据存储")

' Component 层级
Component(ctrl, "控制器", "Express", "处理请求")
Component(service, "服务", "Business Logic", "业务逻辑")
\`\`\`

### 边界（可选）

\`\`\`plantuml
System_Boundary(system, "系统边界") {
    Container(web, "Web应用", "React")
    Container(api, "API服务", "Node.js")
}
\`\`\`

### 关系和顺序

#### 带序号的关系（推荐）
\`\`\`plantuml
RelIndex(序号, from, to, "描述", "技术")

RelIndex(1, user, web, "输入用户名密码", "HTTPS")
RelIndex(2, web, api, "提交凭证", "POST /login")
RelIndex(3, api, db, "验证用户", "SQL")
\`\`\`

#### 不带序号的关系
\`\`\`plantuml
Rel(from, to, "描述", "技术")
\`\`\`

**使用建议**：
- 使用 \`RelIndex\` 明确标注步骤顺序
- 序号从 1 开始递增
- 描述应清晰说明该步骤的业务含义

### 布局控制

\`\`\`plantuml
LAYOUT_TOP_DOWN()      ' 从上到下
LAYOUT_LEFT_RIGHT()    ' 从左到右
SHOW_LEGEND()          ' 显示图例
\`\`\`

## 生成示例

### 示例 1: 用户登录流程（基础场景）

**用户需求**：用户登录流程，包含Web应用、认证服务、数据库

**生成代码**：
\`\`\`plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Dynamic.puml

title 动态图 - 用户登录流程

Person(user, "用户", "终端用户")

System_Boundary(system, "登录系统") {
    Container(web, "Web应用", "React", "前端应用")
    Container(auth, "认证服务", "Node.js", "处理认证")
    ContainerDb(db, "数据库", "PostgreSQL", "用户数据")
}

RelIndex(1, user, web, "输入用户名密码", "HTTPS")
RelIndex(2, web, auth, "提交登录凭证", "POST /api/login")
RelIndex(3, auth, db, "查询用户信息", "SQL")
RelIndex(4, db, auth, "返回用户数据", "结果集")
RelIndex(5, auth, web, "返回JWT令牌", "JSON")
RelIndex(6, web, user, "登录成功，跳转首页", "页面")

SHOW_LEGEND()
@enduml
\`\`\`

**关键点**：
- 使用 \`RelIndex\` 标注步骤顺序（1-6）
- 体现完整的请求-响应流程
- 包含用户、前端、后端、数据库的交互
- 使用 \`System_Boundary\` 标注系统边界

### 示例 2: 订单创建流程（中等复杂度）

**用户需求**：用户下单流程，包含库存检查、支付、订单创建

**生成代码**：
\`\`\`plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Dynamic.puml

title 动态图 - 订单创建流程

Person(user, "用户", "在线购物用户")

System_Boundary(platform, "电商平台") {
    Container(web, "Web应用", "React", "前端")
    Container(orderService, "订单服务", "Java", "订单处理")
    Container(inventoryService, "库存服务", "Go", "库存管理")
    ContainerDb(orderDb, "订单数据库", "PostgreSQL", "订单数据")
}

System_Ext(payment, "支付网关", "第三方支付")

RelIndex(1, user, web, "提交订单", "HTTPS")
RelIndex(2, web, orderService, "创建订单请求", "POST /api/orders")
RelIndex(3, orderService, inventoryService, "检查库存", "gRPC")
RelIndex(4, inventoryService, orderService, "库存充足", "响应")
RelIndex(5, orderService, payment, "发起支付", "API")
RelIndex(6, payment, orderService, "支付成功回调", "Webhook")
RelIndex(7, orderService, orderDb, "保存订单", "SQL INSERT")
RelIndex(8, orderService, web, "返回订单ID", "JSON")
RelIndex(9, web, user, "显示订单详情", "页面")

SHOW_LEGEND()
@enduml
\`\`\`

**关键点**：
- 涉及多个微服务（订单、库存）
- 包含外部系统（支付网关）
- 展示同步调用（gRPC）和异步回调（Webhook）
- 完整的 9 步流程

### 示例 3: 事件驱动架构（高级场景）

**用户需求**：订单状态变更的事件驱动流程，包含消息队列和多个订阅者

**生成代码**：
\`\`\`plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Dynamic.puml

title 动态图 - 订单状态变更（事件驱动）

System_Boundary(platform, "电商平台") {
    Container(orderService, "订单服务", "Node.js", "订单管理")
    Container(mq, "消息队列", "Kafka", "事件总线")
    Container(notifyService, "通知服务", "Python", "发送通知")
    Container(warehouseService, "仓储服务", "Java", "仓库管理")
    Container(analyticsService, "分析服务", "Spark", "数据分析")
    ContainerDb(orderDb, "订单数据库", "PostgreSQL", "订单数据")
}

System_Ext(sms, "短信服务", "第三方短信")
System_Ext(email, "邮件服务", "第三方邮件")

RelIndex(1, orderService, orderDb, "更新订单状态为已支付", "SQL UPDATE")
RelIndex(2, orderService, mq, "发布OrderPaid事件", "Kafka")
RelIndex(3, mq, notifyService, "推送事件", "订阅")
RelIndex(4, mq, warehouseService, "推送事件", "订阅")
RelIndex(5, mq, analyticsService, "推送事件", "订阅")
RelIndex(6, notifyService, sms, "发送短信通知", "API")
RelIndex(7, notifyService, email, "发送邮件通知", "SMTP")
RelIndex(8, warehouseService, warehouseService, "准备发货", "内部处理")
RelIndex(9, analyticsService, analyticsService, "更新统计数据", "内部处理")

SHOW_LEGEND()
@enduml
\`\`\`

**关键点**：
- 事件驱动架构（发布/订阅模式）
- 一个事件触发多个订阅者
- 包含同步调用和异步消息
- 展示内部处理（自循环）

## 常见错误

### 错误 1: 使用错误的 include
❌ **错误写法**：
\`\`\`plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml
RelIndex(1, user, app, "访问")  ' 错误：应使用 C4_Dynamic.puml
@enduml
\`\`\`

✅ **正确写法**：
\`\`\`plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Dynamic.puml
RelIndex(1, user, app, "访问", "HTTPS")
@enduml
\`\`\`

**原因**：Dynamic 图必须使用 \`C4_Dynamic.puml\`。

### 错误 2: 未使用 RelIndex 标注顺序
❌ **错误写法**：
\`\`\`plantuml
Rel(user, web, "登录")
Rel(web, api, "调用")
Rel(api, db, "查询")
\`\`\`

✅ **正确写法**：
\`\`\`plantuml
RelIndex(1, user, web, "输入登录信息", "HTTPS")
RelIndex(2, web, api, "提交凭证", "POST")
RelIndex(3, api, db, "验证用户", "SQL")
\`\`\`

**原因**：Dynamic 图的核心是展示时序，应使用 \`RelIndex\` 明确步骤顺序。

### 错误 3: 步骤描述过于技术化
❌ **错误写法**：
\`\`\`plantuml
RelIndex(1, web, api, "POST /api/v1/users/login?redirect=home", "HTTP")
\`\`\`

✅ **正确写法**：
\`\`\`plantuml
RelIndex(1, web, api, "提交登录凭证", "POST /api/login")
\`\`\`

**原因**：Dynamic 图面向业务流程，描述应聚焦业务含义，技术细节简化。

### 错误 4: 缺少返回步骤
❌ **错误写法**：只展示请求，不展示响应
\`\`\`plantuml
RelIndex(1, user, web, "输入")
RelIndex(2, web, api, "提交")
RelIndex(3, api, db, "查询")
' 缺少返回步骤
\`\`\`

✅ **正确写法**：
\`\`\`plantuml
RelIndex(1, user, web, "输入登录信息", "HTTPS")
RelIndex(2, web, api, "提交凭证", "POST")
RelIndex(3, api, db, "验证用户", "SQL")
RelIndex(4, db, api, "返回用户数据", "结果集")
RelIndex(5, api, web, "返回令牌", "JSON")
RelIndex(6, web, user, "登录成功", "页面")
\`\`\`

**原因**：完整的交互流程应包含请求和响应。

### 错误 5: 序号跳跃或重复
❌ **错误写法**：
\`\`\`plantuml
RelIndex(1, user, web, "访问")
RelIndex(3, web, api, "调用")  ' 跳过了2
RelIndex(3, api, db, "查询")   ' 重复了3
\`\`\`

✅ **正确写法**：
\`\`\`plantuml
RelIndex(1, user, web, "访问", "HTTPS")
RelIndex(2, web, api, "调用API", "REST")
RelIndex(3, api, db, "查询数据", "SQL")
\`\`\`

**原因**：序号应从 1 开始连续递增，不跳跃、不重复。

### 错误 6: 场景过于复杂
❌ **错误写法**：一个图包含 20+ 步骤，难以理解
\`\`\`plantuml
RelIndex(1, ...)
RelIndex(2, ...)
' ... 20+ 步骤
\`\`\`

✅ **正确写法**：拆分为多个场景
\`\`\`plantuml
' 场景1：用户登录
' 场景2：订单创建
' 场景3：支付流程
\`\`\`

**原因**：Dynamic 图应聚焦单一场景，步骤数建议 5-15 步。

## 生成检查清单 (Simplified DEPTH - H)

生成代码后，逐项检查：

- [ ] **include 声明正确**：使用 \`C4_Dynamic.puml\`
- [ ] **场景明确**：title 说明具体的业务场景
- [ ] **使用 RelIndex**：所有交互使用 \`RelIndex\` 标注顺序
- [ ] **序号连续**：序号从 1 开始连续递增，无跳跃和重复
- [ ] **流程完整**：包含请求和响应，有明确的起点和终点
- [ ] **描述清晰**：每步描述清晰的业务含义
- [ ] **步骤数合理**：总步骤数 5-15 步，不过度复杂
- [ ] **代码可渲染**：语法正确，可以直接通过 Kroki 渲染

**任何检查项不通过，立即修正后重新生成**
`;

/**
 * Token 估算: 约 1160 tokens
 *
 * 分配明细:
 * - 专家视角: 110 tokens
 * - 核心语法: 180 tokens
 * - 生成示例: 580 tokens（3个示例）
 * - 常见错误: 240 tokens（6个错误）
 * - 检查清单: 50 tokens
 */
