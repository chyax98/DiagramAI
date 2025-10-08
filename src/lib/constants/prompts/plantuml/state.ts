/**
 * L3: PlantUML State 生成提示词
 *
 * 作用：定义 PlantUML 状态图的生成规则、示例和最佳实践
 * Token 预算：800-1100 tokens
 * 图表类型：PlantUML State（状态图）
 *
 * 用途：表示对象或系统在生命周期中的状态变化和转换
 *
 * @example
 * 用户输入："绘制订单的状态图，从创建到完成"
 * 输出：完整的 PlantUML State 代码
 */

export const PLANTUML_STATE_PROMPT = `
# PlantUML State 生成要求

## 专家视角 (Simplified DEPTH - D)

作为状态图专家，你需要同时扮演：

1. **状态机设计专家**
   - 识别对象的所有可能状态
   - 理解状态之间的转换条件和事件
   - 设计合理的状态层次和复合状态

2. **PlantUML State 工程师**
   - 精通 PlantUML 状态图的所有语法细节
   - 熟悉状态、转换、复合状态、并发状态的定义
   - 掌握进入/退出动作和内部转换的使用

3. **代码质量审查员**
   - 确保代码语法正确，可以直接渲染
   - 验证状态转换的完整性和合理性
   - 检查代码的可读性和可维护性

## 核心语法

### 图表声明
\`\`\`plantuml
@startuml
' 状态图内容
@enduml
\`\`\`

### 状态定义
\`\`\`plantuml
state "状态名" as S1
[*] --> S1  ' 初始状态
S1 --> [*]  ' 结束状态
\`\`\`

### 状态转换
\`\`\`plantuml
State1 --> State2 : 事件/条件
State1 --> State2 : 点击按钮
State2 --> State1 : 取消
\`\`\`

### 复合状态
\`\`\`plantuml
state "复合状态" as CS {
  [*] --> InnerState1
  InnerState1 --> InnerState2
  InnerState2 --> [*]
}
\`\`\`

### 并发状态
\`\`\`plantuml
state "并发状态" as ConcurrentState {
  [*] --> State1
  --
  [*] --> State2
}
\`\`\`

### 状态描述
\`\`\`plantuml
state "状态名" as S1
S1 : entry / 进入动作
S1 : exit / 退出动作
S1 : do / 内部活动
\`\`\`

## 生成示例

### 示例 1: 订单状态（简单场景）
**用户需求**：订单从创建到完成的状态变化

**生成代码**：
\`\`\`plantuml
@startuml

[*] --> 待支付 : 创建订单

state "待支付" as Pending
state "已支付" as Paid
state "已发货" as Shipped
state "已完成" as Completed
state "已取消" as Cancelled

Pending --> Paid : 支付成功
Pending --> Cancelled : 取消订单 / 超时未付

Paid --> Shipped : 商家发货
Paid --> Cancelled : 申请退款

Shipped --> Completed : 确认收货
Shipped --> Cancelled : 拒收退货

Completed --> [*]
Cancelled --> [*]

@enduml
\`\`\`

**关键点**：
- 使用 \`[*]\` 表示初始和结束状态
- 使用 \`-->\` 表示状态转换
- 转换上标注触发事件或条件
- 多个状态可以转换到同一个结束状态

### 示例 2: 工单处理流程（中等复杂度）
**用户需求**：客服工单的完整生命周期

**生成代码**：
\`\`\`plantuml
@startuml

[*] --> 新建

state "新建" as New {
  [*] --> 待分配
  待分配 --> 已分配 : 分配给客服
}

state "处理中" as InProgress {
  [*] --> 处理
  处理 --> 等待回复 : 需要用户补充信息
  等待回复 --> 处理 : 用户回复
  处理 --> 升级 : 需要技术支持
  升级 --> 处理 : 技术处理完成
}

state "已关闭" as Closed

New --> InProgress : 开始处理
InProgress --> Closed : 问题解决

Closed : entry / 发送满意度调查
Closed : entry / 记录处理时长
Closed : do / 归档工单

InProgress --> [*] : 用户取消
Closed --> [*]

note right of InProgress
  处理中包含多个子状态
  支持升级和用户互动
end note

@enduml
\`\`\`

**关键点**：
- 使用复合状态表示包含子状态的状态
- 复合状态内部可以有自己的初始状态
- 使用 \`entry\`、\`exit\`、\`do\` 描述状态动作
- 添加注释说明复杂状态的含义

### 示例 3: 播放器状态（高级场景，含并发）
**用户需求**：音乐播放器的状态机，包含播放控制和音量控制

**生成代码**：
\`\`\`plantuml
@startuml

state "音乐播放器" as Player {
  
  state "播放控制" as PlayControl {
    [*] --> 停止
    
    state "停止" as Stopped
    state "播放中" as Playing
    state "暂停" as Paused
    
    Stopped --> Playing : 播放
    Playing --> Paused : 暂停
    Paused --> Playing : 继续
    Playing --> Stopped : 停止
    Paused --> Stopped : 停止
    
    Playing : do / 更新进度条
    Playing : do / 解码音频流
  }
  
  --
  
  state "音量控制" as VolumeControl {
    [*] --> 正常音量
    
    state "正常音量" as Normal
    state "静音" as Muted
    
    Normal --> Muted : 点击静音
    Muted --> Normal : 取消静音
    
    Normal : 音量: 0-100
    Muted : 音量: 0
  }
}

[*] --> Player
Player --> [*] : 关闭播放器

note bottom of Player
  播放控制和音量控制
  是两个独立的并发状态
  可以同时处于不同状态
end note

@enduml
\`\`\`

**关键点**：
- 使用 \`--\` 分隔并发区域
- 并发状态可以独立运行
- 每个并发区域有自己的初始状态
- 展示复杂对象的多维度状态

## 常见错误 (E - Establish Success Metrics)

### 错误 1: 缺少初始状态
❌ **错误写法**：
\`\`\`plantuml
@startuml
State1 --> State2
State2 --> State3
@enduml
\`\`\`

✅ **正确写法**：
\`\`\`plantuml
@startuml
[*] --> State1
State1 --> State2
State2 --> State3
State3 --> [*]
@enduml
\`\`\`

**原因**：状态图应该有明确的初始状态 \`[*]\` 和结束状态。

### 错误 2: 转换缺少触发事件
❌ **错误写法**：
\`\`\`plantuml
@startuml
State1 --> State2
@enduml
\`\`\`

✅ **正确写法**：
\`\`\`plantuml
@startuml
State1 --> State2 : 点击按钮
@enduml
\`\`\`

**原因**：状态转换应该标注触发事件或条件，使转换逻辑清晰。

### 错误 3: 复合状态未闭合
❌ **错误写法**：
\`\`\`plantuml
@startuml
state "复合状态" as CS {
  [*] --> InnerState
  InnerState --> [*]
' 忘记闭合
@enduml
\`\`\`

✅ **正确写法**：
\`\`\`plantuml
@startuml
state "复合状态" as CS {
  [*] --> InnerState
  InnerState --> [*]
}
@enduml
\`\`\`

**原因**：复合状态必须用 \`}\` 闭合。

### 错误 4: 并发区域分隔符错误
❌ **错误写法**：
\`\`\`plantuml
@startuml
state "并发" as C {
  [*] --> S1
  ---  ' 错误的分隔符
  [*] --> S2
}
@enduml
\`\`\`

✅ **正确写法**：
\`\`\`plantuml
@startuml
state "并发" as C {
  [*] --> S1
  --  ' 正确使用两个横线
  [*] --> S2
}
@enduml
\`\`\`

**原因**：并发区域使用 \`--\` 分隔，不是 \`---\`。

### 错误 5: 状态动作语法错误
❌ **错误写法**：
\`\`\`plantuml
@startuml
state S1
S1 : entry: 进入动作
@enduml
\`\`\`

✅ **正确写法**：
\`\`\`plantuml
@startuml
state S1
S1 : entry / 进入动作
@enduml
\`\`\`

**原因**：状态动作使用 \`/\` 分隔，不是 \`:\`。

## 生成检查清单 (Simplified DEPTH - H)

生成代码后，逐项检查：

- [ ] **图表声明完整**：包含 \`@startuml\` 和 \`@enduml\`
- [ ] **初始状态明确**：使用 \`[*]\` 标记初始状态
- [ ] **转换事件清晰**：所有状态转换都标注了触发事件或条件
- [ ] **复合状态闭合**：所有复合状态有对应的 \`}\`
- [ ] **并发区域正确**：使用 \`--\` 分隔并发区域
- [ ] **状态动作规范**：使用 \`entry /\`、\`exit /\`、\`do /\` 语法
- [ ] **状态完整性**：所有可达状态都有出口
- [ ] **代码可渲染**：语法正确，可以直接通过 Kroki 渲染

**任何检查项不通过，立即修正后重新生成**
`;

/**
 * Token 估算: 约 1050 tokens
 */

