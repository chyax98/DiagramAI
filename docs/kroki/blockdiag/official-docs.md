# BlockDiag 官方文档

## 概述

**BlockDiag** 是一个用 Python 编写的简单块状图生成工具,可以从类似 Graphviz DOT 格式的文本生成块状图图像。

## 官方资源

- **主页**: http://blockdiag.com/
- **文档**: http://blockdiag.com/en/blockdiag/
- **PyPI**: https://pypi.org/project/blockdiag/
- **许可证**: Apache License 2.0

## BlockDiag 家族

BlockDiag 是一个图表工具家族的核心:

1. **blockdiag** - 块状图生成器
2. **seqdiag** - 时序图生成器
3. **actdiag** - 活动图生成器
4. **nwdiag** - 网络拓扑图生成器
5. **rackdiag** - 机架图生成器
6. **packetdiag** - 网络数据包图生成器

## 核心功能

### 1. 简单文本格式

使用类似 DOT 的语法定义图表:

```blockdiag
blockdiag {
   A -> B -> C -> D;
   A -> E -> F -> G;
}
```

### 2. 支持的输出格式

- **PNG** (默认,位图格式)
- **SVG** (矢量格式,使用 `-T svg`)
- **PDF** (需要额外依赖,使用 `-T pdf`)

### 3. 多语言支持

- 支持 UTF-8 编码的多字节字符
- 中文、日文、韩文等均可正常显示
- 需要配置 TrueType 字体

## 安装

### 基本安装

```bash
# 使用 pip
pip install blockdiag

# 使用 easy_install
easy_install blockdiag
```

### PDF 支持

```bash
# 安装 PDF 依赖
pip install "blockdiag[pdf]"
```

### 系统要求

- **Python**: 2.6, 2.7, 3.2, 3.3 或更高版本
- **Pillow**: 2.2.1 或更高版本
- **funcparserlib**: 0.3.6 或更高版本
- **setuptools** 或 **distribute**

## 命令行用法

### 基本命令

```bash
# 生成 PNG (默认)
blockdiag simple.diag

# 生成 SVG
blockdiag -T svg simple.diag

# 生成 PDF
blockdiag -T pdf simple.diag

# 指定输出文件名
blockdiag simple.diag -o output.png
```

### 常用选项

```bash
# 抗锯齿 (默认启用)
blockdiag --antialias simple.diag

# 关闭抗锯齿
blockdiag --no-antialias simple.diag

# 设置字体
blockdiag --font=/path/to/font.ttf simple.diag

# 指定输出格式
blockdiag -T svg simple.diag
blockdiag -T pdf simple.diag

# 详细输出
blockdiag -v simple.diag

# 调试模式
blockdiag --debug simple.diag
```

## 基本语法

### 1. 节点定义

#### 简单节点

```blockdiag
blockdiag {
   A;
   B;
   C;
}
```

#### 带标签的节点

```blockdiag
blockdiag {
   A [label = "Node A"];
   B [label = "Node B"];
   C [label = "Node C"];
}
```

### 2. 边(连接)定义

#### 基本连接

```blockdiag
blockdiag {
   A -> B;
   B -> C;
}
```

#### 链式连接

```blockdiag
blockdiag {
   A -> B -> C -> D;
}
```

#### 分支连接 (v0.7.5+)

```blockdiag
blockdiag {
   // 分支到多个子节点
   A -> B, C;

   // 从多个父节点分支
   D, E -> F;
}
```

### 3. 边的方向

```blockdiag
blockdiag {
   A -> B;    // 右箭头
   B <- C;    // 左箭头
   C -- D;    // 无箭头
   D <-> E;   // 双向箭头
}
```

### 4. 边折叠 (v0.6.1+)

```blockdiag
blockdiag {
   A -> B -> C -> D -> E;

   // 在 C 到 D 处折叠 (D 将布局在顶层左侧)
   C -> D [folded];
}
```

## 节点属性

### 1. 标签属性 (v0.9.2+)

```blockdiag
blockdiag {
   A [label = "Custom Label"];
   B [label = "Node B", textcolor = "red"];
}
```

### 2. 形状属性

#### 标准形状

```blockdiag
blockdiag {
   box [shape = box];              // 矩形 (默认)
   square [shape = square];        // 正方形 (v1.1.0+)
   roundedbox [shape = roundedbox];// 圆角矩形
   dots [shape = dots];            // 点状 (v0.8.2+)

   circle [shape = circle];        // 圆形 (v1.1.0+)
   ellipse [shape = ellipse];      // 椭圆
   diamond [shape = diamond];      // 菱形
   minidiamond [shape = minidiamond]; // 小菱形

   note [shape = note];            // 便签
   mail [shape = mail];            // 邮件
   cloud [shape = cloud];          // 云
   actor [shape = actor];          // 角色 (v0.6.6+)

   beginpoint [shape = beginpoint];// 起点
   endpoint [shape = endpoint];    // 终点
}
```

#### 流程图形状

```blockdiag
blockdiag {
   condition [shape = flowchart.condition];   // 条件判断
   database [shape = flowchart.database];     // 数据库
   terminator [shape = flowchart.terminator]; // 终止符
   input [shape = flowchart.input];           // 输入

   loopin [shape = flowchart.loopin];         // 循环入口
   loopout [shape = flowchart.loopout];       // 循环出口
}
```

### 3. 样式属性

#### 边框样式

```blockdiag
blockdiag {
   A [style = dotted];     // 点状边框
   B [style = dashed];     // 虚线边框
   C [style = "3,3,3,3,15,3"]; // 自定义虚线数组 (v0.9.6+)
}
```

#### 颜色属性

```blockdiag
blockdiag {
   A [color = pink];                          // 背景颜色
   B [color = "#888888"];                     // 十六进制颜色
   C [color = "#888888", textcolor = "#FFFFFF"]; // 背景 + 文本颜色
}
```

#### 编号徽章 (Numbered Badge)

```blockdiag
blockdiag {
   E [numbered = 99];  // 显示编号 99
}
```

#### 背景图片 (v0.9.0+)

```blockdiag
blockdiag {
   // 本地图片
   F [label = "", background = "_static/python-logo.gif"];

   // 网络图片
   G [label = "", background = "http://example.com/logo.gif"];
}
```

#### 图标 (v0.9.0+)

```blockdiag
blockdiag {
   H [icon = "_static/help-browser.png"];
   I [icon = "http://example.com/icon.png"];
}
```

#### 宽度和高度 (v0.9.5+)

```blockdiag
blockdiag {
   K [width = 192];   // 默认 128
   L [height = 64];   // 默认 40
}
```

#### 堆叠属性 (v0.8.2+)

```blockdiag
blockdiag {
   stacked [stacked];                      // 堆叠效果
   diamond [shape = "diamond", stacked];   // 堆叠菱形
   database [shape = "flowchart.database", stacked]; // 堆叠数据库
}
```

### 4. Dots 形状特殊用法 (v0.8.2+)

```blockdiag
blockdiag {
   A -> B, C, D;

   C [shape = "dots"];

   // 隐藏指向 dots 节点的边
   A -> C [style = "none"];
}
```

## 边(Edge)属性

### 1. 标签属性 (v0.9.2+)

```blockdiag
blockdiag {
   A -> B [label = "Edge Label"];
   B -> C [label = "Red Label", textcolor = "red"];
}
```

### 2. 样式属性

```blockdiag
blockdiag {
   A -> B [style = dotted];  // 点状线
   B -> C [style = dashed];  // 虚线
   C -> D [color = "red", style = "3,3,3,3,15,3"]; // 红色自定义虚线
}
```

### 3. 箭头方向

```blockdiag
blockdiag {
   E -> F [dir = none];     // 无箭头
   F -> G [dir = forward];  // 前向箭头
   G -> H [dir = back];     // 后向箭头
   H -> I [dir = both];     // 双向箭头
}
```

### 4. 粗线 (Thick)

```blockdiag
blockdiag {
   J -> K [thick];  // 使用粗线
}
```

## 分组功能

### 1. 基本分组 (v0.5.3+)

```blockdiag
blockdiag {
   A -> B -> C -> D;

   // A 和 B 属于第一组
   group {
      A; B;
   }
}
```

### 2. 带标签的分组

```blockdiag
blockdiag {
   group second_group {
      label = "Second Group";  // 组标签
      color = "#77FF77";       // 背景颜色
      textcolor = "#FF0000";   // 文本颜色 (v0.9.2+)

      E -> F -> G;
   }
}
```

### 3. 嵌套分组 (v0.6+)

```blockdiag
blockdiag {
   group outer {
      label = "Outer Group";
      A -> B;

      group inner {
         label = "Inner Group";
         C -> D;
      }
   }
}
```

### 4. 组形状 (v1.0.1+)

```blockdiag
blockdiag {
   group {
      label = "Line Group";
      shape = line;        // 线型组 (默认 box)
      style = dashed;      // 虚线样式 (仅对 line 组有效)

      H -> I;
   }
}
```

### 5. 节点分组定义 (v0.7.5+)

```blockdiag
blockdiag {
   group second_group {
      E -> F;
   }

   // J 也属于 second_group
   J [group = second_group];
}
```

## 图表级属性

### 1. 节点尺寸

```blockdiag
blockdiag {
   node_width = 200;   // 默认 128
   node_height = 100;  // 默认 40

   A -> B -> C;
}
```

### 2. 间距设置

```blockdiag
blockdiag {
   span_width = 240;   // 默认 64
   span_height = 120;  // 默认 40

   A -> B -> C;
}
```

### 3. 默认形状 (v0.7.2+)

```blockdiag
blockdiag {
   default_shape = roundedbox;  // 默认 box

   A -> B -> C;
}
```

### 4. 默认颜色

```blockdiag
blockdiag {
   default_node_color = lightblue;   // 节点颜色 (v0.9.1+)
   default_group_color = "#7777FF";  // 组颜色 (v0.9.1+)
   default_linecolor = blue;         // 线条颜色 (v1.0.0+)
   default_textcolor = red;          // 文本颜色 (v1.0.0+)

   A -> B -> C;
}
```

### 5. 字体大小 (v0.9.7+)

```blockdiag
blockdiag {
   default_fontsize = 20;  // 默认 11

   A -> B [label = "large"];
   B -> C [label = "small", fontsize = 11];  // 边标签字体

   A [fontsize = 32];  // 节点标签字体

   group {
      label = "group label";
      fontsize = 16;  // 组标签字体
      C;
   }
}
```

### 6. 方向设置

#### 纵向模式 (v0.7.0+)

```blockdiag
blockdiag {
   orientation = portrait;  // 纵向布局

   A -> B -> C;
        B -> D;
}
```

#### 纵向组 (v0.7.4+)

```blockdiag
blockdiag {
   A -> B -> C;

   group {
      orientation = portrait;  // 仅此组纵向

      C -> D -> E;
   }
}
```

## 类定义 (v0.9.7+)

### 定义和使用类

```blockdiag
blockdiag {
   // 定义类 (属性列表)
   class emphasis [color = pink, style = dashed];
   class redline [color = red, style = dotted];

   A -> B -> C;

   // 为节点设置类
   A [class = "emphasis"];

   // 为边设置类
   A -> B [class = "redline"];
}
```

## 字体配置

### 1. 命令行指定

```bash
blockdiag --font=/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf diagram.diag
```

### 2. 配置文件

创建 `$HOME/.blockdiagrc`:

```ini
[blockdiag]
fontpath = /usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf
```

### 3. 多语言字体

#### Linux (中文)

```bash
blockdiag --font=/usr/share/fonts/truetype/wqy-microhei.ttc diagram.diag
```

#### macOS (中文)

```bash
blockdiag --font=/System/Library/Fonts/PingFang.ttc diagram.diag
```

#### Windows (中文)

```bash
blockdiag --font=C:\Windows\Fonts\msyh.ttc diagram.diag
```

## Sphinx 集成

### 1. 安装扩展

```bash
pip install sphinxcontrib-blockdiag
```

### 2. 配置 `conf.py`

```python
extensions = ['sphinxcontrib.blockdiag']

# 字体配置
blockdiag_fontpath = '/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'

# HTML 输出格式 (png 或 svg)
blockdiag_html_image_format = 'SVG'

# LaTeX 输出格式
blockdiag_tex_image_depth = 'PNG'
```

### 3. 在文档中使用

```rst
.. blockdiag::

   blockdiag {
      A -> B -> C;
   }
```

#### 从文件包含

```rst
.. blockdiag:: diagram.diag
   :caption: System Architecture
   :align: center
```

#### 描述表格 (Description Table)

```rst
.. blockdiag::
   :desctable:

   blockdiag {
      A -> B -> C;
      A [description = "Entry point"];
      B [description = "Processing"];
      C [description = "Output"];
   }
```

## 实用示例

### 1. 管理系统流程

```blockdiag
blockdiag admin {
  index [label = "List of FOOs"];
  add [label = "Add FOO"];
  add_confirm [label = "Add FOO (confirm)"];
  edit [label = "Edit FOO"];
  edit_confirm [label = "Edit FOO (confirm)"];
  show [label = "Show FOO"];
  delete_confirm [label = "Delete FOO (confirm)"];

  index -> add  -> add_confirm  -> index;
  index -> edit -> edit_confirm -> index;
  index -> show -> index;
  index -> delete_confirm -> index;
}
```

### 2. 系统架构图

```blockdiag
blockdiag {
   // 前端层
   group frontend {
      label = "Frontend";
      color = "#E8F4F8";

      web [label = "Web UI"];
      mobile [label = "Mobile App"];
   }

   // 后端层
   group backend {
      label = "Backend Services";
      color = "#FFF4E6";

      api [label = "API Gateway"];
      auth [label = "Auth Service"];
      business [label = "Business Logic"];
   }

   // 数据层
   group data {
      label = "Data Layer";
      color = "#F3E5F5";

      db [label = "Database", shape = flowchart.database];
      cache [label = "Cache", shape = flowchart.database];
   }

   // 连接
   web, mobile -> api;
   api -> auth -> business;
   business -> db, cache;
}
```

### 3. 决策流程

```blockdiag
blockdiag {
   start [label = "Start", shape = beginpoint];
   input [label = "Input Data", shape = flowchart.input];
   validate [label = "Validate?", shape = flowchart.condition];
   process [label = "Process"];
   save [label = "Save to DB", shape = flowchart.database];
   end [label = "End", shape = endpoint];
   error [label = "Error", color = "#FFCCCC"];

   start -> input -> validate;
   validate -> process [label = "Valid"];
   validate -> error [label = "Invalid"];
   process -> save -> end;
   error -> end;
}
```

## 最佳实践

### 1. 命名约定

- 使用有意义的节点名
- 组名使用 snake_case
- 避免特殊字符

### 2. 布局技巧

- 合理使用分组组织结构
- 使用 `folded` 控制复杂布局
- 利用 `orientation` 调整方向

### 3. 样式一致性

- 定义类以保持样式统一
- 使用默认颜色设置主题
- 保持字体大小适中

### 4. 性能优化

- 避免过度嵌套分组
- 大图拆分为多个小图
- 使用 SVG 格式减小文件体积

## 常见用途

- ✅ 系统架构图
- ✅ 流程图和决策树
- ✅ 组织结构图
- ✅ 网络拓扑图 (配合 nwdiag)
- ✅ 数据流图
- ✅ 状态机图

## 参考资源

- [BlockDiag 官方文档](http://blockdiag.com/en/blockdiag/)
- [示例图库](http://blockdiag.com/en/blockdiag/examples.html)
- [Sphinx 集成文档](http://blockdiag.com/en/blockdiag/sphinxcontrib.html)
- [PyPI 页面](https://pypi.org/project/blockdiag/)
- [GitHub (非官方镜像)](https://github.com/blockdiag/blockdiag)
