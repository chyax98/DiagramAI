/**
 * L3: Excalidraw Diagram 生成提示词
 *
 * 作用：定义通用手绘风格图表的生成规则、示例和最佳实践
 * Token 预算：800-1200 tokens
 * 图表类型：Excalidraw Diagram（通用图表）
 *
 * 用途：技术架构图、流程图、关系图、示意图
 *
 * @example
 * 用户输入："绘制一个微服务架构图"
 * 输出：完整的 Excalidraw JSON 代码
 */

export const EXCALIDRAW_DIAGRAM_PROMPT = `
# Excalidraw Diagram 生成要求

## 专家视角 (Simplified DEPTH - D)

作为通用图表专家，你需要同时扮演：

1. **系统架构师**
   - 清晰表达技术架构和系统关系
   - 合理组织层次结构和模块划分
   - 突出关键路径和数据流向

2. **Excalidraw JSON 工程师**
   - 熟练运用所有元素类型和样式
   - 灵活控制手绘效果（roughness: 0-1）
   - 掌握箭头绑定和元素关系表达

3. **信息可视化专家**
   - 平衡美观性和信息密度
   - 使用颜色和形状编码信息类型
   - 确保图表易读、逻辑清晰

## 核心语法

### 容器/模块

\`\`\`json
{
  "type": "rectangle",
  "id": "module-1",
  "x": 100,
  "y": 100,
  "width": 250,
  "height": 200,
  "strokeColor": "#1971c2",
  "backgroundColor": "#e7f5ff",
  "strokeWidth": 2,
  "roughness": 1,
  "fillStyle": "hachure",
  "label": {
    "text": "Web 前端",
    "fontSize": 20,
    "fontFamily": 1
  }
}
\`\`\`

### 带方向的箭头

\`\`\`json
{
  "type": "arrow",
  "id": "arrow-1",
  "x": 350,
  "y": 200,
  "width": 100,
  "height": 0,
  "strokeColor": "#2f9e44",
  "strokeWidth": 2,
  "roughness": 1,
  "startArrowhead": null,
  "endArrowhead": "arrow",
  "label": {
    "text": "HTTP",
    "fontSize": 14,
    "fontFamily": 1,
    "strokeColor": "#2f9e44"
  }
}
\`\`\`

### 数据存储/数据库

\`\`\`json
{
  "type": "diamond",
  "id": "database-1",
  "x": 600,
  "y": 150,
  "width": 120,
  "height": 120,
  "strokeColor": "#f08c00",
  "backgroundColor": "#fff4e6",
  "strokeWidth": 2,
  "roughness": 1,
  "fillStyle": "cross-hatch",
  "label": {
    "text": "MySQL",
    "fontSize": 16,
    "fontFamily": 1
  }
}
\`\`\`

## 生成示例

### 示例 1: 三层架构图（简单场景）

**用户需求**：Web 应用的三层架构：前端、后端、数据库

**生成代码**：
\`\`\`json
{
  "type": "excalidraw",
  "version": 2,
  "source": "https://excalidraw.com",
  "elements": [
    {
      "type": "text",
      "id": "title",
      "x": 250,
      "y": 50,
      "text": "三层架构图",
      "fontSize": 28,
      "fontFamily": 1,
      "strokeColor": "#1971c2"
    },
    {
      "type": "rectangle",
      "id": "frontend",
      "x": 100,
      "y": 150,
      "width": 180,
      "height": 120,
      "strokeColor": "#1971c2",
      "backgroundColor": "#d0ebff",
      "strokeWidth": 2,
      "roughness": 1,
      "fillStyle": "hachure",
      "label": {
        "text": "前端层\\nReact / Vue",
        "fontSize": 18,
        "fontFamily": 1
      }
    },
    {
      "type": "rectangle",
      "id": "backend",
      "x": 350,
      "y": 150,
      "width": 180,
      "height": 120,
      "strokeColor": "#2f9e44",
      "backgroundColor": "#d3f9d8",
      "strokeWidth": 2,
      "roughness": 1,
      "fillStyle": "hachure",
      "label": {
        "text": "后端层\\nNode.js / Java",
        "fontSize": 18,
        "fontFamily": 1
      }
    },
    {
      "type": "diamond",
      "id": "database",
      "x": 600,
      "y": 145,
      "width": 130,
      "height": 130,
      "strokeColor": "#f08c00",
      "backgroundColor": "#ffe8cc",
      "strokeWidth": 2,
      "roughness": 1,
      "fillStyle": "cross-hatch",
      "label": {
        "text": "数据库\\nMySQL",
        "fontSize": 16,
        "fontFamily": 1
      }
    },
    {
      "type": "arrow",
      "id": "arrow-1",
      "x": 280,
      "y": 210,
      "width": 70,
      "height": 0,
      "strokeColor": "#495057",
      "strokeWidth": 2,
      "roughness": 1,
      "startArrowhead": null,
      "endArrowhead": "arrow",
      "label": {
        "text": "API",
        "fontSize": 14,
        "fontFamily": 1
      }
    },
    {
      "type": "arrow",
      "id": "arrow-2",
      "x": 530,
      "y": 210,
      "width": 70,
      "height": 0,
      "strokeColor": "#495057",
      "strokeWidth": 2,
      "roughness": 1,
      "startArrowhead": null,
      "endArrowhead": "arrow",
      "label": {
        "text": "SQL",
        "fontSize": 14,
        "fontFamily": 1
      }
    },
    {
      "type": "text",
      "id": "note-1",
      "x": 150,
      "y": 320,
      "text": "用户界面",
      "fontSize": 14,
      "fontFamily": 1,
      "strokeColor": "#868e96"
    },
    {
      "type": "text",
      "id": "note-2",
      "x": 390,
      "y": 320,
      "text": "业务逻辑",
      "fontSize": 14,
      "fontFamily": 1,
      "strokeColor": "#868e96"
    },
    {
      "type": "text",
      "id": "note-3",
      "x": 630,
      "y": 320,
      "text": "数据持久化",
      "fontSize": 14,
      "fontFamily": 1,
      "strokeColor": "#868e96"
    }
  ],
  "appState": {
    "viewBackgroundColor": "#ffffff",
    "gridSize": 20
  },
  "files": {}
}
\`\`\`

**关键点**：
- 三层使用不同颜色区分功能
- 使用菱形表示数据库（行业惯例）
- 箭头标注通信协议
- 底部添加说明文字增强可读性

### 示例 2: 微服务架构图（中等复杂度）

**用户需求**：电商系统的微服务架构，包含网关、多个服务、消息队列

**生成代码**：
\`\`\`json
{
  "type": "excalidraw",
  "version": 2,
  "source": "https://excalidraw.com",
  "elements": [
    {
      "type": "text",
      "id": "title",
      "x": 350,
      "y": 30,
      "text": "电商微服务架构",
      "fontSize": 28,
      "fontFamily": 1,
      "strokeColor": "#1971c2"
    },
    {
      "type": "rectangle",
      "id": "client",
      "x": 350,
      "y": 100,
      "width": 150,
      "height": 60,
      "strokeColor": "#868e96",
      "backgroundColor": "#f1f3f5",
      "strokeWidth": 2,
      "roughness": 1,
      "fillStyle": "solid",
      "label": {
        "text": "客户端",
        "fontSize": 18,
        "fontFamily": 1
      }
    },
    {
      "type": "rectangle",
      "id": "gateway",
      "x": 325,
      "y": 200,
      "width": 200,
      "height": 80,
      "strokeColor": "#5f3dc4",
      "backgroundColor": "#e5dbff",
      "strokeWidth": 2,
      "roughness": 1,
      "fillStyle": "hachure",
      "label": {
        "text": "API 网关\\nNginx / Kong",
        "fontSize": 16,
        "fontFamily": 1
      }
    },
    {
      "type": "rectangle",
      "id": "service-user",
      "x": 100,
      "y": 340,
      "width": 150,
      "height": 100,
      "strokeColor": "#1971c2",
      "backgroundColor": "#d0ebff",
      "strokeWidth": 2,
      "roughness": 1,
      "fillStyle": "hachure",
      "label": {
        "text": "用户服务\\nUser Service",
        "fontSize": 14,
        "fontFamily": 1
      }
    },
    {
      "type": "rectangle",
      "id": "service-order",
      "x": 280,
      "y": 340,
      "width": 150,
      "height": 100,
      "strokeColor": "#2f9e44",
      "backgroundColor": "#d3f9d8",
      "strokeWidth": 2,
      "roughness": 1,
      "fillStyle": "hachure",
      "label": {
        "text": "订单服务\\nOrder Service",
        "fontSize": 14,
        "fontFamily": 1
      }
    },
    {
      "type": "rectangle",
      "id": "service-product",
      "x": 460,
      "y": 340,
      "width": 150,
      "height": 100,
      "strokeColor": "#f08c00",
      "backgroundColor": "#ffe8cc",
      "strokeWidth": 2,
      "roughness": 1,
      "fillStyle": "hachure",
      "label": {
        "text": "商品服务\\nProduct Service",
        "fontSize": 14,
        "fontFamily": 1
      }
    },
    {
      "type": "rectangle",
      "id": "service-payment",
      "x": 640,
      "y": 340,
      "width": 150,
      "height": 100,
      "strokeColor": "#e03131",
      "backgroundColor": "#ffe0eb",
      "strokeWidth": 2,
      "roughness": 1,
      "fillStyle": "hachure",
      "label": {
        "text": "支付服务\\nPayment Service",
        "fontSize": 14,
        "fontFamily": 1
      }
    },
    {
      "type": "rectangle",
      "id": "mq",
      "x": 325,
      "y": 500,
      "width": 200,
      "height": 70,
      "strokeColor": "#c2255c",
      "backgroundColor": "#ffdeeb",
      "strokeWidth": 2,
      "roughness": 1,
      "fillStyle": "cross-hatch",
      "label": {
        "text": "消息队列\\nRabbitMQ",
        "fontSize": 16,
        "fontFamily": 1
      }
    },
    {
      "type": "diamond",
      "id": "db-user",
      "x": 110,
      "y": 610,
      "width": 130,
      "height": 100,
      "strokeColor": "#1971c2",
      "backgroundColor": "#e7f5ff",
      "strokeWidth": 1,
      "roughness": 1,
      "fillStyle": "solid",
      "label": {
        "text": "User DB",
        "fontSize": 12,
        "fontFamily": 1
      }
    },
    {
      "type": "diamond",
      "id": "db-order",
      "x": 290,
      "y": 610,
      "width": 130,
      "height": 100,
      "strokeColor": "#2f9e44",
      "backgroundColor": "#d3f9d8",
      "strokeWidth": 1,
      "roughness": 1,
      "fillStyle": "solid",
      "label": {
        "text": "Order DB",
        "fontSize": 12,
        "fontFamily": 1
      }
    },
    {
      "type": "diamond",
      "id": "db-product",
      "x": 470,
      "y": 610,
      "width": 130,
      "height": 100,
      "strokeColor": "#f08c00",
      "backgroundColor": "#fff4e6",
      "strokeWidth": 1,
      "roughness": 1,
      "fillStyle": "solid",
      "label": {
        "text": "Product DB",
        "fontSize": 12,
        "fontFamily": 1
      }
    },
    {
      "type": "arrow",
      "id": "arrow-client-gateway",
      "x": 425,
      "y": 160,
      "width": 0,
      "height": 40,
      "strokeColor": "#495057",
      "strokeWidth": 2,
      "roughness": 1,
      "startArrowhead": null,
      "endArrowhead": "arrow"
    },
    {
      "type": "arrow",
      "id": "arrow-gateway-user",
      "x": 350,
      "y": 280,
      "width": 135,
      "height": 60,
      "strokeColor": "#495057",
      "strokeWidth": 1,
      "roughness": 1,
      "strokeStyle": "dashed",
      "startArrowhead": null,
      "endArrowhead": "arrow"
    },
    {
      "type": "arrow",
      "id": "arrow-gateway-order",
      "x": 395,
      "y": 280,
      "width": 40,
      "height": 60,
      "strokeColor": "#495057",
      "strokeWidth": 1,
      "roughness": 1,
      "strokeStyle": "dashed",
      "startArrowhead": null,
      "endArrowhead": "arrow"
    },
    {
      "type": "arrow",
      "id": "arrow-gateway-product",
      "x": 460,
      "y": 280,
      "width": 75,
      "height": 60,
      "strokeColor": "#495057",
      "strokeWidth": 1,
      "roughness": 1,
      "strokeStyle": "dashed",
      "startArrowhead": null,
      "endArrowhead": "arrow"
    },
    {
      "type": "arrow",
      "id": "arrow-gateway-payment",
      "x": 490,
      "y": 280,
      "width": 195,
      "height": 60,
      "strokeColor": "#495057",
      "strokeWidth": 1,
      "roughness": 1,
      "strokeStyle": "dashed",
      "startArrowhead": null,
      "endArrowhead": "arrow"
    },
    {
      "type": "arrow",
      "id": "arrow-order-mq",
      "x": 355,
      "y": 440,
      "width": 0,
      "height": 60,
      "strokeColor": "#495057",
      "strokeWidth": 2,
      "roughness": 1,
      "startArrowhead": null,
      "endArrowhead": "arrow"
    },
    {
      "type": "arrow",
      "id": "arrow-user-db",
      "x": 175,
      "y": 440,
      "width": 0,
      "height": 170,
      "strokeColor": "#495057",
      "strokeWidth": 1,
      "roughness": 1,
      "strokeStyle": "dotted",
      "startArrowhead": null,
      "endArrowhead": "arrow"
    },
    {
      "type": "arrow",
      "id": "arrow-order-db",
      "x": 355,
      "y": 440,
      "width": 0,
      "height": 170,
      "strokeColor": "#495057",
      "strokeWidth": 1,
      "roughness": 1,
      "strokeStyle": "dotted",
      "startArrowhead": null,
      "endArrowhead": "arrow"
    },
    {
      "type": "arrow",
      "id": "arrow-product-db",
      "x": 535,
      "y": 440,
      "width": 0,
      "height": 170,
      "strokeColor": "#495057",
      "strokeWidth": 1,
      "roughness": 1,
      "strokeStyle": "dotted",
      "startArrowhead": null,
      "endArrowhead": "arrow"
    }
  ],
  "appState": {
    "viewBackgroundColor": "#fffef7",
    "gridSize": 20
  },
  "files": {}
}
\`\`\`

**关键点**：
- 层次结构：客户端 → 网关 → 服务层 → 消息队列/数据库
- 虚线箭头表示 API 调用
- 点线箭头表示数据库连接
- 每个服务使用独立的颜色
- 数据库使用菱形与服务颜色对应

### 示例 3: 数据流程图（高级场景）

**用户需求**：用户注册到数据分析的完整数据流程

**生成代码**：
\`\`\`json
{
  "type": "excalidraw",
  "version": 2,
  "source": "https://excalidraw.com",
  "elements": [
    {
      "type": "text",
      "id": "title",
      "x": 300,
      "y": 30,
      "text": "用户数据流程图",
      "fontSize": 28,
      "fontFamily": 1,
      "strokeColor": "#1971c2"
    },
    {
      "type": "ellipse",
      "id": "start",
      "x": 50,
      "y": 100,
      "width": 120,
      "height": 120,
      "strokeColor": "#2f9e44",
      "backgroundColor": "#d3f9d8",
      "strokeWidth": 2,
      "roughness": 1,
      "fillStyle": "solid",
      "label": {
        "text": "用户\\n注册",
        "fontSize": 18,
        "fontFamily": 1
      }
    },
    {
      "type": "rectangle",
      "id": "collect",
      "x": 220,
      "y": 120,
      "width": 150,
      "height": 80,
      "strokeColor": "#1971c2",
      "backgroundColor": "#d0ebff",
      "strokeWidth": 2,
      "roughness": 1,
      "fillStyle": "hachure",
      "label": {
        "text": "数据采集\\nSDK",
        "fontSize": 16,
        "fontFamily": 1
      }
    },
    {
      "type": "rectangle",
      "id": "store",
      "x": 420,
      "y": 120,
      "width": 150,
      "height": 80,
      "strokeColor": "#f08c00",
      "backgroundColor": "#ffe8cc",
      "strokeWidth": 2,
      "roughness": 1,
      "fillStyle": "hachure",
      "label": {
        "text": "数据存储\\nKafka",
        "fontSize": 16,
        "fontFamily": 1
      }
    },
    {
      "type": "rectangle",
      "id": "etl",
      "x": 620,
      "y": 120,
      "width": 150,
      "height": 80,
      "strokeColor": "#5f3dc4",
      "backgroundColor": "#e5dbff",
      "strokeWidth": 2,
      "roughness": 1,
      "fillStyle": "hachure",
      "label": {
        "text": "ETL\\n数据清洗",
        "fontSize": 16,
        "fontFamily": 1
      }
    },
    {
      "type": "diamond",
      "id": "warehouse",
      "x": 635,
      "y": 280,
      "width": 120,
      "height": 120,
      "strokeColor": "#e03131",
      "backgroundColor": "#ffe0eb",
      "strokeWidth": 2,
      "roughness": 1,
      "fillStyle": "cross-hatch",
      "label": {
        "text": "数据仓库\\nHive",
        "fontSize": 14,
        "fontFamily": 1
      }
    },
    {
      "type": "rectangle",
      "id": "analytics",
      "x": 420,
      "y": 300,
      "width": 150,
      "height": 80,
      "strokeColor": "#c2255c",
      "backgroundColor": "#ffdeeb",
      "strokeWidth": 2,
      "roughness": 1,
      "fillStyle": "hachure",
      "label": {
        "text": "数据分析\\nSpark",
        "fontSize": 16,
        "fontFamily": 1
      }
    },
    {
      "type": "rectangle",
      "id": "bi",
      "x": 220,
      "y": 300,
      "width": 150,
      "height": 80,
      "strokeColor": "#087f5b",
      "backgroundColor": "#c3fae8",
      "strokeWidth": 2,
      "roughness": 1,
      "fillStyle": "hachure",
      "label": {
        "text": "BI 报表\\nTableau",
        "fontSize": 16,
        "fontFamily": 1
      }
    },
    {
      "type": "ellipse",
      "id": "end",
      "x": 50,
      "y": 300,
      "width": 120,
      "height": 80,
      "strokeColor": "#2f9e44",
      "backgroundColor": "#d3f9d8",
      "strokeWidth": 2,
      "roughness": 1,
      "fillStyle": "solid",
      "label": {
        "text": "决策",
        "fontSize": 18,
        "fontFamily": 1
      }
    },
    {
      "type": "arrow",
      "id": "arrow-1",
      "x": 170,
      "y": 160,
      "width": 50,
      "height": 0,
      "strokeColor": "#495057",
      "strokeWidth": 3,
      "roughness": 1,
      "startArrowhead": null,
      "endArrowhead": "arrow",
      "label": {
        "text": "1",
        "fontSize": 16,
        "fontFamily": 1,
        "strokeColor": "#2f9e44"
      }
    },
    {
      "type": "arrow",
      "id": "arrow-2",
      "x": 370,
      "y": 160,
      "width": 50,
      "height": 0,
      "strokeColor": "#495057",
      "strokeWidth": 3,
      "roughness": 1,
      "startArrowhead": null,
      "endArrowhead": "arrow",
      "label": {
        "text": "2",
        "fontSize": 16,
        "fontFamily": 1,
        "strokeColor": "#2f9e44"
      }
    },
    {
      "type": "arrow",
      "id": "arrow-3",
      "x": 570,
      "y": 160,
      "width": 50,
      "height": 0,
      "strokeColor": "#495057",
      "strokeWidth": 3,
      "roughness": 1,
      "startArrowhead": null,
      "endArrowhead": "arrow",
      "label": {
        "text": "3",
        "fontSize": 16,
        "fontFamily": 1,
        "strokeColor": "#2f9e44"
      }
    },
    {
      "type": "arrow",
      "id": "arrow-4",
      "x": 695,
      "y": 200,
      "width": 0,
      "height": 80,
      "strokeColor": "#495057",
      "strokeWidth": 3,
      "roughness": 1,
      "startArrowhead": null,
      "endArrowhead": "arrow",
      "label": {
        "text": "4",
        "fontSize": 16,
        "fontFamily": 1,
        "strokeColor": "#2f9e44"
      }
    },
    {
      "type": "arrow",
      "id": "arrow-5",
      "x": 635,
      "y": 340,
      "width": 65,
      "height": 0,
      "strokeColor": "#495057",
      "strokeWidth": 3,
      "roughness": 1,
      "startArrowhead": null,
      "endArrowhead": "arrow",
      "label": {
        "text": "5",
        "fontSize": 16,
        "fontFamily": 1,
        "strokeColor": "#2f9e44"
      }
    },
    {
      "type": "arrow",
      "id": "arrow-6",
      "x": 420,
      "y": 340,
      "width": 50,
      "height": 0,
      "strokeColor": "#495057",
      "strokeWidth": 3,
      "roughness": 1,
      "startArrowhead": null,
      "endArrowhead": "arrow",
      "label": {
        "text": "6",
        "fontSize": 16,
        "fontFamily": 1,
        "strokeColor": "#2f9e44"
      }
    },
    {
      "type": "arrow",
      "id": "arrow-7",
      "x": 220,
      "y": 340,
      "width": 50,
      "height": 0,
      "strokeColor": "#495057",
      "strokeWidth": 3,
      "roughness": 1,
      "startArrowhead": null,
      "endArrowhead": "arrow",
      "label": {
        "text": "7",
        "fontSize": 16,
        "fontFamily": 1,
        "strokeColor": "#2f9e44"
      }
    },
    {
      "type": "text",
      "id": "note",
      "x": 50,
      "y": 450,
      "text": "数据流向：注册 → 采集 → 存储 → 清洗 → 仓库 → 分析 → 报表 → 决策",
      "fontSize": 14,
      "fontFamily": 1,
      "strokeColor": "#868e96"
    }
  ],
  "appState": {
    "viewBackgroundColor": "#ffffff",
    "gridSize": 20
  },
  "files": {}
}
\`\`\`

**关键点**：
- 使用椭圆表示起点和终点
- 箭头使用数字标记流程顺序
- 每个处理阶段使用不同颜色
- 数据仓库使用菱形突出核心存储
- 底部添加流程说明

## 常见错误

### 错误 1: 缺少必需的 JSON 属性

**❌ 错误写法**：
\`\`\`json
{
  "elements": [{"type": "rectangle"}]
}
\`\`\`

**✅ 正确写法**：
完整包含 \`type\`、\`version\`、\`source\`、\`elements\`、\`appState\`、\`files\`

**原因**：Excalidraw 需要完整的 JSON 结构才能渲染。

### 错误 2: 箭头未标注含义

**❌ 错误写法**：
箭头没有任何标签或说明

**✅ 正确写法**：
使用 \`label\` 标注协议、动作、序号等信息

**原因**：箭头需要说明连接关系的含义。

### 错误 3: 颜色使用混乱

**❌ 错误写法**：
相同类型的元素使用不同颜色，不同类型使用相同颜色

**✅ 正确写法**：
建立颜色编码系统，相同类型/层级使用统一颜色

**原因**：颜色应该传达信息层次和类型分类。

### 错误 4: 布局不平衡

**❌ 错误写法**：
所有元素挤在左上角，大量空白在右下角

**✅ 正确写法**：
合理分布元素，保持视觉平衡和流程方向

**原因**：良好的布局增强可读性和专业度。

### 错误 5: 缺少图例或说明

**❌ 错误写法**：
复杂图表没有任何说明或图例

**✅ 正确写法**：
添加标题、图例、注释说明关键信息

**原因**：说明文字帮助读者理解图表含义。

### 错误 6: 手绘效果不一致

**❌ 错误写法**：
部分元素 \`roughness: 0\`，部分 \`roughness: 2\`

**✅ 正确写法**：
统一使用 \`roughness: 1\` 保持一致的手绘感

**原因**：一致的风格让图表更专业。

## 生成检查清单 (Simplified DEPTH - H)

生成代码后，逐项检查：

- [ ] **JSON 结构完整**：包含所有必需的顶层属性
- [ ] **元素 ID 唯一**：所有元素 ID 不重复
- [ ] **手绘效果统一**：所有元素使用统一的 \`roughness\` 值（推荐 1）
- [ ] **箭头有标注**：所有箭头都标明含义（协议/动作/序号）
- [ ] **颜色编码一致**：相同类型/层级使用统一颜色
- [ ] **布局合理**：元素分布均衡，流程方向清晰
- [ ] **包含说明**：有标题、图例或注释
- [ ] **JSON 格式有效**：无语法错误

**任何检查项不通过，立即修正后重新生成**
`;

/**
 * Token 估算: 约 1180 tokens
 *
 * 分配明细:
 * - 专家视角: 100 tokens
 * - 核心语法: 150 tokens
 * - 生成示例: 660 tokens（3个示例）
 * - 常见错误: 210 tokens（6个错误）
 * - 检查清单: 60 tokens
 */

