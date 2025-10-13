# BlockDiag 语法规则详解

## 基本语法结构

### 1. 图表声明

```blockdiag
blockdiag {
   // 图表内容
}

// 或使用命名图表
blockdiag admin {
   // 图表内容
}
```

**规则**:
- 必须以 `blockdiag` 关键字开始
- 可选的图表名称
- 使用花括号 `{}` 包裹内容
- 支持单行 `//` 和多行 `/* */` 注释

## 节点语法

### 1. 节点定义

#### 隐式定义
```blockdiag
blockdiag {
   A;          // 定义节点 A
   B;          // 定义节点 B
   A -> B;     // 同时定义连接
}
```

#### 显式定义(带属性)
```blockdiag
blockdiag {
   A [label = "Node A"];  // 定义并设置标签
   B [color = "red"];     // 定义并设置颜色
}
```

### 2. 节点命名规则

**合法命名**:
```blockdiag
blockdiag {
   node1;          // ✅ 字母数字
   node_2;         // ✅ 下划线
   NodeA;          // ✅ 大小写混合
   "node with space"; // ✅ 引号包裹的任意字符
}
```

**避免使用**:
```blockdiag
blockdiag {
   node-1;         // ❌ 连字符(可能解析错误)
   1node;          // ❌ 数字开头
   node:special;   // ❌ 特殊字符(除非引号包裹)
}
```

### 3. 节点属性语法

#### 单个属性
```blockdiag
A [label = "Text"];
```

#### 多个属性
```blockdiag
A [label = "Text", color = "red", shape = "box"];
```

**属性分隔**:
- 使用逗号 `,` 分隔
- 等号 `=` 连接键值
- 字符串值需要引号

## 边(连接)语法

### 1. 基本连接操作符

| 操作符 | 说明 | 示例 |
|--------|------|------|
| `->` | 从左到右的箭头 | `A -> B` |
| `<-` | 从右到左的箭头 | `A <- B` 等同于 `B -> A` |
| `--` | 无箭头连接 | `A -- B` |
| `<->` | 双向箭头 | `A <-> B` |

### 2. 链式连接

```blockdiag
blockdiag {
   // 单链
   A -> B -> C -> D;

   // 等价于
   A -> B;
   B -> C;
   C -> D;
}
```

### 3. 分支连接 (v0.7.5+)

```blockdiag
blockdiag {
   // 一对多分支
   A -> B, C, D;
   // 等价于
   A -> B;
   A -> C;
   A -> D;

   // 多对一汇聚
   E, F, G -> H;
   // 等价于
   E -> H;
   F -> H;
   G -> H;

   // 多对多
   I, J -> K, L;
   // 生成 4 条边: I->K, I->L, J->K, J->L
}
```

### 4. 边属性

```blockdiag
blockdiag {
   // 单条边属性
   A -> B [label = "Step 1"];

   // 多条边共享属性
   C -> D, E [color = "red"];
   // 等价于
   C -> D [color = "red"];
   C -> E [color = "red"];
}
```

## 属性详解

### 1. 通用属性

#### label (标签)
```blockdiag
A [label = "Display Text"];
B [label = "多行\n文本"];  // 支持 \n 换行
```

#### color (颜色)
```blockdiag
// 颜色名称
A [color = "red"];
A [color = "lightblue"];

// 十六进制
B [color = "#FF0000"];
B [color = "#888"];     // 短格式
```

**支持的颜色名称**:
- red, green, blue, yellow, orange, purple, pink
- lightblue, lightgreen, lightyellow
- gray, darkgray, black, white

#### textcolor (文本颜色, v0.9.2+)
```blockdiag
A [textcolor = "white"];
B [textcolor = "#FFFFFF"];
```

### 2. 节点形状属性

#### shape (形状)

**基本形状**:
```blockdiag
box [shape = "box"];              // 矩形(默认)
square [shape = "square"];        // 正方形
roundedbox [shape = "roundedbox"];// 圆角矩形
circle [shape = "circle"];        // 圆形
ellipse [shape = "ellipse"];      // 椭圆
diamond [shape = "diamond"];      // 菱形
minidiamond [shape = "minidiamond"]; // 小菱形
dots [shape = "dots"];            // 点状(v0.8.2+)
```

**特殊形状**:
```blockdiag
note [shape = "note"];            // 便签
mail [shape = "mail"];            // 邮件
cloud [shape = "cloud"];          // 云
actor [shape = "actor"];          // 人物
beginpoint [shape = "beginpoint"];// 起点
endpoint [shape = "endpoint"];    // 终点
```

**流程图形状**:
```blockdiag
condition [shape = "flowchart.condition"];   // 条件(菱形)
database [shape = "flowchart.database"];     // 数据库(圆柱)
terminator [shape = "flowchart.terminator"]; // 终止符(圆角矩形)
input [shape = "flowchart.input"];           // 输入(平行四边形)
loopin [shape = "flowchart.loopin"];         // 循环入口
loopout [shape = "flowchart.loopout"];       // 循环出口
```

### 3. 样式属性

#### style (边框样式)
```blockdiag
// 预定义样式
A [style = "solid"];    // 实线(默认)
B [style = "dotted"];   // 点状
C [style = "dashed"];   // 虚线

// 自定义虚线数组 (v0.9.6+)
D [style = "3,3,3,3,15,3"];
// 格式: [线段1, 间隔1, 线段2, 间隔2, ...]
```

#### stacked (堆叠, v0.8.2+)
```blockdiag
A [stacked];                          // 添加堆叠效果
B [shape = "diamond", stacked];       // 堆叠菱形
C [shape = "flowchart.database", stacked]; // 堆叠数据库
```

### 4. 装饰属性

#### numbered (编号, v0.9.0+)
```blockdiag
A [numbered = 1];
B [numbered = 99];
```

#### icon (图标, v0.9.0+)
```blockdiag
// 本地文件
A [icon = "./icons/server.png"];

// 网络图片
B [icon = "http://example.com/icon.png"];
```

#### background (背景图, v0.9.0+)
```blockdiag
// 图片作为背景(通常清空 label)
A [label = "", background = "logo.png"];
B [background = "http://example.com/bg.jpg"];
```

### 5. 尺寸属性 (v0.9.5+)

```blockdiag
blockdiag {
   A [width = 192];   // 默认 128
   B [height = 64];   // 默认 40

   // 图表级默认值
   node_width = 200;
   node_height = 50;
}
```

### 6. 边属性

#### dir (方向)
```blockdiag
A -> B [dir = "forward"];  // 前向箭头(默认)
B -> C [dir = "back"];     // 后向箭头
C -> D [dir = "both"];     // 双向箭头
D -> E [dir = "none"];     // 无箭头
```

#### thick (粗线)
```blockdiag
A -> B [thick];  // 粗线连接
```

#### folded (折叠, v0.6.1+)
```blockdiag
blockdiag {
   A -> B -> C -> D -> E;

   // C->D 边折叠,D 布局在顶层
   C -> D [folded];
}
```

## 分组语法

### 1. 基本分组

```blockdiag
blockdiag {
   A -> B -> C;

   group {
      A; B;  // A 和 B 在一组
   }
}
```

### 2. 命名分组

```blockdiag
blockdiag {
   group my_group {
      A; B;
   }

   // 后续引用
   C [group = my_group];  // C 也加入 my_group
}
```

### 3. 分组属性

```blockdiag
group {
   label = "Group Title";           // 组标签
   color = "#E8F4F8";               // 背景颜色
   textcolor = "blue";              // 标签颜色
   shape = "line";                  // 线型组 (v1.0.1+)
   style = "dashed";                // 虚线边框
   fontsize = 14;                   // 标签字体大小

   A; B; C;
}
```

### 4. 嵌套分组

```blockdiag
blockdiag {
   group outer {
      label = "Outer";

      A -> B;

      group inner1 {
         label = "Inner 1";
         C -> D;
      }

      group inner2 {
         label = "Inner 2";
         E -> F;
      }
   }
}
```

**嵌套规则**:
- 支持任意层级嵌套
- 子组继承父组的部分属性
- 子组可覆盖父组属性

### 5. 分组形状 (v1.0.1+)

```blockdiag
// 默认盒型组
group {
   shape = "box";
   A; B;
}

// 线型组
group {
   shape = "line";
   style = "dotted";  // 线型组支持样式
   C; D;
}
```

## 图表级属性

### 1. 节点默认值

```blockdiag
blockdiag {
   // 默认尺寸
   node_width = 200;     // 默认 128
   node_height = 100;    // 默认 40

   // 默认形状 (v0.7.2+)
   default_shape = "roundedbox";

   // 默认颜色 (v0.9.1+)
   default_node_color = "lightblue";
   default_text_color = "navy";     // v1.0.0+
}
```

### 2. 间距设置

```blockdiag
blockdiag {
   span_width = 240;    // 水平间距,默认 64
   span_height = 120;   // 垂直间距,默认 40
}
```

### 3. 线条默认值 (v1.0.0+)

```blockdiag
blockdiag {
   default_linecolor = "blue";      // 线条颜色
   default_group_color = "#F5F5F5"; // 组背景颜色
}
```

### 4. 字体设置 (v0.9.7+)

```blockdiag
blockdiag {
   default_fontsize = 16;  // 全局字体大小,默认 11

   A -> B;
}
```

### 5. 方向设置

```blockdiag
blockdiag {
   // 横向布局(默认)
   orientation = landscape;

   // 纵向布局 (v0.7.0+)
   orientation = portrait;

   A -> B -> C;
}
```

## 类定义 (v0.9.7+)

### 语法

```blockdiag
blockdiag {
   // 定义类
   class emphasis [color = "pink", style = "dashed"];
   class important [color = "red", fontsize = 14];

   A [class = "emphasis"];        // 应用类
   B [class = "important"];
   C [class = "emphasis"];        // 多个节点共享类
}
```

### 类的优先级

```blockdiag
blockdiag {
   class myclass [color = "blue"];

   // 直接属性 > 类属性
   A [class = "myclass", color = "red"];
   // A 的颜色是 red,不是 blue
}
```

## 高级语法技巧

### 1. 使用 dots 形状隐藏节点

```blockdiag
blockdiag {
   A -> B, C, D;

   C [shape = "dots"];     // 点状占位符

   A -> C [style = "none"]; // 隐藏边
}
```

### 2. 折叠复杂布局

```blockdiag
blockdiag {
   A -> B -> C -> D -> E -> F;

   // 折叠边,控制布局
   B -> C [folded];
   D -> E [folded];
}
```

### 3. 组合形状和颜色

```blockdiag
blockdiag {
   // 彩色流程图
   start [shape = "beginpoint", color = "lightgreen"];
   process [shape = "box", color = "lightblue"];
   decision [shape = "flowchart.condition", color = "lightyellow"];
   db [shape = "flowchart.database", color = "lightgray"];
   end [shape = "endpoint", color = "pink"];

   start -> process -> decision;
   decision -> db -> end;
}
```

### 4. 多层架构图

```blockdiag
blockdiag {
   orientation = portrait;

   group presentation {
      label = "Presentation Layer";
      color = "#E3F2FD";
      web; mobile;
   }

   group business {
      label = "Business Layer";
      color = "#F3E5F5";
      api; service;
   }

   group data {
      label = "Data Layer";
      color = "#E8F5E9";
      db [shape = "flowchart.database"];
   }

   web, mobile -> api;
   api -> service -> db;
}
```

## 语法限制和约束

### 1. 命名约束
- ✅ 节点名区分大小写
- ✅ 关键字(blockdiag, group, class)不能作为节点名
- ✅ 使用引号可包含任意字符
- ❌ 避免使用纯数字或特殊符号开头

### 2. 属性约束
- 字符串值必须用引号包裹
- 数字值不需要引号
- 布尔值不存在(使用存在性判断,如 `stacked`)
- 未知属性会被忽略(不报错)

### 3. 连接约束
- 必须在定义节点后才能连接
- 循环连接是允许的
- 自连接(A -> A)是允许的

### 4. 分组约束
- 一个节点只能属于一个组
- 后定义的组会覆盖先前的组分配
- 嵌套组不能引用外层组的节点

### 5. 类约束
- 类必须在使用前定义
- 类名不能与节点名冲突
- 类属性不能包含引用(如 icon, background 路径)

## 注释语法

### 单行注释
```blockdiag
blockdiag {
   A -> B;  // 这是单行注释
   // 整行注释
}
```

### 多行注释
```blockdiag
blockdiag {
   /*
    * 这是多行注释
    * 可以跨越多行
    */
   A -> B;
}
```

## 转义和特殊字符

### 引号内的转义
```blockdiag
A [label = "Text with \"quotes\""];     // 转义引号
B [label = "Line 1\nLine 2"];          // 换行符
C [label = "Tab\there"];               // Tab 符
```

### Unicode 支持
```blockdiag
blockdiag {
   // UTF-8 编码的任意字符
   开始 -> 处理 -> 结束;
   開始 -> 處理 -> 終了;  // 繁体中文
   начало -> конец;      // 西里尔字母
}
```

**注意**: 需要配置支持 Unicode 的字体。

## 语法验证

### 常见语法错误

#### 1. 缺少分号或逗号
```blockdiag
// 错误
A [label = "Text"    // ❌ 缺少分号
    color = "red"]

// 正确
A [label = "Text",   // ✅ 逗号分隔
    color = "red"];
```

#### 2. 引号不匹配
```blockdiag
// 错误
A [label = "Text'];  // ❌ 引号不匹配

// 正确
A [label = "Text"];  // ✅
A [label = 'Text'];  // ✅ (单引号也可以)
```

#### 3. 花括号不匹配
```blockdiag
// 错误
blockdiag {
   group {
      A;
   // ❌ 缺少 group 的 }
}

// 正确
blockdiag {
   group {
      A;
   }  // ✅
}
```

#### 4. 未定义的节点
```blockdiag
// 允许但可能非预期
blockdiag {
   A -> B;  // B 被自动创建,没有属性
}

// 明确定义
blockdiag {
   A [label = "Node A"];
   B [label = "Node B"];
   A -> B;
}
```

## 调试技巧

### 1. 逐步构建
```blockdiag
// 第 1 步: 基本结构
blockdiag {
   A -> B;
}

// 第 2 步: 添加属性
blockdiag {
   A [label = "Start"];
   B [label = "End"];
   A -> B;
}

// 第 3 步: 添加分组
blockdiag {
   A [label = "Start"];
   B [label = "End"];
   A -> B;

   group {
      A; B;
   }
}
```

### 2. 使用注释隔离问题
```blockdiag
blockdiag {
   A -> B;
   // B -> C;  // 暂时注释掉测试
   C -> D;
}
```

### 3. 简化复杂图表
```blockdiag
// 复杂图表难以调试
blockdiag {
   A -> B, C, D, E;
   F, G, H -> I;
   // ... 更多连接
}

// 简化为子图
blockdiag {
   A -> B;
   A -> C;
   // 一次测试一部分
}
```

## 性能和优化

### 1. 避免过度复杂
- ❌ 超过 50 个节点考虑拆分
- ❌ 超过 5 层嵌套组简化结构
- ✅ 使用类减少重复属性定义

### 2. 属性优化
```blockdiag
// 低效: 重复定义
A [color = "blue", style = "dashed"];
B [color = "blue", style = "dashed"];
C [color = "blue", style = "dashed"];

// 高效: 使用类
class mystyle [color = "blue", style = "dashed"];
A [class = "mystyle"];
B [class = "mystyle"];
C [class = "mystyle"];
```

### 3. 输出格式选择
- PNG: 快速,适合文档
- SVG: 可缩放,适合 Web
- PDF: 高质量,适合打印

## 兼容性说明

### BlockDiag 版本
- v1.0+: 最新特性完整支持
- v0.9+: 大部分特性支持
- v0.8-: 部分高级特性不可用

### Python 版本
- Python 3.x: 完全支持
- Python 2.7: 基本支持(已废弃)

### Kroki 支持
- 完全兼容 BlockDiag 语法
- 支持 PNG, SVG, PDF 输出
- 在线服务无需本地安装
