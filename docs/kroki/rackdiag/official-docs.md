# RackDiag 官方文档

## 概述

RackDiag 是 BlockDiag 包家族的一部分，专门用于生成机架服务器结构图。它通过简单的文本描述生成标准的机架布局可视化图表，广泛应用于数据中心规划、服务器部署文档和 IT 基础设施管理。

## 官方资源

- **官方网站**: http://blockdiag.com/en/nwdiag/rackdiag-examples.html
- **GitHub 仓库**: https://github.com/blockdiag/nwdiag
- **Python 包**: nwdiag (包含 rackdiag)
- **许可证**: Apache License 2.0

## 基本语法

### 基础结构

```
rackdiag {
  // 机架配置
  16U;                    // 机架高度（U 为单位）

  // 设备定义
  1: UPS [2U];           // 位置: 设备名 [高度]
  3: DB Server
  4: Web Server
}
```

### 核心概念

#### 1. 机架单元 (U)
- **1U** = 1.75 英寸 (44.45mm) 高度
- 标准机架高度: 42U, 48U
- 常见尺寸: 12U, 16U, 24U, 42U

#### 2. 设备定位
- **位置编号**: 从底部或顶部开始（可配置）
- **默认高度**: 1U（如不指定）
- **跨多位置**: 使用 `[NU]` 指定高度

## 语法元素

### 1. 机架高度定义

```
rackdiag {
  12U;    // 12U 机架
  16U;    // 16U 机架
  42U;    // 42U 机架（标准）
  48U;    // 48U 机架
}
```

### 2. 设备定义格式

```
位置: 设备名 [属性]
```

**示例**:
```
1: UPS [2U];              // 1-2U 位置，UPS，占 2U
3: DB Server              // 3U 位置，数据库服务器，占 1U
4: Web Server [5kg]       // 4U 位置，重量 5kg
5: Switch [0.5A]          // 5U 位置，功耗 0.5A
```

### 3. 设备属性

#### 高度 ([NU])
```
1: Server [2U];           // 占用 2U 高度
```

#### 重量 ([Nkg])
```
3: Storage [10kg];        // 重量 10kg
```

#### 功耗 ([NA])
```
5: Switch [1.5A];         // 功耗 1.5A
```

### 4. 机架属性

#### 编号顺序
```
rackdiag {
  ascending;              // 从下到上递增（默认从上到下）
  16U;
  1: Server
}
```

#### 机架描述
```
rackdiag {
  12U;
  description = "Tokyo/1234 East";    // 机架位置描述
  1: UPS [2U];
}
```

## 完整示例

### 1. 简单机架图

```
rackdiag {
  // 定义机架高度
  16U;

  // 定义机架设备
  1: UPS [2U];
  3: DB Server
  4: Web Server
  5: Web Server
  6: Web Server
  7: Load Balancer
  8: L3 Switch
}
```

### 2. 带属性的机架图

```
rackdiag {
  // 编号方式：从下到上
  ascending;

  // 机架高度
  12U;

  // 机架描述
  description = "Tokyo/1234 East";

  // 设备列表
  1: UPS [2U];              // 高度 2U
  3: DB Server [5kg]        // 重量 5kg
  4: Web Server [0.5A]      // 功耗 0.5A
  5: Web Server
  6: Web Server
  7: Load Balancer
  8: L3 Switch
}
```

### 3. 同一位置多个设备

```
rackdiag {
  16U;

  1: UPS [2U];
  3: DB Server
  4: Web Server 1           // 同一层多个设备
  4: Web Server 2
  5: Web Server 3
  5: Web Server 4
  7: Load Balancer
  8: L3 Switch
}
```

### 4. 多个机架

```
rackdiag {
  // 第一个机架
  rack {
    16U;
    1: UPS [2U];
    3: DB Server
    4: Web Server
  }

  // 第二个机架
  rack {
    12U;
    1: UPS [2U];
    3: DB Server
    4: Web Server
  }
}
```

### 5. 标记不可用单元

```
rackdiag {
  12U;

  1: Server
  2: Server
  3: Server
  4: Server
  5: N/A [8U];              // 5-12U 标记为不可用
}
```

## 高级特性

### 1. 机架编号

**默认**: 从上到下递减（1 在顶部）
**ascending**: 从下到上递增（1 在底部）

```
// 默认编号（顶部为 1）
rackdiag {
  16U;
  1: Top Server
  16: Bottom Server
}

// 反向编号（底部为 1）
rackdiag {
  ascending;
  16U;
  1: Bottom Server
  16: Top Server
}
```

### 2. 空间规划

```
rackdiag {
  42U;

  // 电源区域（底部）
  1: PDU A [2U];
  3: PDU B [2U];

  // 网络区域
  5: Core Switch [2U];
  7: Access Switch

  // 计算区域
  10: Blade Server [10U];

  // 存储区域
  25: Storage Array [6U];

  // 预留空间
  35: Reserved [8U];
}
```

### 3. 设备分类标注

```
rackdiag {
  description = "Production Rack A1";
  42U;

  // 基础设施
  1: UPS [3U];
  4: PDU [1U];

  // 网络设备
  5: Firewall [2U];
  7: Core Switch [2U];
  9: Distribution Switch

  // 服务器
  10: App Server 1
  11: App Server 2
  12: App Server 3

  // 存储
  15: NAS [4U];
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
rackdiag diagram.diag

# 生成 SVG
rackdiag -T svg diagram.diag -o output.svg

# 指定字体
rackdiag --font=/path/to/font.ttf diagram.diag

# 指定输出大小
rackdiag --size=800x600 diagram.diag
```

## 使用场景

### 1. 数据中心规划

```
rackdiag {
  description = "DC-01-Rack-A1";
  42U;
  ascending;

  1: PDU [2U];
  3: Network Switch [2U];
  5: Compute Node 1 [4U];
  9: Compute Node 2 [4U];
  13: Storage [10U];
  25: Reserved [18U];
}
```

### 2. 容量规划

```
rackdiag {
  42U;

  // 已使用: 20U
  1: Server 1 [2U];
  3: Server 2 [2U];
  // ... 其他服务器

  // 可用空间: 22U
  21: Available [22U];
}
```

### 3. 迁移规划

```
rackdiag {
  description = "Migration Plan - Phase 1";
  42U;

  1: Existing Server A [2U];
  3: Existing Server B [2U];
  5: NEW: Server C [4U];      // 标记新增设备
  9: To Remove: Old Switch    // 标记待移除
}
```

## 与其他工具集成

### Kroki 集成

```
https://kroki.io/rackdiag/svg/...
```

### Asciidoctor 集成

```asciidoc
[rackdiag]
----
rackdiag {
  16U;
  1: UPS [2U];
}
----
```

### Markdown 集成 (Mermaid Live Editor)

虽然 RackDiag 不直接支持 Markdown，但可以通过图片嵌入:

```markdown
![Rack Diagram](output.svg)
```

## 最佳实践

1. **标准化命名**: 使用一致的设备命名规范
2. **容量规划**: 预留 20-30% 空间用于扩展
3. **电源冗余**: 底部配置 UPS/PDU
4. **网络设备**: 顶部或中部放置交换机
5. **热管理**: 考虑散热，避免高密度设备集中
6. **文档化**: 使用 description 标注机架位置
7. **版本控制**: 将 .diag 文件纳入版本管理

## 常见机架配置

### 标准服务器机架 (42U)

```
rackdiag {
  description = "Standard Server Rack";
  42U;
  ascending;

  // 电源配置（底部）
  1: UPS [3U];
  4: PDU A [1U];
  5: PDU B [1U];

  // 网络配置（顶部）
  40: Core Switch [2U];
  42: Patch Panel

  // 计算资源（中部）
  10: Server 1 [2U];
  12: Server 2 [2U];
  // ...
}
```

### 小型边缘机架 (12U)

```
rackdiag {
  description = "Edge Computing Rack";
  12U;

  1: UPS [2U];
  3: Edge Switch
  4: Edge Server 1
  5: Edge Server 2
  6: Storage [2U];
}
```

## 参考资源

- [BlockDiag 官方文档](http://blockdiag.com/en/)
- [RackDiag 示例集](http://blockdiag.com/en/nwdiag/rackdiag-examples.html)
- [数据中心标准](https://www.tia-942.org/)
- [Asciidoctor Diagram 扩展](https://docs.asciidoctor.org/diagram-extension/latest/diagram_types/nwdiag/)
