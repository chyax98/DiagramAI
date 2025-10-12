# Nomnoml 常见错误

> 更新时间: 2025-10-13

## 语法错误

### 1. 未闭合的括号

**错误**: 图表不显示或显示不完整

```nomnoml
// ❌ 错误 - 缺少闭合括号
[User
[Order]

// ❌ 错误 - 类型标记未闭合
[<class User]
```

**解决方案**:
```nomnoml
// ✅ 正确
[User]
[Order]

[<class> User]
```

**调试技巧**:
1. 检查每个 `[` 是否有对应的 `]`
2. 检查每个 `<` 是否有对应的 `>`
3. 使用代码编辑器的括号高亮功能

### 2. 错误的注释位置

**错误**: 注释被当作节点名称

```nomnoml
// ❌ 错误 - 注释不在行首
[User] -> [Order]  // 这会导致错误

// ❌ 错误 - 注释前有空格
  // [Admin]
```

**解决方案**:
```nomnoml
// ✅ 正确 - 注释在行首
// This is a comment
[User] -> [Order]

// ✅ 正确 - 注释独占一行
[User] -> [Order]
// Comment about the relationship
```

**规则**:
- 注释必须以 `//` 开头
- `//` 前不能有任何字符(包括空格)
- 不支持行尾注释

### 3. 无效的关系符号

**错误**: 关系不显示或显示错误

```nomnoml
// ❌ 错误 - 使用了不存在的符号
[A] => [B]              // => 不是有效符号
[A] <=> [B]             // <=> 不存在
[A] -- [B]              // 双横线无效

// ❌ 错误 - 箭头顺序错误
[A] <> [B]              // 单独的 <> 无效
[A] >- [B]              // 反向箭头无效
```

**解决方案**:
```nomnoml
// ✅ 正确的关系符号
[A] -> [B]              // 单向关联
[A] <-> [B]             // 双向关联
[A] --> [B]             // 依赖
[A] -:> [B]             // 泛化
[A] -- [B]              // 注释线
```

**有效符号列表**:
- 关联: `-`, `->`, `<->`
- 依赖: `-->`, `<-->`
- 泛化: `-:>`, `<:-`
- 实现: `--:>`, `<:--`
- 组合: `+-`, `+->`
- 聚合: `o-`, `o->`
- 特殊: `-o)`, `o<-)`, `->o`
- 其他: `--`, `-/-`

### 4. 分隔符使用错误

**错误**: 节点内容格式混乱

```nomnoml
// ❌ 错误 - 使用错误的分隔符
[User,name,email]       // 逗号不是分隔符
[User;name;email]       // 分号用于属性内部
[User:name:email]       // 冒号不是分隔符

// ❌ 错误 - 管道符数量错误
[User|name|email|id|address]  // 超过3段
```

**解决方案**:
```nomnoml
// ✅ 正确 - 使用管道符分隔
[User|name;email|getUser()]

// ✅ 正确 - 最多三段
[ClassName|attributes|methods]

// ✅ 正确 - 属性用分号分隔
[User|
  id: int;
  name: string
]
```

**规则**:
- 使用 `|` 分隔类名、属性、方法
- 最多三段: `[name|attributes|methods]`
- 属性之间用分号 `;` 或换行分隔

## 类型和样式错误

### 5. 未定义的类型

**错误**: 类型标记不生效

```nomnoml
// ❌ 错误 - 使用了不存在的类型
[<controller> UserController]
[<model> UserModel]
[<service> UserService]
```

**解决方案**:
```nomnoml
// ✅ 正确 - 使用内置类型
[<class> UserController]
[<abstract> BaseModel]
[<package> Services]

// ✅ 正确 - 或自定义样式
#.controller: fill=#e3f2fd
#.model: fill=#f3e5f5
#.service: fill=#e8f5e9

[<controller> UserController]
[<model> UserModel]
[<service> UserService]
```

**内置类型**:
- 类图: `class`, `abstract`, `instance`, `reference`
- 组件: `socket`, `lollipop`
- 流程: `start`, `end`, `state`, `choice`, `sync`, `input`
- 用例: `actor`, `usecase`
- 其他: `package`, `frame`, `note`, `database`, `pipe`, `table`, `hidden`

### 6. 样式类未定义

**错误**: 自定义样式不生效

```nomnoml
// ❌ 错误 - 使用了未定义的样式
[<primary> Button]

// 后面才定义样式
#.primary: fill=#2196F3
```

**解决方案**:
```nomnoml
// ✅ 正确 - 先定义样式
#.primary: fill=#2196F3
#.secondary: fill=#4CAF50

// 再使用
[<primary> Login]
[<secondary> Dashboard]
```

**最佳实践**:
1. 所有样式定义放在文件开头
2. 或使用 `#import: styles.nomnoml`
3. 样式名使用语义化命名

### 7. 颜色值错误

**错误**: 颜色不显示或显示异常

```nomnoml
// ❌ 错误 - 颜色格式错误
#fill: blue red           // 缺少分号
#stroke: #gggggg          // 无效的十六进制
#background: rgb(256,0,0) // RGB 值超范围

// ❌ 错误 - CSS变量不支持
#fill: var(--primary)
```

**解决方案**:
```nomnoml
// ✅ 正确 - 有效的颜色格式
#fill: #eee8d5; #fdf6e3   // 两种颜色用分号分隔
#stroke: #33322E           // 有效的十六进制
#background: rgb(255,0,0)  // 有效的RGB

// ✅ 正确 - 颜色名称
#fill: blue
#stroke: red
```

**支持的格式**:
- 颜色名: `red`, `blue`, `transparent`
- 十六进制: `#f00`, `#ff0000`
- RGB: `rgb(255,0,0)`
- RGBA: `rgba(255,0,0,0.5)`

## 指令错误

### 8. 指令格式错误

**错误**: 指令不生效

```nomnoml
// ❌ 错误 - 缺少冒号
#direction down
#fontSize 14

// ❌ 错误 - 使用等号
#fill = #ffffff

// ❌ 错误 - 空格位置错误
# direction: down
#direction :down
```

**解决方案**:
```nomnoml
// ✅ 正确 - 格式: #key: value
#direction: down
#fontSize: 14
#fill: #ffffff
```

**规则**:
- 指令以 `#` 开头,后面紧跟指令名
- 指令名和值之间用冒号 `:` 分隔
- 冒号后通常有一个空格(可选)

### 9. 指令值无效

**错误**: 指令值类型错误或超出范围

```nomnoml
// ❌ 错误 - 无效的方向
#direction: up             // 只支持 down 和 right

// ❌ 错误 - 负数值
#fontSize: -12
#spacing: -10

// ❌ 错误 - 字符串类型错误
#zoom: "1.5"               // 应该是数字,不是字符串
```

**解决方案**:
```nomnoml
// ✅ 正确
#direction: down           // 或 right
#fontSize: 12              // 正数
#spacing: 40               // 正数
#zoom: 1.5                 // 数字,不带引号
```

**常见指令的有效值**:
- `direction`: `down`, `right`
- `edges`: `hard`, `rounded`
- `ranker`: `network-simplex`, `tight-tree`, `longest-path`
- 数值类指令: 必须是正数

### 10. 导入路径错误

**错误**: 文件导入失败

```nomnoml
// ❌ 错误 - 路径不存在
#import: non-existent.nomnoml

// ❌ 错误 - 绝对路径在浏览器中不可用
#import: /usr/local/styles.nomnoml

// ❌ 错误 - 循环导入
// main.nomnoml
#import: styles.nomnoml

// styles.nomnoml
#import: main.nomnoml
```

**解决方案**:
```nomnoml
// ✅ 正确 - 相对路径
#import: ./styles.nomnoml
#import: ../common/base.nomnoml

// ✅ 正确 - 避免循环导入
// main.nomnoml
#import: styles.nomnoml
#import: components.nomnoml

// styles.nomnoml 和 components.nomnoml 不导入 main
```

**注意事项**:
- 使用相对路径
- 检查文件是否存在
- 避免循环导入
- 导入顺序: 样式 → 组件 → 主逻辑

## 节点和关系错误

### 11. 未定义的节点引用

**错误**: 关系指向不存在的节点

```nomnoml
// ❌ 错误 - B 未定义
[A] -> [B]

// ❌ 错误 - ID 不匹配
[<id=user> User]
[admin] -> [user]         // 应该用 ID,不是节点名
```

**解决方案**:
```nomnoml
// ✅ 正确 - 定义所有节点
[A]
[B]
[A] -> [B]

// ✅ 正确 - ID 使用
[<id=user> User]
[<id=admin> Admin]
[user] -> [admin]
```

**最佳实践**:
1. 先定义所有节点
2. 再定义关系
3. 使用 ID 时要一致

### 12. 重复的节点定义

**错误**: 同名节点导致混淆

```nomnoml
// ❌ 问题 - 同名节点会合并
[User]
[User]                    // 与上面的是同一个节点
[User] -> [Order]
```

**解决方案**:
```nomnoml
// ✅ 正确 - 使用 ID 区分
[<id=user1> User]
[<id=user2> User]
[user1] -> [Order]
[user2] -> [Product]

// ✅ 正确 - 使用不同的名称
[User]
[UserProfile]
[UserSettings]
```

### 13. 关系方向混淆

**错误**: 箭头方向理解错误

```nomnoml
// ❌ 混淆 - 继承方向
[Child] -:> [Parent]      // 这表示 Parent 继承 Child?

// ❌ 混淆 - 依赖方向
[Service] <-- [Controller] // 反向依赖可读性差
```

**解决方案**:
```nomnoml
// ✅ 清晰 - 子类指向父类
[Parent]
[Child]
[Child] -:> [Parent]      // Child 继承 Parent

// ✅ 清晰 - 依赖方向
[Controller] --> [Service] // Controller 依赖 Service

// ✅ 使用注释说明
// Child inherits from Parent
[Child] -:> [Parent]
```

## 布局问题

### 14. 布局混乱

**错误**: 节点重叠或位置不合理

```nomnoml
// ❌ 问题 - 复杂关系导致重叠
[A] -> [B]
[A] -> [C]
[B] -> [C]
[C] -> [A]               // 循环引用
[D] -> [A]
[D] -> [B]
[D] -> [C]
```

**解决方案**:

**方案 1: 调整方向**
```nomnoml
#direction: right        // 改变布局方向
[A] -> [B]
[A] -> [C]
[B] -> [C]
```

**方案 2: 使用隐藏关系**
```nomnoml
[A] -> [B]
[A] -> [C]
[B] -/- [C]             // 隐藏关系保持位置
```

**方案 3: 分层设计**
```nomnoml
// Layer 1
[Controller]

// Layer 2
[Service]

// Layer 3
[Repository]

[Controller] -> [Service]
[Service] -> [Repository]
```

### 15. 节点间距问题

**错误**: 节点过于紧密或分散

```nomnoml
// ❌ 问题 - 使用默认间距
[A] -> [B] -> [C] -> [D] -> [E]
```

**解决方案**:
```nomnoml
// ✅ 调整间距
#spacing: 80             // 增加节点间距
#gutter: 10              // 增加分组间距

[A] -> [B] -> [C]

// ✅ 调整缩放
#zoom: 0.8               // 缩小整体
```

## 文本和格式错误

### 16. 属性格式错误

**错误**: 属性定义不规范

```nomnoml
// ❌ 错误 - 缺少类型
[User|
  id
  name
]

// ❌ 错误 - 分隔符错误
[User|
  id: int, name: string  // 应该用分号
]

// ❌ 错误 - 可见性符号错误
[User|
  @ id: int              // @ 不是有效符号
]
```

**解决方案**:
```nomnoml
// ✅ 正确 - 完整格式
[User|
  - id: int;
  - name: string;
  + email: string
]

// ✅ 正确 - 简化格式(可选类型)
[User|
  id;
  name;
  email
]
```

**属性格式**:
- 标准: `[可见性] 名称: 类型`
- 可见性: `+`(public), `-`(private), `#`(protected)
- 分隔符: 分号 `;` 或换行

### 17. 方法格式错误

**错误**: 方法定义不完整

```nomnoml
// ❌ 错误 - 缺少括号
[User|
  |
  getName
  setName
]

// ❌ 错误 - 参数格式错误
[User|
  |
  setName(string name)   // 参数顺序错误
]

// ❌ 错误 - 返回值格式错误
[User|
  |
  getName() -> string    // 应该用冒号
]
```

**解决方案**:
```nomnoml
// ✅ 正确 - 标准格式
[User|
  |
  + getName(): string;
  + setName(name: string): void;
  - validateEmail(): boolean
]

// ✅ 正确 - 简化格式
[User|
  |
  getName();
  setName(name);
  validateEmail()
]
```

**方法格式**:
- 标准: `[可见性] 名称(参数列表): 返回类型`
- 参数: `名称: 类型`
- 多参数: 用逗号分隔

### 18. 表格格式错误

**错误**: 表格显示不正确

```nomnoml
// ❌ 错误 - 缺少类型标记
[Table|
  col1 | val1 |
]

// ❌ 错误 - 分隔符混乱
[<table> Metrics|
  CPU - 45% -
  Memory - 2.3GB
]

// ❌ 错误 - 行分隔错误
[<table> Data|
  a | 1 |
  b | 2 |          // 每行末尾的 | 可选但要统一
]
```

**解决方案**:
```nomnoml
// ✅ 正确 - 完整格式
[<table> Metrics|
  Metric | Value |
  | CPU | 45% |
  | Memory | 2.3GB |
]

// ✅ 正确 - 简化格式
[<table> Data|
  a | 1 ||
  b | 2
]
```

**表格规则**:
- 必须使用 `<table>` 类型
- 列用 `|` 分隔
- 行用 `||` 或换行分隔
- 第一列前的 `|` 可选

## 渲染和性能问题

### 19. 大图表性能问题

**错误**: 渲染缓慢或浏览器卡死

```nomnoml
// ❌ 问题 - 过多节点和关系
[A] -> [B]
[A] -> [C]
[A] -> [D]
// ... 数百个节点
```

**解决方案**:

**方案 1: 分层拆分**
```nomnoml
// main.nomnoml
[System] -> [Frontend]
[System] -> [Backend]

// frontend.nomnoml
#import: main.nomnoml
[Frontend] -> [React]
[Frontend] -> [Vue]

// backend.nomnoml
#import: main.nomnoml
[Backend] -> [API]
[Backend] -> [Database]
```

**方案 2: 简化图表**
```nomnoml
// 使用包简化细节
[<package> Frontend|
  [React]
  [Vue]
]

[<package> Backend|
  [API]
  [Database]
]

[Frontend] -> [Backend]
```

**方案 3: 优化设置**
```nomnoml
#fontSize: 10            // 减小字体
#spacing: 30             // 减小间距
#padding: 5              // 减小内边距
```

### 20. SVG 导出问题

**错误**: 导出的 SVG 显示异常

**常见问题**:
1. 字体不匹配
2. 颜色丢失
3. 布局错乱

**解决方案**:

**嵌入字体**:
```nomnoml
#font: Arial             // 使用常见字体
```

**固定尺寸**:
```nomnoml
#zoom: 1                 // 固定缩放
#direction: down         // 明确方向
```

**导出前检查**:
```javascript
// 确保完全渲染后再导出
setTimeout(() => {
  const svg = nomnoml.renderSvg(source)
  // 导出 SVG
}, 100)
```

## 调试技巧

### 通用调试流程

1. **检查语法**:
   ```nomnoml
   // 逐步注释代码,定位问题
   [A]
   // [B]
   // [A] -> [B]
   ```

2. **简化测试**:
   ```nomnoml
   // 最小化示例
   [A] -> [B]
   ```

3. **使用在线编辑器**:
   - 访问 https://www.nomnoml.com
   - 实时预览和错误提示

4. **检查浏览器控制台**:
   - F12 打开开发者工具
   - 查看 Console 的错误信息

### 常见错误信息

| 错误信息 | 可能原因 | 解决方法 |
|---------|---------|---------|
| Unexpected token | 语法错误 | 检查括号、引号配对 |
| undefined is not a function | 库未加载 | 检查 script 标签 |
| Cannot read property | 节点未定义 | 确保所有引用的节点存在 |
| Maximum call stack | 循环引用 | 检查导入和关系循环 |

### 调试工具

**浏览器插件**:
- SVG Inspector (查看 SVG 结构)
- JSON Formatter (格式化输出)

**在线工具**:
- Nomnoml 官方编辑器: https://www.nomnoml.com
- SVG 查看器: https://www.svgviewer.dev

**代码验证**:
```javascript
// 验证 nomnoml 源码
try {
  nomnoml.renderSvg(source)
  console.log('✓ Valid nomnoml syntax')
} catch(e) {
  console.error('✗ Syntax error:', e.message)
}
```

## 错误速查表

| 问题类型 | 症状 | 快速修复 |
|---------|------|---------|
| 未闭合括号 | 图表不显示 | 检查 `[` `]` 配对 |
| 注释位置错误 | 语法错误 | 注释移到行首 |
| 无效关系符 | 关系不显示 | 使用有效符号 |
| 分隔符错误 | 格式混乱 | 使用 `\|` 分隔 |
| 未定义类型 | 样式不生效 | 先定义样式类 |
| 颜色值错误 | 颜色异常 | 使用有效格式 |
| 指令格式错误 | 指令无效 | `#key: value` |
| 导入路径错误 | 文件未加载 | 使用相对路径 |
| 未定义节点 | 关系错误 | 先定义节点 |
| 布局混乱 | 重叠 | 调整方向/间距 |
| 性能问题 | 渲染慢 | 拆分/简化图表 |

## 最佳实践

### 预防错误

1. **使用模板**:
   ```nomnoml
   // template.nomnoml
   #direction: down
   #fontSize: 12

   [Node1]
   [Node2]
   [Node1] -> [Node2]
   ```

2. **代码审查清单**:
   - [ ] 所有括号配对
   - [ ] 注释在行首
   - [ ] 使用有效符号
   - [ ] 样式已定义
   - [ ] 节点已声明
   - [ ] 路径正确

3. **版本控制**:
   - 使用 Git 追踪变更
   - 提交前测试
   - 保留工作版本

## 参考资源

- [Nomnoml GitHub Issues](https://github.com/skanaar/nomnoml/issues)
- [在线编辑器](https://www.nomnoml.com)
- [语法文档](https://github.com/skanaar/nomnoml#nomnoml)
