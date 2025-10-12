# Erd 语法规则

## 文件结构

Erd 文件由以下元素组成，按顺序排列：

1. **全局指令** (可选，必须在最前面)
2. **实体定义**
3. **关系定义**

## 1. 全局指令

### 必须位置
全局指令**必须**出现在所有实体和关系定义之前。

### 支持的指令

#### title - 图表标题
```erd
title {label: "图表标题", size: "20", color: "#000000"}
```

#### entity - 全局实体样式
```erd
entity {bgcolor: "#ececfc", size: "16", font: "Helvetica"}
```

#### header - 全局实体头部样式
```erd
header {bgcolor: "#d0e0d0", color: "#000000", size: "18"}
```

#### relationship - 全局关系样式
```erd
relationship {color: "#333333", size: "14"}
```

## 2. 实体定义

### 基本语法

```erd
[实体名]
属性1
属性2
属性3
```

### 实体名规则

1. **基本命名**: 使用 ASCII 字母、数字、下划线
   ```erd
   [Person]
   [User_Account]
   [Product2023]
   ```

2. **包含空格或特殊字符**: 必须使用引号
   ```erd
   [`Birth Place`]      # 反引号
   ['User Account']     # 单引号
   ["Product Info"]     # 双引号
   ```

3. **不能使用**: ASCII 控制字符 (回车、换行等)

### 属性定义

#### 基本属性
```erd
[Person]
name
height
weight
```

#### 主键 (Primary Key)
使用 `*` 前缀：
```erd
[Person]
*person_id
name
```

#### 外键 (Foreign Key)
使用 `+` 前缀：
```erd
[Person]
*person_id
+birth_place_id
```

#### 复合键
同时是主键和外键，使用 `*+` 或 `+*`：
```erd
[Order_Item]
*+order_id
*+product_id
quantity
```

### 实体格式化

#### 单个实体样式
```erd
[Person] {bgcolor: "#ececfc", size: "20", border: "2"}
*person_id
name
```

#### 属性级别样式
```erd
[Person]
*person_id {label: "varchar(50), not null", color: "#ff0000"}
full_name {label: "varchar(100), null"}
age {label: "integer"}
```

## 3. 关系定义

### 基数符号

| 符号 | 含义 | 说明 |
|------|------|------|
| `?` | 0 或 1 | 可选的单一关系 |
| `1` | 恰好 1 | 必须的单一关系 |
| `*` | 0 或多个 | 可选的多重关系 |
| `+` | 1 或多个 | 必须的多重关系 |

### 关系语法

#### 基本关系
```erd
实体A 基数1--基数2 实体B
```

#### 示例
```erd
# 每个 Person 有恰好一个 Birth Place
Person *--1 `Birth Place`

# 每个 Artist 可能有白金专辑
Artist +--? PlatinumAlbums

# 双向多对多
Student *--* Course

# 一对多
Department 1--* Employee
```

### 关系标签

```erd
# 单个标签
Person *--1 Address {label: "lives at"}

# 多个关系，不同标签
game *--1 team {label: "home"}
game *--1 team {label: "away"}
```

### 自引用关系

```erd
# 员工可能有一个经理 (也是员工)
Employee ?--1 Employee {label: "manages"}
```

## 4. 格式化选项

### 颜色表示

#### 十六进制
```erd
{color: "#3366ff"}
{bgcolor: "#ececfc"}
```

#### 颜色名称
使用 [X11 颜色名](https://hackage.haskell.org/package/graphviz-2999.20.1.0/docs/Data-GraphViz-Attributes-Colors-X11.html)：
```erd
{color: "CornflowerBlue"}
{bgcolor: "AliceBlue"}
```

### 支持的格式化属性

| 属性 | 适用范围 | 说明 |
|------|----------|------|
| `label` | 所有 | 标签文本 |
| `color` | 所有 | 字体颜色 |
| `bgcolor` | 实体、属性 | 背景颜色 |
| `size` | 所有 | 字体大小 |
| `font` | 所有 | 字体 (Times-Roman, Helvetica, Courier) |
| `border-color` | 实体、属性 | 边框颜色 |
| `border` | 实体、属性 | 边框宽度 (像素) |

### 格式化语法

```erd
[实体] {属性1: "值1", 属性2: "值2"}

# 多行格式
[实体] {
  bgcolor: "#ececfc",
  size: "20",
  font: "Helvetica"
}
```

**注意事项**:
- 左花括号必须在同一行
- 属性名后跟冒号
- 值使用双引号 (包括数字)
- 用逗号分隔
- 允许尾随逗号
- 可跨多行

## 5. 注释

### 单行注释
```erd
# 这是一行注释
[Person]  # 也可以在行尾注释
```

### 块注释
Erd 不支持块注释，只能使用 `#` 单行注释。

## 6. 完整示例

```erd
# ========================================
# 学生选课系统 ER 图
# ========================================

# 全局配置
title {label: "Student Course System", size: "20"}
entity {bgcolor: "#f0f0f0", size: "14"}

# 实体定义
[Student] {bgcolor: "#d0e0d0"}
*student_id {label: "varchar(20), PK"}
name {label: "varchar(100), not null"}
email {label: "varchar(100), unique"}
+major_id {label: "int, FK"}

[Course] {bgcolor: "#d0e0d0"}
*course_id {label: "varchar(20), PK"}
title {label: "varchar(200), not null"}
credits {label: "int, not null"}
+department_id {label: "int, FK"}

[Enrollment] {bgcolor: "#ffe0e0"}
*+student_id {label: "varchar(20), PK, FK"}
*+course_id {label: "varchar(20), PK, FK"}
grade {label: "varchar(2)"}
semester {label: "varchar(20)"}

[Department] {bgcolor: "#e0e0ff"}
*department_id {label: "int, PK"}
name {label: "varchar(100), not null"}
building {label: "varchar(50)"}

# 关系定义
Student 1--* Enrollment {label: "enrolls in"}
Course 1--* Enrollment {label: "has"}
Department 1--* Course {label: "offers"}
Department 1--* Student {label: "belongs to"}
```

## 7. 语法限制

### 不支持的特性

1. **块注释** - 只支持 `#` 单行注释
2. **嵌套实体** - 不支持实体嵌套定义
3. **条件逻辑** - 不支持 if/else 等控制结构
4. **变量** - 不支持用户定义变量
5. **循环** - 不支持循环语句

### 命名限制

**避免使用的字符**:
- ASCII 控制字符 (0x00-0x1F, 0x7F)
- 回车 `\r`
- 换行 `\n` (除非在字符串内)

**安全命名**:
- 使用字母、数字、下划线
- 或使用引号包裹特殊名称

## 8. 最佳实践

### 组织结构
```erd
# 1. 全局指令
title {...}
entity {...}

# 2. 核心实体
[Entity1]
...

[Entity2]
...

# 3. 关联实体
[Association]
...

# 4. 关系定义
Entity1 *--1 Entity2
...
```

### 命名约定
- **实体名**: 大写开头，单数形式 (Person, not Persons)
- **属性名**: 小写下划线 (user_id, not userId)
- **关系标签**: 使用动词 (owns, belongs to, manages)

### 格式化建议
- **主实体**: 使用显眼的背景色 (如 #d0e0d0)
- **关联实体**: 使用对比色 (如 #ffe0e0)
- **必填字段**: 在 label 中标注 "not null"
- **键约束**: 明确标注 PK/FK

### 注释规范
```erd
# ========================================
# 模块名称
# ========================================

# 实体组: 用户相关
[User]
...

# 实体组: 订单相关
[Order]
...
```

## 9. 错误处理

### 常见语法错误

1. **全局指令位置错误**
   ```erd
   # 错误: title 在实体之后
   [Person]
   name

   title {label: "Wrong"}  # ❌
   ```

2. **关系语法错误**
   ```erd
   # 错误: 缺少基数
   Person -- Address  # ❌

   # 正确
   Person *--1 Address  # ✓
   ```

3. **格式化语法错误**
   ```erd
   # 错误: 花括号不在同一行
   [Person]
   {bgcolor: "#fff"}  # ❌

   # 正确
   [Person] {bgcolor: "#fff"}  # ✓
   ```

### 调试技巧

1. **使用 DOT 输出**
   ```bash
   erd -i schema.er -o schema.dot
   ```

2. **检查 GraphViz 错误**
   ```bash
   erd -i schema.er | dot -Tsvg -o output.svg
   ```

3. **逐步添加** - 从简单开始，逐步添加复杂性
