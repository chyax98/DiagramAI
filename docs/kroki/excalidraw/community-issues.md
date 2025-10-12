# Excalidraw 社区问题和讨论

> 更新时间: 2025-10-13
> 来源: GitHub Issues, Discussions, Reddit, Discord

---

## 🔥 热门功能请求

### 1. 多页面支持 + PDF 导出

**Issue**: [#9719](https://github.com/excalidraw/excalidraw/issues/9719)

**需求**:
- 支持多页面/幻灯片模式
- 导出为多页 PDF
- 页面间导航

**当前方案**:
```typescript
// 使用 Frame 模拟多页
const pages = [
  {
    type: "frame",
    name: "Page 1",
    x: 0, y: 0,
    width: 800, height: 600,
    children: [/* page 1 elements */]
  },
  {
    type: "frame",
    name: "Page 2",
    x: 900, y: 0,  // 水平排列
    width: 800, height: 600,
    children: [/* page 2 elements */]
  }
];

// 单独导出每页
for (const frame of frames) {
  const blob = await exportToBlob({
    elements: frame.children,
    appState: { viewBackgroundColor: "#ffffff" }
  });
  // 保存为单独文件
}
```

**社区投票**: 200+ 👍

---

### 2. 信号 (Signals) 支持

**Issue**: [#3338](https://github.com/vega/vega-lite/issues/3338)

**需求**:
- 支持动态变量 (类似 Vega signals)
- 实现旋转地球等动画效果
- 通过信号控制标记颜色

**当前限制**:
- Excalidraw 不支持动画
- 无法通过变量动态更新元素

**临时方案**:
```typescript
// 使用 JavaScript 手动更新
setInterval(() => {
  const rotation = (Date.now() / 1000) % 360;

  api.updateScene({
    elements: elements.map(el => ({
      ...el,
      angle: el.id === "earth" ? rotation * Math.PI / 180 : el.angle
    }))
  });
}, 16); // 60 FPS
```

**状态**: 📅 长期规划,暂无时间表

---

### 3. 画布链接 (Canvas Linking)

**Changelog**: 2024-10-08

**功能**:
- ✅ 已实现 (v0.17+)
- 元素间创建链接
- 使用 Cmd/Ctrl+K 快捷键
- 右键菜单快速创建链接

**用法**:
```typescript
// 通过 href 属性添加链接
{
  type: "rectangle",
  id: "rect-1",
  href: "https://example.com",
  // 或链接到其他元素
  href: "#element-id-2"
}

// API 设置链接
api.updateScene({
  elements: elements.map(el =>
    el.id === "rect-1"
      ? { ...el, href: "https://example.com" }
      : el
  )
});
```

---

### 4. 图片裁剪

**Changelog**: 2024-10-08

**功能**:
- ✅ 已实现
- 双击图片或按 Enter 进入裁剪模式
- 支持拖动调整裁剪框

**用法**:
```typescript
// 图片元素带裁剪
{
  type: "image",
  fileId: "file-123",
  crop: {
    x: 0.1,    // 裁剪起始 X (比例)
    y: 0.1,    // 裁剪起始 Y (比例)
    width: 0.8,  // 裁剪宽度 (比例)
    height: 0.8  // 裁剪高度 (比例)
  }
}
```

---

## 🐛 常见 Bug 反馈

### 5. 缩放时刻度限制

**Issue**: [#4886](https://github.com/vega/vega-lite/issues/4886)

**问题**:
- 缩放时希望限制 X/Y 轴范围
- 例如: X 轴不低于 0,不高于 1000

**需求场景**:
```typescript
// 期望: 设置缩放边界
{
  scale: {
    domain: [0, 1000],
    clamp: true  // 限制在域内
  }
}
```

**当前状态**: ❌ Excalidraw 不支持坐标轴概念

**替代方案**: 使用 Vega-Lite 进行数据可视化

---

### 6. 条形图标签被截断

**Issue**: [#9441](https://github.com/vega/vega-lite/issues/9441)

**问题**:
- 文本换行后,堆叠条形图错位
- 轴标签过长导致布局混乱

**Excalidraw 相关**:
```typescript
// 文本溢出问题
{
  type: "text",
  text: "Very Long Label That Might Overflow",
  width: 100,  // 固定宽度
  // ❌ 不支持自动换行

  // ✅ 手动处理
  text: "Very Long\nLabel That\nMight Overflow"
}
```

**建议**:
- 手动换行
- 减少文本长度
- 旋转文本 (angle 属性)

---

### 7. 缺陷规模问题

**Issue**: [#9611](https://github.com/vega/vega-lite/issues/9611)

**问题**:
- 使用 `diverging` 刻度时颜色方案无法自定义
- `strokeDash` + 自定义颜色生成两个图例

**Excalidraw 无此问题** (非数据可视化工具)

---

## 💬 社区讨论

### 8. 如何拖放自定义元素?

**Discussion**: [#9575](https://github.com/excalidraw/excalidraw/discussions/9575)

**问题**:
- 想创建自定义图形库
- 拖放到画布时转换为真实形状

**官方回复** (@Mrazator):
```typescript
// 需要转换为 Excalidraw 元素
import { convertToExcalidrawElements } from "@excalidraw/excalidraw";

// 自定义形状
const customShape = {
  type: "rectangle",
  x: dropX,
  y: dropY,
  width: 100,
  height: 80,
  // 如果包含文本,需单独创建文本元素
};

// 带文本的矩形
const withText = [
  {
    type: "rectangle",
    id: "rect-1",
    x: 100, y: 100,
    width: 100, height: 80
  },
  {
    type: "text",
    id: "text-1",
    x: 110, y: 120,
    width: 80, height: 25,
    text: "Label",
    containerId: "rect-1"  // 绑定到矩形
  }
];

const elements = convertToExcalidrawElements(withText);
api.updateScene({ elements });
```

---

### 9. Obsidian 性能问题

**Reddit**: [r/ObsidianMD](https://www.reddit.com/r/ObsidianMD/comments/1eg4q0z/excalidraw_problems/)

**问题**:
- 每次创建新绘图时警告: "Switch to EXCALIDRAW VIEW"
- 插件版本不兼容

**解决方案**:
```
1. 更新 Excalidraw 插件到最新版
2. Settings → Excalidraw → Compatibility mode
   ✅ "Compatibility mode for desktop"
3. 重启 Obsidian
4. 清除 .obsidian/plugins/obsidian-excalidraw-plugin/data.json
```

---

### 10. 大文件停止工作

**Reddit**: [r/ObsidianMD](https://www.reddit.com/r/ObsidianMD/comments/1ifwxc9/a_large_excalidraw_file_stopped_working/)

**问题**:
- 大型 Excalidraw 文件无法打开
- 提示内存不足

**解决方案**:
```
1. 禁用 Graph View 插件
   Settings → Core plugins → Graph view (关闭)

2. 重新启用 Graph View
   Settings → Core plugins → Graph view (开启)

3. 分割大文件
   - 导出为 JSON
   - 手动拆分元素数组
   - 创建多个文件
```

---

## 🌟 最佳实践分享

### 11. Excalidraw 在技术文档中的应用

**来源**: [Paired Ends Blog](https://blog.stephenturner.us/p/excalidraw-create-and-share-workflow)

**经验**:
- ✅ 结合 Mermaid 使用: Mermaid 生成初稿,Excalidraw 美化
- ✅ VS Code 集成: 直接在项目中维护图表
- ✅ Git 版本控制: .excalidraw 文件可 diff

**工作流**:
```bash
# 1. Mermaid 定义流程
cat > workflow.mmd << 'EOF'
graph TD
  A[Sample Prep] --> B[Isolation]
  B --> C[Library Prep]
  C --> D[Sequencing]
EOF

# 2. 转换为 Excalidraw
npx @excalidraw/mermaid-to-excalidraw workflow.mmd > workflow.excalidraw

# 3. 在 Excalidraw 中美化
code workflow.excalidraw  # VS Code 插件打开

# 4. 导出为图片
# (在 Excalidraw 中 File → Export → PNG)

# 5. 嵌入文档
# ![Workflow](workflow.png)
```

---

### 12. 事件风暴 (Event Storming) 模板

**来源**: [Libraries](https://libraries.excalidraw.com/)

**素材库**: Event Storming

**元素**:
- 🟠 Command (橙色) - 命令
- 🟦 Event (蓝色) - 事件
- 🟨 Question (黄色) - 问题
- 🟪 Entity (紫色) - 实体
- 🟩 System (绿色) - 系统

**使用技巧**:
```typescript
// 定义事件风暴颜色规范
const EVENT_STORMING = {
  command: {
    strokeColor: "#f08c00",
    backgroundColor: "#fff4e6"
  },
  event: {
    strokeColor: "#1971c2",
    backgroundColor: "#e7f5ff"
  },
  question: {
    strokeColor: "#f59f00",
    backgroundColor: "#fff9db"
  },
  entity: {
    strokeColor: "#ae3ec9",
    backgroundColor: "#f3d9fa"
  },
  system: {
    strokeColor: "#2f9e44",
    backgroundColor: "#ebfbee"
  }
};

// 创建标准便签
const createSticky = (type, text, x, y) => ({
  type: "rectangle",
  x, y,
  width: 120,
  height: 80,
  ...EVENT_STORMING[type]
});
```

---

### 13. 架构图最佳实践

**来源**: [EA Forum](https://forum.effectivealtruism.org/posts/iKes4JjvpLM8LKMyT/excalidraw-why-and-how-to-use-it)

**建议**:
1. **使用 Frame 分层**
   - Frontend Frame
   - Backend Frame
   - Database Frame

2. **一致的图标风格**
   - 使用 IT Logos 库
   - 或统一手绘风格

3. **颜色编码**
   - 蓝色: 服务
   - 绿色: 数据库
   - 橙色: 外部 API
   - 红色: 安全边界

4. **标注说明**
   - 使用编号 (1, 2, 3...)
   - 配合文本说明流程

**示例**:
```typescript
const architecture = [
  // 前端层
  {
    type: "frame",
    name: "Frontend",
    x: 0, y: 0,
    width: 400, height: 300,
    backgroundColor: "#e7f5ff"
  },
  {
    type: "rectangle",
    frameId: "frontend-frame",
    label: { text: "React App" },
    ...
  },

  // 后端层
  {
    type: "frame",
    name: "Backend",
    x: 500, y: 0,
    width: 400, height: 300,
    backgroundColor: "#ebfbee"
  },

  // 连接箭头
  {
    type: "arrow",
    startBinding: { elementId: "react-app" },
    endBinding: { elementId: "api-server" },
    label: { text: "1. HTTP Request" }
  }
];
```

---

## 🔮 未来路线图

### 已确认功能 (基于 Changelog)

#### ✅ 已实现 (2024-2025)
- 画布链接 (Canvas linking)
- 图片裁剪 (Image cropping)
- 手绘 CJK 字体 (Excalifont)
- 屏幕共享 (Screen sharing)
- 演示模式改进 (Presentation mode)

#### 🚧 进行中
- 性能优化 (大型画布)
- 移动端体验改进
- 更多素材库

#### 📅 计划中 (社区投票)
- 多页面支持 (高票数)
- 动画支持 (探索中)
- AI 辅助绘图 (研究中)

---

## 📊 社区统计

### GitHub 活跃度
- ⭐ Stars: 108k+
- 🍴 Forks: 11.2k+
- 👁️ Watchers: 471
- 📝 Issues: 1,918 open
- 🎉 Contributors: 346+

### 热门集成
1. **Obsidian** - 最受欢迎的笔记工具集成
2. **VS Code** - 开发者常用
3. **Mermaid** - 代码到图表转换
4. **Notion** - (社区需求,官方未支持)

### 企业使用
- Google (内部工具)
- Microsoft (文档)
- Vercel (设计讨论)
- 多个教育机构

---

## 🤝 贡献指南

### 如何报告 Bug
1. 搜索现有 Issues
2. 在空白 vault/浏览器测试
3. 提供最小复现案例
4. 附加截图/日志

**Issue 模板**:
```markdown
## Bug 描述
简短描述问题

## 重现步骤
1. 打开 Excalidraw
2. 创建矩形
3. 点击...

## 期望行为
应该发生什么

## 实际行为
实际发生了什么

## 环境
- Excalidraw 版本: v0.18.0
- 浏览器: Chrome 120
- 操作系统: macOS 14
```

### 功能请求
1. 检查路线图
2. 搜索现有 Discussions
3. 描述用例和收益
4. 提供 UI mock 或示例

---

## 📚 学习资源

### 官方资源
- [文档](https://docs.excalidraw.com/)
- [示例](https://github.com/excalidraw/excalidraw/tree/master/examples)
- [视频教程](https://www.youtube.com/results?search_query=excalidraw)

### 社区教程
- [Effective Altruism Forum](https://forum.effectivealtruism.org/posts/iKes4JjvpLM8LKMyT/excalidraw-why-and-how-to-use-it)
- [Medium 文章集](https://medium.com/tag/excalidraw)
- [HackMD 指南](https://hackmd.io/@alkemio/SJuewkPwn)

### 交流渠道
- 💬 [Discord](https://discord.gg/UexuTaE) - 实时讨论
- 🐦 [Twitter @excalidraw](https://twitter.com/excalidraw) - 动态更新
- 💼 [LinkedIn](https://www.linkedin.com/company/excalidraw) - 商业案例

---

## 🏆 社区项目

### 扩展和工具
1. **excalidraw-vscode** - VS Code 扩展
2. **mermaid-to-excalidraw** - Mermaid 转换
3. **obsidian-excalidraw-plugin** - Obsidian 插件
4. **excalidraw-automate** - Obsidian 自动化脚本

### 素材库贡献者
- @Pierre Clainchard - IT Logos
- @gabi-as-cosmos - Periodic Table
- @Alexander Tsukanov - ELK Stack
- 众多社区贡献者

---

**最后更新**: 2025-10-13
**社区活跃度**: ⭐⭐⭐⭐⭐ (非常活跃)
