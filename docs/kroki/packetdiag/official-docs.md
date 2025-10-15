# PacketDiag 官方文档

## 概述

PacketDiag 是 BlockDiag 包家族的一部分，专门用于生成网络数据包头部结构图。它通过简单的文本描述生成标准的数据包结构可视化图表，广泛应用于网络协议文档和技术规范。

## 官方资源

- **官方网站**: http://blockdiag.com/en/nwdiag/packetdiag-examples.html
- **GitHub 仓库**: https://github.com/blockdiag/nwdiag
- **Python 包**: nwdiag (包含 packetdiag)
- **许可证**: Apache License 2.0

## 基本语法

### 基础结构

```
packetdiag {
  colwidth = 32          // 列宽（位数）
  node_height = 72       // 节点高度（像素）

  0-15: Field Name       // 字段定义：位范围 : 字段名
}
```

### 核心语法元素

#### 1. 全局配置

- `colwidth`: 定义列宽度（通常为 8, 16, 32）
- `node_height`: 节点高度（像素）

#### 2. 字段定义格式

```
起始位-结束位: 字段名 [属性]
```

**示例**:

```
0-15: Source Port               // 单行字段
16-31: Destination Port
32-63: Sequence Number          // 跨多列
```

#### 3. 字段属性

- `rotate = 270`: 文本旋转 270 度（垂直显示）
- `colheight = N`: 字段跨越 N 行高度

**示例**:

```
106: URG [rotate = 270]         // 垂直文本
192-223: data [colheight = 3]   // 3 行高度
```

## TCP 头部结构示例

```
packetdiag {
  colwidth = 32
  node_height = 72

  0-15: Source Port
  16-31: Destination Port
  32-63: Sequence Number
  64-95: Acknowledgment Number
  96-99: Data Offset
  100-105: Reserved
  106: URG [rotate = 270]
  107: ACK [rotate = 270]
  108: PSH [rotate = 270]
  109: RST [rotate = 270]
  110: SYN [rotate = 270]
  111: FIN [rotate = 270]
  112-127: Window
  128-143: Checksum
  144-159: Urgent Pointer
  160-191: (Options and Padding)
  192-223: data [colheight = 3]
}
```

## 位范围规则

### 标准位宽

- **8-bit** 字段: `0-7`, `8-15`, `16-23`
- **16-bit** 字段: `0-15`, `16-31`, `32-47`
- **32-bit** 字段: `0-31`, `32-63`, `64-95`

### 位编号规则

- 位编号从 **0** 开始
- 按照网络字节序（大端序）排列
- 位范围必须连续且不重叠

## 使用场景

1. **网络协议文档**: TCP/IP、UDP、ICMP 等协议头部
2. **数据帧结构**: 以太网帧、WiFi 帧等
3. **自定义协议**: 应用层协议头部设计
4. **技术规范**: RFC 文档中的包结构图

## 与其他工具集成

### Kroki 集成

PacketDiag 已集成到 Kroki 服务中：

```
https://kroki.io/packetdiag/svg/...
```

### Asciidoctor 集成

```asciidoc
[packetdiag]
----
packetdiag {
  0-15: Field1
  16-31: Field2
}
----
```

### Sphinx 集成

```rst
.. packetdiag::

   packetdiag {
     0-15: Field1
   }
```

## 输出格式

- **PNG**: 栅格图像（默认）
- **SVG**: 矢量图形（推荐）
- **PDF**: 文档嵌入

## 命令行使用

```bash
# 安装
pip install nwdiag

# 生成 PNG
packetdiag diagram.diag

# 生成 SVG
packetdiag -T svg diagram.diag -o output.svg

# 指定字体
packetdiag --font=/path/to/font.ttf diagram.diag
```

## 最佳实践

1. **使用标准位宽**: 优先使用 8/16/32 位对齐
2. **清晰命名**: 字段名简洁明了
3. **合理旋转**: 单比特标志位使用 rotate 节省空间
4. **分组显示**: 使用 colheight 合并相关字段
5. **注释说明**: 使用括号标注可选字段

## 参考文档

- [BlockDiag 官方文档](http://blockdiag.com/en/)
- [NwDiag 包文档](http://blockdiag.com/en/nwdiag/)
- [Asciidoctor Diagram 扩展](https://docs.asciidoctor.org/diagram-extension/latest/diagram_types/nwdiag/)
