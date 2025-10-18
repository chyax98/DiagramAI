# Nomnoml 社区问题与解决方案

> 收集时间: 2025-10-13
> 来源: GitHub Issues, Stack Overflow, 社区讨论

## 高频问题

### 1. 文本搜索功能失效

**问题描述**: 在较大的 nomnoml 图表中,浏览器的文本搜索(Ctrl+F)无法正常工作

**影响版本**: 所有版本

**重现步骤**:

1. 创建包含 100+ 个节点的图表
2. 在浏览器中按 Ctrl+F
3. 搜索节点名称
4. 搜索无法高亮或定位到目标元素

**原因分析**:

- SVG 文本元素的搜索支持有限
- 浏览器对 SVG 内部文本的索引不完整
- 某些浏览器完全不支持 SVG 内文本搜索

**解决方案**:

**方案 1: 自定义搜索功能**

```javascript
function searchNomnoml(searchTerm) {
  const svg = document.querySelector("svg");
  const textElements = svg.querySelectorAll("text");

  // 清除之前的高亮
  textElements.forEach((el) => {
    el.classList.remove("highlight");
  });

  // 搜索并高亮
  const matches = [];
  textElements.forEach((el, index) => {
    if (el.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
      el.classList.add("highlight");
      matches.push({ element: el, index });
    }
  });

  // 滚动到第一个匹配项
  if (matches.length > 0) {
    matches[0].element.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  return matches;
}

// CSS 样式
const style = document.createElement("style");
style.textContent = `
  .highlight {
    fill: #ff0000 !important;
    font-weight: bold !important;
  }
`;
document.head.appendChild(style);
```

**方案 2: 添加数据属性索引**

```javascript
// 渲染后添加搜索索引
function indexDiagram() {
  const svg = document.querySelector("svg");
  const nodes = svg.querySelectorAll("g[data-name]");

  nodes.forEach((node) => {
    const name = node.getAttribute("data-name");
    // 创建隐藏的可搜索文本
    const searchText = document.createElement("span");
    searchText.style.display = "none";
    searchText.textContent = name;
    searchText.className = "nomnoml-search-index";
    node.appendChild(searchText);
  });
}

// 在渲染后调用
nomnoml.draw(canvas, source);
indexDiagram();
```

**方案 3: 使用浏览器扩展**

- 安装 SVG 搜索增强扩展
- 使用支持 SVG 搜索的浏览器(如 Firefox 的某些版本)

### 2. R 语言集成中的希腊字母问题

**问题描述**: 在 R 的 nomnoml 包中无法正确显示希腊字母

**错误示例**:

```r
library(nomnoml)

# ❌ 尝试使用 R 的表达式语法
nomnoml::nomnoml("[α] -> [β]")  # 显示为乱码
```

**解决方案**:

**方案 1: 使用 Unicode 字符**

```r
library(nomnoml)

# ✅ 直接使用 Unicode
nomnoml::nomnoml("[α] -> [β]")

# 或使用 Unicode 转义
nomnoml::nomnoml("[\u03B1] -> [\u03B2]")
```

**方案 2: 使用 HTML 实体**

```r
# 如果支持 HTML 渲染
nomnoml::nomnoml("[&alpha;] -> [&beta;]")
```

**方案 3: 设置字体**

```r
nomnoml::nomnoml("
  #font: Arial Unicode MS

  [α-particle] -> [β-decay]
")
```

**常用希腊字母 Unicode**:

- α (alpha): `\u03B1`
- β (beta): `\u03B2`
- γ (gamma): `\u03B3`
- δ (delta): `\u03B4`
- θ (theta): `\u03B8`
- λ (lambda): `\u03BB`
- μ (mu): `\u03BC`
- π (pi): `\u03C0`
- σ (sigma): `\u03C3`
- Δ (Delta): `\u0394`
- Σ (Sigma): `\u03A3`

### 3. RMarkdown 导出到 Word 问题

**问题描述**: RMarkdown 文档中的 nomnoml 图表无法正确导出到 Word (.docx)

**错误信息**:

```
Error: Diagrams require SVG or PNG output, but Word doesn't support inline SVG
```

**原因**: Word 不直接支持内嵌 SVG

**解决方案**:

**方案 1: 转换为 PNG**

```r
library(nomnoml)
library(rsvg)

# 创建图表
diagram_svg <- nomnoml::nomnoml("
  [User] -> [System]
", svg = TRUE)

# 转换为 PNG
png_file <- tempfile(fileext = ".png")
rsvg::rsvg_png(
  charToRaw(diagram_svg),
  png_file,
  width = 800,
  height = 600
)

# 在 RMarkdown 中使用
knitr::include_graphics(png_file)
```

**方案 2: 使用 webshot**

```r
library(nomnoml)
library(webshot)

# 保存为 HTML
html_file <- tempfile(fileext = ".html")
nomnoml::nomnoml("
  [User] -> [System]
", file = html_file)

# 截图为 PNG
png_file <- tempfile(fileext = ".png")
webshot::webshot(html_file, png_file)

knitr::include_graphics(png_file)
```

**方案 3: RMarkdown 配置**

````markdown
```{r, echo=FALSE, fig.width=8, fig.height=6}
library(nomnoml)

nomnoml::nomnoml("
  [User] -> [System]
", png = "diagram.png", width = 800, height = 600)

knitr::include_graphics("diagram.png")
```
````

### 4. tsuml2 与 Nomnoml 集成错误

**问题描述**: 使用 tsuml2 从 TypeScript 生成 UML 时出现解析错误

**错误信息**:

```bash
$ tsuml2 --glob "./src/**/*.ts"
ParseError: Unexpected token at line 45
```

**原因分析**:

- TypeScript 新语法不被支持
- Decorator 语法冲突
- 泛型类型解析错误
- tsconfig 配置不兼容

**解决方案**:

**方案 1: 更新 tsuml2**

```bash
# 更新到最新版本
npm update tsuml2 -g

# 或重新安装
npm uninstall tsuml2 -g
npm install tsuml2@latest -g
```

**方案 2: 调整 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "exclude": ["node_modules", "**/*.spec.ts", "**/*.test.ts"]
}
```

**方案 3: 排除问题文件**

```bash
# 逐步排除文件定位问题
tsuml2 --glob "./src/models/**/*.ts"
tsuml2 --glob "./src/services/**/*.ts"

# 排除特定模式
tsuml2 --glob "./src/**/!(*.spec|*.test).ts"
```

**方案 4: 手动处理**

```typescript
// 简化复杂类型
// ❌ 可能导致错误
type Complex<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? ReturnType<T[K]> : T[K];
};

// ✅ 简化为
interface Complex {
  // 手动定义类型
}
```

### 5. Jupyter Notebook 集成问题

**问题描述**: 在 Jupyter Notebook 中使用 nomnoml 无法正确渲染

**尝试的方法**:

```python
# ❌ 这些方法可能不工作
%%javascript
// nomnoml code

%%html
<script src="nomnoml.js"></script>
```

**解决方案**:

**方案 1: 使用 IFrame**

```python
from IPython.display import IFrame, HTML
import json

nomnoml_source = """
[User] -> [System]
"""

html_template = """
<!DOCTYPE html>
<html>
<head>
  <script src="https://unpkg.com/graphre/dist/graphre.js"></script>
  <script src="https://unpkg.com/nomnoml/dist/nomnoml.js"></script>
</head>
<body>
  <canvas id="canvas"></canvas>
  <script>
    var source = `{source}`
    var canvas = document.getElementById('canvas')
    nomnoml.draw(canvas, source)
  </script>
</body>
</html>
"""

html = html_template.format(source=nomnoml_source)

# 保存并显示
with open('temp_diagram.html', 'w') as f:
    f.write(html)

IFrame('temp_diagram.html', width=800, height=600)
```

**方案 2: 使用 SVG 输出**

```python
from IPython.display import SVG
import subprocess
import tempfile

nomnoml_source = """
[User] -> [System]
"""

# 保存源文件
with tempfile.NamedTemporaryFile(mode='w', suffix='.nomnoml', delete=False) as f:
    f.write(nomnoml_source)
    input_file = f.name

# 生成 SVG
output_file = input_file.replace('.nomnoml', '.svg')
subprocess.run(['nomnoml', input_file, output_file])

# 显示
SVG(filename=output_file)
```

**方案 3: 使用专用库**

```python
# 安装 jupyter-nomnoml 扩展(如果有)
!pip install jupyter-nomnoml

# 使用 magic 命令
%%nomnoml
[User] -> [System]
```

### 6. 标签重叠问题

**问题描述**: 节点标签相互重叠,难以阅读

**典型场景**:

```nomnoml
// 多个长名称的节点
[VeryLongControllerName]
[AnotherVeryLongServiceName]
[VeryLongRepositoryImplementation]

[VeryLongControllerName] -> [AnotherVeryLongServiceName]
[AnotherVeryLongServiceName] -> [VeryLongRepositoryImplementation]
```

**解决方案**:

**方案 1: 调整间距**

```nomnoml
#spacing: 80                // 增大节点间距
#gutter: 20                 // 增大分组间距
#padding: 15                // 增大内边距

[VeryLongControllerName]
[AnotherVeryLongServiceName]
[VeryLongRepositoryImplementation]

[VeryLongControllerName] -> [AnotherVeryLongServiceName]
```

**方案 2: 使用缩写**

```nomnoml
// 使用缩写和ID
[<id=ctrl> Controller]
[<id=svc> Service]
[<id=repo> Repository]

[ctrl] -> [svc]
[svc] -> [repo]

// 或添加注释
// Controller: UserAuthenticationController
[Controller] -> [Service]
```

**方案 3: 改变布局方向**

```nomnoml
#direction: right           // 水平布局减少重叠

[VeryLongControllerName] -> [AnotherVeryLongServiceName] -> [VeryLongRepositoryImplementation]
```

**方案 4: 分层显示**

```nomnoml
[<frame> Presentation|
  [Controller]
]

[<frame> Business|
  [Service]
]

[<frame> Data|
  [Repository]
]

[Presentation] -> [Business]
[Business] -> [Data]
```

### 7. npm run build 测试失败

**问题描述**: 运行 `npm run build` 时出现测试错误

**错误信息**:

```
Error in TestSuite "include edges in canvas size calculation"
Expected: canvas includes arrow endpoints
Actual: arrow cut off at edge
```

**原因**: Canvas 尺寸计算不包含箭头端点

**解决方案**:

**方案 1: 更新 nomnoml**

```bash
# 更新到最新版本
npm update nomnoml

# 或安装特定版本
npm install nomnoml@1.7.0
```

**方案 2: 手动调整 Canvas 大小**

```javascript
// 渲染前增加 Canvas 边距
function drawWithMargin(source) {
  const canvas = document.createElement("canvas");

  // 临时渲染获取尺寸
  nomnoml.draw(canvas, source);

  // 添加边距
  const margin = 20;
  canvas.width += margin * 2;
  canvas.height += margin * 2;

  // 平移上下文
  const ctx = canvas.getContext("2d");
  ctx.translate(margin, margin);

  // 重新渲染
  nomnoml.draw(canvas, source);

  return canvas;
}
```

**方案 3: 跳过测试(临时)**

```bash
# 跳过特定测试
npm run build -- --grep "include edges" --invert

# 或禁用所有测试
npm run build -- --no-tests
```

### 8. 创建分组功能

**问题描述**: 如何创建可视化的分组或包

**需求**: 将相关节点组织在一起

**解决方案**:

**方案 1: 使用 Frame**

```nomnoml
[<frame> User Management|
  [User]
  [UserProfile]
  [UserSettings]

  [User] -> [UserProfile]
  [User] -> [UserSettings]
]
```

**方案 2: 使用 Package**

```nomnoml
[<package> Frontend|
  [React Components]
  [Vue Components]
]

[<package> Backend|
  [API Layer]
  [Database Layer]
]

[Frontend] -> [Backend]
```

**方案 3: 嵌套结构**

```nomnoml
[<frame> System|
  [<package> Web Layer|
    [Controllers]
    [Views]
  ]

  [<package> Business Layer|
    [Services]
    [Domain Models]
  ]

  [<package> Data Layer|
    [Repositories]
    [Database]
  ]
]
```

**方案 4: 使用样式区分**

```nomnoml
#.frontend: fill=#e3f2fd stroke=#2196F3
#.backend: fill=#f3e5f5 stroke=#9C27B0

[<frontend> React]
[<frontend> Vue]
[<backend> API]
[<backend> Database]

[React] -> [API]
[Vue] -> [API]
[API] -> [Database]
```

## 集成问题

### 9. Confluence 集成

**问题描述**: 在 Atlassian Confluence 中使用 nomnoml 插件

**常见问题**:

1. 插件安装失败
2. 图表不显示
3. 编辑器异常

**解决方案**:

**安装步骤**:

1. 在 Atlassian Marketplace 搜索 "nomnoml"
2. 安装 "nomnoml for Confluence" 插件
3. 重启 Confluence 服务

**使用方法**:

```
{nomnoml}
[User] -> [System]
{nomnoml}
```

**故障排查**:

1. 检查插件版本兼容性
2. 清除浏览器缓存
3. 检查 Confluence 权限设置
4. 查看服务器日志

### 10. VS Code 集成

**问题描述**: 在 VS Code 中实时预览 nomnoml 图表

**解决方案**:

**方案 1: 使用扩展**

```bash
# 安装 nomnoml preview 扩展
code --install-extension [extension-id]
```

**方案 2: 自定义 Task**

```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Preview Nomnoml",
      "type": "shell",
      "command": "nomnoml ${file} output.svg && open output.svg",
      "group": "build"
    }
  ]
}
```

**方案 3: Live Server**

```html
<!-- preview.html -->
<!DOCTYPE html>
<html>
  <head>
    <script src="https://unpkg.com/graphre/dist/graphre.js"></script>
    <script src="https://unpkg.com/nomnoml/dist/nomnoml.js"></script>
  </head>
  <body>
    <canvas id="canvas"></canvas>
    <script>
      // 定期读取文件并刷新
      setInterval(async () => {
        const response = await fetch("diagram.nomnoml");
        const source = await response.text();
        nomnoml.draw(document.getElementById("canvas"), source);
      }, 1000);
    </script>
  </body>
</html>
```

## 样式和渲染问题

### 11. 深色模式支持

**问题描述**: 在深色主题下图表颜色不协调

**解决方案**:

**方案 1: 深色主题配置**

```nomnoml
#background: #1e1e1e
#fill: #2d2d2d; #3d3d3d
#stroke: #ffffff
#font: Consolas

[<class> DarkTheme|
  background: #1e1e1e;
  text: #ffffff
]
```

**方案 2: CSS 媒体查询**

```css
/* 自动切换主题 */
@media (prefers-color-scheme: dark) {
  canvas {
    filter: invert(1) hue-rotate(180deg);
  }

  /* 或使用 CSS 变量 */
  :root {
    --nomnoml-bg: #1e1e1e;
    --nomnoml-stroke: #ffffff;
  }
}
```

**方案 3: 动态主题切换**

```javascript
const themes = {
  light: {
    background: "transparent",
    fill: "#eee8d5; #fdf6e3",
    stroke: "#33322E",
  },
  dark: {
    background: "#1e1e1e",
    fill: "#2d2d2d; #3d3d3d",
    stroke: "#ffffff",
  },
};

function applyTheme(source, themeName) {
  const theme = themes[themeName];
  const directives = `
    #background: ${theme.background}
    #fill: ${theme.fill}
    #stroke: ${theme.stroke}
  `;
  return directives + "\n" + source;
}

// 使用
const darkSource = applyTheme(originalSource, "dark");
nomnoml.draw(canvas, darkSource);
```

### 12. 自定义字体不生效

**问题描述**: 设置 `#font:` 指令后字体没有改变

**原因**:

1. 字体未安装在系统上
2. 字体名称拼写错误
3. 浏览器不支持该字体

**解决方案**:

**方案 1: 使用 Web 字体**

```html
<!-- 引入 Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet" />

<script>
  const source = `
    #font: Roboto

    [User] -> [System]
  `;
  nomnoml.draw(canvas, source);
</script>
```

**方案 2: 字体回退**

```nomnoml
#font: "Helvetica Neue", Helvetica, Arial, sans-serif

[User] -> [System]
```

**方案 3: 本地字体检查**

```javascript
// 检查字体是否可用
async function isFontAvailable(fontName) {
  const fonts = await document.fonts.ready;
  return fonts.check(`12px "${fontName}"`);
}

// 使用
if (await isFontAvailable("CustomFont")) {
  source = "#font: CustomFont\n" + source;
} else {
  source = "#font: Arial\n" + source;
}
```

### 13. 箭头方向异常

**问题描述**: 某些情况下箭头指向错误的方向

**场景**:

```nomnoml
// 预期: A 指向 B
[A] -> [B]

// 实际: 箭头反向
```

**原因**: 布局算法自动调整节点位置

**解决方案**:

**方案 1: 使用双向箭头**

```nomnoml
[A] <-> [B]    // 明确双向关系
```

**方案 2: 调整布局方向**

```nomnoml
#direction: right

[A] -> [B]    // 确保从左到右
```

**方案 3: 使用隐藏节点定位**

```nomnoml
[A]
[<hidden>]
[B]

[A] -> [hidden]
[hidden] -> [B]
```

## 导出和部署问题

### 14. SVG 导出字体嵌入

**问题描述**: 导出的 SVG 在其他环境中字体显示不正确

**解决方案**:

**方案 1: 转换文本为路径**

```javascript
// 使用库将文本转为路径
import { convertTextToPath } from "svg-text-to-path";

const svg = nomnoml.renderSvg(source);
const pathSvg = convertTextToPath(svg);
```

**方案 2: 嵌入字体**

```javascript
function embedFont(svg, fontUrl) {
  const fontFace = `
    <defs>
      <style>
        @font-face {
          font-family: 'EmbeddedFont';
          src: url('${fontUrl}') format('woff2');
        }
      </style>
    </defs>
  `;
  return svg.replace("<svg", `<svg>${fontFace}`);
}
```

**方案 3: 使用系统字体**

```nomnoml
#font: Arial, sans-serif    // 使用通用字体
```

### 15. 批量生成图表

**问题描述**: 需要从多个源文件批量生成图表

**解决方案**:

**Node.js 脚本**:

```javascript
const fs = require("fs");
const path = require("path");
const nomnoml = require("nomnoml");

const inputDir = "./diagrams";
const outputDir = "./output";

// 读取所有 .nomnoml 文件
fs.readdirSync(inputDir)
  .filter((file) => file.endsWith(".nomnoml"))
  .forEach((file) => {
    const source = fs.readFileSync(path.join(inputDir, file), "utf8");
    const svg = nomnoml.renderSvg(source);

    const outputFile = file.replace(".nomnoml", ".svg");
    fs.writeFileSync(path.join(outputDir, outputFile), svg);

    console.log(`✓ Generated ${outputFile}`);
  });
```

**使用 Makefile**:

```makefile
# Makefile
SOURCES := $(wildcard diagrams/*.nomnoml)
OUTPUTS := $(SOURCES:diagrams/%.nomnoml=output/%.svg)

all: $(OUTPUTS)

output/%.svg: diagrams/%.nomnoml
	nomnoml $< $@

clean:
	rm -f output/*.svg
```

## 性能优化

### 16. 大图表优化策略

**问题**: 超过 50 个节点时渲染缓慢

**优化方案**:

**1. 延迟加载**:

```javascript
// 仅渲染可视区域
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const source = entry.target.dataset.nomnoml;
      nomnoml.draw(entry.target, source);
      observer.unobserve(entry.target);
    }
  });
});

document.querySelectorAll(".nomnoml-lazy").forEach((el) => {
  observer.observe(el);
});
```

**2. 使用 Web Worker**:

```javascript
// worker.js
importScripts("https://unpkg.com/nomnoml/dist/nomnoml.js");

self.onmessage = (e) => {
  const svg = nomnoml.renderSvg(e.data);
  self.postMessage(svg);
};

// main.js
const worker = new Worker("worker.js");
worker.postMessage(source);
worker.onmessage = (e) => {
  container.innerHTML = e.data;
};
```

**3. 缓存结果**:

```javascript
const cache = new Map();

function renderCached(source) {
  const hash = hashCode(source);

  if (cache.has(hash)) {
    return cache.get(hash);
  }

  const svg = nomnoml.renderSvg(source);
  cache.set(hash, svg);
  return svg;
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash;
}
```

## 社区资源

### 工具和扩展

1. **编辑器插件**:
   - VS Code: "Nomnoml Preview"
   - Atom: "nomnoml-preview"
   - Sublime Text: "Nomnoml"

2. **集成平台**:
   - Confluence: "nomnoml for Confluence"
   - GitBook: gitbook-plugin-nomnoml
   - MkDocs: mkdocs-nomnoml-plugin

3. **在线工具**:
   - 官方编辑器: https://www.nomnoml.com
   - SVG 优化: https://jakearchibald.github.io/svgomg/

### 学习资源

- **GitHub 仓库**: https://github.com/skanaar/nomnoml
- **示例画廊**: https://www.nomnoml.com (首页有示例)
- **API 文档**: https://github.com/skanaar/nomnoml#api

### 问题报告

发现 Bug 或有功能建议?

1. 检查 [GitHub Issues](https://github.com/skanaar/nomnoml/issues)
2. 搜索 [Stack Overflow](https://stackoverflow.com/questions/tagged/nomnoml)
3. 提供最小可复现示例
4. 包含 nomnoml 版本信息

### 社区讨论

- **GitHub Discussions**: https://github.com/skanaar/nomnoml/discussions
- **Stack Overflow**: `[nomnoml]` 标签
- **Reddit**: r/UML, r/webdev

## 常见问题索引

| 问题            | 章节 |
| --------------- | ---- |
| 文本搜索失效    | §1   |
| R 希腊字母      | §2   |
| Word 导出       | §3   |
| TypeScript 集成 | §4   |
| Jupyter 集成    | §5   |
| 标签重叠        | §6   |
| npm 构建错误    | §7   |
| 创建分组        | §8   |
| Confluence      | §9   |
| VS Code         | §10  |
| 深色模式        | §11  |
| 自定义字体      | §12  |
| 箭头方向        | §13  |
| SVG 字体        | §14  |
| 批量生成        | §15  |
| 性能优化        | §16  |

## 贡献指南

欢迎贡献解决方案!

1. Fork 仓库
2. 添加问题和解决方案
3. 提供代码示例
4. 提交 Pull Request

**文档格式**:

- 问题描述清晰
- 提供可运行的示例代码
- 说明适用版本
- 注明来源(Issue 链接等)
