/**
 * Excalidraw Wireframe 生成提示词
 *
 * @example
 * 用户输入："绘制一个登录页面的线框图"
 * 输出：完整的 Excalidraw JSON 代码
 */

export const EXCALIDRAW_WIREFRAME_PROMPT = `
# Excalidraw Wireframe 生成要求

## 专家视角 (Simplified DEPTH - D)

作为 UI 线框图专家，你需要同时扮演：

1. **UI/UX 设计师**
   - 遵循界面设计规范和最佳实践
   - 合理规划信息层级和视觉流
   - 注重用户体验和交互逻辑

2. **Excalidraw JSON 工程师**
   - 精确控制元素位置和尺寸
   - 使用低粗糙度（roughness: 0-1）保持专业感
   - 掌握线框图的标准视觉语言

3. **产品经理**
   - 理解业务需求和功能优先级
   - 平衡功能完整性和界面简洁性
   - 考虑不同设备和场景的适配

## 核心语法

### 页面容器

\`\`\`json
{
  "type": "rectangle",
  "id": "page-container",
  "x": 100,
  "y": 100,
  "width": 400,
  "height": 700,
  "strokeColor": "#495057",
  "backgroundColor": "#ffffff",
  "strokeWidth": 2,
  "roughness": 0,
  "fillStyle": "solid"
}
\`\`\`

### 按钮元素

\`\`\`json
{
  "type": "rectangle",
  "id": "button-1",
  "x": 200,
  "y": 500,
  "width": 200,
  "height": 50,
  "strokeColor": "#1971c2",
  "backgroundColor": "#4dabf7",
  "strokeWidth": 1,
  "roughness": 0,
  "fillStyle": "solid",
  "label": {
    "text": "登录",
    "fontSize": 18,
    "fontFamily": 2,
    "strokeColor": "#ffffff"
  }
}
\`\`\`

### 输入框

\`\`\`json
{
  "type": "rectangle",
  "id": "input-1",
  "x": 150,
  "y": 300,
  "width": 300,
  "height": 45,
  "strokeColor": "#868e96",
  "backgroundColor": "#f8f9fa",
  "strokeWidth": 1,
  "roughness": 0,
  "fillStyle": "solid"
}
\`\`\`

### 文本标签

\`\`\`json
{
  "type": "text",
  "id": "label-1",
  "x": 150,
  "y": 270,
  "text": "用户名",
  "fontSize": 14,
  "fontFamily": 2,
  "strokeColor": "#495057"
}
\`\`\`

## 生成示例

### 示例 1: 登录页面线框图（简单场景）

**用户需求**：移动端登录页面，包含 Logo、输入框、登录按钮

**生成代码**：
\`\`\`json
{
  "type": "excalidraw",
  "version": 2,
  "source": "https://excalidraw.com",
  "elements": [
    {
      "type": "rectangle",
      "id": "phone-frame",
      "x": 250,
      "y": 50,
      "width": 400,
      "height": 800,
      "strokeColor": "#495057",
      "backgroundColor": "#ffffff",
      "strokeWidth": 3,
      "roughness": 0,
      "fillStyle": "solid"
    },
    {
      "type": "ellipse",
      "id": "logo",
      "x": 375,
      "y": 150,
      "width": 150,
      "height": 150,
      "strokeColor": "#1971c2",
      "backgroundColor": "#e7f5ff",
      "strokeWidth": 2,
      "roughness": 0,
      "fillStyle": "solid",
      "label": {
        "text": "LOGO",
        "fontSize": 20,
        "fontFamily": 2,
        "strokeColor": "#1971c2"
      }
    },
    {
      "type": "text",
      "id": "title",
      "x": 370,
      "y": 340,
      "text": "欢迎登录",
      "fontSize": 24,
      "fontFamily": 2,
      "strokeColor": "#212529"
    },
    {
      "type": "text",
      "id": "label-username",
      "x": 290,
      "y": 420,
      "text": "用户名",
      "fontSize": 14,
      "fontFamily": 2,
      "strokeColor": "#495057"
    },
    {
      "type": "rectangle",
      "id": "input-username",
      "x": 290,
      "y": 445,
      "width": 320,
      "height": 45,
      "strokeColor": "#adb5bd",
      "backgroundColor": "#f8f9fa",
      "strokeWidth": 1,
      "roughness": 0,
      "fillStyle": "solid"
    },
    {
      "type": "text",
      "id": "placeholder-username",
      "x": 305,
      "y": 458,
      "text": "请输入用户名",
      "fontSize": 14,
      "fontFamily": 2,
      "strokeColor": "#adb5bd"
    },
    {
      "type": "text",
      "id": "label-password",
      "x": 290,
      "y": 520,
      "text": "密码",
      "fontSize": 14,
      "fontFamily": 2,
      "strokeColor": "#495057"
    },
    {
      "type": "rectangle",
      "id": "input-password",
      "x": 290,
      "y": 545,
      "width": 320,
      "height": 45,
      "strokeColor": "#adb5bd",
      "backgroundColor": "#f8f9fa",
      "strokeWidth": 1,
      "roughness": 0,
      "fillStyle": "solid"
    },
    {
      "type": "text",
      "id": "placeholder-password",
      "x": 305,
      "y": 558,
      "text": "••••••••",
      "fontSize": 18,
      "fontFamily": 2,
      "strokeColor": "#adb5bd"
    },
    {
      "type": "rectangle",
      "id": "button-login",
      "x": 290,
      "y": 640,
      "width": 320,
      "height": 50,
      "strokeColor": "#1971c2",
      "backgroundColor": "#4dabf7",
      "strokeWidth": 0,
      "roughness": 0,
      "fillStyle": "solid",
      "label": {
        "text": "登录",
        "fontSize": 18,
        "fontFamily": 2,
        "strokeColor": "#ffffff"
      }
    },
    {
      "type": "text",
      "id": "link-forgot",
      "x": 390,
      "y": 720,
      "text": "忘记密码？",
      "fontSize": 14,
      "fontFamily": 2,
      "strokeColor": "#1971c2"
    }
  ],
  "appState": {
    "viewBackgroundColor": "#f1f3f5",
    "gridSize": 20
  },
  "files": {}
}
\`\`\`

**关键点**：
- 使用 \`roughness: 0\` 保持线框图的专业和精确
- \`fontFamily: 2\` 使用正常字体，不使用手绘字体
- 输入框使用浅灰色背景（#f8f9fa）区分
- 主按钮使用蓝色填充突出主要操作

### 示例 2: 商品列表页面线框图（中等复杂度）

**用户需求**：电商应用的商品列表页，包含搜索栏、筛选、商品卡片

**生成代码**：
\`\`\`json
{
  "type": "excalidraw",
  "version": 2,
  "source": "https://excalidraw.com",
  "elements": [
    {
      "type": "rectangle",
      "id": "phone-frame",
      "x": 200,
      "y": 50,
      "width": 400,
      "height": 800,
      "strokeColor": "#495057",
      "backgroundColor": "#ffffff",
      "strokeWidth": 3,
      "roughness": 0,
      "fillStyle": "solid"
    },
    {
      "type": "rectangle",
      "id": "header",
      "x": 200,
      "y": 50,
      "width": 400,
      "height": 60,
      "strokeColor": "#1971c2",
      "backgroundColor": "#4dabf7",
      "strokeWidth": 0,
      "roughness": 0,
      "fillStyle": "solid"
    },
    {
      "type": "text",
      "id": "header-title",
      "x": 360,
      "y": 70,
      "text": "商品列表",
      "fontSize": 20,
      "fontFamily": 2,
      "strokeColor": "#ffffff"
    },
    {
      "type": "rectangle",
      "id": "search-bar",
      "x": 220,
      "y": 130,
      "width": 360,
      "height": 40,
      "strokeColor": "#adb5bd",
      "backgroundColor": "#f8f9fa",
      "strokeWidth": 1,
      "roughness": 0,
      "fillStyle": "solid"
    },
    {
      "type": "text",
      "id": "search-placeholder",
      "x": 235,
      "y": 142,
      "text": "🔍 搜索商品",
      "fontSize": 14,
      "fontFamily": 2,
      "strokeColor": "#adb5bd"
    },
    {
      "type": "rectangle",
      "id": "filter-bar",
      "x": 220,
      "y": 190,
      "width": 360,
      "height": 40,
      "strokeColor": "#e9ecef",
      "backgroundColor": "#ffffff",
      "strokeWidth": 1,
      "roughness": 0,
      "fillStyle": "solid"
    },
    {
      "type": "text",
      "id": "filter-text",
      "x": 235,
      "y": 202,
      "text": "筛选：价格 | 分类 | 销量",
      "fontSize": 12,
      "fontFamily": 2,
      "strokeColor": "#868e96"
    },
    {
      "type": "rectangle",
      "id": "product-card-1",
      "x": 220,
      "y": 250,
      "width": 170,
      "height": 220,
      "strokeColor": "#dee2e6",
      "backgroundColor": "#ffffff",
      "strokeWidth": 1,
      "roughness": 0,
      "fillStyle": "solid"
    },
    {
      "type": "rectangle",
      "id": "product-image-1",
      "x": 230,
      "y": 260,
      "width": 150,
      "height": 150,
      "strokeColor": "#ced4da",
      "backgroundColor": "#e9ecef",
      "strokeWidth": 1,
      "roughness": 0,
      "fillStyle": "solid",
      "label": {
        "text": "图片",
        "fontSize": 14,
        "fontFamily": 2,
        "strokeColor": "#adb5bd"
      }
    },
    {
      "type": "text",
      "id": "product-name-1",
      "x": 230,
      "y": 420,
      "text": "商品名称",
      "fontSize": 14,
      "fontFamily": 2,
      "strokeColor": "#212529"
    },
    {
      "type": "text",
      "id": "product-price-1",
      "x": 230,
      "y": 445,
      "text": "¥199",
      "fontSize": 16,
      "fontFamily": 2,
      "strokeColor": "#e03131"
    },
    {
      "type": "rectangle",
      "id": "product-card-2",
      "x": 410,
      "y": 250,
      "width": 170,
      "height": 220,
      "strokeColor": "#dee2e6",
      "backgroundColor": "#ffffff",
      "strokeWidth": 1,
      "roughness": 0,
      "fillStyle": "solid"
    },
    {
      "type": "rectangle",
      "id": "product-image-2",
      "x": 420,
      "y": 260,
      "width": 150,
      "height": 150,
      "strokeColor": "#ced4da",
      "backgroundColor": "#e9ecef",
      "strokeWidth": 1,
      "roughness": 0,
      "fillStyle": "solid",
      "label": {
        "text": "图片",
        "fontSize": 14,
        "fontFamily": 2,
        "strokeColor": "#adb5bd"
      }
    },
    {
      "type": "text",
      "id": "product-name-2",
      "x": 420,
      "y": 420,
      "text": "商品名称",
      "fontSize": 14,
      "fontFamily": 2,
      "strokeColor": "#212529"
    },
    {
      "type": "text",
      "id": "product-price-2",
      "x": 420,
      "y": 445,
      "text": "¥299",
      "fontSize": 16,
      "fontFamily": 2,
      "strokeColor": "#e03131"
    },
    {
      "type": "rectangle",
      "id": "product-card-3",
      "x": 220,
      "y": 490,
      "width": 170,
      "height": 220,
      "strokeColor": "#dee2e6",
      "backgroundColor": "#ffffff",
      "strokeWidth": 1,
      "roughness": 0,
      "fillStyle": "solid"
    },
    {
      "type": "rectangle",
      "id": "product-image-3",
      "x": 230,
      "y": 500,
      "width": 150,
      "height": 150,
      "strokeColor": "#ced4da",
      "backgroundColor": "#e9ecef",
      "strokeWidth": 1,
      "roughness": 0,
      "fillStyle": "solid",
      "label": {
        "text": "图片",
        "fontSize": 14,
        "fontFamily": 2,
        "strokeColor": "#adb5bd"
      }
    },
    {
      "type": "text",
      "id": "product-name-3",
      "x": 230,
      "y": 660,
      "text": "商品名称",
      "fontSize": 14,
      "fontFamily": 2,
      "strokeColor": "#212529"
    },
    {
      "type": "text",
      "id": "product-price-3",
      "x": 230,
      "y": 685,
      "text": "¥99",
      "fontSize": 16,
      "fontFamily": 2,
      "strokeColor": "#e03131"
    },
    {
      "type": "rectangle",
      "id": "product-card-4",
      "x": 410,
      "y": 490,
      "width": 170,
      "height": 220,
      "strokeColor": "#dee2e6",
      "backgroundColor": "#ffffff",
      "strokeWidth": 1,
      "roughness": 0,
      "fillStyle": "solid"
    },
    {
      "type": "rectangle",
      "id": "product-image-4",
      "x": 420,
      "y": 500,
      "width": 150,
      "height": 150,
      "strokeColor": "#ced4da",
      "backgroundColor": "#e9ecef",
      "strokeWidth": 1,
      "roughness": 0,
      "fillStyle": "solid",
      "label": {
        "text": "图片",
        "fontSize": 14,
        "fontFamily": 2,
        "strokeColor": "#adb5bd"
      }
    },
    {
      "type": "text",
      "id": "product-name-4",
      "x": 420,
      "y": 660,
      "text": "商品名称",
      "fontSize": 14,
      "fontFamily": 2,
      "strokeColor": "#212529"
    },
    {
      "type": "text",
      "id": "product-price-4",
      "x": 420,
      "y": 685,
      "text": "¥399",
      "fontSize": 16,
      "fontFamily": 2,
      "strokeColor": "#e03131"
    },
    {
      "type": "rectangle",
      "id": "bottom-nav",
      "x": 200,
      "y": 790,
      "width": 400,
      "height": 60,
      "strokeColor": "#e9ecef",
      "backgroundColor": "#ffffff",
      "strokeWidth": 1,
      "roughness": 0,
      "fillStyle": "solid"
    },
    {
      "type": "text",
      "id": "nav-text",
      "x": 250,
      "y": 812,
      "text": "首页    分类    购物车    我的",
      "fontSize": 12,
      "fontFamily": 2,
      "strokeColor": "#868e96"
    }
  ],
  "appState": {
    "viewBackgroundColor": "#f8f9fa",
    "gridSize": 20
  },
  "files": {}
}
\`\`\`

**关键点**：
- 顶部导航栏使用填充色区分功能区域
- 商品卡片使用统一的布局和间距
- 图片占位符使用浅灰色填充
- 价格使用红色突出显示
- 底部导航栏保持简洁

### 示例 3: 仪表盘线框图（高级场景）

**用户需求**：数据管理后台的仪表盘页面，包含侧边栏、卡片、图表区域

**生成代码**：
\`\`\`json
{
  "type": "excalidraw",
  "version": 2,
  "source": "https://excalidraw.com",
  "elements": [
    {
      "type": "rectangle",
      "id": "sidebar",
      "x": 50,
      "y": 50,
      "width": 200,
      "height": 700,
      "strokeColor": "#343a40",
      "backgroundColor": "#495057",
      "strokeWidth": 0,
      "roughness": 0,
      "fillStyle": "solid"
    },
    {
      "type": "text",
      "id": "sidebar-title",
      "x": 100,
      "y": 80,
      "text": "管理后台",
      "fontSize": 20,
      "fontFamily": 2,
      "strokeColor": "#ffffff"
    },
    {
      "type": "text",
      "id": "nav-item-1",
      "x": 70,
      "y": 140,
      "text": "📊 仪表盘",
      "fontSize": 16,
      "fontFamily": 2,
      "strokeColor": "#4dabf7"
    },
    {
      "type": "text",
      "id": "nav-item-2",
      "x": 70,
      "y": 180,
      "text": "👥 用户管理",
      "fontSize": 16,
      "fontFamily": 2,
      "strokeColor": "#ffffff"
    },
    {
      "type": "text",
      "id": "nav-item-3",
      "x": 70,
      "y": 220,
      "text": "📦 订单管理",
      "fontSize": 16,
      "fontFamily": 2,
      "strokeColor": "#ffffff"
    },
    {
      "type": "text",
      "id": "nav-item-4",
      "x": 70,
      "y": 260,
      "text": "⚙️ 系统设置",
      "fontSize": 16,
      "fontFamily": 2,
      "strokeColor": "#ffffff"
    },
    {
      "type": "rectangle",
      "id": "header",
      "x": 250,
      "y": 50,
      "width": 800,
      "height": 60,
      "strokeColor": "#e9ecef",
      "backgroundColor": "#ffffff",
      "strokeWidth": 1,
      "roughness": 0,
      "fillStyle": "solid"
    },
    {
      "type": "text",
      "id": "header-title",
      "x": 280,
      "y": 72,
      "text": "仪表盘 / Dashboard",
      "fontSize": 18,
      "fontFamily": 2,
      "strokeColor": "#212529"
    },
    {
      "type": "rectangle",
      "id": "stat-card-1",
      "x": 280,
      "y": 140,
      "width": 230,
      "height": 120,
      "strokeColor": "#dee2e6",
      "backgroundColor": "#ffffff",
      "strokeWidth": 1,
      "roughness": 0,
      "fillStyle": "solid"
    },
    {
      "type": "text",
      "id": "stat-title-1",
      "x": 300,
      "y": 160,
      "text": "总用户数",
      "fontSize": 14,
      "fontFamily": 2,
      "strokeColor": "#868e96"
    },
    {
      "type": "text",
      "id": "stat-value-1",
      "x": 300,
      "y": 195,
      "text": "12,345",
      "fontSize": 32,
      "fontFamily": 2,
      "strokeColor": "#1971c2"
    },
    {
      "type": "text",
      "id": "stat-trend-1",
      "x": 300,
      "y": 235,
      "text": "↑ 12% 较上周",
      "fontSize": 12,
      "fontFamily": 2,
      "strokeColor": "#2f9e44"
    },
    {
      "type": "rectangle",
      "id": "stat-card-2",
      "x": 540,
      "y": 140,
      "width": 230,
      "height": 120,
      "strokeColor": "#dee2e6",
      "backgroundColor": "#ffffff",
      "strokeWidth": 1,
      "roughness": 0,
      "fillStyle": "solid"
    },
    {
      "type": "text",
      "id": "stat-title-2",
      "x": 560,
      "y": 160,
      "text": "今日订单",
      "fontSize": 14,
      "fontFamily": 2,
      "strokeColor": "#868e96"
    },
    {
      "type": "text",
      "id": "stat-value-2",
      "x": 560,
      "y": 195,
      "text": "456",
      "fontSize": 32,
      "fontFamily": 2,
      "strokeColor": "#2f9e44"
    },
    {
      "type": "text",
      "id": "stat-trend-2",
      "x": 560,
      "y": 235,
      "text": "↑ 8% 较昨日",
      "fontSize": 12,
      "fontFamily": 2,
      "strokeColor": "#2f9e44"
    },
    {
      "type": "rectangle",
      "id": "stat-card-3",
      "x": 800,
      "y": 140,
      "width": 230,
      "height": 120,
      "strokeColor": "#dee2e6",
      "backgroundColor": "#ffffff",
      "strokeWidth": 1,
      "roughness": 0,
      "fillStyle": "solid"
    },
    {
      "type": "text",
      "id": "stat-title-3",
      "x": 820,
      "y": 160,
      "text": "总收入",
      "fontSize": 14,
      "fontFamily": 2,
      "strokeColor": "#868e96"
    },
    {
      "type": "text",
      "id": "stat-value-3",
      "x": 820,
      "y": 195,
      "text": "¥67.8万",
      "fontSize": 28,
      "fontFamily": 2,
      "strokeColor": "#f08c00"
    },
    {
      "type": "text",
      "id": "stat-trend-3",
      "x": 820,
      "y": 235,
      "text": "↓ 3% 较上月",
      "fontSize": 12,
      "fontFamily": 2,
      "strokeColor": "#e03131"
    },
    {
      "type": "rectangle",
      "id": "chart-area-1",
      "x": 280,
      "y": 290,
      "width": 490,
      "height": 300,
      "strokeColor": "#dee2e6",
      "backgroundColor": "#ffffff",
      "strokeWidth": 1,
      "roughness": 0,
      "fillStyle": "solid"
    },
    {
      "type": "text",
      "id": "chart-title-1",
      "x": 300,
      "y": 310,
      "text": "月度销售趋势",
      "fontSize": 16,
      "fontFamily": 2,
      "strokeColor": "#212529"
    },
    {
      "type": "rectangle",
      "id": "chart-placeholder",
      "x": 300,
      "y": 350,
      "width": 450,
      "height": 220,
      "strokeColor": "#ced4da",
      "backgroundColor": "#f8f9fa",
      "strokeWidth": 1,
      "roughness": 0,
      "fillStyle": "solid",
      "label": {
        "text": "📈 图表占位",
        "fontSize": 18,
        "fontFamily": 2,
        "strokeColor": "#adb5bd"
      }
    },
    {
      "type": "rectangle",
      "id": "chart-area-2",
      "x": 800,
      "y": 290,
      "width": 230,
      "height": 300,
      "strokeColor": "#dee2e6",
      "backgroundColor": "#ffffff",
      "strokeWidth": 1,
      "roughness": 0,
      "fillStyle": "solid"
    },
    {
      "type": "text",
      "id": "chart-title-2",
      "x": 820,
      "y": 310,
      "text": "分类占比",
      "fontSize": 16,
      "fontFamily": 2,
      "strokeColor": "#212529"
    },
    {
      "type": "ellipse",
      "id": "pie-chart-placeholder",
      "x": 845,
      "y": 380,
      "width": 140,
      "height": 140,
      "strokeColor": "#ced4da",
      "backgroundColor": "#f8f9fa",
      "strokeWidth": 1,
      "roughness": 0,
      "fillStyle": "solid",
      "label": {
        "text": "饼图",
        "fontSize": 14,
        "fontFamily": 2,
        "strokeColor": "#adb5bd"
      }
    },
    {
      "type": "rectangle",
      "id": "table-area",
      "x": 280,
      "y": 620,
      "width": 750,
      "height": 130,
      "strokeColor": "#dee2e6",
      "backgroundColor": "#ffffff",
      "strokeWidth": 1,
      "roughness": 0,
      "fillStyle": "solid"
    },
    {
      "type": "text",
      "id": "table-title",
      "x": 300,
      "y": 640,
      "text": "最近订单",
      "fontSize": 16,
      "fontFamily": 2,
      "strokeColor": "#212529"
    },
    {
      "type": "rectangle",
      "id": "table-header",
      "x": 300,
      "y": 675,
      "width": 710,
      "height": 30,
      "strokeColor": "#e9ecef",
      "backgroundColor": "#f8f9fa",
      "strokeWidth": 0,
      "roughness": 0,
      "fillStyle": "solid"
    },
    {
      "type": "text",
      "id": "table-header-text",
      "x": 320,
      "y": 685,
      "text": "订单号          用户          金额          状态",
      "fontSize": 12,
      "fontFamily": 2,
      "strokeColor": "#495057"
    },
    {
      "type": "line",
      "id": "table-row-1",
      "x": 300,
      "y": 715,
      "width": 710,
      "height": 0,
      "strokeColor": "#e9ecef",
      "strokeWidth": 1,
      "roughness": 0
    }
  ],
  "appState": {
    "viewBackgroundColor": "#f1f3f5",
    "gridSize": 20
  },
  "files": {}
}
\`\`\`

**关键点**：
- 使用深色侧边栏和白色主内容区对比
- 统计卡片使用大字号数字和趋势箭头
- 图表区域使用占位符标明内容类型
- Emoji 增强导航项的可识别性
- 表格使用浅灰色表头区分

## 常见错误

### 错误 1: 使用手绘效果

**❌ 错误写法**：
\`\`\`json
{
  "roughness": 2,
  "fontFamily": 1
}
\`\`\`

**✅ 正确写法**：
\`\`\`json
{
  "roughness": 0,
  "fontFamily": 2
}
\`\`\`

**原因**：线框图应该保持专业和精确，使用 \`roughness: 0\` 和正常字体。

### 错误 2: 元素对齐不规范

**❌ 错误写法**：
元素位置随意，没有对齐

**✅ 正确写法**：
使用网格对齐（20px 的倍数），保持统一间距

**原因**：线框图需要精确的布局体现设计规范。

### 错误 3: 缺少视觉层次

**❌ 错误写法**：
所有元素使用相同的颜色和粗细

**✅ 正确写法**：
标题使用大字号，主按钮使用填充色，次要元素使用浅色

**原因**：需要通过视觉层次引导用户注意力。

### 错误 4: 忽略真实内容

**❌ 错误写法**：
所有文本都是 "Lorem ipsum"

**✅ 正确写法**：
使用真实的标签和占位文本，如 "用户名"、"登录按钮"

**原因**：线框图需要传达真实的功能和内容。

### 错误 5: 元素尺寸不合理

**❌ 错误写法**：
按钮高度只有 20px，输入框宽度超过页面

**✅ 正确写法**：
遵循常见尺寸规范（按钮 40-50px，输入框 300-400px）

**原因**：尺寸需要符合实际使用场景和设备规格。

### 错误 6: 缺少状态说明

**❌ 错误写法**：
没有标注占位符、禁用状态等

**✅ 正确写法**：
使用浅灰色文本标注 "请输入..."、图片区域标注 "图片"

**原因**：线框图需要清晰说明每个区域的用途。

## 生成检查清单 (Simplified DEPTH - H)

生成代码后，逐项检查：

- [ ] **JSON 结构完整**：包含所有必需的顶层属性
- [ ] **专业精确**：\`roughness: 0\`，\`fontFamily: 2\`
- [ ] **元素对齐规范**：位置坐标是 20px 的倍数
- [ ] **视觉层次清晰**：标题、主按钮、次要元素有明显区分
- [ ] **内容真实可用**：使用实际标签而非占位文本
- [ ] **尺寸合理**：符合实际界面规范
- [ ] **状态标注清楚**：占位符、禁用状态有明确说明
- [ ] **JSON 格式有效**：无语法错误

**任何检查项不通过，立即修正后重新生成**
`;
