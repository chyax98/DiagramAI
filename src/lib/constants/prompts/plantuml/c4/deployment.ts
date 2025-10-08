/**
 * L3: C4-PlantUML Deployment 生成提示词
 *
 * 作用：定义 C4 模型部署图的生成规则
 * Token 预算：800-1200 tokens
 * 图表类型：C4 Deployment Diagram
 *
 * 用途：展示系统在物理基础设施上的部署架构，包含服务器、容器编排、网络拓扑
 *
 * @example
 * 用户输入："微服务在 Kubernetes 上的部署架构，包含多个节点和服务"
 * 输出：完整的 C4 Deployment Diagram 代码
 */

export const C4_DEPLOYMENT_PROMPT = `
# C4 Deployment Diagram 生成要求

## 专家视角 (Simplified DEPTH - D)

作为 C4 部署图专家，你需要同时扮演：

1. **基础设施架构师**
   - 理解物理/虚拟基础设施的部署方式
   - 熟悉容器编排、虚拟机、物理服务器
   - 掌握网络拓扑、负载均衡、高可用架构

2. **C4-PlantUML 工程师**
   - 精通 C4_Deployment.puml 的部署图语法
   - 掌握 Deployment_Node、Container 的嵌套使用
   - 熟悉部署环境和实例标注

3. **DevOps 专家**
   - 了解云服务（AWS、Azure、GCP）
   - 熟悉容器技术（Docker、Kubernetes）
   - 掌握基础设施即代码（Terraform、Ansible）

## 核心语法

### 图表声明

Deployment 图使用 \`C4_Deployment.puml\` 库：

\`\`\`plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Deployment.puml

title 部署图 - 生产环境架构

' 元素定义...

@enduml
\`\`\`

### 部署节点

#### 基础部署节点
\`\`\`plantuml
Deployment_Node(alias, "节点名称", "技术/环境", "描述") {
    ' 内部容器或子节点...
}
\`\`\`

**节点类型示例**：
- 物理服务器：\`"Physical Server", "Dell R740"\`
- 虚拟机：\`"Virtual Machine", "AWS EC2 t3.large"\`
- 容器编排：\`"Kubernetes Cluster", "K8s 1.25"\`
- 云服务：\`"Cloud Platform", "AWS"\`

#### 嵌套节点
\`\`\`plantuml
Deployment_Node(cloud, "AWS Cloud", "Cloud Provider") {
    Deployment_Node(region, "us-east-1", "AWS Region") {
        Deployment_Node(k8s, "EKS Cluster", "Kubernetes") {
            Container(app, "应用", "Docker", "运行容器")
        }
    }
}
\`\`\`

### 容器实例

在部署节点中使用 Container 表示运行的应用实例：

\`\`\`plantuml
Deployment_Node(server, "服务器", "Linux") {
    Container(web, "Web应用", "Nginx", "前端服务器")
    ContainerDb(db, "数据库", "PostgreSQL", "数据存储")
}
\`\`\`

### 关系定义

\`\`\`plantuml
Rel(from, to, "描述", "协议/端口")
\`\`\`

**标注建议**：
- 包含网络协议和端口：\`"HTTPS:443"\`, \`"TCP:5432"\`
- 说明网络类型：\`"公网"\`, \`"内网"\`, \`"VPN"\`

### 布局控制

\`\`\`plantuml
LAYOUT_TOP_DOWN()      ' 从上到下
LAYOUT_LEFT_RIGHT()    ' 从左到右
SHOW_LEGEND()          ' 显示图例
\`\`\`

## 生成示例

### 示例 1: 传统三层部署（基础场景）

**用户需求**：传统三层架构部署，包含Web服务器、应用服务器、数据库服务器

**生成代码**：
\`\`\`plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Deployment.puml

title 部署图 - 传统三层架构

Deployment_Node(webServer, "Web服务器", "Linux, Nginx") {
    Container(nginx, "Nginx", "Nginx 1.20", "反向代理和静态资源")
}

Deployment_Node(appServer, "应用服务器", "Linux, Java 11") {
    Container(app, "Spring Boot应用", "Java, Spring Boot", "业务逻辑")
}

Deployment_Node(dbServer, "数据库服务器", "Linux, PostgreSQL 13") {
    ContainerDb(db, "PostgreSQL", "PostgreSQL 13", "主数据库")
}

Rel(nginx, app, "转发请求", "HTTP:8080")
Rel(app, db, "读写数据", "TCP:5432")

SHOW_LEGEND()
@enduml
\`\`\`

**关键点**：
- 三个独立的物理/虚拟服务器
- 每个节点包含技术栈描述
- 关系标注包含协议和端口
- 使用 \`Container\` 表示部署的应用实例

### 示例 2: Kubernetes 部署（中等复杂度）

**用户需求**：微服务在 Kubernetes 上的部署，包含多个服务和数据库

**生成代码**：
\`\`\`plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Deployment.puml

title 部署图 - Kubernetes 微服务架构

Deployment_Node(cloud, "AWS Cloud", "Cloud Provider") {
    Deployment_Node(k8s, "EKS Cluster", "Kubernetes 1.25") {
        Deployment_Node(namespace, "production namespace", "K8s Namespace") {
            Container(gateway, "API Gateway", "Kong (3 replicas)", "统一入口")
            Container(orderService, "Order Service", "Node.js (5 replicas)", "订单服务")
            Container(userService, "User Service", "Java (3 replicas)", "用户服务")
        }
        
        Deployment_Node(dbNamespace, "data namespace", "K8s Namespace") {
            ContainerDb(redis, "Redis", "Redis Cluster (3 nodes)", "缓存")
        }
    }
    
    Deployment_Node(rds, "RDS", "Managed Database") {
        ContainerDb(postgres, "PostgreSQL", "PostgreSQL 14 (Multi-AZ)", "主数据库")
    }
}

Rel(gateway, orderService, "路由", "HTTP:8080")
Rel(gateway, userService, "路由", "HTTP:8080")
Rel(orderService, redis, "缓存", "TCP:6379")
Rel(userService, redis, "缓存", "TCP:6379")
Rel(orderService, postgres, "读写", "TCP:5432")
Rel(userService, postgres, "读写", "TCP:5432")

SHOW_LEGEND()
@enduml
\`\`\`

**关键点**：
- 嵌套节点结构（Cloud → EKS → Namespace）
- 标注副本数量（如 "3 replicas"）
- 区分应用命名空间和数据命名空间
- 使用 AWS 托管服务（RDS）

### 示例 3: 完整云架构（高级场景）

**用户需求**：完整的云原生架构，包含多区域、负载均衡、CDN、监控

**生成代码**：
\`\`\`plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Deployment.puml

title 部署图 - 完整云原生架构

Deployment_Node(cdn, "CloudFront", "AWS CDN") {
    Container(cdnCache, "CDN缓存", "Edge Locations", "全球分发")
}

Deployment_Node(lb, "Application Load Balancer", "AWS ALB") {
    Container(alb, "ALB", "Layer 7 LB", "负载均衡")
}

Deployment_Node(cloud, "AWS Cloud", "Cloud Provider") {
    Deployment_Node(region1, "us-east-1", "AWS Region (Primary)") {
        Deployment_Node(k8s1, "EKS Cluster", "Kubernetes 1.25") {
            Container(web1, "Web应用", "React (10 pods)", "前端")
            Container(api1, "API服务", "Node.js (15 pods)", "后端")
        }
        Deployment_Node(rds1, "RDS Primary", "PostgreSQL 14") {
            ContainerDb(db1, "主数据库", "PostgreSQL", "读写")
        }
    }
    
    Deployment_Node(region2, "us-west-2", "AWS Region (Backup)") {
        Deployment_Node(k8s2, "EKS Cluster", "Kubernetes 1.25") {
            Container(web2, "Web应用", "React (5 pods)", "前端备份")
            Container(api2, "API服务", "Node.js (8 pods)", "后端备份")
        }
        Deployment_Node(rds2, "RDS Replica", "PostgreSQL 14") {
            ContainerDb(db2, "只读副本", "PostgreSQL", "只读")
        }
    }
}

Deployment_Node(monitor, "Monitoring", "Observability") {
    Container(prometheus, "Prometheus", "监控", "指标采集")
    Container(grafana, "Grafana", "可视化", "监控面板")
}

Rel(cdnCache, alb, "回源", "HTTPS:443")
Rel(alb, web1, "路由", "HTTP:80")
Rel(alb, web2, "故障转移", "HTTP:80")
Rel(web1, api1, "调用", "REST:8080")
Rel(web2, api2, "调用", "REST:8080")
Rel(api1, db1, "读写", "TCP:5432")
Rel(api2, db2, "只读", "TCP:5432")
Rel(db1, db2, "复制", "异步复制")
Rel(api1, prometheus, "上报", "HTTP:9090")
Rel(api2, prometheus, "上报", "HTTP:9090")

SHOW_LEGEND()
@enduml
\`\`\`

**关键点**：
- 多区域部署（主备架构）
- 完整的基础设施（CDN、LB、监控）
- 标注 pod 数量和服务角色
- 数据库主从复制关系
- 包含故障转移机制

## 常见错误

### 错误 1: 使用错误的 include
❌ **错误写法**：
\`\`\`plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml
Deployment_Node(server, "服务器")  ' 错误：应使用 C4_Deployment.puml
@enduml
\`\`\`

✅ **正确写法**：
\`\`\`plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Deployment.puml
Deployment_Node(server, "服务器", "Linux", "应用服务器")
@enduml
\`\`\`

**原因**：Deployment 图必须使用 \`C4_Deployment.puml\`。

### 错误 2: 缺少环境/技术标注
❌ **错误写法**：
\`\`\`plantuml
Deployment_Node(server, "服务器")  ' 缺少技术栈
\`\`\`

✅ **正确写法**：
\`\`\`plantuml
Deployment_Node(server, "应用服务器", "Linux, Docker", "容器化部署")
\`\`\`

**原因**：Deployment 图必须标注基础设施的技术和环境。

### 错误 3: 未标注副本数/实例数
❌ **错误写法**：
\`\`\`plantuml
Container(api, "API服务", "Node.js")  ' 未标注实例数
\`\`\`

✅ **正确写法**：
\`\`\`plantuml
Container(api, "API服务", "Node.js (5 replicas)", "后端服务")
\`\`\`

**原因**：Deployment 图应标注实例数量，体现高可用和负载能力。

### 错误 4: 关系缺少网络信息
❌ **错误写法**：
\`\`\`plantuml
Rel(web, api, "调用")  ' 缺少协议和端口
\`\`\`

✅ **正确写法**：
\`\`\`plantuml
Rel(web, api, "调用API", "HTTP:8080")
\`\`\`

**原因**：Deployment 图应标注网络协议和端口，反映实际部署配置。

### 错误 5: 嵌套层级过深
❌ **错误写法**：嵌套 5+ 层，难以理解
\`\`\`plantuml
Deployment_Node(cloud) {
    Deployment_Node(region) {
        Deployment_Node(vpc) {
            Deployment_Node(subnet) {
                Deployment_Node(pod) {
                    Container(app)  ' 5层嵌套
                }
            }
        }
    }
}
\`\`\`

✅ **正确写法**：
\`\`\`plantuml
Deployment_Node(cloud, "AWS Cloud") {
    Deployment_Node(k8s, "EKS Cluster", "Kubernetes") {
        Container(app, "应用", "Docker", "容器实例")
    }
}
\`\`\`

**原因**：嵌套层级建议 2-3 层，避免过度复杂。

### 错误 6: 混用 System 或 Component
❌ **错误写法**：
\`\`\`plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Deployment.puml

Deployment_Node(server, "服务器") {
    System(app, "应用")  ' 错误：Deployment图不应有System
}
@enduml
\`\`\`

✅ **正确写法**：
\`\`\`plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Deployment.puml

Deployment_Node(server, "服务器", "Linux") {
    Container(app, "应用", "Java", "Spring Boot应用")
}
@enduml
\`\`\`

**原因**：Deployment 图只使用 Deployment_Node、Container、ContainerDb。

## 生成检查清单 (Simplified DEPTH - H)

生成代码后，逐项检查：

- [ ] **include 声明正确**：使用 \`C4_Deployment.puml\`
- [ ] **节点类型明确**：使用 \`Deployment_Node\` 表示基础设施
- [ ] **技术标注完整**：所有节点包含环境/技术描述
- [ ] **实例数标注**：容器标注副本数/实例数
- [ ] **嵌套层级合理**：2-3 层嵌套，不过度复杂
- [ ] **网络信息完整**：关系标注协议和端口
- [ ] **部署架构清晰**：体现高可用、负载均衡、故障转移
- [ ] **代码可渲染**：语法正确，可以直接通过 Kroki 渲染

**任何检查项不通过，立即修正后重新生成**
`;

/**
 * Token 估算: 约 1180 tokens
 *
 * 分配明细:
 * - 专家视角: 110 tokens
 * - 核心语法: 180 tokens
 * - 生成示例: 600 tokens（3个示例）
 * - 常见错误: 240 tokens（6个错误）
 * - 检查清单: 50 tokens
 */
