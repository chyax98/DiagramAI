# Excalidraw 常见错误和解决方案

> 更新时间: 2025-10-13
> 基于 GitHub Issues 和社区反馈整理

---

## 🚨 渲染错误

### 1. 复杂图形无法显示

**症状**:
- 复杂的 Excalidraw 图形在移动设备上不显示
- PC 端显示正常,移动端显示空白或损坏
- 错误信息: "Issue with complex Excalidraw graphics not displaying"

**原因**:
- 移动设备性能限制
- Canvas 元素数量过多
- 单个图形元素过大

**解决方案**:
```typescript
// 1. 分离复杂图形为多个文件
const MAX_ELEMENTS_PER_FILE = 100;

if (elements.length > MAX_ELEMENTS_PER_FILE) {
  console.warn("Too many elements, consider splitting");
}

// 2. 使用 Frame 分页
const frames = [
  { type: "frame", name: "Page 1", children: [...elements.slice(0, 50)] },
  { type: "frame", name: "Page 2", children: [...elements.slice(50, 100)] }
];

// 3. 优化元素复杂度
// 减少 roughness 值
{ roughness: 0 }  // 而非 roughness: 2

// 使用简单填充
{ fillStyle: "solid" }  // 而非 "hachure"
```

**GitHub Issue**: [#1997](https://github.com/zsviczian/obsidian-excalidraw-plugin/issues/1997)

---

### 2. 渲染问题 (Linux/Debian)

**症状**:
- 大尺寸对象渲染异常
- 图形显示不完整或错位
- Windows 正常,Linux 出错

**原因**:
- Linux 图形驱动兼容性
- Canvas 渲染引擎差异
- 字体渲染问题

**解决方案**:
```bash
# 1. 更新图形驱动
sudo apt update
sudo apt upgrade

# 2. 使用 Chrome/Chromium (推荐)
sudo apt install chromium-browser

# 3. 禁用硬件加速 (临时)
chromium --disable-gpu --disable-software-rasterizer

# 4. 检查字体
fc-list | grep -i "virgil\|cascadia"
```

**临时解决**:
```typescript
// 降低元素尺寸
const MAX_SIZE = 1000;

if (element.width > MAX_SIZE || element.height > MAX_SIZE) {
  element.width = Math.min(element.width, MAX_SIZE);
  element.height = Math.min(element.height, MAX_SIZE);
}
```

**GitHub Issue**: [#8978](https://github.com/excalidraw/excalidraw/issues/8978)

---

### 3. 图片损坏/无法显示

**症状**:
- 粘贴的图片显示为损坏图标
- 之前正常的图片突然无法显示
- 错误: "broken images"

**原因**:
- LocalStorage 存储限制 (通常 5-10MB)
- 图片 Base64 数据丢失
- 浏览器缓存清除

**解决方案**:
```typescript
// 1. 检查图片大小
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

if (file.size > MAX_IMAGE_SIZE) {
  console.error("Image too large:", file.size);
  // 压缩图片
  const compressed = await compressImage(file, { maxWidth: 1000 });
}

// 2. 使用外部图片链接 (而非嵌入)
{
  type: "image",
  fileId: null,
  // 使用 URL 而非 Base64
  src: "https://example.com/image.png"
}

// 3. 清理 LocalStorage
localStorage.removeItem("excalidraw");
localStorage.removeItem("excalidraw-files");
```

**预防措施**:
```typescript
// 定期导出备份
const exportData = serializeAsJSON(elements, appState, files);
localStorage.setItem("excalidraw-backup", exportData);

// 检查存储使用
const usage = new Blob([exportData]).size;
console.log(`Storage usage: ${(usage / 1024 / 1024).toFixed(2)} MB`);
```

**GitHub Discussion**: [#9184](https://github.com/excalidraw/excalidraw/discussions/9184)

---

## 🔧 功能错误

### 4. 拖拽肘形箭头闪烁

**症状**:
- 拖拽 elbow arrow 时画布闪烁
- 性能下降,动画卡顿

**原因**:
- 箭头重计算导致频繁重渲染
- 绑定点更新触发全局刷新

**解决方案**:
```typescript
// 暂时禁用 elbow arrow
// 使用标准 arrow 替代

{
  type: "arrow",
  // 不使用 roundness (避免肘形)
  roundness: null
}

// 或使用 line + 手动转角
{
  type: "line",
  points: [
    [0, 0],
    [100, 0],
    [100, 50],
    [200, 50]
  ]
}
```

**GitHub Issue**: [#9720](https://github.com/excalidraw/excalidraw/issues/9720)

---

### 5. 拼写检查点击无效

**症状**:
- 点击拼写纠正建议无法修正文本
- 拼写检查功能不响应

**原因**:
- 浏览器拼写检查与 Excalidraw 事件冲突
- contentEditable 元素事件捕获问题

**解决方案**:
```typescript
// 方案 1: 禁用浏览器拼写检查
<div contentEditable={true} spellCheck={false}>
  {text}
</div>

// 方案 2: 手动修正拼写
// 直接编辑文本元素

// 方案 3: 使用外部编辑器
const fixedText = await externalSpellCheck(element.text);
element.text = fixedText;
```

**GitHub Issue**: [#9707](https://github.com/excalidraw/excalidraw/issues/9707)

---

### 6. RTL (从右到左语言) 兼容性

**症状**:
- 阿拉伯语/希伯来语界面显示错乱
- 透明度控制条与 RTL 不兼容

**原因**:
- UI 组件未适配 RTL 布局
- CSS direction 属性冲突

**解决方案**:
```typescript
// 强制 LTR 布局
<div dir="ltr" style={{ direction: "ltr" }}>
  <Excalidraw />
</div>

// 或等待官方修复
// GitHub Issue: #9710
```

**GitHub Issue**: [#9710](https://github.com/excalidraw/excalidraw/issues/9710)

---

## 🔌 集成错误

### 7. Mermaid 导入 `<br>` 标签问题

**症状**:
- Mermaid 图中的 `<br>` 标签无法正确解析
- 换行符显示为文本

**原因**:
- `@excalidraw/mermaid-to-excalidraw` 不处理 HTML 标签

**解决方案**:
```typescript
// 预处理 Mermaid 定义
const mermaidDef = `
graph TD
  A[Line 1<br>Line 2] --> B
`;

// 替换 <br> 为换行符
const processed = mermaidDef.replace(/<br\s*\/?>/gi, "\n");

const { elements } = await parseMermaidToExcalidraw(processed);
```

**GitHub Issue**: [#9711](https://github.com/excalidraw/excalidraw/issues/9711)

---

### 8. Notion 嵌入失败

**症状**:
- 无法在 Notion 中嵌入 Excalidraw
- 希望直接在 Notion 访问 Excalidraw 项目

**原因**:
- Notion 不支持 Excalidraw 原生嵌入
- 跨域限制

**解决方案**:
```markdown
# 方案 1: 使用图片嵌入
1. 导出 Excalidraw 为 PNG (带 embed scene)
2. 上传图片到 Notion
3. 用户可下载图片并重新导入 Excalidraw 编辑

# 方案 2: 使用链接
1. 将 Excalidraw 分享链接
2. 在 Notion 中嵌入链接

# 方案 3: Excalidraw+ (付费)
- 支持更好的协作功能
- 可能有 Notion 集成
```

**GitHub Issue**: [#9718](https://github.com/excalidraw/excalidraw/issues/9718)

---

### 9. Obsidian 插件兼容性

**症状**:
- Excalidraw 与其他 Obsidian 插件冲突
- 性能下降,Obsidian 卡顿

**原因**:
- Metadata Menu 插件冲突
- Templater 语法高亮冲突
- Minimal Theme CSS 冲突

**解决方案**:
```typescript
// 1. 禁用冲突插件
// Settings → Community plugins → 禁用:
// - Metadata Menu
// - Templater 的 "Syntax highlighting on desktop"

// 2. 切换主题
// Settings → Appearance → 使用:
// - Default theme
// - Gruvbox theme (推荐)

// 3. 测试空白 Vault
// 创建新 vault,仅安装 Excalidraw
// 确认问题是否由其他插件引起

// 4. 禁用压缩 (性能优化)
// Excalidraw Plugin Settings → Saving
// ❌ "Compress Excalidraw JSON in Markdown"
```

**参考**: [Compatibility Issues Wiki](https://excalidraw-obsidian.online/wiki/troubleshooting/compatibility)

---

### 10. VS Code 扩展模块问题

**症状**:
- 错误: "uses the `module` export condition as an entry point"
- TypeScript 导入失败

**原因**:
- Excalidraw v0.18+ 仅支持 ESM
- 不兼容 CommonJS

**解决方案**:
```json
// package.json
{
  "type": "module",  // 启用 ESM
  "exports": {
    ".": {
      "import": "./dist/excalidraw.esm.js",
      "require": "./dist/excalidraw.cjs.js"
    }
  }
}
```

```typescript
// 使用动态导入
const { Excalidraw } = await import("@excalidraw/excalidraw");

// 或配置 tsconfig.json
{
  "compilerOptions": {
    "module": "esnext",
    "moduleResolution": "node"
  }
}
```

**GitHub Issue**: [#9729](https://github.com/excalidraw/excalidraw/issues/9729)

---

## 🎨 UI/UX 错误

### 11. 全屏模式快捷键冲突

**症状**:
- Ctrl+Tab / Ctrl+Shift+Tab 无法切换标签
- 全屏模式下快捷键失效

**原因**:
- Excalidraw 捕获了浏览器快捷键
- 事件传播被阻止

**解决方案**:
```typescript
// 禁用 Excalidraw 快捷键
<Excalidraw
  UIOptions={{
    canvasActions: {
      // 禁用可能冲突的快捷键
      toggleTheme: false
    }
  }}
  handleKeyboardGlobally={false}
/>

// 或监听并手动处理
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "Tab") {
    e.stopPropagation();
    // 浏览器原生行为
  }
});
```

**GitHub Issue**: [#9728](https://github.com/excalidraw/excalidraw/issues/9728)

---

### 12. 深色模式颜色问题

**症状**:
- 图片在深色模式下颜色略有不同
- 导出的图片与显示不一致

**原因**:
- 深色模式自动调整图片亮度
- CSS filter 影响

**解决方案**:
```typescript
// 导出时固定为浅色模式
await exportToBlob({
  elements,
  appState: {
    ...appState,
    theme: "light",
    exportBackground: true,
    viewBackgroundColor: "#ffffff"
  },
  files
});

// 或禁用深色模式自动调整
<div style={{ filter: "none" }}>
  <Excalidraw theme="light" />
</div>
```

**GitHub Issue**: [#9706](https://github.com/excalidraw/excalidraw/issues/9706)

---

## 📱 移动端问题

### 13. 触摸设备支持

**症状**:
- 平板/手机操作不流畅
- 多点触控识别错误
- 手势冲突

**原因**:
- 触摸事件处理不完善
- 缩放/拖动手势冲突

**解决方案**:
```typescript
// 优化触摸体验
<Excalidraw
  detectScroll={true}
  handleKeyboardGlobally={false}
  UIOptions={{
    canvasActions: {
      // 简化移动端 UI
      export: { saveFileToDisk: false }
    }
  }}
/>

// CSS 优化
.excalidraw {
  touch-action: none; /* 禁用浏览器默认手势 */
  -webkit-user-select: none;
}
```

**GitHub Issue**: [#9705](https://github.com/excalidraw/excalidraw/issues/9705)

---

### 14. 协作模式本地元素移动

**症状**:
- 更改 URL hash 时本地元素被移入协作房间
- 元素意外同步

**原因**:
- 协作状态管理bug
- hash 变化触发同步

**解决方案**:
```typescript
// 禁用自动同步
const [collaborators, setCollaborators] = useState(new Map());

// 手动控制同步
const shouldSync = (element) => {
  return !element.isLocal; // 标记本地元素
};

// 或使用不同的存储
localStorage.setItem(`excalidraw-local-${userId}`, JSON.stringify(localElements));
```

**GitHub Issue**: [#9708](https://github.com/excalidraw/excalidraw/issues/9708)

---

## 🛠️ 调试技巧

### 通用调试流程

```typescript
// 1. 启用调试模式
window.EXCALIDRAW_DEBUG = true;

// 2. 查看元素状态
console.log("Elements:", api.getSceneElements());
console.log("App State:", api.getAppState());

// 3. 检查文件
console.log("Files:", api.getFiles());

// 4. 监听变化
<Excalidraw
  onChange={(elements, appState) => {
    console.log("Changed:", { elements, appState });
  }}
  onError={(error) => {
    console.error("Excalidraw Error:", error);
  }}
/>

// 5. 导出诊断数据
const diagnostics = {
  elements: api.getSceneElements(),
  appState: api.getAppState(),
  files: api.getFiles(),
  libraryItems: await api.getLibraryItems(),
  version: window.EXCALIDRAW_VERSION
};

console.log("Diagnostics:", JSON.stringify(diagnostics, null, 2));
```

### 性能分析

```typescript
// 测量渲染性能
const start = performance.now();

api.updateScene({ elements: newElements });

const end = performance.now();
console.log(`Render time: ${end - start}ms`);

// 元素统计
const stats = {
  total: elements.length,
  byType: elements.reduce((acc, el) => {
    acc[el.type] = (acc[el.type] || 0) + 1;
    return acc;
  }, {}),
  totalSize: new Blob([JSON.stringify(elements)]).size
};

console.log("Stats:", stats);
```

---

## 📚 参考资源

### 官方资源
- [GitHub Issues](https://github.com/excalidraw/excalidraw/issues)
- [Excalidraw Changelog](https://plus.excalidraw.com/changelog)
- [FAQ](https://docs.excalidraw.com/docs/@excalidraw/excalidraw/faq)

### 社区资源
- [Discord Support](https://discord.gg/UexuTaE)
- [Obsidian Plugin Troubleshooting](https://excalidraw-obsidian.online/wiki/troubleshooting)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/excalidraw)

### 已知限制
- LocalStorage 限制: 5-10MB (浏览器依赖)
- 最大元素数: ~1000 个 (性能考虑)
- 图片大小: 建议 < 2MB
- 不支持: 动画、视频、3D

---

**最后更新**: 2025-10-13
**基于 Issues**: 截至 2025-07 的开放问题
