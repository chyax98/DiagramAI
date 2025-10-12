# Erd 社区问题与解决方案

## 项目状态

- **GitHub**: https://github.com/BurntSushi/erd
- **维护状态**: 活跃维护中 (最近更新: 2023)
- **Stars**: 1.8k+
- **Issues**: 开放中
- **社区**: Haskell 生态系统

## 1. 高频问题

### 1.1 Mermaid/PlantUML 语法兼容性

**问题来源**: [GitHub Issue #117](https://github.com/mermaid-js/mermaid/issues/117)

**用户期望**:
Mermaid 用户希望使用 Erd 的简洁语法:
```erd
[player]
*player_id
full_name
team_id

[team]
*team_id
```

**现状**:
- Mermaid 有自己的 ER 图语法
- PlantUML 也有类似但不同的语法 ([Issue #1309](https://github.com/mermaid-js/mermaid/issues/1309))
- Erd 语法不被其他工具原生支持

**解决方案**:
1. 使用转换工具 (如果存在)
2. 学习目标工具的原生语法
3. 使用 Kroki 统一接口 (支持多种图表工具)

---

### 1.2 配置文件不生效

**症状**:
```bash
erd -c ~/.erd.yaml -i schema.er -o output.pdf
# 样式没有应用
```

**常见原因**:
1. **文件不存在**: `~/.erd.yaml` 未创建
2. **YAML 格式错误**: 缩进或语法问题
3. **选项冲突**: 命令行参数覆盖配置文件

**诊断步骤**:
```bash
# 1. 检查文件是否存在
ls -la ~/.erd.yaml

# 2. 生成默认配置
erd -c > ~/.erd.yaml

# 3. 验证配置文件
cat ~/.erd.yaml

# 4. 使用明确路径
erd -c ./myconfig.yaml -i schema.er
```

---

### 1.3 Docker 容器文件访问问题

**问题**:
```bash
docker run -i ghcr.io/burntsushi/erd:latest schema.er
# Error: cannot open file
```

**原因**: Docker 容器无法直接访问宿主机文件系统

**解决方案**:

**方法 1: 使用标准输入**
```bash
docker run -i ghcr.io/burntsushi/erd:latest < schema.er > output.pdf
```

**方法 2: 挂载卷**
```bash
docker run -i -v $(pwd):/data ghcr.io/burntsushi/erd:latest \\
  < /data/schema.er > /data/output.pdf
```

**方法 3: 使用 docker-compose**
```yaml
version: '3'
services:
  erd:
    image: ghcr.io/burntsushi/erd:latest
    volumes:
      - ./schemas:/schemas
    stdin_open: true
```

---

### 1.4 GraphViz 渲染问题

**问题 1: 字体缺失**

**症状**: 文本显示为方框或乱码

**解决方案 (macOS)**:
```bash
# 安装完整的 GraphViz
brew install graphviz

# 验证字体支持
fc-list | grep Helvetica
```

**解决方案 (Linux)**:
```bash
# 安装字体
sudo apt-get install fonts-liberation

# 刷新字体缓存
fc-cache -fv
```

---

**问题 2: Pango 支持缺失**

**症状**: 粗体和斜体不显示

**解决方案**:
```bash
# macOS: 重新编译带 Pango 的 GraphViz
brew reinstall graphviz

# 验证
dot -v | grep pango
# 应该显示: libpango

# Linux
sudo apt-get install libpango1.0-dev
```

参考: [GraphViz Issue 1636](https://gitlab.com/graphviz/graphviz/issues/1636)

---

### 1.5 复杂关系布局混乱

**问题**: 多对多关系导致线条交叉、重叠

**示例**:
```erd
[Student]
*student_id

[Course]
*course_id

[Teacher]
*teacher_id

Student *--* Course
Course *--* Teacher
Student ?--* Teacher
```

**解决策略**:

**策略 1: 使用不同边类型**
```bash
erd -e ortho  # 正交边
erd -e spline # 平滑曲线
```

**策略 2: 引入关联实体**
```erd
[Student]
*student_id

[Course]
*course_id

[Enrollment]
*+student_id
*+course_id
grade

Student 1--* Enrollment
Course 1--* Enrollment
```

**策略 3: 手动调整 DOT**
```bash
# 生成 DOT
erd -i schema.er -o schema.dot

# 手动编辑 schema.dot 添加:
# rankdir=LR  // 改变方向
# splines=ortho  // 正交线

# 重新渲染
dot -Tpdf schema.dot -o output.pdf
```

---

## 2. 平台特定问题

### 2.1 Windows 平台

**问题 1: 路径分隔符**
```bash
# ❌ 错误
erd -i C:\\Users\\name\\schema.er

# ✓ 正确
erd -i "C:/Users/name/schema.er"
```

**问题 2: 字符编码**
```bash
# 使用 UTF-8
chcp 65001
erd -i schema.er
```

**问题 3: Stack 安装路径**
```powershell
# 添加到 PATH
$env:Path += ";C:\Users\<user>\AppData\Roaming\local\bin"
```

---

### 2.2 macOS 平台

**问题 1: Homebrew 版本过旧**
```bash
# 更新 Homebrew
brew update
brew upgrade erd
```

**问题 2: GraphViz 缺少 Pango**
```bash
# 完全卸载重装
brew uninstall graphviz
brew install graphviz --with-pango

# 如果没有 --with-pango 选项
brew install pango
brew reinstall graphviz
```

---

### 2.3 Linux 平台

**问题 1: 依赖缺失**
```bash
# Debian/Ubuntu
sudo apt-get install libgraphviz-dev libpango1.0-dev

# Fedora/RHEL
sudo dnf install graphviz-devel pango-devel
```

**问题 2: Stack 二进制路径**
```bash
# 添加到 ~/.bashrc 或 ~/.zshrc
export PATH="$HOME/.local/bin:$PATH"
```

---

## 3. 性能问题

### 3.1 大型图表渲染缓慢

**问题**: 超过 50 个实体的图表渲染超过 1 分钟

**优化策略**:

**策略 1: 分拆图表**
```erd
# 按模块分离
# user-module.er
[User]
[Profile]
...

# order-module.er
[Order]
[OrderItem]
...
```

**策略 2: 使用更快的布局引擎**
```bash
# 使用 neato 代替 dot
erd -i schema.er -o schema.dot
neato -Tpdf schema.dot -o output.pdf
```

**策略 3: 减少格式化**
```erd
# 简化样式，移除不必要的格式化
entity {bgcolor: "#fff"}  # 单一背景色
# 移除 label, border 等
```

---

### 3.2 内存占用过高

**问题**: 处理大型图表时内存不足

**解决方案**:
```bash
# 增加 GHC 运行时内存
erd +RTS -M4G -RTS -i large-schema.er

# 或使用流式处理
cat schema.er | erd | dot -Tpdf > output.pdf
```

---

## 4. 集成问题

### 4.1 CI/CD 集成

**GitHub Actions 示例**:
```yaml
name: Generate ER Diagrams
on: [push]
jobs:
  erd:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Install GraphViz
        run: sudo apt-get install -y graphviz

      - name: Install Erd
        run: |
          curl -L https://github.com/BurntSushi/erd/releases/download/v0.2.1.0/erd-0.2.1.0-x86_64-linux.tar.gz | tar xz
          sudo mv erd /usr/local/bin/

      - name: Generate Diagrams
        run: |
          for file in schemas/*.er; do
            erd -i "$file" -o "diagrams/$(basename $file .er).pdf"
          done

      - name: Upload Artifacts
        uses: actions/upload-artifact@v2
        with:
          name: er-diagrams
          path: diagrams/
```

---

### 4.2 编辑器集成

**VS Code 集成**:

**问题**: 预览不更新

**解决方案**:
1. 安装 [vscode-erd](https://github.com/kaishuu0123/vscode-erd)
2. 配置 settings.json:
```json
{
  "erd.executablePath": "/path/to/erd",
  "erd.autoUpdate": true
}
```

**Vim 集成**:

**问题**: 语法高亮不工作

**解决方案**:
```vim
" 在 ~/.vimrc 添加
Plugin 'flniu/er.vim'

" 或手动安装
git clone https://github.com/flniu/er.vim ~/.vim/bundle/er.vim
```

---

## 5. 类型定义问题

### 5.1 自定义类型不显示

**问题**: Label 中的类型信息被截断

**示例**:
```erd
[User]
*id {label: "uuid PRIMARY KEY DEFAULT gen_random_uuid()"}
# 可能显示不完整
```

**解决方案**:
```erd
# 方案 1: 简化标签
*id {label: "uuid, PK"}

# 方案 2: 增加实体宽度
[User] {size: "12"}  # 更小字体
*id {label: "uuid PRIMARY KEY DEFAULT gen_random_uuid()"}

# 方案 3: 分行显示
*id {label: "uuid, PK,"}
    {label: "DEFAULT: gen_random_uuid()"}
```

---

## 6. 多语言支持

### 6.1 中文显示问题

**问题**: 中文显示为方框

**原因**: GraphViz 缺少中文字体

**解决方案 (Linux)**:
```bash
# 安装中文字体
sudo apt-get install fonts-wqy-zenhei

# 在配置中指定字体
entity {font: "WenQuanYi Zen Hei"}
```

**解决方案 (macOS)**:
```bash
# 使用系统字体
entity {font: "PingFang SC"}
```

---

### 6.2 Unicode 字符问题

**问题**: 特殊字符显示异常

**解决方案**:
```erd
# 使用 HTML 实体
[用户] {label: "&#29992;&#25143;"}  # 用户

# 或确保文件编码为 UTF-8
file -I schema.er  # 检查编码
```

---

## 7. 社区资源

### 官方资源
- **GitHub**: https://github.com/BurntSushi/erd
- **Hackage**: https://hackage.haskell.org/package/erd
- **Docker Hub**: ghcr.io/burntsushi/erd

### 替代工具
- **Mermaid ER**: https://mermaid.js.org/syntax/entityRelationshipDiagram.html
- **PlantUML**: https://plantuml.com/ie-diagram
- **dbdiagram.io**: https://dbdiagram.io
- **QuickDBD**: https://www.quickdatabasediagrams.com

### 学习资源
- **ER 图基础**: https://www.lucidchart.com/pages/er-diagrams
- **数据库设计**: https://www.simplilearn.com/tutorials/sql-tutorial/er-diagram-in-dbms
- **GraphViz 文档**: https://graphviz.org/documentation/

---

## 8. 贡献指南

### 报告 Bug
1. 访问 https://github.com/BurntSushi/erd/issues
2. 搜索是否已有类似问题
3. 提供最小可复现示例
4. 包含版本信息:
   ```bash
   erd --version
   dot -V
   ```

### 功能请求
1. 描述使用场景
2. 提供示例语法
3. 说明与现有功能的关系

### Pull Request
1. Fork 仓库
2. 创建功能分支
3. 遵循 Haskell 代码规范
4. 添加测试用例
5. 更新文档

---

## 9. 常见工作流问题

### 9.1 数据库逆向工程

**问题**: 从现有数据库生成 Erd 文件

**解决方案**:
```bash
# MySQL
mysqldump --no-data mydb | mysql2erd > schema.er

# PostgreSQL
pg_dump --schema-only mydb | pg2erd > schema.er

# 注: 需要自行开发或查找转换工具
```

---

### 9.2 版本控制最佳实践

**问题**: 合并冲突难以解决

**建议**:
```bash
# .gitattributes
*.er diff=erd
*.dot diff=dot

# .gitignore
*.pdf
*.svg
*.png
diagrams/
```

**冲突解决**:
```bash
# 使用自定义合并工具
git config merge.erd.driver "./merge-erd.sh %O %A %B %A"
```

---

## 10. 未来发展

### 计划中的功能
- 更好的 Unicode 支持
- 交互式编辑器
- Web 预览界面
- 数据库逆向工程内置支持

### 社区需求
- VS Code 扩展改进
- 在线编辑器
- 模板库
- 样式主题

---

## 获取帮助

1. **GitHub Issues**: 官方问题追踪
2. **Stack Overflow**: 标签 `erd` 或 `entity-relationship-diagram`
3. **Reddit**: r/haskell, r/databases
4. **Discord**: Haskell 社区服务器

**提问模板**:
```
环境:
- OS: [e.g. macOS 12.0]
- Erd 版本: [erd --version]
- GraphViz 版本: [dot -V]

问题描述:
[详细描述问题]

复现步骤:
1. [步骤 1]
2. [步骤 2]

预期行为:
[应该发生什么]

实际行为:
[实际发生什么]

最小示例:
```erd
[示例代码]
```
