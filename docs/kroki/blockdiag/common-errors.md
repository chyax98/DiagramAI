# BlockDiag 常见错误和解决方案

## 语法解析错误

### 1. 语法错误 (Syntax Error)

#### 错误现象

```
ERROR: Syntax error at line X
```

#### 常见原因及解决方案

##### 原因 1: 缺少分号或逗号

```blockdiag
// 错误
blockdiag {
   A [label = "Text"
       color = "red"]  // ❌ 缺少逗号
}

// 正确
blockdiag {
   A [label = "Text",
       color = "red"];  // ✅ 添加逗号
}
```

##### 原因 2: 引号不匹配

```blockdiag
// 错误
A [label = "Text'];  // ❌ 双引号开始,单引号结束

// 正确
A [label = "Text"];  // ✅ 配对使用
A [label = 'Text'];  // ✅ 单引号也可以
```

##### 原因 3: 花括号不匹配

```blockdiag
// 错误
blockdiag {
   group {
      A -> B;
   // ❌ 缺少组的结束括号
}

// 正确
blockdiag {
   group {
      A -> B;
   }  // ✅ 完整闭合
}
```

##### 原因 4: 特殊字符未转义

```blockdiag
// 错误
A [label = "Text with "quotes""];  // ❌ 未转义引号

// 正确
A [label = "Text with \"quotes\""];  // ✅ 转义引号
A [label = 'Text with "quotes"'];   // ✅ 使用单引号
```

### 2. 未知属性警告 (Unknown attribute)

#### 错误现象

```
WARNING: Unknown attribute 'xyz' at line X
```

#### 原因及解决方案

##### 原因 1: 属性名拼写错误

```blockdiag
// 错误
A [lable = "Text"];      // ❌ lable -> label
A [collor = "red"];      // ❌ collor -> color
A [shpae = "box"];       // ❌ shpae -> shape

// 正确
A [label = "Text"];      // ✅
A [color = "red"];       // ✅
A [shape = "box"];       // ✅
```

##### 原因 2: 版本不支持的属性

```blockdiag
// v0.8 及更早版本
A [stacked];  // ❌ stacked 是 v0.8.2+ 特性

// 解决: 升级 blockdiag
pip install --upgrade blockdiag

// 或避免使用新特性
A [style = "dashed"];  // ✅ 使用旧版支持的属性
```

### 3. 节点未定义错误

#### 错误现象

```
ERROR: Node 'X' not found
```

#### 原因及解决方案

```blockdiag
// 错误: 使用未定义的节点
blockdiag {
   A -> B;
   C [group = nonexistent];  // ❌ 组不存在
}

// 正确: 先定义再使用
blockdiag {
   group mygroup {
      A; B;
   }
   C [group = mygroup];  // ✅ 引用已定义的组
}
```

## 渲染错误

### 4. 字体相关错误

#### 错误现象

```
ERROR: Cannot find font
WARNING: Font not found, using default
```

#### 解决方案

##### 方案 1: 命令行指定字体

```bash
# Linux
blockdiag --font=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf diagram.diag

# macOS
blockdiag --font=/System/Library/Fonts/Helvetica.ttc diagram.diag

# Windows
blockdiag --font=C:\Windows\Fonts\arial.ttf diagram.diag
```

##### 方案 2: 配置文件

创建 `~/.blockdiagrc`:

```ini
[blockdiag]
fontpath = /usr/share/fonts/truetype/dejavu/DejaVuSans.ttf
```

##### 方案 3: 安装字体

```bash
# Ubuntu/Debian
sudo apt-get install fonts-dejavu

# Fedora/RHEL
sudo dnf install dejavu-sans-fonts

# macOS (使用 Homebrew)
brew tap homebrew/cask-fonts
brew install font-dejavu
```

### 5. 中文/多语言显示问题

#### 错误现象

- 中文显示为方框 □□□
- 乱码或问号 ???
- 部分字符缺失

#### 解决方案

##### 方案 1: 使用支持 Unicode 的字体

```bash
# Linux (中文)
blockdiag --font=/usr/share/fonts/truetype/wqy-microhei.ttc diagram.diag

# macOS (中文)
blockdiag --font=/System/Library/Fonts/PingFang.ttc diagram.diag

# Windows (中文)
blockdiag --font=C:\Windows\Fonts\msyh.ttc diagram.diag
```

##### 方案 2: 确保文件编码为 UTF-8

```bash
# 检查文件编码
file -i diagram.diag

# 转换为 UTF-8
iconv -f GBK -t UTF-8 diagram.diag > diagram_utf8.diag

# 或使用 dos2unix 处理行尾符
dos2unix diagram.diag
```

##### 方案 3: 配置文件永久设置

```ini
# ~/.blockdiagrc
[blockdiag]
fontpath = /usr/share/fonts/truetype/wqy-microhei.ttc
```

### 6. 图像输出错误

#### 错误: 无法生成 SVG

```
ERROR: unknown format: SVG
```

**原因**: SVG 支持需要额外依赖

**解决方案**:

```bash
pip install blockdiag[svg]
# 或
pip install cairosvg
```

#### 错误: 无法生成 PDF

```
ERROR: unknown format: PDF
```

**原因**: PDF 支持需要额外依赖

**解决方案**:

```bash
pip install "blockdiag[pdf]"
# 或单独安装依赖
pip install reportlab
```

### 7. 图像质量问题

#### 问题: 图像模糊

**原因**: 默认尺寸过小

**解决方案**:

```blockdiag
blockdiag {
   // 增大节点尺寸
   node_width = 256;   // 默认 128
   node_height = 80;   // 默认 40

   A -> B -> C;
}
```

**或使用 SVG**:

```bash
blockdiag -T svg diagram.diag
```

#### 问题: 文字重叠

**原因**: 标签文本过长

**解决方案**:

```blockdiag
// 方法 1: 增大节点宽度
A [label = "Very Long Label", width = 200];

// 方法 2: 使用换行
A [label = "Very Long\nLabel"];

// 方法 3: 缩小字体
A [label = "Very Long Label", fontsize = 10];
```

## 布局问题

### 8. 布局混乱

#### 问题: 节点重叠

**原因**: 间距设置过小

**解决方案**:

```blockdiag
blockdiag {
   // 增大间距
   span_width = 100;   // 默认 64
   span_height = 60;   // 默认 40

   A -> B -> C;
}
```

#### 问题: 箭头交叉

**原因**: 复杂连接导致自动布局困难

**解决方案**:

```blockdiag
// 方法 1: 使用 folded 边
blockdiag {
   A -> B -> C -> D;
   A -> D [folded];  // 折叠长边
}

// 方法 2: 使用分组
blockdiag {
   group {
      A -> B;
   }
   group {
      C -> D;
   }
   B -> C;
}

// 方法 3: 简化图表
// 拆分为多个小图
```

### 9. 分组显示问题

#### 问题: 分组边框不显示

**原因**: 组内没有节点

**解决方案**:

```blockdiag
// 错误: 空组
group empty_group {
   // 没有节点
}

// 正确: 添加节点
group my_group {
   A; B;
}
```

#### 问题: 嵌套组显示异常

**原因**: 嵌套层级过深

**解决方案**:

```blockdiag
// 避免超过 3 层嵌套
group level1 {
   group level2 {
      group level3 {
         // 可能出现渲染问题
      }
   }
}

// 改为扁平结构
group level1 {
   A;
}
group level2 {
   B;
}
```

## 性能问题

### 10. 渲染速度慢

#### 症状

- 生成大型图表耗时过长
- Python 进程占用大量 CPU

#### 解决方案

##### 方案 1: 拆分大图

```bash
# 将 big_diagram.diag 拆分为多个文件
# part1.diag, part2.diag, part3.diag

# 并行渲染
for f in part*.diag; do
   blockdiag "$f" &
done
wait
```

##### 方案 2: 简化复杂度

```blockdiag
// 避免: 过多节点和连接
blockdiag {
   A -> B, C, D, E, F, G, H, I, J;
   B -> C, D, E, F, G, H, I, J;
   // ... 100+ 连接
}

// 改为: 使用分组抽象
blockdiag {
   Frontend -> Backend -> Database;

   group Frontend {
      Web; Mobile;
   }
   group Backend {
      API; Service;
   }
}
```

##### 方案 3: 使用缓存

```bash
#!/bin/bash
# 仅渲染修改过的文件

for f in *.diag; do
   png="${f%.diag}.png"
   if [ ! -f "$png" ] || [ "$f" -nt "$png" ]; then
      echo "Rendering $f..."
      blockdiag "$f"
   fi
done
```

### 11. 内存占用过高

#### 症状

```
MemoryError: Unable to allocate array
```

#### 解决方案

##### 方案 1: 增加虚拟内存 (Linux)

```bash
# 检查当前 swap
free -h

# 创建 swap 文件
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

##### 方案 2: 减小输出尺寸

```blockdiag
blockdiag {
   // 减小节点尺寸
   node_width = 96;   // 从 128 减小
   node_height = 30;  // 从 40 减小
}
```

##### 方案 3: 使用 SVG 而非 PNG

```bash
# SVG 是矢量格式,内存占用更小
blockdiag -T svg large_diagram.diag
```

## 集成工具错误

### 12. Sphinx 集成问题

#### 错误: sphinxcontrib.blockdiag 未找到

```
Extension error: Could not import extension sphinxcontrib.blockdiag
```

**解决方案**:

```bash
pip install sphinxcontrib-blockdiag
```

#### 错误: Sphinx 中图像不显示

**原因**: 路径配置错误

**解决方案**:

```python
# conf.py
blockdiag_fontpath = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
blockdiag_html_image_format = 'SVG'  # 或 'PNG'
blockdiag_tex_image_depth = 'PNG'
```

```rst
# 文档中使用
.. blockdiag::
   :caption: System Architecture
   :align: center

   blockdiag {
      A -> B;
   }
```

### 13. Kroki 集成问题

#### 问题: Kroki URL 过长

**原因**: 复杂图表编码后 URL 超过限制

**解决方案**:

```bash
# 使用 POST 请求
curl -X POST https://kroki.io/blockdiag/png \
  -H "Content-Type: text/plain" \
  --data-binary @diagram.diag \
  -o output.png
```

#### 问题: 编码错误

**原因**: 特殊字符编码问题

**解决方案**:

```python
import zlib
import base64

def encode_blockdiag(diagram):
    compressed = zlib.compress(diagram.encode('utf-8'), 9)
    encoded = base64.urlsafe_b64encode(compressed).decode('ascii')
    return encoded.rstrip('=')

# 使用
diagram = '''
blockdiag {
   A -> B;
}
'''
url = f"https://kroki.io/blockdiag/png/{encode_blockdiag(diagram)}"
```

## 特殊场景错误

### 14. 形状不显示

#### 问题: flowchart 形状显示为普通方框

**原因**: 形状名称错误

**解决方案**:

```blockdiag
// 错误
A [shape = "condition"];       // ❌ 缺少前缀

// 正确
A [shape = "flowchart.condition"];  // ✅ 完整名称
```

#### 问题: dots 形状不起作用

**原因**: 版本过旧

**解决方案**:

```bash
# 检查版本
blockdiag --version

# 升级到 v0.8.2+
pip install --upgrade blockdiag
```

### 15. 边显示问题

#### 问题: 箭头方向错误

**原因**: dir 属性设置错误

**解决方案**:

```blockdiag
// A -> B 默认从 A 指向 B

// 反向箭头
A -> B [dir = "back"];    // 箭头从 B 指向 A

// 双向箭头
A -> B [dir = "both"];

// 无箭头
A -> B [dir = "none"];
```

#### 问题: folded 边不折叠

**原因**: 版本过旧或语法错误

**解决方案**:

```blockdiag
// 确保 v0.6.1+
blockdiag {
   A -> B -> C -> D;

   // 正确使用 folded
   C -> D [folded];  // ✅

   // 不能用于分支
   A -> B, C [folded];  // ❌ 无效
}
```

### 16. 类定义问题

#### 问题: 类不生效

**原因**: 类定义在使用之后

**解决方案**:

```blockdiag
// 错误
blockdiag {
   A [class = "mystyle"];  // ❌ 先使用

   class mystyle [color = "red"];  // 后定义
}

// 正确
blockdiag {
   class mystyle [color = "red"];  // ✅ 先定义

   A [class = "mystyle"];  // 后使用
}
```

#### 问题: 类属性被覆盖

**说明**: 直接属性优先级高于类属性

**解决方案**:

```blockdiag
blockdiag {
   class mystyle [color = "blue"];

   // 直接属性覆盖类属性
   A [class = "mystyle", color = "red"];  // A 是红色

   // 只使用类属性
   B [class = "mystyle"];  // B 是蓝色
}
```

## 调试方法

### 通用调试流程

1. **启用详细输出**

```bash
blockdiag -v diagram.diag
```

2. **启用调试模式**

```bash
blockdiag --debug diagram.diag
```

3. **逐步构建**

```blockdiag
// 步骤 1: 最简图
blockdiag { A -> B; }

// 步骤 2: 添加属性
blockdiag {
   A [label = "Start"];
   B [label = "End"];
   A -> B;
}

// 步骤 3: 添加复杂性
// ...
```

4. **隔离问题**

```blockdiag
blockdiag {
   A -> B;
   // B -> C;  // 注释掉测试
   C -> D;
}
```

5. **验证语法**

```bash
# 使用 Python 解析验证
python -c "from blockdiag import parser; parser.parse_file('diagram.diag')"
```

### 常见问题检查清单

- [ ] 文件编码是 UTF-8
- [ ] 所有花括号配对
- [ ] 引号正确配对
- [ ] 属性名拼写正确
- [ ] 字体路径配置正确(多语言)
- [ ] Python 和 blockdiag 版本满足要求
- [ ] 依赖包已安装(SVG/PDF)
- [ ] 节点和组名称有效
- [ ] 类定义在使用之前
- [ ] 输出目录有写权限

## 错误日志分析

### 示例错误日志

```
ERROR: Syntax error at line 5
  A [label = "Text"
              ^
Expected ',' or ']'
```

**分析**:

- **位置**: 第 5 行
- **问题**: 缺少逗号或右括号
- **修复**: 在属性之间添加逗号

### 常见错误模式

| 错误信息            | 原因       | 解决方案             |
| ------------------- | ---------- | -------------------- |
| `Syntax error`      | 语法错误   | 检查括号、引号、分号 |
| `Unknown attribute` | 未知属性   | 检查拼写或版本       |
| `Node not found`    | 节点未定义 | 先定义再引用         |
| `Cannot find font`  | 字体缺失   | 安装或指定字体       |
| `MemoryError`       | 内存不足   | 简化图表或增加内存   |

## 获取帮助

### 官方资源

- 文档: http://blockdiag.com/en/blockdiag/
- PyPI: https://pypi.org/project/blockdiag/
- GitHub: https://github.com/blockdiag/blockdiag (镜像)

### 社区支持

- Stack Overflow: tag `[blockdiag]`
- Google Groups: blockdiag-discuss
- Gitter Chat: blockdiag/blockdiag

### 报告 Bug

提供以下信息:

1. blockdiag 版本: `blockdiag --version`
2. Python 版本: `python --version`
3. 操作系统和版本
4. 完整错误消息
5. 最小复现示例(.diag 文件)
6. 预期行为描述

**示例 Bug 报告**:

````
Title: Syntax error with nested groups

Environment:
- blockdiag: 3.0.0
- Python: 3.9.7
- OS: Ubuntu 20.04

Issue:
Nested groups cause syntax error when using class attribute.

Minimal example:
```blockdiag
blockdiag {
   class mystyle [color = "red"];
   group {
      group inner {
         A [class = "mystyle"];
      }
   }
}
````

Error:
ERROR: Syntax error at line 5

Expected:
Should render without error

```

```
