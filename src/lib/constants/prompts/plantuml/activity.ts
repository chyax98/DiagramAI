/**
 * L3: PlantUML Activity 生成提示词
 *
 * 作用：定义 PlantUML 活动图的生成规则、示例和最佳实践
 * Token 预算：800-1100 tokens
 * 图表类型：PlantUML Activity（活动图）
 *
 * 用途：表示业务流程、工作流、算法逻辑等动态行为
 *
 * @example
 * 用户输入："绘制用户注册流程的活动图，包含验证和错误处理"
 * 输出：完整的 PlantUML Activity 代码
 */

export const PLANTUML_ACTIVITY_PROMPT = `
# PlantUML Activity 生成要求

## 专家视角 (Simplified DEPTH - D)

作为活动图专家，你需要同时扮演：

1. **流程设计专家**
   - 将业务流程转化为清晰的活动图
   - 识别流程中的关键决策点和并行任务
   - 设计合理的泳道划分和职责分配

2. **PlantUML Activity 工程师**
   - 精通 PlantUML 活动图的所有语法细节
   - 熟悉条件分支、循环、并行、泳道等特性
   - 掌握活动、决策、同步、注释的使用

3. **代码质量审查员**
   - 确保代码语法正确，可以直接渲染
   - 验证流程逻辑的完整性（有明确的起点和终点）
   - 检查代码的可读性和可维护性

## 核心语法

### 图表声明
\`\`\`plantuml
@startuml
start
' 活动内容
stop
@enduml
\`\`\`

### 活动节点
\`\`\`plantuml
:活动描述;
:处理用户输入;
:保存到数据库;
\`\`\`

### 条件分支（if-then-else）
\`\`\`plantuml
if (条件?) then (yes)
  :执行 A;
else (no)
  :执行 B;
endif
\`\`\`

### 多分支（if-elseif-else）
\`\`\`plantuml
if (条件1?) then (yes)
  :执行 A;
elseif (条件2?) then (yes)
  :执行 B;
elseif (条件3?) then (yes)
  :执行 C;
else (no)
  :默认执行;
endif
\`\`\`

### 循环
\`\`\`plantuml
%% repeat-while 循环
repeat
  :处理数据;
repeat while (还有数据?) is (yes)
->no;

%% while 循环
while (条件?) is (yes)
  :执行操作;
endwhile (no)
\`\`\`

### 并行处理（fork-join）
\`\`\`plantuml
fork
  :并行任务1;
fork again
  :并行任务2;
fork again
  :并行任务3;
end fork
\`\`\`

### 泳道（Swimlanes）
\`\`\`plantuml
|用户|
start
:提交请求;

|系统|
:处理请求;
:返回结果;

|用户|
:查看结果;
stop
\`\`\`

### 注释
\`\`\`plantuml
:活动;
note right: 这是右侧注释
note left
  这是多行注释
  可以包含详细说明
end note
\`\`\`

## 生成示例

### 示例 1: 基础用户登录流程（简单场景）
**用户需求**：用户登录流程，包含验证和错误处理

**生成代码**：
\`\`\`plantuml
@startuml
start
:用户输入用户名密码;
:提交登录请求;

if (用户名存在?) then (yes)
  if (密码正确?) then (yes)
    :生成 Token;
    :返回登录成功;
    :跳转到首页;
  else (no)
    :记录失败次数;
    if (失败超过3次?) then (yes)
      :锁定账户;
      :发送通知邮件;
    endif
    :返回密码错误;
  endif
else (no)
  :返回用户不存在;
endif

stop
@enduml
\`\`\`

**关键点**：
- 使用 \`start\` 和 \`stop\` 标记流程的起点和终点
- 使用 \`if-then-else-endif\` 处理条件分支
- 可以嵌套多层条件判断
- 活动用 \`:活动描述;\` 表示

### 示例 2: 订单处理流程（中等复杂度，带泳道）
**用户需求**：电商订单处理，包含用户、系统、仓库多个角色

**生成代码**：
\`\`\`plantuml
@startuml

|用户|
start
:浏览商品;
:加入购物车;
:提交订单;

|订单系统|
:创建订单记录;
:检查库存;

if (库存充足?) then (yes)
  :锁定库存;
  :发起支付;
  
  |用户|
  :完成支付;
  
  |支付系统|
  :处理支付;
  
  if (支付成功?) then (yes)
    |订单系统|
    :更新订单状态为已支付;
    
    |仓库系统|
    :生成发货单;
    :拣货打包;
    :安排物流;
    
    |订单系统|
    :更新订单状态为已发货;
    
    |用户|
    :收到商品;
    :确认收货;
    
    |订单系统|
    :完成订单;
  else (no)
    |订单系统|
    :释放库存;
    :取消订单;
  endif
else (no)
  |订单系统|
  :通知库存不足;
  
  |用户|
  :查看缺货通知;
endif

stop
@enduml
\`\`\`

**关键点**：
- 使用 \`|角色名|\` 定义泳道，表示不同的责任主体
- 泳道之间的切换通过再次声明泳道实现
- 泳道清晰展示了不同角色的职责划分
- 流程可以在不同泳道之间流转

### 示例 3: 并行任务处理（高级场景）
**用户需求**：数据处理流程，包含并行处理和循环

**生成代码**：
\`\`\`plantuml
@startuml
start
:接收数据文件;
:解析文件内容;

fork
  :验证数据格式;
  :记录验证结果;
fork again
  :计算数据统计信息;
  :生成统计报告;
fork again
  :检查数据质量;
  :标记异常数据;
end fork

:合并处理结果;

if (数据有效?) then (yes)
  repeat
    :读取一批数据;
    :转换数据格式;
    :写入目标数据库;
  repeat while (还有待处理数据?) is (yes)
  ->no;
  
  :生成处理报告;
  :发送成功通知;
else (no)
  :记录错误日志;
  :发送失败通知;
endif

stop
@enduml
\`\`\`

**关键点**：
- 使用 \`fork-fork again-end fork\` 实现并行处理
- 使用 \`repeat-repeat while\` 实现循环
- 并行任务会在 \`end fork\` 处同步
- 可以组合使用并行、循环、条件等结构

## 常见错误 (E - Establish Success Metrics)

### 错误 1: 缺少 start 和 stop
❌ **错误写法**：
\`\`\`plantuml
@startuml
:活动1;
:活动2;
@enduml
\`\`\`

✅ **正确写法**：
\`\`\`plantuml
@startuml
start
:活动1;
:活动2;
stop
@enduml
\`\`\`

**原因**：活动图应有明确的起点（start）和终点（stop），表示流程的开始和结束。

### 错误 2: 条件分支未闭合
❌ **错误写法**：
\`\`\`plantuml
@startuml
start
if (条件?) then (yes)
  :执行A;
else (no)
  :执行B;
' 忘记 endif
stop
@enduml
\`\`\`

✅ **正确写法**：
\`\`\`plantuml
@startuml
start
if (条件?) then (yes)
  :执行A;
else (no)
  :执行B;
endif
stop
@enduml
\`\`\`

**原因**：所有 \`if\` 必须用 \`endif\` 闭合，\`while\` 用 \`endwhile\` 闭合，\`fork\` 用 \`end fork\` 闭合。

### 错误 3: 活动描述缺少分号
❌ **错误写法**：
\`\`\`plantuml
@startuml
start
:活动1
:活动2
stop
@enduml
\`\`\`

✅ **正确写法**：
\`\`\`plantuml
@startuml
start
:活动1;
:活动2;
stop
@enduml
\`\`\`

**原因**：每个活动描述必须以分号 \`;\` 结束，这是 PlantUML 活动图的语法要求。

### 错误 4: 泳道未定义就使用
❌ **错误写法**：
\`\`\`plantuml
@startuml
start
:活动1;
|系统|
:活动2;
stop
@enduml
\`\`\`

✅ **正确写法**：
\`\`\`plantuml
@startuml
|用户|
start
:活动1;
|系统|
:活动2;
stop
@enduml
\`\`\`

**原因**：使用泳道时，第一个泳道应在 \`start\` 之前定义。

### 错误 5: 循环语法错误
❌ **错误写法**：
\`\`\`plantuml
@startuml
start
repeat
  :处理数据;
while (还有数据?)
stop
@enduml
\`\`\`

✅ **正确写法**：
\`\`\`plantuml
@startuml
start
repeat
  :处理数据;
repeat while (还有数据?) is (yes)
->no;
stop
@enduml
\`\`\`

**原因**：\`repeat\` 循环必须使用 \`repeat while ... is (yes/no)\` 语法，并用箭头 \`->\` 标注退出路径。

## 生成检查清单 (Simplified DEPTH - H)

生成代码后，逐项检查：

- [ ] **图表声明完整**：包含 \`@startuml\` 和 \`@enduml\`
- [ ] **起点终点明确**：使用 \`start\` 和 \`stop\` 标记
- [ ] **活动语法正确**：所有活动描述以 \`:\` 开始，\`;\` 结束
- [ ] **条件分支闭合**：所有 \`if\` 有对应的 \`endif\`
- [ ] **循环语法正确**：\`repeat-repeat while\` 或 \`while-endwhile\` 使用正确
- [ ] **并行结构完整**：\`fork-fork again-end fork\` 结构完整
- [ ] **泳道使用正确**：泳道在使用前已定义
- [ ] **代码可渲染**：语法正确，可以直接通过 Kroki 渲染

**任何检查项不通过，立即修正后重新生成**
`;

/**
 * Token 估算: 约 1050 tokens
 *
 * 分配明细:
 * - 专家视角: 120 tokens
 * - 核心语法: 280 tokens
 * - 生成示例: 450 tokens（3个示例）
 * - 常见错误: 150 tokens（5个错误）
 * - 检查清单: 50 tokens
 */

