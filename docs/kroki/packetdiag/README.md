# PacketDiag 文档集合

PacketDiag 是 BlockDiag 包家族的一部分，专门用于生成网络数据包头部结构图。本目录包含完整的 PacketDiag 官方文档、语法规则、常见错误及社区问题解决方案。

## 📚 文档列表

### 1. [官方文档](./official-docs.md)

- 基本概念和语法
- 核心功能介绍
- TCP/IP 协议头部示例
- 命令行使用指南
- 与 Kroki、Asciidoctor 集成

### 2. [语法规则详解](./syntax-rules.md)

- 完整语法结构
- 位范围定义规则
- 字段属性详解
- 高级语法特性
- 语法检查清单

### 3. [常见错误及解决方案](./common-errors.md)

- 语法错误处理
- 位范围冲突解决
- 属性配置问题
- 渲染错误修复
- 调试技巧和工具

### 4. [社区问题与案例](./community-issues.md)

- GitHub Issues 精选
- Stack Overflow 热门问题
- Reddit 讨论摘要
- 实际应用案例
- 自动化工具和脚本

## 🚀 快速开始

### 安装

```bash
pip install nwdiag
```

### 基础示例

```
packetdiag {
  colwidth = 32
  node_height = 72

  0-15: Source Port
  16-31: Destination Port
  32-63: Sequence Number
}
```

### 生成图表

```bash
# 生成 SVG
packetdiag -T svg packet.diag -o packet.svg

# 生成 PNG
packetdiag packet.diag
```

## 📊 文档统计

- **总行数**: 1,293 行
- **官方文档**: 171 行
- **语法规则**: 262 行
- **常见错误**: 428 行
- **社区问题**: 432 行

## 🔗 相关资源

- [BlockDiag 官方网站](http://blockdiag.com/en/)
- [GitHub 仓库](https://github.com/blockdiag/nwdiag)
- [Kroki 集成](https://kroki.io/)
- [Asciidoctor Diagram](https://docs.asciidoctor.org/diagram-extension/latest/diagram_types/nwdiag/)

## 📝 适用场景

- 网络协议文档（TCP、UDP、ICMP）
- RFC 规范图表
- 数据帧结构说明
- 自定义协议设计
- 技术培训材料

---

**最后更新**: 2025-10-13
**维护**: DiagramAI 文档团队
