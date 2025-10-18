# NwDiag 语法规则详解

> **文档目的**: 详细说明 NwDiag 的语法规则和最佳实践
> **最后更新**: 2025-01-13

---

## 📐 基本结构

### 1. 顶层结构

```nwdiag
nwdiag {
  // 所有内容必须在 nwdiag { } 块内
  network name {
    // 网络定义
  }
}
```

**规则**:

- ✅ 必须以 `nwdiag {` 开始,以 `}` 结束
- ✅ 内部可以包含网络定义、组定义、点对点连接
- ❌ 不能在 `nwdiag {}` 外定义网络元素

### 2. 注释

```nwdiag
nwdiag {
  // 单行注释

  /* 多行注释
     可以跨越多行 */

  network dmz {
    web01;  // 行尾注释
  }
}
```

**支持的注释方式**:

- `//` 单行注释
- `/* */` 多行注释

---

## 🌐 网络定义

### 基本语法

```nwdiag
network <network_name> {
  address = "<ip_range>";
  <node_name> [<attributes>];
  <node_name> [<attributes>];
}
```

### 网络属性

| 属性      | 类型    | 说明         | 示例                  |
| --------- | ------- | ------------ | --------------------- |
| `address` | string  | 网络地址范围 | `"192.168.1.0/24"`    |
| `color`   | color   | 背景颜色     | `"pink"`, `"#FF0000"` |
| `width`   | keyword | 网络宽度     | `full` (占满整行)     |

**示例**:

```nwdiag
nwdiag {
  network dmz {
    address = "210.x.x.x/24"
    color = "lightblue"
    width = full
  }
}
```

### 匿名网络

```nwdiag
nwdiag {
  // 不指定名称的网络
  network {
    router;
    web01;
  }
}
```

**用途**:

- 简单的网络段
- 不需要引用网络名称的场景

---

## 🖥️ 节点定义

### 基本语法

```nwdiag
<node_name> [<attribute1> = "<value1>", <attribute2> = "<value2>"];
```

### 节点属性

| 属性          | 类型    | 说明               | 示例                         |
| ------------- | ------- | ------------------ | ---------------------------- |
| `address`     | string  | IP 地址 (支持多个) | `"192.168.1.1"`              |
| `shape`       | keyword | 节点形状           | `cloud`, `database`, `actor` |
| `color`       | color   | 节点颜色           | `"pink"`, `"#FF0000"`        |
| `description` | string  | 节点描述           | `"Web Server"`               |

### 多地址节点

```nwdiag
nwdiag {
  network dmz {
    // 使用逗号分隔多个地址
    web01 [address = "210.x.x.1, 210.x.x.20"];
  }
}
```

**规则**:

- ✅ 多个地址用逗号分隔
- ✅ 可以是完整 IP 或相对地址 (如 `.1`)
- ❌ 不要在地址中使用空格

### 相对地址

```nwdiag
nwdiag {
  network internal {
    address = "192.168.10.0/24"

    // 相对地址: 自动补全为 192.168.10.1
    web01 [address = ".1"];
    web02 [address = ".2"];
  }
}
```

**优点**:

- 简洁
- 自动继承网络地址前缀

---

## 👥 节点分组

### 网络内分组

```nwdiag
nwdiag {
  network Sample {
    // 在网络内定义组
    group web {
      web01 [address = ".1"];
      web02 [address = ".2"];
    }
  }
}
```

### 网络外分组

```nwdiag
nwdiag {
  // 在所有网络外定义组
  group {
    color = "#FFAAAA";
    description = "Web Servers";
    web01;
    web02;
  }

  network dmz {
    web01;
    web02;
  }
}
```

### 组属性

| 属性          | 类型   | 说明     | 示例                 |
| ------------- | ------ | -------- | -------------------- |
| `color`       | color  | 组背景色 | `"#FFAAAA"`          |
| `description` | string | 组描述   | `"Database Cluster"` |

### 多个组

```nwdiag
nwdiag {
  group {
    color = "#FFaaaa";
    web01;
    db01;
  }

  group {
    color = "#aaaaFF";
    web02;
    db02;
  }

  network dmz {
    web01;
    web02;
  }
}
```

**规则**:

- ✅ 可以定义多个组
- ✅ 一个节点只能属于一个组
- ❌ 组不能嵌套

---

## 🔗 点对点连接

### 基本语法

```nwdiag
nwdiag {
  <node1> -- <node2>;
}
```

### 示例

```nwdiag
nwdiag {
  inet [shape = cloud];
  inet -- router;

  network {
    router;
    web01;
  }
}
```

**特点**:

- 不使用水平网络总线
- 直接连接两个节点
- 适合简单的点对点连接

### 级联连接

```nwdiag
nwdiag {
  internet [shape = cloud];
  internet -- firewall;
  firewall -- router;
  router -- switch;

  network internal {
    switch;
    server01;
    server02;
  }
}
```

---

## 🎨 节点形状

### 支持的形状

```nwdiag
nwdiag {
  network shapes {
    n01 [shape = actor];
    n02 [shape = agent];
    n03 [shape = artifact];
    n04 [shape = boundary];
    n05 [shape = card];
    n06 [shape = cloud];
    n07 [shape = collections];
    n08 [shape = component];
    n09 [shape = control];
    n10 [shape = database];
    n11 [shape = entity];
    n12 [shape = file];
    n13 [shape = folder];
    n14 [shape = frame];
    n15 [shape = hexagon];
    n16 [shape = interface];
    n17 [shape = label];
    n18 [shape = node];  // 默认
    n19 [shape = package];
    n20 [shape = person];
    n21 [shape = queue];
    n22 [shape = rectangle];
    n23 [shape = stack];
    n24 [shape = storage];
    n25 [shape = usecase];
  }
}
```

### 常用形状用途

| 形状             | 适用场景       |
| ---------------- | -------------- |
| `cloud`          | 互联网、云服务 |
| `database`       | 数据库服务器   |
| `storage`        | 存储设备       |
| `actor`/`person` | 用户、角色     |
| `rectangle`      | 通用服务器     |
| `node`           | 默认节点       |

---

## 🎯 跨网络节点

### 基本规则

```nwdiag
nwdiag {
  network dmz {
    web01 [address = "210.x.x.1"];
  }

  network internal {
    web01 [address = "172.x.x.1"];  // 同一节点,不同地址
    db01;
  }

  network backup {
    web01 [address = "192.168.x.1"];  // 再次出现
  }
}
```

**规则**:

- ✅ 同一节点可以出现在多个网络
- ✅ 每个网络中可以有不同的地址
- ✅ NwDiag 自动使用跳线连接
- ❌ 节点名称必须一致

### 跳线布局

```nwdiag
nwdiag {
  e1

  network n1 {
    width = full
    e1; e2; e3;
  }

  network n2 {
    width = full
    e3; e4; e5;
  }

  network n3 {
    width = full
    e2; e6;
  }
}
```

**特点**:

- 自动计算跳线路径
- 避免线条交叉
- 使用 `width = full` 对齐所有网络

---

## 📏 网络宽度

### 宽度选项

| 值     | 说明         |
| ------ | ------------ |
| (默认) | 自动调整宽度 |
| `full` | 占满整行     |

### 示例

```nwdiag
nwdiag {
  network n1 {
    width = full  // 占满整行
    server01;
    server02;
  }

  network n2 {
    // 自动宽度
    server03;
  }
}
```

### 统一宽度

```nwdiag
nwdiag {
  network n1 {
    width = full
    a; b; c;
  }

  network n2 {
    width = full
    c; d; e;
  }

  network n3 {
    width = full
    b; f;
  }
}
```

**用途**:

- 所有网络对齐
- 便于查看跨网络连接

---

## 🎨 颜色定义

### 颜色格式

```nwdiag
nwdiag {
  network dmz {
    // 命名颜色
    color = "pink"

    // 十六进制颜色
    web01 [color = "#FF0000"];

    // RGB 颜色
    web02 [color = "rgb(255, 0, 0)"];
  }

  group {
    color = "lightblue"
    web01;
  }
}
```

**支持的格式**:

- 命名颜色: `"pink"`, `"lightblue"`, `"red"`
- 十六进制: `"#FF0000"`, `"#F00"`
- RGB: `"rgb(255, 0, 0)"`

### 常用颜色

| 颜色名        | 十六进制  | 用途     |
| ------------- | --------- | -------- |
| `pink`        | `#FFC0CB` | DMZ 区域 |
| `lightblue`   | `#ADD8E6` | 内部网络 |
| `palegreen`   | `#98FB98` | 安全区域 |
| `lightyellow` | `#FFFFE0` | 管理网络 |
| `lightgray`   | `#D3D3D3` | 备份网络 |

---

## ✏️ 文本和描述

### 节点描述

```nwdiag
nwdiag {
  network dmz {
    web01 [
      description = "Web Server 01\nNginx 1.18"
    ];
  }
}
```

**规则**:

- ✅ 使用 `\n` 换行
- ✅ 支持多行文本
- ❌ 不支持特殊格式 (粗体、斜体)

### 组描述

```nwdiag
nwdiag {
  group {
    description = "Production Servers\n(High Availability)";
    web01;
    web02;
  }
}
```

---

## 🔧 命名规则

### 有效的名称

```nwdiag
nwdiag {
  network dmz_prod {
    web_server_01;
    db_server_01;
  }
}
```

**规则**:

- ✅ 字母、数字、下划线
- ✅ 以字母开头
- ❌ 不能包含连字符 `-`
- ❌ 不能包含空格
- ❌ 不能使用保留字

### 保留字

以下关键字不能用作名称:

- `network`
- `group`
- `address`
- `color`
- `shape`
- `description`
- `width`

### 特殊字符处理

```nwdiag
nwdiag {
  network dmz {
    // 错误: 包含连字符
    // web-server-01;  ❌

    // 正确: 使用下划线
    web_server_01;  ✅

    // 正确: 使用驼峰命名
    webServer01;  ✅
  }
}
```

---

## 📋 最佳实践

### 1. 使用描述性名称

```nwdiag
// ❌ 不好
nwdiag {
  network n1 {
    s1; s2; s3;
  }
}

// ✅ 好
nwdiag {
  network dmz {
    web_server_01;
    web_server_02;
    load_balancer;
  }
}
```

### 2. 统一地址格式

```nwdiag
// ✅ 好
nwdiag {
  network internal {
    address = "192.168.1.0/24"
    web01 [address = ".10"];
    web02 [address = ".20"];
    db01 [address = ".100"];
  }
}
```

### 3. 合理使用分组

```nwdiag
// ✅ 好
nwdiag {
  group {
    color = "#FFAAAA";
    description = "Web Tier";
    web01; web02;
  }

  group {
    color = "#AAAAFF";
    description = "Database Tier";
    db01; db02;
  }

  network dmz {
    web01; web02;
  }

  network internal {
    web01; web02;
    db01; db02;
  }
}
```

### 4. 网络宽度对齐

```nwdiag
// ✅ 好: 所有网络对齐
nwdiag {
  network n1 {
    width = full
    a; b;
  }

  network n2 {
    width = full
    b; c;
  }
}
```

### 5. 使用注释

```nwdiag
nwdiag {
  // DMZ 网络 - 公网访问
  network dmz {
    address = "210.x.x.x/24"

    // Web 服务器集群
    web01 [address = ".10"];
    web02 [address = ".20"];
  }

  // 内部网络 - 私有访问
  network internal {
    address = "172.16.0.0/24"

    web01 [address = ".10"];
    web02 [address = ".20"];

    // 数据库服务器
    db01 [address = ".100", shape = database];
  }
}
```

---

## 🚫 常见错误

### 1. 连字符命名

```nwdiag
// ❌ 错误
nwdiag {
  network dmz {
    web-server-01;  // 语法错误
  }
}

// ✅ 正确
nwdiag {
  network dmz {
    web_server_01;
  }
}
```

### 2. 地址格式错误

```nwdiag
// ❌ 错误
nwdiag {
  network dmz {
    web01 [address = ".1 .2"];  // 空格分隔
  }
}

// ✅ 正确
nwdiag {
  network dmz {
    web01 [address = ".1, .2"];  // 逗号分隔
  }
}
```

### 3. 缺少分号

```nwdiag
// ❌ 错误
nwdiag {
  network dmz {
    web01 [address = ".1"]  // 缺少分号
  }
}

// ✅ 正确
nwdiag {
  network dmz {
    web01 [address = ".1"];
  }
}
```

### 4. 组嵌套

```nwdiag
// ❌ 错误
nwdiag {
  group outer {
    group inner {  // 不支持嵌套
      web01;
    }
  }
}

// ✅ 正确
nwdiag {
  group web_group {
    web01;
  }

  group db_group {
    db01;
  }
}
```

---

## 📚 参考资料

- **官方语法文档**: http://blockdiag.com/en/nwdiag/introduction.html
- **示例集合**: http://blockdiag.com/en/nwdiag/nwdiag-examples.html
- **PlantUML 集成**: https://plantuml.com/nwdiag

---

_文档整理: DiagramAI 项目 | 语法规则详解_
