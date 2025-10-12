# WaveDrom 社区问题与解决方案

> 收集时间: 2025-10-13
> 来源: GitHub Issues, Stack Overflow, 用户社区

## 高频问题

### 1. Vue 3 集成错误

**问题描述**: 在 Vue 3.4.21 中使用 WaveDrom 3.5.0 时出现错误:
```
Uncaught (in promise) TypeError: Cannot read properties of undefined
```

**原因分析**:
- WaveDrom 尝试访问未定义的 DOM 元素
- Vue 3 的响应式系统导致时序问题
- 生命周期钩子调用时机不当

**解决方案**:

```vue
<template>
  <div ref="waveContainer"></div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const waveContainer = ref(null)

onMounted(async () => {
  // 等待 DOM 完全渲染
  await nextTick()

  // 动态导入 WaveDrom
  const WaveDrom = await import('wavedrom')

  const source = {
    signal: [
      { name: "clk", wave: "p......" }
    ]
  }

  // 确保容器存在
  if (waveContainer.value) {
    WaveDrom.renderWaveForm(0, source, waveContainer.value)
  }
})
</script>
```

**相关 Issues**:
- [wavedrom/wavedrom#xxx](https://github.com/wavedrom/wavedrom/issues)
- Vue 用户社区讨论

### 2. 大图表性能问题

**问题描述**: 当图表包含大量信号(>100)时,渲染变慢或浏览器卡死

**典型场景**:
- 总线信号展示(32位、64位)
- 复杂协议时序
- 长时间序列数据

**解决方案**:

**方案 1: 分段渲染**
```json
// 将长波形拆分为多个较短的图表
{
  "signal": [
    { "name": "bus[31:0]", "wave": "x34x", "data": ["A", "B"] }
    // 只显示关键周期
  ]
}
```

**方案 2: 使用 hscale 优化**
```json
{
  "signal": [...],
  "config": {
    "hscale": 1,      // 使用最小缩放
    "skin": "narrow"  // 使用紧凑皮肤
  }
}
```

**方案 3: 虚拟化加载**
```javascript
// 懒加载不可见的波形段
function renderVisibleWaves(scrollPosition) {
  const visibleRange = calculateVisibleRange(scrollPosition)
  const partialSource = {
    signal: fullSource.signal.map(sig => ({
      ...sig,
      wave: sig.wave.substring(visibleRange.start, visibleRange.end)
    }))
  }
  WaveDrom.renderWaveForm(0, partialSource, canvas)
}
```

**性能优化建议**:
1. 限制单个图表的信号数量(<50)
2. 避免过长的波形字符串(<200字符)
3. 使用 `skin: "narrow"` 减少渲染开销
4. 考虑使用服务端渲染(SSR)生成静态 SVG

### 3. 文本搜索失效

**问题描述**: 在较大的 nomnoml 图表中无法使用文本搜索功能

**重现步骤**:
1. 创建包含 >100 个节点的图表
2. 在浏览器中按 Ctrl+F 搜索
3. 搜索无法高亮或定位元素

**原因**:
- SVG 文本元素的搜索支持有限
- 浏览器对 SVG 内容的搜索实现不一致

**解决方案**:

**方案 1: 添加自定义搜索**
```javascript
function searchInWaveDrom(searchTerm) {
  // 获取所有文本元素
  const textElements = document.querySelectorAll('svg text')

  textElements.forEach(el => {
    if (el.textContent.includes(searchTerm)) {
      // 高亮匹配项
      el.style.fill = 'red'
      el.style.fontWeight = 'bold'

      // 滚动到视图
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else {
      // 重置样式
      el.style.fill = ''
      el.style.fontWeight = ''
    }
  })
}
```

**方案 2: 使用数据属性**
```javascript
// 渲染时添加数据属性
WaveDrom.renderWaveForm = (function(original) {
  return function(...args) {
    const result = original.apply(this, args)

    // 为每个元素添加搜索标记
    const texts = document.querySelectorAll('svg text')
    texts.forEach(el => {
      el.setAttribute('data-search', el.textContent.toLowerCase())
    })

    return result
  }
})(WaveDrom.renderWaveForm)

// 搜索函数
function search(term) {
  const selector = `svg text[data-search*="${term.toLowerCase()}"]`
  return document.querySelectorAll(selector)
}
```

### 4. TypeScript 类型定义问题

**问题描述**: 在 TypeScript 项目中使用 WaveDrom 时缺少类型定义

**错误信息**:
```
Could not find a declaration file for module 'wavedrom'
```

**解决方案**:

**方案 1: 创建类型声明文件**
```typescript
// wavedrom.d.ts
declare module 'wavedrom' {
  export interface WaveSignal {
    name: string
    wave: string
    data?: string[]
    node?: string
    period?: number
    phase?: number
  }

  export interface WaveConfig {
    hscale?: number
    skin?: 'default' | 'narrow' | 'lowkey'
  }

  export interface WaveSource {
    signal: (WaveSignal | string[] | {})[]
    config?: WaveConfig
    head?: {
      text?: string | any[]
      tick?: number
      tock?: number
      every?: number
    }
    foot?: {
      text?: string | any[]
      tock?: number
    }
    edge?: string[]
  }

  export function renderWaveForm(
    index: number,
    source: WaveSource,
    target: HTMLElement | string
  ): void

  export function renderSvg(source: WaveSource): string

  export function ProcessAll(): void
}
```

**方案 2: 使用 any 类型(临时方案)**
```typescript
declare module 'wavedrom' {
  const WaveDrom: any
  export = WaveDrom
}
```

### 5. 箭头重叠问题

**问题描述**: 多个箭头在同一区域时相互重叠,难以区分

**示例**:
```json
{
  "signal": [
    { "name": "A", "wave": "01..", "node": ".a.." },
    { "name": "B", "wave": "0.1.", "node": "..b." },
    { "name": "C", "wave": "0..1", "node": "...c" }
  ],
  "edge": [
    "a->b setup",
    "a->c hold",    // 重叠
    "b->c delay"
  ]
}
```

**解决方案**:

**方案 1: 调整节点位置**
```json
{
  "signal": [
    { "name": "A", "wave": "01..", "node": ".a.." },
    { "name": "B", "wave": "0.1.", "node": "..b." },
    { "name": "C", "wave": "0..1", "node": "....c" },  // 延后节点位置
    { "node": "...d" }  // 添加中间节点
  ],
  "edge": [
    "a->b setup",
    "a->d hold",
    "d->c",
    "b->c delay"
  ]
}
```

**方案 2: 使用不同箭头类型**
```json
{
  "edge": [
    "a->b setup",     // 直线箭头
    "a~>c hold",      // 曲线箭头(区分)
    "b-|>c delay"     // 直角箭头(区分)
  ]
}
```

**方案 3: 分组显示**
```json
// 将相关信号分组,减少箭头交叉
{
  "signal": [
    ["Setup Group",
      { "name": "A", "wave": "01..", "node": ".a.." },
      { "name": "B", "wave": "0.1.", "node": "..b." }
    ],
    {},
    ["Hold Group",
      { "name": "C", "wave": "0..1", "node": "...c" }
    ]
  ],
  "edge": [
    "a->b setup",
    "a~>c hold"  // 跨组箭头更清晰
  ]
}
```

## 集成问题

### 6. Markdown 渲染器集成

**问题**: 在 Markdown 中嵌入 WaveDrom 代码块不渲染

**场景**:
- GitBook
- VuePress
- Docsify
- MkDocs

**解决方案**:

**GitBook 插件**:
```json
// book.json
{
  "plugins": ["wavedrom"]
}
```

```markdown
```wavedrom
{
  signal: [
    { name: "clk", wave: "p...." }
  ]
}
​```
```

**VuePress 配置**:
```javascript
// .vuepress/config.js
module.exports = {
  markdown: {
    extendMarkdown: md => {
      md.use(require('markdown-it-wavedrom'))
    }
  }
}
```

**通用方案(自定义)**:
```javascript
// 查找代码块并渲染
document.querySelectorAll('pre code.language-wavedrom').forEach(block => {
  const source = JSON.parse(block.textContent)
  const container = document.createElement('div')

  block.parentElement.replaceWith(container)
  WaveDrom.renderWaveForm(0, source, container)
})
```

### 7. React 组件封装

**问题**: 在 React 中多次渲染导致内存泄漏

**错误实现**:
```jsx
// ❌ 错误 - 每次渲染都创建新实例
function WaveForm({ source }) {
  useEffect(() => {
    WaveDrom.renderWaveForm(0, source, 'wave-container')
  })  // 缺少依赖数组

  return <div id="wave-container"></div>
}
```

**正确实现**:
```jsx
import { useEffect, useRef } from 'react'

function WaveForm({ source }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (containerRef.current) {
      // 清空容器
      containerRef.current.innerHTML = ''

      // 渲染新内容
      WaveDrom.renderWaveForm(0, source, containerRef.current)
    }

    // 清理函数
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [source])  // source 改变时重新渲染

  return <div ref={containerRef}></div>
}
```

### 8. 服务端渲染(SSR)

**问题**: 在 Next.js/Nuxt.js 中服务端渲染失败

**错误**:
```
ReferenceError: document is not defined
```

**原因**: WaveDrom 依赖浏览器 DOM API

**解决方案**:

**Next.js**:
```jsx
import dynamic from 'next/dynamic'

// 禁用 SSR
const WaveForm = dynamic(
  () => import('../components/WaveForm'),
  { ssr: false }
)

export default function Page() {
  return <WaveForm source={...} />
}
```

**Nuxt.js**:
```vue
<template>
  <client-only>
    <wave-form :source="waveSource" />
  </client-only>
</template>

<script>
export default {
  components: {
    WaveForm: () => import('~/components/WaveForm.vue')
  }
}
</script>
```

**通用方案**:
```javascript
// 仅在客户端加载
if (typeof window !== 'undefined') {
  const WaveDrom = require('wavedrom')
  // 使用 WaveDrom
}
```

## 样式和显示问题

### 9. CSS 冲突

**问题**: 页面 CSS 影响 WaveDrom 渲染

**常见冲突**:
```css
/* 全局样式影响 SVG */
svg {
  max-width: 100%;  /* 导致图表被压缩 */
}

text {
  font-family: Arial;  /* 覆盖 WaveDrom 字体 */
}
```

**解决方案**:

**方案 1: 使用命名空间**
```css
/* 仅对 WaveDrom 容器应用样式 */
.wavedrom-container svg {
  max-width: none !important;
}

.wavedrom-container text {
  font-family: 'Courier New', monospace;
}
```

**方案 2: 使用 CSS 隔离**
```html
<div style="all: initial;">
  <div id="wave-container"></div>
</div>
```

**方案 3: Shadow DOM**
```javascript
const shadow = document.getElementById('host').attachShadow({ mode: 'open' })
const container = document.createElement('div')
shadow.appendChild(container)

WaveDrom.renderWaveForm(0, source, container)
```

### 10. 深色模式适配

**问题**: 深色主题下图表颜色不匹配

**解决方案**:

**方案 1: 使用皮肤**
```json
{
  "signal": [...],
  "config": {
    "skin": "lowkey"  // 单色皮肤适合深色背景
  }
}
```

**方案 2: CSS 过滤器**
```css
@media (prefers-color-scheme: dark) {
  .wavedrom-container svg {
    filter: invert(1) hue-rotate(180deg);
  }
}
```

**方案 3: 自定义主题**
```javascript
// 动态修改 SVG 颜色
function applyDarkMode(svgElement) {
  svgElement.querySelectorAll('[fill="#000"]').forEach(el => {
    el.setAttribute('fill', '#fff')
  })

  svgElement.querySelectorAll('[stroke="#000"]').forEach(el => {
    el.setAttribute('stroke', '#fff')
  })

  svgElement.style.backgroundColor = '#1e1e1e'
}
```

## 数据处理问题

### 11. 动态数据更新

**问题**: 实时数据更新时图表闪烁

**场景**: 监控系统、调试工具

**优化方案**:

**方案 1: 使用 requestAnimationFrame**
```javascript
let updateScheduled = false

function updateWaveform(newData) {
  if (!updateScheduled) {
    updateScheduled = true

    requestAnimationFrame(() => {
      WaveDrom.renderWaveForm(0, newData, container)
      updateScheduled = false
    })
  }
}
```

**方案 2: 增量更新**
```javascript
// 只更新变化的部分
function incrementalUpdate(newSignals) {
  const svg = container.querySelector('svg')

  newSignals.forEach((signal, index) => {
    const textElement = svg.querySelector(`text[data-index="${index}"]`)
    if (textElement && textElement.textContent !== signal.name) {
      textElement.textContent = signal.name
    }
  })
}
```

**方案 3: 防抖动**
```javascript
import debounce from 'lodash/debounce'

const debouncedUpdate = debounce((data) => {
  WaveDrom.renderWaveForm(0, data, container)
}, 100)  // 100ms 防抖
```

### 12. 大数据量处理

**问题**: 处理数千个数据点时性能下降

**解决方案**:

**数据抽样**:
```javascript
function sampleData(data, maxPoints = 200) {
  if (data.length <= maxPoints) return data

  const step = Math.floor(data.length / maxPoints)
  return data.filter((_, index) => index % step === 0)
}

const sampledSource = {
  signal: [
    {
      name: "data",
      wave: "x" + "=".repeat(sampledData.length) + "x",
      data: sampleData(largeDataset)
    }
  ]
}
```

**数据聚合**:
```javascript
function aggregateData(data, windowSize = 10) {
  const aggregated = []

  for (let i = 0; i < data.length; i += windowSize) {
    const window = data.slice(i, i + windowSize)
    const avg = window.reduce((a, b) => a + b, 0) / window.length
    aggregated.push(Math.round(avg))
  }

  return aggregated
}
```

## 导出和保存问题

### 13. PNG 导出质量差

**问题**: 导出的 PNG 图片模糊或失真

**原因**: Canvas 默认分辨率不足

**解决方案**:

```javascript
function exportHighQualityPNG(source, scale = 2) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  // 临时渲染获取尺寸
  const tempDiv = document.createElement('div')
  tempDiv.style.position = 'absolute'
  tempDiv.style.left = '-9999px'
  document.body.appendChild(tempDiv)

  WaveDrom.renderWaveForm(0, source, tempDiv)
  const svg = tempDiv.querySelector('svg')
  const bbox = svg.getBBox()

  // 设置高分辨率
  canvas.width = bbox.width * scale
  canvas.height = bbox.height * scale

  // 缩放上下文
  ctx.scale(scale, scale)

  // 重新渲染
  WaveDrom.renderWaveForm(0, source, canvas)

  // 导出
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'waveform.png'
    a.click()
  }, 'image/png', 1.0)  // 最高质量

  document.body.removeChild(tempDiv)
}
```

### 14. SVG 嵌入字体问题

**问题**: 导出的 SVG 在其他环境中字体显示不正确

**解决方案**:

**方案 1: 嵌入字体**
```javascript
function embedFonts(svgElement) {
  const style = document.createElement('style')
  style.textContent = `
    @font-face {
      font-family: 'WaveDrom';
      src: url('data:font/woff2;base64,...');
    }
  `
  svgElement.insertBefore(style, svgElement.firstChild)
}
```

**方案 2: 转换为路径**
```javascript
// 使用库如 opentype.js 将文本转换为路径
function textToPath(svgElement) {
  const texts = svgElement.querySelectorAll('text')

  texts.forEach(textEl => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    // 转换逻辑...
    textEl.parentNode.replaceChild(path, textEl)
  })
}
```

## 兼容性问题

### 15. IE 浏览器支持

**问题**: WaveDrom 在 IE11 中无法运行

**解决方案**:

```html
<!-- 添加 polyfills -->
<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>

<!-- 或使用 Babel 转译 -->
<script src="wavedrom.legacy.js"></script>
```

**注意**: IE11 已停止支持,建议提示用户升级浏览器

### 16. 移动端显示问题

**问题**: 移动设备上图表显示不正常

**解决方案**:

```css
/* 响应式调整 */
@media (max-width: 768px) {
  .wavedrom-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .wavedrom-container svg {
    min-width: 100%;
  }
}
```

```json
// 使用较小的 hscale
{
  "signal": [...],
  "config": {
    "hscale": 1  // 移动端使用最小缩放
  }
}
```

## 调试工具和资源

### 推荐工具

1. **在线编辑器**: https://wavedrom.com/editor.html
   - 实时预览
   - 错误提示
   - 示例库

2. **浏览器扩展**:
   - WaveDrom Viewer (Chrome)
   - SVG Inspector (Firefox)

3. **开发工具**:
   ```javascript
   // 启用调试模式
   localStorage.setItem('wavedrom-debug', 'true')
   ```

### 社区资源

- **GitHub Issues**: https://github.com/wavedrom/wavedrom/issues
- **Stack Overflow**: [wavedrom] 标签
- **用户论坛**: https://groups.google.com/g/wavedrom

### 常见问题快速索引

| 问题 | 章节 |
|-----|------|
| Vue 集成 | §1 |
| 性能优化 | §2 |
| 文本搜索 | §3 |
| TypeScript | §4 |
| 箭头重叠 | §5 |
| Markdown | §6 |
| React 集成 | §7 |
| SSR | §8 |
| CSS 冲突 | §9 |
| 深色模式 | §10 |
| 动态更新 | §11 |
| 大数据 | §12 |
| PNG 导出 | §13 |
| SVG 字体 | §14 |
| IE 兼容 | §15 |
| 移动端 | §16 |

## 贡献指南

发现新问题或有解决方案?

1. 在 [GitHub Issues](https://github.com/wavedrom/wavedrom/issues) 搜索是否已存在
2. 提供完整的复现步骤和代码示例
3. 附上浏览器版本和环境信息
4. 欢迎提交 PR 完善文档
