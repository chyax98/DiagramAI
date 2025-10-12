# RackDiag 常见错误及解决方案

## 错误分类

### 1. 语法错误（Syntax Errors）

#### 错误 1.1: 缺少机架高度定义

**错误示例**:
```
rackdiag {
  1: Server          // ❌ 未定义机架高度
}
```

**错误信息**:
```
Error: rack height not specified
```

**解决方案**:
```
rackdiag {
  12U;               // ✅ 添加机架高度
  1: Server
}
```

#### 错误 1.2: 高度格式错误

**错误示例**:
```
rackdiag {
  12                 // ❌ 缺少 U
  16U                // ❌ 缺少分号
  "24U";             // ❌ 不应使用引号
}
```

**解决方案**:
```
rackdiag {
  12U;               // ✅ 正确格式
}
```

#### 错误 1.3: 缺少冒号分隔符

**错误示例**:
```
rackdiag {
  12U;
  1 Server           // ❌ 缺少冒号
}
```

**解决方案**:
```
rackdiag {
  12U;
  1: Server          // ✅ 添加冒号
}
```

#### 错误 1.4: 括号不匹配

**错误示例**:
```
rackdiag {
  12U;
  1: Server [2U      // ❌ 缺少右括号
```

**解决方案**:
```
rackdiag {
  12U;
  1: Server [2U];    // ✅ 补全括号
}
```

### 2. 位置冲突错误（Position Errors）

#### 错误 2.1: 设备位置重叠

**错误示例**:
```
rackdiag {
  12U;
  1: Server A [3U];  // 占用 1-3
  2: Server B        // ❌ 位置 2 已被 Server A 占用
}
```

**错误信息**:
```
ValueError: position 2 is already occupied
```

**解决方案**:
```
rackdiag {
  12U;
  1: Server A [3U];  // 占用 1-3
  4: Server B        // ✅ 位置 4 可用
}
```

#### 错误 2.2: 设备超出机架高度

**错误示例**:
```
rackdiag {
  12U;
  11: Server [3U];   // ❌ 11+3-1=13 > 12
}
```

**错误信息**:
```
ValueError: device exceeds rack height (position 11 + 3U = 14 > 12U)
```

**解决方案**:
```
rackdiag {
  12U;
  10: Server [3U];   // ✅ 10+3-1=12，刚好
}

// 或增加机架高度
rackdiag {
  16U;               // ✅ 增加机架高度
  11: Server [3U];
}
```

#### 错误 2.3: 位置编号为零或负数

**错误示例**:
```
rackdiag {
  12U;
  0: Server          // ❌ 位置 0 无效
  -1: Switch         // ❌ 负数无效
}
```

**解决方案**:
```
rackdiag {
  12U;
  1: Server          // ✅ 位置从 1 开始
  2: Switch
}
```

### 3. 属性错误（Attribute Errors）

#### 错误 3.1: 高度属性值无效

**错误示例**:
```
rackdiag {
  12U;
  1: Server [0U];    // ❌ 高度为 0
  2: Server [-2U];   // ❌ 负数高度
  3: Server [1.5U];  // ❌ 小数高度
}
```

**解决方案**:
```
rackdiag {
  12U;
  1: Server [1U];    // ✅ 正整数
  2: Server [2U];
  3: Server [4U];
}
```

#### 错误 3.2: 属性格式错误

**错误示例**:
```
rackdiag {
  12U;
  1: Server 2U       // ❌ 缺少方括号
  2: Server [2U      // ❌ 缺少右括号
  3: Server 2U]      // ❌ 缺少左括号
}
```

**解决方案**:
```
rackdiag {
  12U;
  1: Server [2U];    // ✅ 完整括号
}
```

#### 错误 3.3: 重量/功耗格式错误

**错误示例**:
```
rackdiag {
  12U;
  1: Server [kg10];   // ❌ 顺序错误
  2: Server [A2.5];   // ❌ 顺序错误
}
```

**解决方案**:
```
rackdiag {
  12U;
  1: Server [10kg];   // ✅ 数字在前
  2: Server [2.5A];   // ✅ 数字在前
}
```

### 4. 配置错误（Configuration Errors）

#### 错误 4.1: description 缺少引号

**错误示例**:
```
rackdiag {
  description = Tokyo Rack A1;    // ❌ 缺少引号
  12U;
}
```

**解决方案**:
```
rackdiag {
  description = "Tokyo Rack A1";  // ✅ 添加引号
  12U;
}
```

#### 错误 4.2: ascending 拼写错误

**错误示例**:
```
rackdiag {
  acending;          // ❌ 拼写错误
  assending;         // ❌ 拼写错误
  12U;
}
```

**解决方案**:
```
rackdiag {
  ascending;         // ✅ 正确拼写
  12U;
}
```

### 5. 多机架错误（Multiple Rack Errors）

#### 错误 5.1: 多机架配置混乱

**错误示例**:
```
rackdiag {
  12U;               // ❌ 多机架不应在外层定义高度
  rack {
    1: Server
  }
  rack {
    1: Switch
  }
}
```

**解决方案**:
```
rackdiag {
  rack {
    12U;             // ✅ 在每个 rack 块内定义
    1: Server
  }
  rack {
    16U;
    1: Switch
  }
}
```

#### 错误 5.2: rack 块缺少大括号

**错误示例**:
```
rackdiag {
  rack              // ❌ 缺少大括号
    12U;
    1: Server
}
```

**解决方案**:
```
rackdiag {
  rack {            // ✅ 添加大括号
    12U;
    1: Server
  }
}
```

### 6. 逻辑错误（Logical Errors）

#### 错误 6.1: 位置跳跃过大

**问题示例**:
```
rackdiag {
  42U;
  1: Server
  40: Switch        // 跳过 2-39 位置
}
```

**说明**: 不是语法错误，但会导致大量空白

**改进方案**:
```
rackdiag {
  42U;
  1: Server
  2: Server
  // ...
  35: Reserved [8U]  // ✅ 明确标记预留空间
  40: Switch
}
```

#### 错误 6.2: 同位置设备过多

**问题示例**:
```
rackdiag {
  12U;
  5: Server 1
  5: Server 2
  5: Server 3
  5: Server 4
  5: Server 5       // 同一层 5 个设备，可能显示拥挤
}
```

**改进方案**:
```
rackdiag {
  12U;
  5: Server 1-5     // ✅ 使用范围表示
  // 或分散到多层
  5: Server 1
  5: Server 2
  6: Server 3
  6: Server 4
}
```

#### 错误 6.3: 编号顺序与 ascending 不符

**问题示例**:
```
rackdiag {
  ascending;        // 从下到上
  12U;
  12: Top Server    // 语义混乱：ascending 时 12 应在顶部
}
```

**改进方案**:
```
rackdiag {
  ascending;
  12U;
  1: Bottom Server  // ✅ 底部为 1
  12: Top Server    // ✅ 顶部为 12
}

// 或不使用 ascending
rackdiag {
  12U;
  1: Top Server     // ✅ 顶部为 1（默认）
  12: Bottom Server
}
```

### 7. 渲染错误（Rendering Errors）

#### 错误 7.1: 设备名过长

**问题示例**:
```
rackdiag {
  12U;
  1: Very Long Server Name That Does Not Fit In The Space
}
```

**解决方案**:
```
rackdiag {
  12U;
  1: VL Server Name   // ✅ 缩写
  // 或增加设备高度
  1: Very Long Server Name [2U];  // ✅ 更多空间
}
```

#### 错误 7.2: 字体不支持字符

**问题示例**:
```
rackdiag {
  12U;
  1: 服务器           // 中文可能显示为方框
}
```

**解决方案**:
```bash
# 指定支持的字体
rackdiag --font=/path/to/chinese-font.ttf diagram.diag

# 或使用英文
rackdiag {
  12U;
  1: Server          // ✅ 使用英文
}
```

## 调试技巧

### 1. 分步构建

```
# 步骤 1: 最小配置
rackdiag {
  12U;
}

# 步骤 2: 添加一个设备
rackdiag {
  12U;
  1: Server
}

# 步骤 3: 逐步添加设备
rackdiag {
  12U;
  1: Server
  2: Switch
  3: Storage
}

# 步骤 4: 添加属性
rackdiag {
  12U;
  1: Server [2U] [10kg]
  3: Switch
  4: Storage [4U]
}
```

### 2. 使用注释隔离问题

```
rackdiag {
  12U;
  1: Server
  // 2: Problematic Device   // 注释掉可疑设备
  3: Switch
}
```

### 3. 验证位置占用

```python
# Python 辅助脚本
def check_positions(devices, rack_height):
    occupied = set()

    for pos, height in devices:
        # 计算占用范围
        end_pos = pos + height - 1

        # 检查超出机架
        if end_pos > rack_height:
            print(f"Error: position {pos} with {height}U exceeds rack ({rack_height}U)")

        # 检查重叠
        for p in range(pos, end_pos + 1):
            if p in occupied:
                print(f"Error: position {p} already occupied")
            occupied.add(p)

# 使用示例
devices = [
    (1, 2),   # 位置 1, 高度 2U
    (3, 1),   # 位置 3, 高度 1U
    (4, 4),   # 位置 4, 高度 4U
]
check_positions(devices, 12)
```

### 4. 检查总容量

```python
# 计算已用和可用空间
def calculate_capacity(devices, rack_height):
    used = sum(height for _, height in devices)
    available = rack_height - used

    print(f"Rack: {rack_height}U")
    print(f"Used: {used}U ({used/rack_height*100:.1f}%)")
    print(f"Available: {available}U ({available/rack_height*100:.1f}%)")

devices = [(1, 2), (3, 4), (7, 2)]
calculate_capacity(devices, 12)
# 输出:
# Rack: 12U
# Used: 8U (66.7%)
# Available: 4U (33.3%)
```

## 错误预防清单

### 规划阶段
- [ ] 确定机架高度（标准: 12U, 16U, 42U）
- [ ] 列出所有设备及其高度
- [ ] 计算总高度，确保 ≤ 机架高度
- [ ] 确定设备排列顺序
- [ ] 预留 10-20% 扩展空间

### 编写阶段
- [ ] 先定义机架高度（NU;）
- [ ] 每个设备有位置编号和冒号
- [ ] 高度属性在方括号中（[NU]）
- [ ] description 使用引号
- [ ] 检查括号配对
- [ ] 位置编号从 1 开始

### 验证阶段
- [ ] 无位置重叠
- [ ] 无设备超出机架
- [ ] 属性格式正确
- [ ] 多机架使用 rack 块
- [ ] 测试渲染输出
- [ ] 验证设备名可读性

## 常见问题 FAQ

### Q1: 如何表示空位？
**A**: 可以跳过位置编号，或使用 N/A：
```
rackdiag {
  12U;
  1: Server
  2: Server
  // 3-5 为空
  6: Server
  // 或明确标记
  7: N/A [3U];      // 7-9 为空
}
```

### Q2: 同一位置能放多少设备？
**A**: 理论上无限制，但实际建议 2-3 个以保证可读性：
```
rackdiag {
  12U;
  5: Server 1
  5: Server 2       // 推荐最多 2-3 个
  5: Server 3
}
```

### Q3: ascending 什么时候用？
**A**: 当你希望位置 1 在底部时：
```
// 默认: 1 在顶部
rackdiag {
  12U;
  1: Top
  12: Bottom
}

// ascending: 1 在底部
rackdiag {
  ascending;
  12U;
  1: Bottom
  12: Top
}
```

### Q4: 如何处理半高设备？
**A**: RackDiag 不支持半高（0.5U），使用 1U 代替或在名称中说明：
```
rackdiag {
  12U;
  1: Half-Height Server (0.5U)   // 文字说明
}
```

### Q5: 能否自定义机架宽度？
**A**: RackDiag 假定标准 19 英寸机架，不支持自定义宽度。

## 工具支持

### 在线验证
- **Kroki Live Editor**: https://kroki.io/
- **BlockDiag Playground**: http://interactive.blockdiag.com/

### 本地验证
```bash
# 安装
pip install nwdiag

# 语法检查（生成会暴露错误）
rackdiag test.diag

# 详细错误信息
rackdiag -v test.diag
```

### IDE 支持
- **VS Code**: 安装 "PlantUML" 扩展（支持 BlockDiag 系列）
- **IntelliJ IDEA**: PlantUML Integration 插件

## 错误信息参考

| 错误信息 | 原因 | 解决方案 |
|----------|------|----------|
| `rack height not specified` | 未定义机架高度 | 添加 `NU;` |
| `position X already occupied` | 位置重叠 | 调整设备位置 |
| `device exceeds rack height` | 设备超出机架 | 减少高度或增加机架 |
| `invalid syntax` | 语法错误 | 检查冒号、括号 |
| `unmatched bracket` | 括号不匹配 | 补全括号 |
| `invalid attribute` | 属性格式错误 | 检查 [NU], [Nkg], [NA] |

## 最佳实践建议

### 1. 标准化命名
```
// 推荐格式
位置: 类型-功能-编号

// 示例
1: UPS-PRIMARY-01
3: SW-CORE-01
5: SRV-WEB-01
```

### 2. 容量规划
```
rackdiag {
  42U;

  // 已用: 30U
  1: Device 1 [2U];
  // ... 其他设备

  // 预留: 12U (28.6%)
  31: Reserved [12U];
}
```

### 3. 文档化
```
rackdiag {
  description = "DC01-ROW3-RACK15 (Production Web Tier)";
  42U;

  // 电源配置
  1: PDU-A [2U];
  3: UPS [3U];

  // 网络配置
  6: SW-CORE [2U];

  // 计算配置
  10: WEB-01 [2U];
}
```

## 参考资源

- [BlockDiag 官方文档](http://blockdiag.com/en/)
- [RackDiag 示例](http://blockdiag.com/en/nwdiag/rackdiag-examples.html)
- [Python 错误处理](https://docs.python.org/3/tutorial/errors.html)
