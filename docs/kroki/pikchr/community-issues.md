# Pikchr 社区问题与解决方案

## 项目状态

- **官方网站**: https://pikchr.org
- **开发者**: D. Richard Hipp (SQLite 和 Fossil 作者)
- **开发语言**: C (单文件实现)
- **维护状态**: 活跃维护中
- **主要用途**: Fossil SCM 文档、SQLite 语法图

## 1. 高频问题

### 1.1 与 PIC 的兼容性

**问题来源**: 用户期望 Pikchr 完全兼容原始 PIC

**现状**:

- Pikchr 受 PIC 启发，但**不是**完全兼容
- 大部分 PIC 脚本需要修改才能在 Pikchr 中运行
- Pikchr 移除了 PIC 的一些复杂特性

**主要差异**:

| 特性         | PIC               | Pikchr                 |
| ------------ | ----------------- | ---------------------- |
| 单位         | 仅英寸            | 支持 cm, mm, px, pt 等 |
| .PS/.PE 标记 | 必需              | 不需要                 |
| troff 依赖   | 是                | 否 (零依赖)            |
| 输出格式     | 多种 (依赖 troff) | 仅 SVG                 |
| 文本处理     | troff 格式        | 简化的文本属性         |

**解决方案**:

1. 参考官方差异文档: https://pikchr.org/home/doc/trunk/doc/differences.md
2. 使用转换脚本 (如果有)
3. 手动调整 PIC 脚本

---

### 1.2 文本自动调整大小问题

**问题**: `fit` 属性计算的尺寸不准确

**原因**: Pikchr 需要估算文本渲染尺寸，但无法访问实际字体度量

**症状**:

```pikchr
box "Very long text that should fit" fit
# 可能文本溢出或留白过多
```

**workaround 解决方案**:

**方案 1: 调整字符宽度估计**

```pikchr
charwid = 0.1      # 默认 0.08，调大让盒子更宽
box "Long text" fit
```

**方案 2: 手动微调**

```pikchr
box "Long text" fit width 110%  # fit 后再调整
```

**方案 3: 添加空格**

```pikchr
box " Long text "  # 前后加空格增加边距
```

---

### 1.3 中文和 Unicode 支持

**问题**: 中文字符显示为方框或布局错误

**原因**:

1. SVG 查看器缺少中文字体
2. `charwid` 估计不准 (中文字符通常更宽)
3. 文件编码非 UTF-8

**解决方案**:

**步骤 1: 确保 UTF-8 编码**

```bash
# 检查编码
file -I diagram.pikchr

# 转换编码
iconv -f GBK -t UTF-8 diagram.pikchr -o diagram_utf8.pikchr
```

**步骤 2: 调整字符宽度**

```pikchr
# 中文字符更宽
charwid = 0.15     # 默认 0.08
charht = 0.14      # 默认 0.14

box "中文文本" fit
```

**步骤 3: 指定字体 (在 CSS 中)**

```html
<style>
  text {
    font-family: "Microsoft YaHei", "PingFang SC", sans-serif;
  }
</style>
```

---

### 1.4 复杂路径渲染异常

**问题**: 多段线条或闭合路径显示不正确

**示例**:

```pikchr
line from B1.s \\
  go down 1cm \\
  then right 2cm \\
  then up 1cm \\
  then right 1cm \\
  close
# 可能显示异常
```

**可能原因**:

1. 路径自相交
2. SVG 渲染器的 fill-rule 问题
3. 路径过于复杂

**解决方案**:

**方案 1: 简化路径**

```pikchr
# 分成多个简单路径
line from B1.s down 1cm then right 2cm
line from previous.end up 1cm then right 1cm
```

**方案 2: 使用容器**

```pikchr
[
  # 复杂图形在独立坐标系
  line ...
  close
] at ...
```

---

## 2. 集成问题

### 2.1 Markdown 渲染器支持

**问题**: 不是所有 Markdown 渲染器都支持 Pikchr

**支持情况**:

| 平台/工具  | 支持        | 备注              |
| ---------- | ----------- | ----------------- |
| Fossil SCM | ✅ 原生支持 | 默认启用          |
| GitHub     | ❌ 不支持   | 需要预渲染        |
| GitLab     | ❌ 不支持   | 需要预渲染        |
| Kroki      | ✅ 支持     | 通过 API          |
| Pandoc     | ⚠️ 需要插件 | 需要自定义 filter |
| Hugo       | ⚠️ 需要配置 | 需要 shortcode    |

**通用解决方案**:

**方案 1: 预渲染 (CI/CD)**

```yaml
# GitHub Actions 示例
- name: Render Pikchr
  run: |
    for file in docs/**/*.md; do
      pikchr-render "$file"
    done
```

**方案 2: 使用 Kroki API**

```bash
# 通过 Kroki 生成 SVG
curl -X POST https://kroki.io/pikchr/svg \\
  -H "Content-Type: text/plain" \\
  --data-binary @diagram.pikchr > output.svg
```

**方案 3: JavaScript 客户端渲染**

```html
<script src="pikchr.js"></script>
<script>
  document.querySelectorAll("code.language-pikchr").forEach((el) => {
    el.innerHTML = pikchr(el.textContent);
  });
</script>
```

---

### 2.2 Fossil Wiki 集成问题

**问题 1: 语法未被识别**

**错误示例**:

```
<verbatim>
box "Hello"
</verbatim>
```

**解决方案**: 添加 `type="pikchr"`

```
<verbatim type="pikchr">
box "Hello"
</verbatim>
```

---

**问题 2: toggle 参数不工作**

**症状**: 点击图表不能切换到源码

**原因**: Fossil 版本过旧

**解决方案**:

```bash
# 更新 Fossil
fossil update

# 或使用新语法
<verbatim type="pikchr" toggle>
box "Hello"
</verbatim>
```

---

### 2.3 Web 集成性能问题

**问题**: 在网页中渲染大量 Pikchr 图表导致页面卡顿

**场景**:

```html
<!-- 页面中有 50+ 个 pikchr 代码块 -->
<code class="language-pikchr">box "A"</code>
<code class="language-pikchr">circle "B"</code>
<!-- ... 更多 ... -->
```

**优化策略**:

**策略 1: 懒加载**

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const code = entry.target;
      code.innerHTML = pikchr(code.textContent);
      observer.unobserve(code);
    }
  });
});

document.querySelectorAll("code.language-pikchr").forEach((el) => {
  observer.observe(el);
});
```

**策略 2: Web Worker**

```javascript
// worker.js
importScripts("pikchr.js");
self.onmessage = (e) => {
  self.postMessage(pikchr(e.data));
};

// main.js
const worker = new Worker("worker.js");
worker.postMessage(pikchrCode);
worker.onmessage = (e) => {
  element.innerHTML = e.data;
};
```

**策略 3: 服务端预渲染**

```bash
# 构建时渲染
node render-pikchr.js docs/ > rendered.html
```

---

## 3. C/C++ 集成问题

### 3.1 编译错误

**问题**: `pikchr.c` 编译失败

**常见错误**:

```
error: implicit declaration of function 'malloc'
```

**解决方案**:

```c
// 确保包含必要的头文件
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "pikchr.h"
```

---

### 3.2 内存管理问题

**问题**: 内存泄漏或 double free

**错误代码**:

```c
char *svg1 = pikchr("box", NULL, 0, NULL, NULL);
char *svg2 = pikchr("circle", NULL, 0, NULL, NULL);
// ❌ 忘记释放 svg1
pikchr_free(svg2);
```

**正确做法**:

```c
char *svg = pikchr("box; circle", NULL, 0, NULL, NULL);
if (svg[0] != '<') {
  // svg 包含错误信息
  fprintf(stderr, "Error: %s\\n", svg);
} else {
  printf("%s", svg);
}
pikchr_free(svg);  // 总是释放
```

---

### 3.3 多线程问题

**问题**: 在多线程环境中调用 Pikchr 导致崩溃

**原因**: Pikchr 使用全局状态，非线程安全

**解决方案**:

```c
#include <pthread.h>

pthread_mutex_t pikchr_mutex = PTHREAD_MUTEX_INITIALIZER;

void* render_thread(void* arg) {
  pthread_mutex_lock(&pikchr_mutex);
  char *svg = pikchr((char*)arg, NULL, 0, NULL, NULL);
  // 处理 svg
  pikchr_free(svg);
  pthread_mutex_unlock(&pikchr_mutex);
  return NULL;
}
```

---

## 4. Python/其他语言集成

### 4.1 ctypes 使用问题

**问题**: Python ctypes 调用失败

**错误代码**:

```python
import ctypes
lib = ctypes.CDLL('./pikchr.so')
svg = lib.pikchr(b"box")  # ❌ 参数不完整
```

**正确代码**:

```python
import ctypes

# 加载库
lib = ctypes.CDLL('./pikchr.so')

# 设置函数签名
lib.pikchr.argtypes = [
    ctypes.c_char_p,  # zText
    ctypes.c_char_p,  # zClass
    ctypes.c_uint,    # mFlags
    ctypes.POINTER(ctypes.c_int),  # pnWidth
    ctypes.POINTER(ctypes.c_int)   # pnHeight
]
lib.pikchr.restype = ctypes.c_char_p
lib.pikchr_free.argtypes = [ctypes.c_char_p]

# 调用
svg = lib.pikchr(b"box", None, 0, None, None)
print(svg.decode('utf-8'))
lib.pikchr_free(svg)  # 重要: 释放内存
```

---

### 4.2 WASM 集成问题

**问题**: Emscripten 编译 Pikchr 到 WASM 失败

**解决方案**:

```bash
# 使用特定编译选项
emcc pikchr.c -o pikchr.js \\
  -s EXPORTED_FUNCTIONS='["_pikchr", "_pikchr_free"]' \\
  -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]' \\
  -s ALLOW_MEMORY_GROWTH=1 \\
  -O3
```

**JavaScript 调用**:

```javascript
const pikchr_c = Module.cwrap("pikchr", "string", [
  "string",
  "string",
  "number",
  "number",
  "number",
]);

const svg = pikchr_c("box", null, 0, 0, 0);
console.log(svg);
```

---

## 5. 已知 Bug 和 Workarounds

### 5.1 超长文本截断

**问题**: 非常长的文本标签被截断

**Bug Tracker**: https://fossil-scm.org/forum (搜索 "pikchr text truncation")

**Workaround**:

```pikchr
# 方案 1: 分行
box "Very long" "text that" "was truncated"

# 方案 2: 增加宽度
box "Very long text" fit width 150%

# 方案 3: 使用容器
[
  text "Very long text"
] with .w at ...
```

---

### 5.2 弧线端点对齐问题

**问题**: `arc` 的起点/终点与预期不符

**示例**:

```pikchr
arc from B1.e to B1.n cw
# 弧线位置可能不准确
```

**Workaround**:

```pikchr
# 使用 spline 代替
spline from B1.e \\
  go up 0.5cm heading 45 \\
  then heading 135 \\
  to B1.n
```

---

### 5.3 fit 在嵌套容器中失效

**问题**: 容器内的 `fit` 不工作

**示例**:

```pikchr
[
  box "Text" fit  # ❌ 可能不准确
]
```

**Workaround**:

```pikchr
# 先在外部测试 fit
# box "Text" fit  # 查看宽度

# 然后在容器内手动指定
[
  box "Text" width 1.5cm  # 手动宽度
]
```

---

## 6. 性能和限制

### 6.1 对象数量限制

**事实**: Pikchr 没有硬性对象限制，但实践中:

- **< 100 对象**: 流畅
- **100-500 对象**: 可接受
- **> 500 对象**: 可能慢

**优化建议**:

```pikchr
# 使用宏减少重复
define component {
  [box "$1"; circle]
}

component("A")
component("B")
# 比手写 100 次快
```

---

### 6.2 SVG 输出大小

**问题**: 复杂图表生成的 SVG 文件很大

**测量**:

```bash
pikchr < complex.pikchr | wc -c
# 可能输出 100KB+
```

**优化**:

```pikchr
# 1. 减少不必要的样式
# 避免: fill 0x123456 color 0xABCDEF
# 使用: fill lightblue

# 2. 复用对象属性
boxstyle = fill lightblue color navy
box same as boxstyle

# 3. 简化文本
box "简短"
# 而不是 "很长的描述文本"
```

---

## 7. 文档和学习资源

### 7.1 官方资源

- **用户手册**: https://pikchr.org/home/doc/trunk/doc/userman.md
- **语法规范**: https://pikchr.org/home/doc/trunk/doc/grammar.md
- **与 PIC 的差异**: https://pikchr.org/home/doc/trunk/doc/differences.md
- **SQLite 用例**: https://pikchr.org/home/doc/trunk/doc/sqlitesyntax.md

### 7.2 第三方教程

- **Kernighan 的 PIC 论文**: https://pikchr.org/home/uv/pic.pdf (经典参考)
- **DPIC 文档**: https://pikchr.org/home/uv/dpic-doc.pdf
- **Fossil 文档**: https://fossil-scm.org/home/doc/tip/www/pikchr.md

### 7.3 示例库

- **Pikchr Show**: https://pikchr.org/home/pikchrshow (交互式编辑器)
- **SQLite 语法图**: https://sqlite.org/lang.html (实际应用)
- **Fossil 论坛**: https://fossil-scm.org/forum (社区示例)

---

## 8. 社区支持

### 8.1 报告 Bug

**在哪里报告**:

- **Fossil 论坛**: https://fossil-scm.org/forum
- **邮件列表**: fossil-users@lists.fossil-scm.org

**报告模板**:

````
标题: [Pikchr] 简短描述

环境:
- Pikchr 版本: [如果知道]
- 集成方式: [Fossil/C/Python/Web]
- 操作系统: [Linux/macOS/Windows]

问题描述:
[详细描述问题]

最小可复现示例:
```pikchr
[最简代码]
````

预期行为:
[应该怎样]

实际行为:
[实际怎样]

附加信息:
[错误信息、截图等]

```

---

### 8.2 功能请求

**流程**:
1. 搜索论坛/邮件列表是否已有讨论
2. 描述用例 (why, not just what)
3. 提供示例语法建议
4. 考虑向后兼容性

**示例**:
```

标题: Feature Request - 支持渐变填充

用例:
我需要绘制数据可视化图表，渐变填充可以
更好地表达数值范围。

建议语法:
box fill gradient(lightblue, darkblue, vertical)

影响:

- 需要扩展 SVG 输出
- 可能与现有 fill 语法冲突
- 建议作为可选特性

```

---

### 8.3 贡献代码

**Pikchr 特点**:
- 单文件实现 (~8000 行 C)
- 零依赖
- 高度优化的解析器

**贡献途径**:
1. **改进文档**: 提交到 Fossil 仓库
2. **测试用例**: 提供边界情况
3. **工具/集成**: 独立项目 (Python 库、VS Code 插件等)

**注意**: Pikchr 核心由 D. Richard Hipp 维护，大型功能改动需讨论

---

## 9. 替代方案和互补工具

### 9.1 类似工具对比

| 工具 | 优势 | 劣势 |
|------|------|------|
| **Pikchr** | 零依赖、简单、Fossil 集成 | 仅 SVG 输出、有限功能 |
| **PlantUML** | 功能丰富、多图表类型 | 需要 Java、复杂 |
| **Graphviz** | 强大的布局算法 | 语法复杂、学习曲线陡 |
| **Mermaid** | Web 友好、Markdown 集成好 | 依赖 JavaScript |
| **D2** | 现代语法、美观输出 | 相对新、生态小 |

---

### 9.2 工具链建议

**文档工作流**:
```

Pikchr (简单图表)
↓
Fossil/Markdown
↓
SVG 输出
↓
(可选) ImageMagick → PNG

```

**复杂图表工作流**:
```

设计阶段: Pikchr (快速原型)
↓
生产阶段: PlantUML/Graphviz (精细化)
↓
发布: 转换为 SVG/PNG

```

---

## 10. 未来发展

### 10.1 Roadmap (非官方观察)

**可能增强**:
- 更好的文本度量
- 更多输出格式 (通过插件)
- 改进的错误信息
- 性能优化

**不太可能**:
- 完全 PIC 兼容 (设计理念不同)
- 复杂动画 (静态图表工具)
- 3D 图形 (超出范围)

---

### 10.2 社区项目

**已有项目**:
- **pikchr-wasm**: WebAssembly 封装
- **vscode-pikchr**: VS Code 扩展 (非官方)
- **pandoc-pikchr**: Pandoc filter
- **pikchr-cli**: 命令行工具

**潜在项目**:
- PyPI 包 (官方 Python 绑定)
- React/Vue 组件
- GitHub Action (自动渲染)
- 在线编辑器改进

---

## 11. 案例研究

### 11.1 SQLite 语法图

**背景**: SQLite 使用 Pikchr 生成所有语法图

**挑战**:
- 复杂的语法规则
- 需要一致的视觉风格
- 自动化生成

**解决方案**:
- 自定义宏库
- 自动化脚本生成 Pikchr
- 集成到构建流程

**参考**: https://sqlite.org/lang.html

---

### 11.2 Fossil 项目文档

**背景**: Fossil SCM 自身的文档使用 Pikchr

**优势**:
- 零外部依赖
- Markdown 原生支持
- 版本控制友好 (文本格式)

**最佳实践**:
- 简洁的图表 (避免复杂性)
- 使用标签引用
- 容器组织复杂图表

---

## 12. 总结：常见陷阱

### Top 10 常见错误

1. **忘记续行符** - 多行语句必须用 `\`
2. **单位混淆** - 默认是英寸，不是厘米
3. **前向引用** - 先定义后使用
4. **文本属性顺序** - 文本在前，属性在后
5. **标签大小写** - 标签大写开头，变量小写
6. **fit 过度依赖** - 不准确时手动调整
7. **中文字符宽度** - 需调整 `charwid`
8. **内存泄漏** - C 集成时记得 `pikchr_free`
9. **SVG 兼容性** - 测试不同浏览器
10. **复杂度控制** - 超简保持简单

---

## 获取帮助

**渠道优先级**:
1. **官方文档** - 先查文档
2. **Fossil 论坛** - 最活跃
3. **邮件列表** - 深度讨论
4. **GitHub 镜像** - 代码相关

**联系方式**:
- **论坛**: https://fossil-scm.org/forum
- **邮件**: fossil-users@lists.fossil-scm.org
- **Twitter**: @fossil_scm (官方账号)
```
