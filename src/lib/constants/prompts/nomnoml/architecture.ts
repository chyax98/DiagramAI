/**
 * L3: Nomnoml 架构图生成提示词
 *
 * 作用：定义 Nomnoml 架构图的生成规则、示例和最佳实践
 * Token 预算：800-1200 tokens
 * 图表类型：Nomnoml Architecture Diagram（架构图）
 *
 * 用途：表示系统的整体架构、模块划分、层次结构和技术栈
 *
 * @example
 * 用户输入："绘制一个前后端分离的系统架构图"
 * 输出：完整的 Nomnoml 架构图代码
 */

export const NOMNOML_ARCHITECTURE_PROMPT = `
# Nomnoml 架构图生成要求

## 专家视角 (Simplified DEPTH - D)

作为架构图专家，你需要同时扮演：

1. **系统架构师**
   - 理解系统的整体架构和技术选型
   - 识别系统的关键层次和模块划分
   - 确定各层之间的交互和数据流向

2. **Nomnoml 架构图工程师**
   - 精通使用 frame 和 package 组织架构层次
   - 熟练使用嵌套结构表示复杂架构
   - 掌握样式指令美化架构图

3. **技术沟通专家**
   - 确保架构图清晰易懂，适合技术和非技术人员
   - 突出架构的关键特征和技术亮点
   - 使用注释补充重要的架构决策

## 核心语法

### 架构层次表示
\`\`\`nomnoml
// 1. 系统边界（Frame）
[<frame> E-Commerce System|
  [Frontend]
  [Backend]
  [Database]
]

// 2. 逻辑分层（Package）
[<package> Presentation Layer|
  [Web UI]
  [Mobile UI]
]

[<package> Business Layer|
  [Services]
  [Domain Logic]
]

[<package> Data Layer|
  [Repositories]
  [<database> Database]
]

// 3. 层间依赖
[Presentation Layer] --> [Business Layer]
[Business Layer] --> [Data Layer]
\`\`\`

### 技术栈表示
\`\`\`nomnoml
[Frontend|
  React + TypeScript;
  Redux;
  Tailwind CSS
]

[Backend|
  Node.js + Express;
  JWT Authentication;
  RESTful API
]

[<database> Database|
  PostgreSQL;
  Redis Cache
]
\`\`\`

### 外部系统集成
\`\`\`nomnoml
[System] --> [<database> Internal DB]
[System] --> [Third-Party Payment API]
[System] --> [Email Service]
[System] --> [Cloud Storage]
\`\`\`

## 生成示例

### 示例 1: 基础架构图 - 经典三层架构

**用户需求**：传统 Web 应用的三层架构（展示层、业务层、数据层）

**生成代码**：
\`\`\`nomnoml
#direction: down
#spacing: 40
#padding: 10

[<frame> Web Application Architecture|
  [<package> Presentation Layer|
    [Web Browser]
    [Mobile App]
  ]
  
  [<package> Application Layer|
    [Web Server|
      Nginx
    ]
    [Application Server|
      Node.js + Express;
      JWT Authentication
    ]
  ]
  
  [<package> Business Layer|
    [User Service]
    [Order Service]
    [Payment Service]
  ]
  
  [<package> Data Layer|
    [Data Access Layer]
    [<database> PostgreSQL]
    [<database> Redis Cache]
  ]
  
  [Web Browser] --> [Web Server]
  [Mobile App] --> [Web Server]
  [Web Server] --> [Application Server]
  [Application Server] --> [User Service]
  [Application Server] --> [Order Service]
  [Application Server] --> [Payment Service]
  [User Service] --> [Data Access Layer]
  [Order Service] --> [Data Access Layer]
  [Payment Service] --> [Data Access Layer]
  [Data Access Layer] --> [PostgreSQL]
  [Data Access Layer] --> [Redis Cache]
]
\`\`\`

**关键点**：
- 使用 \`<frame>\` 包裹整个架构
- 每层使用 \`<package>\` 分组
- 明确的层间依赖关系
- 技术栈信息直接写在组件内

### 示例 2: 中等复杂度 - 微服务架构

**用户需求**：基于微服务的电商系统架构，包含 API 网关、服务注册、消息队列

**生成代码**：
\`\`\`nomnoml
#direction: down
#spacing: 50
#fontSize: 11

[<frame> Microservices Architecture|
  [<package> Client Layer|
    [Web Client]
    [Mobile Client]
    [Admin Panel]
  ]
  
  [<package> API Gateway Layer|
    [API Gateway|
      Kong;
      Rate Limiting;
      Authentication
    ]
  ]
  
  [<package> Service Layer|
    [User Service|
      Node.js;
      REST API
    ]
    [Product Service|
      Java Spring Boot;
      GraphQL API
    ]
    [Order Service|
      Python FastAPI;
      REST API
    ]
    [Payment Service|
      Go;
      gRPC
    ]
    [Notification Service|
      Node.js;
      Event-Driven
    ]
  ]
  
  [<package> Infrastructure Layer|
    [Service Registry|
      Consul
    ]
    [Message Queue|
      RabbitMQ
    ]
    [Cache Layer|
      Redis Cluster
    ]
  ]
  
  [<package> Data Layer|
    [<database> User DB]
    [<database> Product DB]
    [<database> Order DB]
    [<database> Payment DB]
  ]
  
  [Web Client] --> [API Gateway]
  [Mobile Client] --> [API Gateway]
  [Admin Panel] --> [API Gateway]
  
  [API Gateway] --> [User Service]
  [API Gateway] --> [Product Service]
  [API Gateway] --> [Order Service]
  [API Gateway] --> [Payment Service]
  
  [User Service] --> [Service Registry]
  [Product Service] --> [Service Registry]
  [Order Service] --> [Service Registry]
  [Payment Service] --> [Service Registry]
  
  [Order Service] --> [Message Queue]
  [Payment Service] --> [Message Queue]
  [Message Queue] --> [Notification Service]
  
  [User Service] --> [Cache Layer]
  [Product Service] --> [Cache Layer]
  
  [User Service] --> [User DB]
  [Product Service] --> [Product DB]
  [Order Service] --> [Order DB]
  [Payment Service] --> [Payment DB]
]

[<note> 微服务通过消息队列
实现异步通信和解耦] -- [Message Queue]
\`\`\`

**关键点**：
- 清晰的分层架构（客户端、网关、服务、基础设施、数据）
- 每个微服务标注技术栈和 API 类型
- 服务注册和发现机制
- 消息队列实现异步通信
- 使用 \`<note>\` 说明关键架构决策

### 示例 3: 高级场景 - 云原生架构（容器化 + Kubernetes）

**用户需求**：基于 Kubernetes 的云原生应用架构，包含负载均衡、自动扩缩容

**生成代码**：
\`\`\`nomnoml
#stroke: #34495e
#fill: #ecf0f1
#background: #ffffff
#direction: down
#spacing: 50

[<frame> Cloud-Native Architecture|
  [<package> External Access|
    [Load Balancer|
      AWS ALB;
      SSL/TLS;
      Health Check
    ]
    [CDN|
      CloudFront;
      Static Assets
    ]
  ]
  
  [<package> Kubernetes Cluster|
    [<package> Ingress Layer|
      [Ingress Controller|
        Nginx Ingress;
        Path-based Routing
      ]
    ]
    
    [<package> Application Pods|
      [Frontend Pod|
        Next.js SSR;
        Replicas: 3;
        Auto-scaling
      ]
      [API Pod|
        Node.js API;
        Replicas: 5;
        Auto-scaling
      ]
      [Worker Pod|
        Python Workers;
        Replicas: 2
      ]
    ]
    
    [<package> Persistent Services|
      [<database> PostgreSQL StatefulSet]
      [<database> Redis StatefulSet]
      [Message Queue|
        Kafka
      ]
    ]
    
    [<package> Observability|
      [Prometheus|
        Metrics Collection
      ]
      [Grafana|
        Monitoring Dashboards
      ]
      [ELK Stack|
        Log Aggregation
      ]
    ]
  ]
  
  [<package> External Services|
    [S3 Storage|
      AWS S3;
      File Storage
    ]
    [Auth Provider|
      Auth0;
      OAuth2
    ]
    [Email Service|
      SendGrid
    ]
  ]
  
  [Load Balancer] --> [CDN]
  [CDN] --> [Ingress Controller]
  [Load Balancer] --> [Ingress Controller]
  
  [Ingress Controller] --> [Frontend Pod]
  [Ingress Controller] --> [API Pod]
  
  [Frontend Pod] --> [API Pod]
  [API Pod] --> [PostgreSQL StatefulSet]
  [API Pod] --> [Redis StatefulSet]
  [API Pod] --> [Message Queue]
  [API Pod] --> [Auth Provider]
  
  [Message Queue] --> [Worker Pod]
  [Worker Pod] --> [PostgreSQL StatefulSet]
  [Worker Pod] --> [S3 Storage]
  [Worker Pod] --> [Email Service]
  
  [Prometheus] --> [Frontend Pod]
  [Prometheus] --> [API Pod]
  [Prometheus] --> [Worker Pod]
  [Grafana] --> [Prometheus]
  [ELK Stack] --> [Frontend Pod]
  [ELK Stack] --> [API Pod]
]

[<note> 自动扩缩容策略:
CPU > 70% 或 Memory > 80%
触发 Horizontal Pod Autoscaler] -- [API Pod]
\`\`\`

**关键点**：
- 多层嵌套结构展示复杂架构
- Kubernetes 组件（Pod、StatefulSet、Ingress）
- 云服务集成（AWS ALB、S3、CloudFront）
- 可观测性组件（Prometheus、Grafana、ELK）
- 使用 \`<note>\` 补充技术细节
- 样式指令定制专业外观

## 常见错误

### 错误 1: 架构层次不清晰

**❌ 错误写法**：所有组件平铺
\`\`\`nomnoml
[Web UI]
[API Server]
[Database]
[Cache]
[Message Queue]
\`\`\`

**✅ 正确写法**：使用 package 分层
\`\`\`nomnoml
[<package> Presentation Layer|
  [Web UI]
]
[<package> Application Layer|
  [API Server]
]
[<package> Data Layer|
  [<database> Database]
  [<database> Cache]
]
\`\`\`

**原因**：架构图应体现清晰的分层结构。

### 错误 2: 技术栈信息缺失

**❌ 错误写法**：
\`\`\`nomnoml
[Frontend]
[Backend]
[Database]
\`\`\`

**✅ 正确写法**：
\`\`\`nomnoml
[Frontend|
  React + TypeScript;
  Vite
]
[Backend|
  Node.js + Express;
  TypeScript
]
[<database> Database|
  PostgreSQL 15;
  Replication
]
\`\`\`

**原因**：架构图应包含关键技术栈信息，便于技术评审。

### 错误 3: 数据流向不明确

**❌ 错误写法**：使用无向连接
\`\`\`nomnoml
[Frontend] - [Backend]
\`\`\`

**✅ 正确写法**：使用有向箭头
\`\`\`nomnoml
[Frontend] --> [Backend]    // 请求方向
[Backend] --> [Database]    // 数据访问方向
\`\`\`

**原因**：明确数据流向有助于理解架构。

### 错误 4: 外部系统未标识

**❌ 错误写法**：
\`\`\`nomnoml
[System] --> [Email Service]
\`\`\`

**✅ 正确写法**：
\`\`\`nomnoml
[<package> External Services|
  [Email Service|
    SendGrid API
  ]
  [Payment Gateway|
    Stripe
  ]
]
[System] --> [Email Service]
\`\`\`

**原因**：将外部系统单独分组，明确系统边界。

### 错误 5: 嵌套过深导致混乱

**❌ 错误写法**：超过 4 层嵌套
\`\`\`nomnoml
[System|
  [Layer1|
    [Layer2|
      [Layer3|
        [Layer4|
          [Component]
        ]
      ]
    ]
  ]
]
\`\`\`

**✅ 正确写法**：控制在 2-3 层
\`\`\`nomnoml
[<frame> System|
  [<package> Layer1|
    [Component A]
    [Component B]
  ]
]
\`\`\`

**原因**：过深的嵌套降低可读性。

### 错误 6: 缺少架构说明

**❌ 错误写法**：只有组件，没有说明

**✅ 正确写法**：
\`\`\`nomnoml
[Message Queue] --> [Worker Service]

[<note> 使用消息队列实现
异步处理和削峰填谷] -- [Message Queue]
\`\`\`

**原因**：关键架构决策需要用 \`<note>\` 说明。

## 生成检查清单 (Simplified DEPTH - H)

生成代码后，逐项检查：

- [ ] **架构层次清晰**：使用 \`<frame>\` 和 \`<package>\` 合理分层
- [ ] **技术栈完整**：关键组件标注技术选型
- [ ] **数据流向明确**：使用箭头表示依赖和数据流
- [ ] **外部系统分组**：外部服务单独标识
- [ ] **嵌套深度合理**：不超过 3 层嵌套
- [ ] **关键决策有说明**：使用 \`<note>\` 补充架构说明
- [ ] **样式统一美观**：使用指令控制整体风格
- [ ] **代码可渲染**：语法正确，可以直接通过 Kroki 渲染

**任何检查项不通过，立即修正后重新生成**
`;

/**
 * Token 估算: 约 1180 tokens
 *
 * 分配明细:
 * - 专家视角: 120 tokens
 * - 核心语法: 200 tokens
 * - 生成示例: 560 tokens（3个示例，包含复杂的云原生架构）
 * - 常见错误: 230 tokens（6个错误）
 * - 检查清单: 70 tokens
 */

