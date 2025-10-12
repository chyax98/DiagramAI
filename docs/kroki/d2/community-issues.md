# D2 社区问题与讨论

> 来自 GitHub, Stack Overflow, Reddit, Discord 的实际案例 | 最后更新: 2025-10-13

---

## 🔥 高频问题

### 1. D2 vs Mermaid: 选择哪个?

**社区讨论**: [GitHub #5](https://github.com/mermaid-js/mermaid/issues/5), [Reddit r/selfhosted](https://www.reddit.com/r/selfhosted/comments/1gin6ut/)

**用户问题**:
> "我们团队一直在用 Mermaid,D2 有什么优势值得切换?"

**社区共识**:

**D2 的优势**:
- ✅ 更简洁的语法 (无需记忆特殊关键字)
- ✅ 更好的自定义能力 (样式系统更灵活)
- ✅ 支持 `style.multiple` (多重显示)
- ✅ 支持 SQL 表格定义
- ✅ 更好的布局引擎选择 (ELK, TALA)
- ✅ 手绘风格 `--sketch`
- ✅ 更好的语言工具 (自动格式化、错误提示)

**Mermaid 的优势**:
- ✅ 生态更成熟 (更多集成)
- ✅ 特定图表类型支持更好 (序列图、甘特图)
- ✅ 社区更大 (更多示例和教程)
- ✅ 默认集成在 GitHub/GitLab

**建议**:
```
新项目 → D2
现有 Mermaid 项目 → 保持 Mermaid (除非有强需求)
架构图 → D2
序列图/甘特图 → Mermaid
```

---

### 2. 布局控制问题

**问题**: [Stack Overflow - D2 布局定制](https://stackoverflow.com/questions/75623128/)

**用户需求**:
> "我想让两个圆柱形状水平对齐,中间放一列方框,但 D2 总是把它们乱放"

**原始代码**:
```d2
nvme0n1: {
  shape: cylinder
  p1 -> p2 -> p3
}

nvme1n1: {
  shape: cylinder
  p1 -> p2 -> p3
}

RAID1; RAID0; SWAP0; SWAP1

nvme0n1.p1 -> RAID1 -> nvme1n1.p1
nvme0n1.p2 -> SWAP0
nvme1n1.p2 -> SWAP1
nvme0n1.p3 -> RAID0 -> nvme1n1.p3
```

**社区解决方案**:

**方案 1: 使用 ELK 布局引擎**
```d2
vars: {
  d2-config: {
    layout-engine: elk
  }
}

# 其他代码保持不变
```

**方案 2: 手动设置尺寸**
```d2
nvme0n1: {
  shape: cylinder
  width: 20      # 固定宽度
  height: 400
  p1 -> p2 -> p3
}

nvme1n1: {
  shape: cylinder
  width: 20
  height: 400
  p1 -> p2 -> p3
}
```

**方案 3: 使用 direction 约束**
```d2
direction: right  # 强制水平布局

# 或者
direction: down   # 强制垂直布局
```

**教训**:
- ⚠️ D2 的自动布局不是魔法,复杂需求需要手动调整
- ⚠️ 不同布局引擎结果差异很大,多试几个
- ⚠️ TALA (付费) 通常效果最好,但 ELK 免费且足够好

---

### 3. 多重形状显示问题

**问题**: [GitHub Discussions](https://github.com/terrastruct/d2/discussions)

**用户问题**:
> "我想显示一个数据库集群 (3 个数据库实例),但 D2 只显示一个"

**错误示例**:
```d2
# ❌ 这只会显示一个数据库
database: {
  shape: cylinder
}
```

**解决方案**:
```d2
# ✅ 使用 style.multiple
database: {
  shape: cylinder
  style.multiple: true  # 显示为 3 个重叠的圆柱
}

# 或者显式定义多个
db_cluster: {
  db1: {shape: cylinder}
  db2: {shape: cylinder}
  db3: {shape: cylinder}
}
```

**最佳实践**:
```d2
# 推荐: 语义化表示集群
production: {
  database_cluster: {
    shape: cylinder
    style.multiple: true
    label: "PostgreSQL\n(3 replicas)"
  }
}
```

---

### 4. 中文/多语言支持

**问题**: [GitHub Issues](https://github.com/terrastruct/d2/issues)

**用户报告**:
> "使用中文标签时布局很奇怪,字体也不对"

**已知问题**:
1. 默认字体 "Source Sans Pro" 不支持中文
2. 中文字符宽度计算可能不准确

**解决方案**:

**方案 1: 自定义字体**
```bash
# 使用支持中文的字体
d2 --font-regular /path/to/NotoSansCJK-Regular.ttf input.d2
```

**方案 2: SVG 后处理**
```html
<!-- 在 HTML 中指定字体 -->
<object data="diagram.svg" type="image/svg+xml">
  <style>
    text {
      font-family: "Noto Sans CJK SC", sans-serif !important;
    }
  </style>
</object>
```

**方案 3: 使用英文键名,中文标签**
```d2
# ✅ 推荐做法
api: API 服务器
db: 数据库
cache: 缓存

api -> db: 查询数据
api -> cache: 读取缓存
```

---

### 5. 箭头穿透问题

**问题**: [Hacker News 讨论](https://news.ycombinator.com/item?id=33704254)

**用户抱怨**:
> "箭头经常穿过不相关的形状,看起来很乱"

**示例**:
```d2
x -> cont.y -> z
x -> cont2.y
x -> cont3.y

cont {x -> y -> z}
cont2 {x -> y -> z}
cont3 {x -> y -> z}

# 结果: x -> cont3.y 的线穿过 cont2
```

**社区分析**:
- 这是布局引擎的算法限制
- 不同引擎处理方式不同

**缓解方法**:

**方法 1: 调整容器层次**
```d2
# 将相关元素放在同一层级
layer1: {
  x
  cont.y
}
layer2: {
  cont2.y
}
layer3: {
  cont3.y
}
```

**方法 2: 使用 ELK 布局**
```d2
vars: {
  d2-config: {
    layout-engine: elk
  }
}
```

**方法 3: 增加 padding**
```bash
d2 --pad=100 input.d2  # 增加边距,减少交叉
```

---

## 🛠️ 实际用例

### 6. AWS 架构图最佳实践

**社区分享**: [Medium - D2 架构图指南](https://medium.com/@raditya.mit/using-d2-to-draw-software-architecture-diagrams-300576a7f128)

**推荐模式**:
```d2
# 使用图标增强可读性
vars: {
  aws-icon: https://icons.terrastruct.com/aws
}

aws_architecture: {
  # 区域层
  us_east_1: {
    label: "AWS us-east-1"

    # VPC 层
    vpc: {
      # 公共子网
      public_subnet: {
        alb: Load Balancer {
          icon: ${aws-icon}/Compute/Elastic-Load-Balancing.svg
        }
      }

      # 私有子网
      private_subnet: {
        ecs: ECS Cluster {
          icon: ${aws-icon}/Compute/Amazon-ECS.svg
          style.multiple: true
        }

        rds: RDS PostgreSQL {
          icon: ${aws-icon}/Database/Amazon-RDS.svg
          shape: cylinder
        }
      }
    }
  }

  # 全局服务
  cloudfront: CloudFront {
    icon: ${aws-icon}/Networking-Content-Delivery/Amazon-CloudFront.svg
  }

  route53: Route 53 {
    icon: ${aws-icon}/Networking-Content-Delivery/Amazon-Route-53.svg
  }
}

# 连接
aws_architecture.route53 -> aws_architecture.cloudfront
aws_architecture.cloudfront -> aws_architecture.us_east_1.vpc.public_subnet.alb
aws_architecture.us_east_1.vpc.public_subnet.alb -> aws_architecture.us_east_1.vpc.private_subnet.ecs
aws_architecture.us_east_1.vpc.private_subnet.ecs -> aws_architecture.us_east_1.vpc.private_subnet.rds
```

**优化建议**:
1. 使用官方 AWS 图标
2. 逻辑分组 (区域 → VPC → 子网)
3. 使用 `style.multiple` 表示集群
4. 添加文档注释

---

### 7. 微服务架构演进图

**社区案例**: [Tools-Online.app 教程](https://www.tools-online.app/blog/D2-Diagrams-Online-Complete-Architecture-Diagram-Guide)

**版本控制模式**:
```d2
# 在图表中嵌入版本信息
title: E-Commerce Architecture v2.1 {
  near: top-center
  style.font-size: 20
  style.bold: true
}

subtitle: Last Updated: 2025-10-13 {
  near: top-center
  style.font-size: 12
}

# 注释记录变更
# v2.1 (2025-10-13):
# - Added Redis cache
# - Migrated to microservices
#
# v2.0 (2024-12-01):
# - Initial microservices architecture
```

**命名规范**:
```d2
# ✅ 一致的命名
auth_service
order_service
payment_service
notification_service

# ❌ 混乱的命名
authService        # camelCase
order-service      # kebab-case
Payment_Service    # 混合大小写
notif_svc          # 缩写
```

**容量注释**:
```d2
# 在注释中记录容量信息
# Production Architecture - Updated 2025-10-13
# Total capacity: 10,000 req/sec
# Disaster recovery: Active-passive

load_balancer: {
  label: "Load Balancer\n(10K req/s)"
}

database: {
  label: "PostgreSQL\n(Primary + 2 Read Replicas)"
  style.multiple: true
}
```

---

### 8. C4 模型实现

**官方教程**: [D2 Blog - C4 Model](https://d2lang.com/blog/c4/)

**Level 1: System Context**
```d2
internet_banking_system: Internet Banking System {
  style.fill: "#1168bd"
  style.stroke: "#0b4884"
}

mainframe_banking_system: Mainframe Banking System {
  style.fill: "#999999"
}

email_system: E-mail System {
  style.fill: "#999999"
}

customer: Personal Banking Customer {
  shape: person
  style.fill: "#08427b"
}

customer -> internet_banking_system: Views account balances
internet_banking_system -> mainframe_banking_system: Gets account info
internet_banking_system -> email_system: Sends e-mail
```

**Level 2: Container**
```d2
internet_banking_system: {
  web_app: Web Application {
    style.fill: "#1168bd"
  }

  spa: Single-Page Application {
    style.fill: "#1168bd"
  }

  mobile_app: Mobile App {
    style.fill: "#1168bd"
  }

  api_app: API Application {
    style.fill: "#1168bd"
  }

  database: Database {
    shape: cylinder
    style.fill: "#1168bd"
  }
}
```

**使用 Suspend/Unsuspend 过滤视图**:
```d2
# 显示 API Application 相关的所有连接
*: suspend                          # 暂停所有
(* -> *)[*]: suspend                # 暂停所有连接

# 仅显示与 API 相关的
(* -> *)[*]: unsuspend {
  &src: internet_banking_system.api_app
}
(* -> *)[*]: unsuspend {
  &dst: internet_banking_system.api_app
}
```

---

## 🎓 学习资源

### 9. 从 Mermaid 迁移

**常见迁移映射**:

**Mermaid Flowchart → D2**
```mermaid
# Mermaid
graph LR
    A[Square] --> B(Round)
    B --> C{Diamond}
    C -->|Yes| D[Result 1]
    C -->|No| E[Result 2]
```

```d2
# D2 等价
A: Square
B: Round {shape: oval}
C: Diamond {shape: diamond}
D: Result 1
E: Result 2

A -> B
B -> C
C -> D: Yes
C -> E: No
```

**Mermaid Sequence → D2**
```mermaid
# Mermaid
sequenceDiagram
    Alice->>John: Hello John
    John-->>Alice: Hi Alice
```

```d2
# D2 等价
shape: sequence_diagram
Alice -> John: Hello John
John -> Alice: Hi Alice {
  style.stroke-dash: 3  # 虚线
}
```

---

### 10. 性能优化技巧

**社区经验**: [Code4IT 博客](https://www.code4it.dev/architecture-notes/d2-diagrams/)

**问题**: 大型图表渲染慢

**优化策略**:

**1. 分离定义和样式**
```d2
# ✅ 先定义结构
api; database; cache
api -> database
api -> cache

# 后应用样式 (可选择性注释掉)
# api.style.fill: blue
# database.style.fill: green
```

**2. 使用 imports 拆分**
```d2
# main.d2
...@infrastructure.d2
...@services.d2
...@styles.d2
```

**3. 限制节点数量**
```
经验法则: 单个图表不超过 15-20 个主要组件
超过时考虑:
- 拆分为多个图表 (使用 layers)
- 使用抽象/简化视图
- 隐藏内部细节
```

**4. 选择合适的布局引擎**
```d2
# 小图 (< 10 节点): DAGRE (最快)
vars: {d2-config: {layout-engine: dagre}}

# 中图 (10-50 节点): ELK
vars: {d2-config: {layout-engine: elk}}

# 大图/复杂图: TALA (需付费,但最优)
vars: {d2-config: {layout-engine: tala}}
```

---

## 🐛 已知限制

### 11. 端口 (Ports) 支持

**状态**: 未支持 ([GitHub Discussion](https://github.com/terrastruct/d2/discussions))

**用户需求**:
> "我想指定连接从形状的特定边/点出发"

**当前限制**:
- D2 不支持 Graphviz 风格的端口语法
- 连接自动选择最优点

**Workaround**:
```d2
# 使用子形状模拟端口
node: {
  top
  bottom
  left
  right
}

external -> node.top
node.bottom -> database
```

---

### 12. 交互性限制

**已知问题**:
- SVG 导出的交互性取决于嵌入方式
- PDF/PNG 导出无交互性
- 工具提示和链接仅在 SVG 中工作

**解决方案**:
```bash
# 导出为 SVG (保留交互)
d2 input.d2 output.svg

# 在 HTML 中正确嵌入
# ❌ 无交互
<img src="diagram.svg">

# ✅ 有交互
<object data="diagram.svg" type="image/svg+xml"></object>
```

---

## 💬 社区资源

### 官方渠道
- **Discord**: https://discord.com/invite/pbUXgvmTpU (最活跃)
- **GitHub Discussions**: https://github.com/terrastruct/d2/discussions
- **GitHub Issues**: https://github.com/terrastruct/d2/issues

### 非官方资源
- **Reddit r/selfhosted**: D2 使用案例分享
- **Stack Overflow**: `[d2lang]` 标签
- **Medium/Dev.to**: 教程和最佳实践

### 学习材料
- **官方示例**: https://d2lang.com/examples/overview/
- **Playground**: https://play.d2lang.com/
- **图标库**: https://icons.terrastruct.com/
- **Blog**: https://d2lang.com/blog/

---

## 📊 社区统计 (2025-10)

- **GitHub Stars**: 16,000+
- **Discord 成员**: 2,000+
- **每月下载量**: 50,000+
- **活跃贡献者**: 100+

---

## 🔮 未来发展

**Roadmap**: https://d2lang.com/tour/future/

**计划中的特性**:
- ✨ LSP (Language Server Protocol) 支持
- ✨ 更多布局引擎集成
- ✨ 改进的错误提示
- ✨ 更好的自动布局算法
- ✨ 端口 (ports) 支持
- ✨ 更多形状类型

**社区呼声最高**:
1. 端口支持 (类似 Graphviz)
2. 更好的中文/CJK 字体支持
3. 实时协作编辑
4. Web 组件/React 集成
5. 更多导出格式 (Excalidraw, Draw.io)

---

**最后更新**: 2025-10-13
**贡献**: 欢迎提交 PR 补充社区案例和解决方案
