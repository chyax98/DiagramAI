# Erd 官方文档

## 项目概述

**Erd** (Entity Relationship Diagram) 是由 BurntSushi 开发的工具，用于将纯文本描述的关系数据库架构转换为图形化的实体关系图。

- **官方仓库**: https://github.com/BurntSushi/erd
- **开发语言**: Haskell
- **许可证**: Unlicense (公有领域)
- **Stars**: 1.8k+
- **支持格式**: pdf, svg, eps, png, jpg, plain text, dot

## 核心特性

### 1. 简洁的文本语法
- 实体声明使用 `[实体名]`
- 属性直接列在实体下方
- 主键使用 `*` 前缀
- 外键使用 `+` 前缀
- 关系使用基数符号连接

### 2. 多种输出格式
使用 GraphViz 作为渲染引擎，支持：
- PDF、SVG、EPS (矢量格式)
- PNG、JPG (位图格式)
- Plain text、DOT (中间格式)

### 3. 丰富的自定义选项
- 颜色配置 (实体、属性、关系)
- 字体样式 (大小、字体族)
- 边框样式
- 标签和注释

## 基本语法

### 实体定义

```erd
# 基本实体
[Person]
name
height

# 带主键的实体
[Person]
*name
+birth_place_id

# 带类型标签的实体
[Person] {bgcolor: "#ececfc", size: "20"}
*person_id {label: "varchar, not null"}
full_name {label: "varchar, null"}
```

### 关系定义

**基数符号**:
- `?` - 0 或 1
- `1` - 恰好 1
- `*` - 0 或多个
- `+` - 1 或多个

**关系语法**:
```erd
# Person 有恰好一个 Birth Place
Person *--1 `Birth Place`

# Artist 可能有白金专辑，白金专辑必有 Artist
Artist +--? PlatinumAlbums

# 双向关系
game 1--* drive
```

### 实体和属性名称

**支持特殊字符**:
- 使用反引号: `` `Birth Place` ``
- 使用单引号: `'birth state'`
- 使用双引号: `"birth country"`

### 全局指令

必须放在文件开头:

```erd
# 标题配置
title {label: "My ER Diagram", size: "20"}

# 全局实体样式
entity {bgcolor: "#d0e0d0", size: "16"}

# 全局头部样式
header {bgcolor: "#ffffff", color: "#000000"}

# 全局关系样式
relationship {color: "#333333"}
```

## 格式化选项

### 实体格式化

```erd
[Player] {bgcolor: "#d0e0d0"}
*player_id {label: "varchar, not null"}
full_name {label: "varchar, null"}
team {label: "varchar, not null"}
```

### 属性格式化

支持的属性:
- `label` - 显示在方括号中的标签文本
- `color` - 字体颜色 (十六进制或颜色名)
- `bgcolor` - 背景色
- `size` - 字体大小
- `font` - 字体 (Times-Roman, Helvetica, Courier)
- `border-color` - 边框颜色
- `border` - 边框宽度 (像素)

### 关系格式化

```erd
game *--1 team {label: "home"}
game *--1 team {label: "away"}
```

## 配置文件

### ~/.erd.yaml

使用 `-c` 或 `--config` 参数:

```bash
# 使用默认配置文件
erd -c -i ./schema.er -o ./diagram.pdf

# 使用自定义配置
erd -c ./myconfig.yaml -i ./schema.er -o ./diagram.pdf

# 生成默认配置模板
erd -c > ~/.erd.yaml
```

配置文件支持:
- 全局颜色方案
- 默认字体设置
- 边框样式
- 布局选项

## 命令行选项

| 短选项 | 长选项 | 说明 |
|--------|--------|------|
| `-i FILE` | `--input=FILE` | 输入文件 (默认 stdin) |
| `-o FILE` | `--output=FILE` | 输出文件 (默认 stdout) |
| `-f FMT` | `--fmt=FMT` | 强制输出格式 |
| `-e EDGE` | `--edge=EDGE` | 边类型: compound, noedge, ortho, poly, spline |
| `-d` | `--dot-entity` | 使用 DOT 表格而非 HTML 表格 |
| `-p PATTERN` | `--edge-pattern=PATTERN` | 边样式: dashed, dotted, solid |
| `-n NOTATION` | `--notation=NOTATION` | 基数符号: ie, uml |
| `-c [FILE]` | `--config[=FILE]` | 配置文件 |

## 完整示例

```erd
# nfldb ER 图示例
title {label: "nfldb Entity-Relationship diagram", size: "20"}

entity {bgcolor: "#ececfc"}

[player] {bgcolor: "#d0e0d0"}
*player_id {label: "varchar, not null"}
full_name {label: "varchar, null"}
team {label: "varchar, not null"}
position {label: "player_pos, not null"}

[team] {bgcolor: "#d0e0d0"}
*team_id {label: "varchar, not null"}
city {label: "varchar, not null"}
name {label: "varchar, not null"}

[game] {bgcolor: "#ececfc"}
*gsis_id {label: "gameid, not null"}
start_time {label: "utctime, not null"}
week {label: "usmallint, not null"}
season_year {label: "usmallint, not null"}
home_team {label: "varchar, not null"}
away_team {label: "varchar, not null"}

# 关系
player *--1 team
game *--1 team {label: "home"}
game *--1 team {label: "away"}
```

## 安装方法

### MacPorts
```bash
port install erd
```

### Docker
```bash
docker run -i ghcr.io/burntsushi/erd:latest < schema.er > output.pdf
```

### Stack (Haskell)
```bash
git clone https://github.com/BurntSushi/erd
cd erd
stack install
```

### Cabal
```bash
cabal new-install erd
```

## 与其他工具比较

Erd 的文件格式受 [Erwiz](https://github.com/slopjong/Erwiz) 启发，但更加轻量级。

**类似工具**:
- **Mermaid** (JavaScript) - 支持 ER 图语法
- **PlantUML** (Java) - 支持 IE 图语法
- **dbdiagram.io** (Web) - 在线 ER 图工具
- **QuickDBD** (Web) - 快速数据库图表

## 文本编辑器支持

- **Vim**: [er.vim](https://github.com/flniu/er.vim) 语法高亮
- **VS Code**:
  - [erd preview](https://github.com/kaishuu0123/vscode-erd) 预览插件
  - [syntax highlighting](https://github.com/mikkel-ol/vsc-er-syntax-highlighting) 语法高亮

## GraphViz 依赖

Erd 需要 GraphViz 支持文本格式化:

### macOS 注意事项
对于粗体和斜体支持，需要 Pango 支持:

```bash
brew install graphviz
```

验证 Pango 支持:
```bash
dot -v | grep pango
```

参考: [GraphViz Issue 1636](https://gitlab.com/graphviz/graphviz/issues/1636)

## 最佳实践

1. **使用全局指令** - 在文件开头定义全局样式
2. **一致的命名** - 使用清晰的实体和属性名
3. **适当的标签** - 为关系添加说明性标签
4. **颜色编码** - 用颜色区分不同类型的实体
5. **类型注释** - 在 label 中包含数据类型信息

## 参考资源

- **GitHub**: https://github.com/BurntSushi/erd
- **示例库**: https://github.com/BurntSushi/erd/tree/master/examples
- **Changelog**: https://github.com/BurntSushi/erd/blob/master/changelog.md
- **Hackage**: https://hackage.haskell.org/package/erd
