# UMLet 官方文档

> **渲染引擎**: UMLet
> **官方网站**: https://www.umlet.com
> **GitHub 仓库**: https://github.com/umlet/umlet
> **许可证**: GPL-3.0
> **最新版本**: 15.1

---

## 📋 概述

UMLet 是一个**免费、开源的 UML 工具**，专为**快速绘制 UML 草图**而设计。它采用简单的用户界面：通过文本输入而不是弹出对话框来修改 UML 元素属性。

**核心理念**:
- 快速绘制 UML 图表
- 基于文本的属性编辑
- Markdown 风格的简化语法
- 无需复杂的弹出对话框

---

## 🎯 设计哲学

### 快速 UML 草图工具

UMLet 的主要目标是让用户能够**快速创建 UML 草图**，而不是精确的 UML 模型。

**与传统 UML 工具的区别**:
- ❌ 不追求模型一致性
- ❌ 不强制 UML 规范
- ❌ 没有复杂的元模型
- ✅ 专注于快速可视化
- ✅ 简化的用户交互
- ✅ 文本驱动的编辑

---

## 🖥️ 用户界面

### 主界面组成

UMLet 主界面包含三个面板：

1. **图表面板** (Diagram Panel)
   - 显示 UML 图表
   - 允许移动元素位置

2. **调色板面板** (Palette Panel)
   - 列出可用的 UML 元素
   - 双击添加到图表

3. **属性面板** (Property Panel)
   - 查看和修改元素属性
   - 基于文本的编辑

### 无弹窗设计

**传统工具**:
```
点击元素 → 弹出对话框 → 修改属性 → 确认
```

**UMLet 方式**:
```
选择元素 → 在属性面板编辑文本 → 实时预览
```

---

## 📝 基础语法

### 1. 类图元素

#### 类 (Class)

```
ClassName
--
attribute1
attribute2
--
method1()
method2()
--
bg=green
```

**语法规则**:
- 第一行: 类名（居中显示）
- `--` (双横线): 分隔线
- 其他行: 属性或方法（左对齐）
- `bg=color`: 设置背景颜色

#### 接口 (Interface)

```
<<interface>>
InterfaceName
--
method1()
method2()
```

#### 抽象类

```
/AbstractClass/
--
abstractMethod()
```

**斜体语法**: `/text/` 表示斜体（抽象类/方法）

---

### 2. 关系

#### 关联 (Association)

```
关系属性面板:
r1=Role1
r2=Role2
m1=1
m2=*
q1=qualifier1
```

- `r1=`, `r2=`: 角色名
- `m1=`, `m2=`: 多重性
- `q1=`, `q2=`: 限定符

#### 继承 (Inheritance)

```
使用箭头元素，设置:
fg=black
transparency=0
```

---

### 3. 用例图

```
用例元素:
(Use Case Name)

参与者元素:
Actor Name
```

---

### 4. 时序图

UMLet 提供 **All-in-One 时序图元素**：

```
_name1~ID1_
_name2~ID2_

ID1->ID2:message1
ID2->ID1:message2
```

**语法规则**:
- `_name~ID_`: 定义泳道
- `ID1->ID2:message`: 定义消息
- 使用 TAB 缩进定义分叉

---

### 5. 活动图

**All-in-One 活动图元素**：

```
Activity 1
--
Activity 2
--
TAB Activity 3
--
TAB Activity 4
```

**TAB 缩进**: 定义活动分叉

---

## 🎨 样式和格式

### 颜色设置

```
bg=colorName        # 背景色
fg=colorName        # 前景色/文本色
```

**支持的颜色名**:
- red, green, blue, yellow
- orange, pink, purple, gray
- white, black
- 或 HTML 颜色代码: `#FF0000`

### 文本格式

```
/italic/            # 斜体
*bold*              # 粗体（部分元素支持）
```

### 对齐

- 类名: 自动居中
- 属性/方法: 自动左对齐
- 使用空格调整位置

---

## 🔧 高级特性

### 1. 自定义元素

UMLet 允许用户**在运行时创建新的 UML 元素类型**。

#### 自定义元素界面

当创建自定义元素时，属性面板扩展为三个部分：

1. **属性面板** (Property Panel)
2. **源代码面板** (Source Code Panel)
3. **预览面板** (Preview Panel)

#### 编程模型

**全局变量**:
```java
textlines         // 属性文本行的向量
textheight()      // 像素高度
```

**绘图方法**:
```java
printLeft(text, x, y)     // 左对齐打印
drawRect(x, y, w, h)      // 绘制矩形
allowResize(...)          // 允许调整大小
```

#### 实时编译

- 代码在后台持续编译
- 预览面板提供即时反馈
- 编译错误会高亮显示

---

### 2. 从文本生成图表

#### 序列图生成

```
alice->bob: Authentication Request
bob-->alice: Authentication Response
alice->bob: Another authentication Request
alice<--bob: another authentication Response
```

#### 活动图生成

```
start
activity1
if(condition?)
  activity2
else
  activity3
endif
stop
```

---

## 📚 支持的图表类型

UMLet 支持多种 UML 图表：

- ✅ **类图** (Class Diagrams)
- ✅ **用例图** (Use Case Diagrams)
- ✅ **时序图** (Sequence Diagrams)
- ✅ **状态图** (State Diagrams)
- ✅ **部署图** (Deployment Diagrams)
- ✅ **活动图** (Activity Diagrams)
- ✅ **组件图** (Component Diagrams)
- ✅ **对象图** (Object Diagrams)

---

## 💾 导出格式

UMLet 支持多种导出格式：

- **SVG** - 矢量图形
- **PDF** - 可打印文档
- **JPG** - 位图图像
- **PNG** - 透明背景位图
- **EPS** - PostScript 矢量
- **剪贴板** - 直接复制

### 命令行导出

```bash
# 转换单个文件
java -jar umlet.jar -action=convert -format=pdf -filename=diagram.uxf

# 批量转换
java -jar umlet.jar -action=convert -format=svg -filename=palettes/*.uxf -output=.
```

---

## 🔄 与 Eclipse 集成

### Eclipse 插件特性

- 在 Eclipse 中直接编辑 UML 图
- 与代码同步
- 版本控制集成
- 快捷键支持

### 安装方式

1. **Marketplace**: 在 Eclipse Marketplace 搜索 "UMLet"
2. **Update Site**: https://www.umlet.com/eclipse
3. **离线安装**: 下载 ZIP 后本地安装

---

## 🆚 与其他工具对比

### UMLet vs PlantUML

| 特性 | UMLet | PlantUML |
|------|-------|----------|
| 编辑方式 | 可视化 + 文本 | 纯文本 |
| 学习曲线 | 低 | 中 |
| 自定义能力 | 高（Java 代码） | 中（配置） |
| 图表类型 | 全部 UML | 全部 UML + 非 UML |
| 实时预览 | ✅ | ✅ |

### UMLet vs draw.io

| 特性 | UMLet | draw.io |
|------|-------|---------|
| 专注领域 | UML | 通用图表 |
| 离线使用 | ✅ | ✅ |
| 云存储 | ❌ | ✅ |
| 协作编辑 | ❌ | ✅ |
| 文本驱动 | ✅ | ❌ |

---

## 🛠️ 可用版本

### 1. 独立应用 (Stand-alone)

- **平台**: Windows, macOS, Linux
- **特性**: 完整功能集
- **下载**: https://www.umlet.com/

### 2. Eclipse 插件

- **要求**: Eclipse IDE
- **集成**: 与代码编辑器无缝集成
- **安装**: Eclipse Marketplace

### 3. Web 版 (UMLetino)

- **URL**: https://www.umletino.com
- **特性**: 浏览器中使用
- **限制**: 功能略少于桌面版

### 4. VS Code 扩展

- **Marketplace**: TheUMLetTeam.umlet
- **特性**: VS Code 中编辑 .uxf 文件
- **限制**: 功能受 VS Code API 限制

---

## 📖 学习资源

### 官方资源

- **官网**: https://www.umlet.com
- **FAQ**: https://www.umlet.com/faq.htm
- **Wiki**: https://github.com/umlet/umlet/wiki
- **教程**: https://www.umlet.com/tutorial.htm

### 社区资源

- **GitHub Discussions**: https://github.com/umlet/umlet/discussions
- **Stack Overflow**: 标签 `umlet`
- **YouTube**: 搜索 "UMLet tutorial"

---

## 🎓 快速入门

### 5分钟教程

1. **下载安装** UMLet
2. **双击调色板元素** 添加到图表
3. **在属性面板编辑文本**
4. **拖动调整位置**
5. **导出为 PDF/SVG**

### 第一个类图

```
1. 从调色板选择 "Class" 元素
2. 双击添加到图表
3. 在属性面板输入:

MyClass
--
-privateField: String
+publicMethod(): void

4. 点击应用
```

---

## 💡 最佳实践

### 1. 使用模板

- 将常用元素保存到自定义调色板
- 创建项目特定的元素模板
- 利用复制粘贴加速绘图

### 2. 键盘快捷键

```
Ctrl + C/V    # 复制粘贴
Ctrl + Z      # 撤销
Ctrl + D      # 删除
Ctrl + +/-    # 缩放
```

### 3. 版本控制

- .uxf 文件是 XML 格式
- 适合 Git 版本控制
- 可以进行文本对比

---

## 🔗 相关工具

- **UMLet**: 主项目
- **UMLetino**: Web 版本
- **VS Code UMLet**: 编辑器扩展
- **Eclipse UMLet**: IDE 插件

---

## 🌐 使用场景

1. **软件设计**: 快速绘制架构图
2. **教学**: 演示 UML 概念
3. **文档**: 嵌入技术文档
4. **原型**: 系统设计原型
5. **协作**: 团队设计讨论

---

**最后更新**: 2025-10-13
**版本**: 基于 UMLet 15.1
