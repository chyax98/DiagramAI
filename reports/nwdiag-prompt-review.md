# NwDiag Prompt 系统审查报告

**语言**: NwDiag
**文件位置**: `/root/Diagram/DiagramAI/src/lib/constants/prompts/nwdiag/`
**审查日期**: 2025-10-13
**审查范围**: L2 (common.txt) + L3 (network.txt)

---

## 📊 文件清单

| 文件 | 类型 | 行数 | 功能 |
|------|------|------|------|
| `common.txt` | L2 通用规范 | 206 行 | NwDiag/RackDiag/PacketDiag 通用语法 |
| `network.txt` | L3 图表类型 | 316 行 | 网络拓扑图生成规范 |

**总计**: 522 行

---

## ✅ 优点分析

### 1. L2 通用规范质量优秀

**强制规则突出 NwDiag 特性**:
- ✅ 规则 1: 图表声明 - `nwdiag {}` 包裹
- ✅ 规则 2: 节点必须在 `network` 块内定义地址 - **NwDiag 特有**
- ✅ 规则 3: IP 地址与网段匹配 - **NwDiag 特有逻辑校验**
- ✅ 规则 4: 中文标签引号

**专家视角定义精准**:
- 网络架构师 - 理解三层架构、DMZ、数据中心设计
- NwDiag 工程师 - 精通 network、group、address 关键字
- 代码质量审查员 - 验证网络拓扑逻辑性

**语法覆盖完整**:
- 图表声明、网络定义、节点属性、分组 (Group)
- **特别指出**: 第 138-152 行提到 `rackdiag {}` 和 `packetdiag {}`,说明这个 common.txt 是 NwDiag 系列共用

---

### 2. L3 (network.txt) 示例质量极高

**3 个示例,覆盖真实网络场景**:
- ✅ 示例 1: 三层网络架构 - DMZ、内网、数据库网段,展示双网卡服务器
- ✅ 示例 2: 数据中心互联 - 两个 DC 通过专线互联,包含防火墙和核心交换机
- ✅ 示例 3: DMZ 安全架构 - 外网、DMZ、内网、数据库 4 层安全架构

**代码质量**:
- IP 地址合理: `10.0.0.0/24`, `192.168.1.0/24`
- 设备描述完整: `Core Switch DC1`, `Firewall DC1`
- 使用 `shape = "cloud"` 表示互联网 - 非常专业

---

## ⚠️ 问题与改进建议

### 问题 1: L2 (common.txt) 存在严重问题 - 混淆了三种语言

**严重问题**: 第 134-152 行

```markdown
### 1. 图表声明
```
nwdiag {
  // 网络拓扑图内容
}

rackdiag {
  // 机架图内容（使用 rackdiag 关键字）
}

packetdiag {
  // 数据包图内容（使用 packetdiag 关键字）
}
```

**说明**：
- `nwdiag` 用于网络拓扑图（network、group）
- `rackdiag` 用于机架布局图（U 位布局）
- `packetdiag` 用于网络协议包图（协议头字段）
```

**问题严重性**: 🔴 高

**影响**:
- 这个 `common.txt` 实际上是 **NwDiag 系列 (nwdiag, rackdiag, packetdiag)** 的共用 L2
- 但它被放在 `/prompts/nwdiag/common.txt`,容易误解为只针对 nwdiag
- **PacketDiag 和 RackDiag 没有独立的 L2 文件,都依赖这个文件**

**改进建议**:
```bash
# 方案 1: 拆分成三个独立的 L2 文件
/prompts/nwdiag/common.txt   - 只包含 nwdiag 特有规则
/prompts/rackdiag/common.txt - 只包含 rackdiag 特有规则
/prompts/packetdiag/common.txt - 只包含 packetdiag 特有规则

# 方案 2: 明确标注这是共用文件
重命名为 /prompts/_shared/nwdiag-series-common.txt
然后在每个语言的 prompt-loader.ts 中引用
```

**推荐方案 1** - 因为这三种语言的规则差异较大:
- NwDiag: `network {}` + `address` + IP 地址匹配
- RackDiag: U 位编号 1-42 + 多 U 标记 `[2U]`
- PacketDiag: `colwidth` + 位范围不重叠

---

### 问题 2: L3 (network.txt) 与 L2 存在内容重复

**重复内容**:
- L2 第 154-193 行: 定义了网络定义、节点属性、分组语法
- L3 第 11-47 行: 再次定义基础网络定义和分组

**问题严重性**: 🟡 中等

**改进建议**:
- 删除 L3 中的基础语法重复内容
- L3 仅保留网络拓扑图特有的语法 (如双网卡服务器、跨网段连接)

---

### 问题 3: 缺少 NwDiag 特有语法的详细说明

**缺失内容**:
- 双网卡服务器的语法: 同一节点在多个 `network` 中出现
- 跨网段连接的限制: 节点必须先在某个 `network` 中定义地址

**改进建议**:
```markdown
## 在 L2 或 L3 中添加
### 双网卡服务器（节点跨网段）
```nwdiag
nwdiag {
  network dmz {
    web01 [address = "210.x.x.1"];
  }
  network internal {
    web01 [address = "172.16.0.1"];  // 同一节点,不同地址
  }
}
```
**规则**: 同一节点可以在多个 `network` 中定义,但每个 `network` 中的地址必须不同

### 跨网段连接限制
- ❌ 不能直接 `web01 -> db01` 如果两者不在同一 `network`
- ✅ 必须通过共同所在的 `network` 或中间节点连接
```

---

## 📈 量化评分

| 评估维度 | 得分 | 说明 |
|---------|------|------|
| **L2 覆盖度** | 7/10 | 规则完整,但混淆了三种语言 |
| **L3 示例质量** | 10/10 | 示例极其专业,覆盖真实网络场景 |
| **错误预防** | 9/10 | 常见错误覆盖全面,包含 IP 地址不匹配 |
| **内容去重** | 6/10 | L2 与 L3 存在重复 |
| **类型特异性** | 9/10 | Network 拓扑图特性突出 |
| **可维护性** | 6/10 | L2 文件混淆三种语言,维护困难 |
| **总体评分** | **7.8/10** | L3 质量极高,但 L2 设计有问题 |

---

## 🎯 优先改进建议

### 高优先级 (P0)
1. **拆分 nwdiag/common.txt 为三个独立文件** - 解决语言混淆问题
2. **删除 L3 中的语法重复内容** - 减少 Prompt 长度

### 中优先级 (P1)
3. **增加双网卡服务器语法说明** - NwDiag 特有特性
4. **增加跨网段连接限制说明** - 防止语法错误

---

## 📝 总结

**NwDiag Prompt 系统的 L3 (network.txt) 质量极高**,示例专业且实用。但 **L2 (common.txt) 存在严重设计问题** - 它实际上是 NwDiag 系列 (nwdiag, rackdiag, packetdiag) 的共用文件,但被放在 nwdiag 目录下,容易误解。

**建议优先拆分 L2 文件**,让每种语言有独立的 common.txt,避免维护混乱。
