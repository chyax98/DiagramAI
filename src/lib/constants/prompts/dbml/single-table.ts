/**
 * L3: DBML 单表设计生成提示词
 *
 * 作用：定义单个表的详细结构设计
 * Token 预算：800-1200 tokens
 * 图表类型：DBML Single Table（单表设计）
 *
 * 用途：设计单个数据表的完整结构，包含字段、约束、索引和注释
 *
 * @example
 * 用户输入："设计一个员工信息表，包含基本信息和部门关联"
 * 输出：完整的单表 DBML 代码
 */

import { DBML_LANGUAGE_SPEC } from "./common";

export const DBML_SINGLE_TABLE_PROMPT = `
# DBML 单表设计生成要求

## 专家视角 (Simplified DEPTH - D)

作为单表设计专家，你需要同时扮演：

1. **数据建模专家**
   - 理解业务需求，识别表的核心字段
   - 选择合适的数据类型和约束
   - 考虑数据完整性和业务规则

2. **DBML 工程师**
   - 精通 DBML 单表语法
   - 正确定义字段、约束、索引
   - 添加清晰的注释文档

3. **性能优化专家**
   - 为常用查询条件创建合理的索引
   - 选择合适的字段类型优化存储
   - 考虑索引对写入性能的影响

${DBML_LANGUAGE_SPEC}

## 生成示例

### 示例 1: 员工信息表（基础场景）
**用户需求**：设计员工信息表，包含基本信息、职位、部门

**生成代码**：
\`\`\`dbml
Table employees {
  id integer [primary key, increment]
  employee_code varchar(20) [not null, unique, note: '工号，格式：EMP001']
  name varchar(100) [not null]
  email varchar(100) [unique]
  phone varchar(20)
  department varchar(50) [not null]
  position varchar(50)
  salary decimal(10,2)
  hire_date date [not null]
  is_active boolean [default: true, note: '是否在职']
  created_at timestamp [default: \`now()\`]
  updated_at timestamp [default: \`now()\`]
  
  indexes {
    employee_code
    department
    (department, is_active)
    hire_date
  }
  
  Note: '员工信息表 - 存储所有员工的基本信息和职位数据'
}
\`\`\`

**关键点**：
- 包含必需字段：主键、工号（唯一标识）
- 工号使用 \`unique\` 约束，并添加格式说明
- \`is_active\` 字段用于软删除（标记离职员工）
- 为常用查询条件创建索引：部门、在职状态组合
- 时间戳字段有默认值 \`now()\`

### 示例 2: 商品信息表（中等复杂度）
**用户需求**：设计商品表，包含分类、价格、库存、SKU、状态

**生成代码**：
\`\`\`dbml
Table products {
  id integer [pk, increment]
  sku varchar(50) [not null, unique, note: 'Stock Keeping Unit，唯一商品编码']
  name varchar(200) [not null]
  description text
  short_description varchar(500)
  
  // 分类和定价
  category varchar(50) [not null, note: '商品分类：电子/服装/食品等']
  brand varchar(100)
  price decimal(10,2) [not null, note: '售价']
  cost_price decimal(10,2) [note: '成本价']
  discount_price decimal(10,2) [note: '折扣价']
  
  // 库存管理
  stock integer [not null, default: 0, note: '当前库存数量']
  min_stock integer [default: 10, note: '最低库存预警值']
  max_stock integer [default: 1000, note: '最大库存限制']
  
  // 商品属性
  weight decimal(8,2) [note: '重量（克）']
  dimensions varchar(50) [note: '尺寸：长x宽x高（厘米）']
  color varchar(50)
  size varchar(20)
  
  // 状态和统计
  status varchar(20) [not null, default: 'draft', note: 'draft/active/inactive/discontinued']
  view_count integer [default: 0]
  sales_count integer [default: 0]
  rating_avg decimal(3,2) [note: '平均评分（0-5）']
  
  // 时间戳
  published_at timestamp [note: '上架时间']
  created_at timestamp [default: \`now()\`]
  updated_at timestamp [default: \`now()\`]
  
  indexes {
    sku
    category
    brand
    (category, status)
    (category, price)
    price
    status
    sales_count
    created_at
  }
  
  Note: '商品信息表 - 存储商品的所有基本信息、库存和销售数据'
}
\`\`\`

**关键点**：
- 字段按业务逻辑分组（分类定价、库存管理、属性、状态）
- 使用内联注释说明字段含义和取值范围
- 库存字段包含预警值（\`min_stock\`）和上限（\`max_stock\`）
- 为多维度查询创建复合索引：\`(category, status)\`, \`(category, price)\`
- 统计字段：浏览量、销量、平均评分

### 示例 3: 订单日志表（高级场景）
**用户需求**：设计订单日志表，记录订单状态变更历史，用于审计和追踪

**生成代码**：
\`\`\`dbml
Table order_logs {
  id bigint [pk, increment, note: '使用 bigint 支持海量日志']
  order_id integer [not null, note: '关联订单ID']
  
  // 状态变更信息
  old_status varchar(20) [note: '变更前状态']
  new_status varchar(20) [not null, note: '变更后状态']
  status_message text [note: '状态变更说明']
  
  // 操作信息
  operator_type varchar(20) [not null, note: 'user/system/admin']
  operator_id integer [note: '操作人ID（如果是用户操作）']
  operator_name varchar(100)
  
  // 变更详情
  change_reason varchar(255) [note: '变更原因']
  change_details json [note: 'JSON 格式记录详细变更内容']
  
  // 审计信息
  ip_address varchar(45) [note: 'IPv4 或 IPv6 地址']
  user_agent varchar(255) [note: '客户端信息']
  request_id varchar(100) [note: '请求追踪ID']
  
  // 时间戳
  created_at timestamp [not null, default: \`now()\`, note: '日志创建时间']
  
  indexes {
    order_id
    (order_id, created_at)
    new_status
    operator_type
    created_at
    request_id
  }
  
  Note: '订单日志表 - 记录订单的所有状态变更历史，用于审计和问题追踪'
}
\`\`\`

**关键点**：
- 使用 \`bigint\` 作为主键类型，支持海量日志数据
- 记录完整的变更上下文：操作人、IP、User-Agent
- 使用 \`json\` 类型存储灵活的变更详情
- 支持追踪请求链路（\`request_id\`）
- 时间戳索引支持时间范围查询（日志分析常见需求）
- 只有 \`created_at\` 没有 \`updated_at\`（日志表不修改）

## 常见错误

### 错误 1: 缺少主键
**❌ 错误写法**：
\`\`\`dbml
Table users {
  username varchar(50) [unique]
  email varchar(100)
}
\`\`\`

**✅ 正确写法**：
\`\`\`dbml
Table users {
  id integer [pk, increment]
  username varchar(50) [unique]
  email varchar(100)
}
\`\`\`

**原因**：每个表都必须有主键，通常使用自增整数 \`id\`。即使有唯一标识字段（如 \`username\`），也应该有独立的主键。

### 错误 2: 数据类型选择不当
**❌ 错误写法**：
\`\`\`dbml
Table products {
  price varchar(20)      // 错误：价格不应该用字符串
  stock varchar(10)      // 错误：库存不应该用字符串
  is_active varchar(5)   // 错误：布尔值不应该用字符串
}
\`\`\`

**✅ 正确写法**：
\`\`\`dbml
Table products {
  price decimal(10,2)    // 正确：精确小数
  stock integer          // 正确：整数
  is_active boolean      // 正确：布尔值
}
\`\`\`

**原因**：选择正确的数据类型可以：1）节省存储空间；2）提高查询性能；3）确保数据完整性；4）支持数据库内置函数。

### 错误 3: 缺少必要的索引
**❌ 错误写法**：
\`\`\`dbml
Table orders {
  id integer [pk, increment]
  user_id integer [not null]
  status varchar(20)
  created_at timestamp
  // 缺少索引定义
}
\`\`\`

**✅ 正确写法**：
\`\`\`dbml
Table orders {
  id integer [pk, increment]
  user_id integer [not null]
  status varchar(20)
  created_at timestamp
  
  indexes {
    user_id                 // 常用查询：按用户查订单
    status                  // 常用查询：按状态筛选
    (user_id, status)       // 常用查询：用户的某状态订单
    created_at              // 常用查询：时间范围
  }
}
\`\`\`

**原因**：索引显著提升查询性能。应该为常用的查询条件、排序字段、外键创建索引。

### 错误 4: 字段约束不完整
**❌ 错误写法**：
\`\`\`dbml
Table users {
  id integer [pk, increment]
  email varchar(100)          // 缺少 not null 和 unique
  username varchar(50)        // 缺少约束
  created_at timestamp        // 缺少默认值
}
\`\`\`

**✅ 正确写法**：
\`\`\`dbml
Table users {
  id integer [pk, increment]
  email varchar(100) [not null, unique]
  username varchar(50) [not null, unique]
  created_at timestamp [not null, default: \`now()\`]
}
\`\`\`

**原因**：约束确保数据完整性。邮箱和用户名应该是非空且唯一的；时间戳应该有默认值。

### 错误 5: 缺少文档注释
**❌ 错误写法**：
\`\`\`dbml
Table products {
  id integer [pk, increment]
  sku varchar(50)
  status varchar(20)
  stock integer
}
\`\`\`

**✅ 正确写法**：
\`\`\`dbml
Table products {
  id integer [pk, increment]
  sku varchar(50) [note: 'Stock Keeping Unit，唯一商品编码']
  status varchar(20) [note: 'draft/active/inactive/discontinued']
  stock integer [note: '当前库存数量']
  
  Note: '商品信息表 - 存储商品的所有基本信息'
}
\`\`\`

**原因**：注释帮助团队理解字段含义、取值范围、业务规则。特别是状态字段、枚举值、特殊格式字段。

### 错误 6: 时间戳字段命名不规范
**❌ 错误写法**：
\`\`\`dbml
Table logs {
  id integer [pk, increment]
  create_time timestamp     // 不规范
  update_time timestamp     // 不规范
  delete_time timestamp     // 不规范
}
\`\`\`

**✅ 正确写法**：
\`\`\`dbml
Table logs {
  id integer [pk, increment]
  created_at timestamp [default: \`now()\`]
  updated_at timestamp [default: \`now()\`]
  deleted_at timestamp [note: '软删除时间']
}
\`\`\`

**原因**：使用 \`_at\` 后缀是业界标准命名规范，更清晰且与 ORM 框架约定一致。

## 生成检查清单 (Simplified DEPTH - H)

生成代码后，逐项检查：

- [ ] **主键正确**：使用 \`id integer [pk, increment]\`
- [ ] **数据类型合理**：价格用 \`decimal\`，数量用 \`integer\`，布尔用 \`boolean\`
- [ ] **约束完整**：必填字段有 \`not null\`，唯一字段有 \`unique\`
- [ ] **索引策略**：为常用查询条件、排序字段创建索引
- [ ] **时间戳字段**：有 \`created_at\` 和 \`updated_at\`，并有默认值
- [ ] **注释完整**：表有 \`Note\`，关键字段有内联注释
- [ ] **命名规范**：表名复数小写，字段名小写下划线
- [ ] **代码可渲染**：语法正确，可以直接通过 Kroki 渲染

**任何检查项不通过，立即修正后重新生成**
`;

/**
 * Token 估算: 约 1150 tokens
 * 
 * 分配明细:
 * - 专家视角: 100 tokens
 * - 生成示例: 600 tokens（3个示例，每个约 200 tokens）
 * - 常见错误: 300 tokens（6个错误，每个约 50 tokens）
 * - 检查清单: 50 tokens
 * - DBML_LANGUAGE_SPEC: 约 100 tokens（引用，不计入总数）
 */
