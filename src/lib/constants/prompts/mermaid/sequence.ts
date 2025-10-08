/**
 * L3: Mermaid Sequence Diagram 生成提示词
 *
 * 作用：定义 Mermaid 时序图的生成规则、示例和最佳实践
 * Token 预算：900-1200 tokens
 * 图表类型：Mermaid Sequence Diagram（时序图）
 *
 * 用途：表示对象间的交互时序、API 调用流程、系统通信等
 *
 * @example
 * 用户输入："绘制用户登录的时序图，包括前端、后端和数据库"
 * 输出：完整的 Mermaid Sequence Diagram 代码
 */

export const MERMAID_SEQUENCE_PROMPT = `
# Mermaid Sequence Diagram 生成要求

## 专家视角

作为时序图专家，你需要同时扮演：

1. **系统交互设计专家**
   - 清晰识别参与者（Actor/Participant）和它们的角色
   - 理解消息传递的时序关系和因果逻辑
   - 区分同步调用、异步消息和返回值

2. **Mermaid Sequence 工程师**
   - 精通 sequenceDiagram 的所有语法细节
   - 熟悉激活框、循环、条件分支等高级特性
   - 掌握注释、分组和样式定制

3. **代码质量审查员**
   - 确保消息流程的逻辑正确性
   - 验证参与者声明和消息箭头的一致性
   - 检查代码可读性和渲染兼容性

## 核心语法

### 图表声明
\`\`\`mermaid
sequenceDiagram
    %% 时序图以 sequenceDiagram 关键字开始
\`\`\`

### 参与者声明
\`\`\`mermaid
%% 方式 1: 自动声明（首次使用时自动创建）
Alice->>Bob: Hello

%% 方式 2: 显式声明（推荐，可以设置别名和顺序）
participant A as Alice
participant B as Bob
actor U as User       %% actor 用于真人用户

%% 参与者顺序：按声明顺序从左到右排列
\`\`\`

### 消息类型
\`\`\`mermaid
%% 1. 实线箭头（同步调用）
A->>B: 同步消息

%% 2. 虚线箭头（异步消息或返回）
A-->>B: 异步消息
B-->>A: 返回值

%% 3. 实线无箭头
A-B: 无方向消息

%% 4. 十字箭头（丢失的消息）
A-xB: 丢失的消息

%% 5. 开放箭头（异步消息）
A-)B: 异步开放箭头
\`\`\`

### 激活框（Activation）
\`\`\`mermaid
%% 显示对象被激活的时间段
Alice->>+John: 调用方法
John-->>-Alice: 返回结果

%% 手动激活/去激活
activate John
John->>Bob: 调用
deactivate John
\`\`\`

### 注释和标注
\`\`\`mermaid
%% Note 注释
Note left of Alice: 左侧注释
Note right of Bob: 右侧注释
Note over Alice,Bob: 跨越多个参与者的注释
\`\`\`

### 循环和条件
\`\`\`mermaid
%% 循环
loop 每天
    Alice->>Bob: 问候
end

%% 条件分支
alt 成功
    Alice->>Bob: 返回数据
else 失败
    Alice->>Bob: 返回错误
end

%% 可选流程
opt 额外检查
    Alice->>Bob: 验证
end
\`\`\`

## 生成示例

### 示例 1: 基础用户登录时序（简单场景）
**用户需求**：绘制用户登录的时序图，包括前端、后端和数据库

**生成代码**：
\`\`\`mermaid
sequenceDiagram
    actor User as 用户
    participant FE as 前端
    participant BE as 后端
    participant DB as 数据库

    User->>FE: 输入用户名密码
    FE->>BE: POST /login {username, password}
    activate BE
    BE->>DB: 查询用户
    activate DB
    DB-->>BE: 返回用户信息
    deactivate DB

    alt 验证成功
        BE-->>FE: 返回 Token
        FE-->>User: 登录成功
    else 验证失败
        BE-->>FE: 返回错误
        FE-->>User: 显示错误信息
    end
    deactivate BE
\`\`\`

**关键点**：
- 使用 \`actor\` 声明真人用户
- 使用 \`participant\` 声明系统组件
- 使用 \`activate/deactivate\` 显示激活框
- 使用 \`alt/else\` 表示条件分支
- 使用 \`--\>\>\` 表示返回消息

### 示例 2: 支付流程时序图（中等复杂度）
**用户需求**：电商支付流程，包括订单服务、支付服务和第三方支付

**生成代码**：
\`\`\`mermaid
sequenceDiagram
    participant Order as 订单服务
    participant Payment as 支付服务
    participant Gateway as 支付宝

    Order->>+Payment: 创建支付订单
    Payment->>Payment: 生成支付单号
    Payment-->>-Order: 返回支付单号

    Order->>+Gateway: 请求支付 (订单号, 金额)
    Gateway-->>-Order: 返回支付页面 URL

    Note over Order,Gateway: 用户在支付宝页面完成支付

    Gateway->>+Payment: 支付回调 (支付结果)
    Payment->>Payment: 验证签名

    alt 支付成功
        Payment->>Order: 通知支付成功
        Payment-->>Gateway: 返回 success
    else 支付失败
        Payment->>Order: 通知支付失败
        Payment-->>Gateway: 返回 fail
    end
    deactivate Payment
\`\`\`

**关键点**：
- 使用 \`Note over\` 标注重要说明
- 自激活消息（\`Payment->>Payment:\`）表示内部处理
- 多层嵌套的激活框
- 清晰的返回消息流向

### 示例 3: 微服务调用链（高级场景）
**用户需求**：展示微服务之间的调用链，包含重试和熔断机制

**生成代码**：
\`\`\`mermaid
sequenceDiagram
    participant API as API Gateway
    participant UserSvc as 用户服务
    participant OrderSvc as 订单服务
    participant PaySvc as 支付服务
    participant Cache as Redis

    API->>+UserSvc: 获取用户信息
    UserSvc->>Cache: 查询缓存

    alt 缓存命中
        Cache-->>UserSvc: 返回用户信息
    else 缓存未命中
        UserSvc->>UserSvc: 查询数据库
        UserSvc->>Cache: 更新缓存
    end
    UserSvc-->>-API: 返回用户信息

    API->>+OrderSvc: 查询用户订单

    loop 重试 3 次
        OrderSvc->>PaySvc: 查询支付状态

        opt 服务超时
            Note over OrderSvc,PaySvc: 熔断器开启
            OrderSvc-->>OrderSvc: 使用降级数据
        end
    end

    OrderSvc-->>-API: 返回订单列表
\`\`\`

**关键点**：
- 使用 \`loop\` 表示重试逻辑
- 使用 \`opt\` 表示可选的降级流程
- 组合使用缓存查询的条件分支
- 复杂的激活框嵌套

## 常见错误

### 错误 1: 参与者名称不一致
**❌ 错误写法**：
\`\`\`mermaid
sequenceDiagram
    Alice->>Bob: Hello
    bob->>Alice: Hi    %% 注意 B 的大小写
\`\`\`

**✅ 正确写法**：
\`\`\`mermaid
sequenceDiagram
    Alice->>Bob: Hello
    Bob->>Alice: Hi    %% 保持大小写一致
\`\`\`

**原因**：参与者名称大小写敏感，\`Bob\` 和 \`bob\` 是两个不同的参与者。

### 错误 2: 箭头语法错误
**❌ 错误写法**：
\`\`\`mermaid
sequenceDiagram
    A->B: Message    %% 单箭头错误
\`\`\`

**✅ 正确写法**：
\`\`\`mermaid
sequenceDiagram
    A->>B: Message   %% 使用双箭头
\`\`\`

**原因**：Mermaid 时序图使用 \`->>\` 而不是 \`->\`。

### 错误 3: 激活框未配对
**❌ 错误写法**：
\`\`\`mermaid
sequenceDiagram
    A->>+B: 请求
    B->>C: 转发
    %% 缺少 deactivate 或 -
\`\`\`

**✅ 正确写法**：
\`\`\`mermaid
sequenceDiagram
    A->>+B: 请求
    B->>C: 转发
    B-->>-A: 返回    %% 使用 - 去激活
\`\`\`

**原因**：每个 \`+\` 激活必须有对应的 \`-\` 去激活，否则激活框不会关闭。

### 错误 4: alt/else 语法错误
**❌ 错误写法**：
\`\`\`mermaid
sequenceDiagram
    alt 成功
        A->>B: OK
    else if 失败    %% 不支持 else if
        A->>B: Error
    end
\`\`\`

**✅ 正确写法**：
\`\`\`mermaid
sequenceDiagram
    alt 成功
        A->>B: OK
    else 失败       %% 使用 else
        A->>B: Error
    end
\`\`\`

**原因**：Mermaid 的 \`alt/else\` 不支持 \`else if\`，只能有一个 \`else\`。

### 错误 5: Note 位置错误
**❌ 错误写法**：
\`\`\`mermaid
sequenceDiagram
    Note Alice: 注释    %% 缺少 left of/right of/over
\`\`\`

**✅ 正确写法**：
\`\`\`mermaid
sequenceDiagram
    Note left of Alice: 注释
    Note over Alice,Bob: 跨越注释
\`\`\`

**原因**：\`Note\` 必须指定位置：\`left of\`、\`right of\` 或 \`over\`。

### 错误 6: 消息文本包含特殊字符未转义
**❌ 错误写法**：
\`\`\`mermaid
sequenceDiagram
    A->>B: 返回数据 {id: 1}    %% {} 会导致解析错误
\`\`\`

**✅ 正确写法**：
\`\`\`mermaid
sequenceDiagram
    A->>B: 返回数据 (id: 1)    %% 使用 () 或其他符号
\`\`\`

**原因**：消息文本中的特殊字符（如 \`{}\`）可能导致解析错误，建议使用其他符号。

## 生成检查清单

生成代码后，逐项检查：

- [ ] **图表声明正确**：使用 \`sequenceDiagram\`
- [ ] **参与者名称一致**：所有参与者名称大小写一致
- [ ] **箭头语法正确**：使用 \`->>\`、\`--\>\>\` 等正确语法
- [ ] **激活框配对**：每个 \`+\` 都有对应的 \`-\`
- [ ] **消息流向清晰**：调用和返回的方向正确
- [ ] **条件分支正确**：\`alt/else/opt/loop\` 语法正确且有 \`end\`
- [ ] **注释位置正确**：\`Note\` 使用正确的位置语法
- [ ] **代码可渲染**：语法正确，可以直接通过 Kroki 渲染

**任何检查项不通过，立即修正后重新生成**
`;

/**
 * Token 估算: 约 1100 tokens
 *
 * 分配明细:
 * - 专家视角: 120 tokens
 * - 核心语法: 320 tokens
 * - 生成示例: 420 tokens（3个示例）
 * - 常见错误: 180 tokens（6个错误）
 * - 检查清单: 60 tokens
 */
