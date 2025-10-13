# Structurizr DSL Common Errors

> **Last Updated**: 2025-10-13
> **Reference**: [Structurizr Troubleshooting](https://docs.structurizr.com/lite/troubleshooting)

---

## 语法错误 (Syntax Errors)

### 1. 前向引用错误

**错误信息**: `The destination element "xxx" does not exist at line X`

**原因**: 尝试在定义元素之前引用它

```structurizr
// ❌ 错误
model {
  a = softwareSystem "A"
  a -> b "Uses"           // 错误! b 尚未定义
  b = softwareSystem "B"
}
```

**解决方案**:
```structurizr
// ✅ 正确 - 按顺序定义
model {
  a = softwareSystem "A"
  b = softwareSystem "B"
  a -> b "Uses"
}

// ✅ 或者在元素块内使用隐式关系
model {
  a = softwareSystem "A" {
    -> b "Uses"  // 可以前向引用 (特例)
  }
  b = softwareSystem "B"
}
```

**注意**: Structurizr DSL 不支持提升/前向引用，因为它是命令式语言，按顺序构建模型。

---

### 2. 大括号位置错误

**错误信息**: 各种语法错误

**原因**: 左大括号不在同一行，或右大括号不独占一行

```structurizr
// ❌ 错误 - 左大括号在新行
softwareSystem "System"
{
  container "API"
}

// ❌ 错误 - 右大括号不独占一行
softwareSystem "System" {
  container "API" }
```

**解决方案**:
```structurizr
// ✅ 正确
softwareSystem "System" {
  container "API"
}
```

---

### 3. 引号缺失

**错误信息**: 解析错误

**原因**: 包含空格的文本没有用引号括起

```structurizr
// ❌ 错误
person User Name

// ❌ 错误
softwareSystem My System
```

**解决方案**:
```structurizr
// ✅ 正确
person "User Name"

// ✅ 正确
softwareSystem "My System"

// ✅ 无空格可省略引号
person UserName
```

---

### 4. 标识符冲突

**错误信息**: `The identifier "xxx" is already in use`

**原因**: 在扁平标识符模式下重复使用同一标识符

```structurizr
// ❌ 错误 - 默认扁平模式
model {
  system1 = softwareSystem "S1" {
    api = container "API"
  }
  system2 = softwareSystem "S2" {
    api = container "API"  // 错误! 标识符 api 已被使用
  }
}
```

**解决方案 1**: 使用唯一标识符
```structurizr
model {
  system1 = softwareSystem "S1" {
    api1 = container "API"
  }
  system2 = softwareSystem "S2" {
    api2 = container "API"
  }
}
```

**解决方案 2**: 使用分层标识符
```structurizr
workspace {
  !identifiers hierarchical

  model {
    system1 = softwareSystem "S1" {
      api = container "API"  // system1.api
    }
    system2 = softwareSystem "S2" {
      api = container "API"  // system2.api (不冲突)
    }
  }
}
```

---

### 5. 元素名称重复

**错误信息**: 名称重复相关的验证错误

**原因**: 违反唯一性规则

```structurizr
// ❌ 错误 - 人员名称全局重复
model {
  admin = person "User"
  guest = person "User"  // 错误! 名称重复
}

// ❌ 错误 - 同一系统内容器名称重复
model {
  system = softwareSystem "System" {
    api1 = container "API"
    api2 = container "API"  // 错误! 名称重复
  }
}
```

**解决方案**:
```structurizr
// ✅ 正确 - 唯一名称
model {
  admin = person "Administrator"
  guest = person "Guest"
}

// ✅ 正确 - 不同系统内可同名
model {
  system1 = softwareSystem "S1" {
    api = container "API"
  }
  system2 = softwareSystem "S2" {
    api = container "API"  // 不同系统，允许
  }
}
```

---

### 6. 关系描述重复

**错误信息**: 关系重复相关错误

**原因**: 从 A 到 B 的多个关系使用相同描述

```structurizr
// ❌ 错误
model {
  user = person "User"
  system = softwareSystem "System"

  user -> system "Uses"
  user -> system "Uses"  // 错误! 相同描述
}
```

**解决方案**:
```structurizr
// ✅ 正确 - 不同描述
model {
  user = person "User"
  system = softwareSystem "System"

  user -> system "Browses products"
  user -> system "Makes purchases"
}

// ✅ 或者使用标签区分
model {
  user = person "User"
  system = softwareSystem "System"

  user -> system "Uses" {
    tags "Read"
  }
  user -> system "Uses" {
    tags "Write"
  }
}
```

---

### 7. 注释位置错误

**错误信息**: 语法错误

**原因**: 注释在括号内或紧跟右括号

```structurizr
// ❌ 错误
model {
  system = softwareSystem "System" {
    /* 注释 */
  }
} // 注释紧跟右括号也可能出错
```

**解决方案**:
```structurizr
// ✅ 正确 - 注释独立成行
model {
  // 注释
  system = softwareSystem "System" {
    container "API"
  }
}

// 注释放在独立行
```

---

## 模型错误 (Model Errors)

### 8. 分层标识符前向引用

**错误信息**: `The destination element "xxx.yyy" does not exist`

**原因**: 使用分层标识符时仍然存在顺序问题

```structurizr
workspace {
  !identifiers hierarchical

  model {
    system = softwareSystem "System" {
      container1 = container "C1" {
        this -> system.container2  // 错误! container2 尚未定义
      }
      container2 = container "C2"
    }
  }
}
```

**解决方案**:
```structurizr
workspace {
  !identifiers hierarchical

  model {
    system = softwareSystem "System" {
      container1 = container "C1"
      container2 = container "C2"

      // 在元素定义后建立关系
      container1 -> container2 "Uses"
    }
  }
}
```

---

### 9. 部署实例关系限制

**错误信息**: `A relationship between "ContainerInstance..." and "..." is not permitted`

**原因**: 容器实例和软件系统实例之间的关系有限制

```structurizr
// ❌ 某些关系可能不支持
deploymentEnvironment "Production" {
  deploymentNode "Node1" {
    containerInstance1 = containerInstance container1
  }
  deploymentNode "Node2" {
    systemInstance = softwareSystemInstance system
    containerInstance1 -> systemInstance  // 可能不支持
  }
}
```

**解决方案**: 在模型层建立关系，而非部署实例层
```structurizr
model {
  container1 -> system "Uses"  // 在模型层定义
}

deploymentEnvironment "Production" {
  deploymentNode "Node1" {
    containerInstance container1  // 关系自动继承
  }
  deploymentNode "Node2" {
    softwareSystemInstance system
  }
}
```

---

### 10. Workspace 作用域违规

**错误信息**: 作用域验证错误

**原因**: 在设置 `scope` 后包含不允许的内容

```structurizr
workspace {
  configuration {
    scope softwareSystem  // 仅允许单个软件系统
  }

  model {
    system1 = softwareSystem "S1"
    system2 = softwareSystem "S2"  // 错误! 超出作用域
  }
}
```

**解决方案**:
```structurizr
// ✅ 软件系统作用域
workspace {
  configuration {
    scope softwareSystem
  }

  model {
    system = softwareSystem "System" {
      // 只定义一个系统的详细信息
      container1 = container "C1"
      container2 = container "C2"
    }
  }
}

// ✅ 或使用 landscape 作用域
workspace {
  configuration {
    scope landscape
  }

  model {
    system1 = softwareSystem "S1"
    system2 = softwareSystem "S2"
  }
}
```

---

## 视图错误 (View Errors)

### 11. 视图键丢失导致布局重置

**问题**: 每次刷新后图表布局丢失

**原因**: 未指定视图键，系统自动生成的键可能变化

```structurizr
// ❌ 风险 - 自动生成键
views {
  systemContext system {
    include *
  }
}
```

**解决方案**:
```structurizr
// ✅ 显式指定稳定的键
views {
  systemContext system "SystemContextView" {
    include *
  }

  container system "ContainerView" {
    include *
  }
}
```

---

### 12. Include 表达式错误

**错误信息**: 元素未显示在视图中

**原因**: Include 表达式不正确

```structurizr
// ❌ 可能不符合预期
views {
  container system {
    include user  // 只包含 user，不包含关系
  }
}
```

**解决方案**:
```structurizr
// ✅ 包含元素及其关系
views {
  container system {
    include *  // 包含所有容器及其关系

    // 或精确控制
    include user system.webapp system.api
    include "->system.api->"  // API 的所有依赖
  }
}
```

---

### 13. 自动布局冲突

**问题**: 布局看起来很奇怪

**原因**: 自动布局参数不合适

```structurizr
// ❌ 可能导致拥挤
views {
  systemContext system {
    include *
    autoLayout lr 50 50  // 间距太小
  }
}
```

**解决方案**:
```structurizr
// ✅ 合理的间距
views {
  systemContext system {
    include *
    autoLayout lr 300 300  // 默认推荐值
  }

  // 或调整以适应复杂图表
  container system {
    include *
    autoLayout tb 400 200  // 上下布局，更大间距
  }
}
```

---

## 样式错误 (Style Errors)

### 14. 标签匹配失败

**问题**: 样式未应用

**原因**: 标签名称不匹配

```structurizr
model {
  db = container "Database" {
    tags "DataStore"  // 标签名: DataStore
  }
}

views {
  styles {
    element "Database" {  // ❌ 不匹配!
      shape Cylinder
    }
  }
}
```

**解决方案**:
```structurizr
model {
  db = container "Database" {
    tags "Database"  // 使用一致的标签
  }
}

views {
  styles {
    element "Database" {  // ✅ 匹配
      shape Cylinder
    }
  }
}
```

---

### 15. 主题 URL 错误

**问题**: 主题未加载

**原因**: URL 错误或不可访问

```structurizr
// ❌ 错误的 URL
views {
  themes https://example.com/nonexistent-theme.json
}
```

**解决方案**:
```structurizr
// ✅ 使用官方主题
views {
  themes https://static.structurizr.com/themes/amazon-web-services-2023.04.30/theme.json
  themes https://static.structurizr.com/themes/microsoft-azure-2023.01.24/theme.json
}
```

**验证**: 在浏览器中测试主题 URL 是否可访问

---

## 文件和导入错误

### 16. Include 文件路径错误

**错误信息**: `File not found` 或路径错误

**原因**: 相对路径不正确

```structurizr
// ❌ 错误的路径
workspace {
  !include model/model.dsl  // 文件不在该位置
}
```

**解决方案**:
```structurizr
// ✅ 正确的相对路径
workspace {
  !include ./model.dsl
  !include ../shared/common.dsl
}

// ✅ 或使用绝对路径
workspace {
  !include /full/path/to/model.dsl
}
```

---

### 17. 循环导入

**错误信息**: 循环依赖错误

**原因**: 文件 A 包含文件 B，文件 B 又包含文件 A

```structurizr
// file-a.dsl
!include file-b.dsl

// file-b.dsl
!include file-a.dsl  // ❌ 循环!
```

**解决方案**: 重新组织文件结构
```structurizr
// workspace.dsl (主文件)
workspace {
  !include model.dsl
  !include views.dsl
}

// model.dsl
model {
  // 模型定义
}

// views.dsl
views {
  // 视图定义
}
```

---

## Structurizr Lite 特定错误

### 18. 布局信息丢失

**问题**: 手动调整的布局在刷新后丢失

**原因**: 元素重命名或顺序变化导致内部 ID 变化

**解决方案**:
1. **保持元素定义顺序稳定**
2. **避免频繁重命名元素**
3. **使用版本控制** 跟踪 `workspace.json`
4. **备份 workspace.json** (包含布局信息)

```bash
# 备份布局
cp workspace.json workspace.json.backup

# 恢复布局
cp workspace.json.backup workspace.json
```

---

### 19. UI 卡住 "Loading workspace..."

**问题**: Structurizr Lite 界面卡在加载中

**原因**: 浏览器缓存问题

**解决方案**:
1. **硬刷新浏览器**: Ctrl+Shift+R (Windows/Linux) 或 Cmd+Shift+R (Mac)
2. **清除浏览器缓存**
3. **检查浏览器控制台** 是否有错误信息

---

### 20. 反向代理配置问题

**问题**: Structurizr Lite 样式/图表加载失败

**原因**: 反向代理配置不正确

**解决方案**:
1. **设置 `structurizr.url`**:
   ```properties
   # structurizr.properties
   structurizr.url=https://your-domain.com
   ```

2. **禁用冲突的 HTTP 头** (在反向代理中):
   - X-Frame-Options
   - Content-Security-Policy

3. **确保上下文路径为根路径** (`/`)

---

## Kroki 集成错误

### 21. Kroki 渲染超时

**错误信息**: 超时或 504 错误

**原因**: 图表太复杂或 Kroki 服务响应慢

**解决方案**:
1. **简化图表**: 减少元素数量
2. **拆分视图**: 创建多个小图表而非一个大图表
3. **使用自托管 Kroki**: 而非公共服务

```structurizr
// ❌ 太复杂
container system {
  include *  // 100+ 元素
}

// ✅ 拆分
container system "CoreContainers" {
  include system.api system.webapp system.db
}

container system "BackgroundServices" {
  include system.worker system.queue
}
```

---

### 22. Kroki 样式限制

**问题**: 样式在 Kroki 中不生效

**原因**: Kroki 不完全支持 Structurizr 样式

**限制**:
- 有限的元素形状
- 不支持主题
- 有限的颜色/字体控制

**解决方案**:
1. **使用 Structurizr Lite/Cloud** 获得完整样式支持
2. **导出为 PlantUML/Mermaid** 获得更好的 Kroki 支持
3. **接受基本样式** 用于文档嵌入

---

### 23. Kroki URI 长度限制

**错误信息**: 414 URI Too Long

**原因**: 图表代码太长，编码后超过 URI 限制

**解决方案**:
1. **使用 POST 请求** 而非 GET
2. **简化图表**
3. **增加 Kroki 的 `KROKI_MAX_URI_LENGTH`** (自托管)

```bash
# Docker 运行 Kroki 时设置
docker run -e KROKI_MAX_URI_LENGTH=8192 yuzutech/kroki
```

---

## 验证和测试

### 24. DSL 验证

**使用 Structurizr CLI 验证**:
```bash
# 验证 DSL 语法
structurizr-cli validate -workspace workspace.dsl
```

**常见验证错误**:
- 语法错误
- 唯一性违规
- 关系错误
- 作用域违规

---

### 25. 本地测试工作流

```bash
# 1. 编辑 DSL 文件
vim workspace.dsl

# 2. 验证语法
structurizr-cli validate -workspace workspace.dsl

# 3. 启动 Structurizr Lite
docker run -p 8080:8080 -v $(pwd):/usr/local/structurizr structurizr/lite

# 4. 浏览器访问
# http://localhost:8080

# 5. 导出为其他格式 (可选)
structurizr-cli export -workspace workspace.dsl -format plantuml
```

---

## 调试技巧

### 1. 使用注释隔离问题

```structurizr
model {
  system = softwareSystem "System" {
    // 逐步注释掉部分代码定位错误
    // container1 = container "C1"
    container2 = container "C2"
  }
}
```

### 2. 最小化复现

从最小 DSL 开始，逐步添加内容:
```structurizr
workspace {
  model {
    user = person "User"
    system = softwareSystem "System"
    user -> system "Uses"
  }

  views {
    systemContext system {
      include *
      autoLayout
    }
  }
}
```

### 3. 检查 workspace.json

```bash
# 查看生成的 JSON (包含更多错误信息)
cat workspace.json | jq .
```

### 4. 浏览器开发者工具

- 打开控制台查看 JavaScript 错误
- 检查网络请求是否失败
- 查看响应内容

---

## 常见问题速查

| 错误信息 | 可能原因 | 解决方案 |
|---------|---------|---------|
| `does not exist at line X` | 前向引用 | 按顺序定义元素 |
| `identifier already in use` | 标识符冲突 | 使用唯一标识符或分层模式 |
| `relationship not permitted` | 关系限制 | 检查元素类型和关系规则 |
| `Loading workspace...` (卡住) | 浏览器缓存 | 硬刷新浏览器 |
| 布局丢失 | 元素 ID 变化 | 保持元素顺序，使用稳定视图键 |
| 样式未应用 | 标签不匹配 | 检查标签名称一致性 |
| 414 URI Too Long | Kroki URI 限制 | 使用 POST 或简化图表 |
| 文件未找到 | Include 路径错误 | 检查相对/绝对路径 |

---

## 参考资源

- **官方故障排除**: https://docs.structurizr.com/lite/troubleshooting
- **FAQ**: https://docs.structurizr.com/dsl/faq
- **GitHub Issues**: https://github.com/structurizr/dsl/issues
- **GitHub Discussions**: https://github.com/structurizr/dsl/discussions

---

**Structurizr DSL** - 理解错误，快速修复
