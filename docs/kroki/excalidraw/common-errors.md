# Excalidraw 常见错误与解决方案

> **最后更新**: 2025-01-13

---

## 🔴 文件加载错误

### 1. 绘图损坏无法打开

**现象**: 显示错误信息,无法复制内容

**原因**:

- 文件过大
- 同步冲突 (Obsidian/iCloud)
- 部分写入

**解决方案**:

```bash
# 1. 检查 JSON 格式
cat drawing.excalidraw | jq .

# 2. 在新 vault 测试
# 3. 从备份恢复
```

---

### 2. Mermaid 导入错误

**现象**: `<br>` 标签解析错误

**错误代码**:

```mermaid
flowchart TD
  A[Line1<br>Line2]  # ❌ 错误
```

**正确代码**:

```mermaid
flowchart TD
  A[Line1<br/>Line2]  # ✅ 自闭合标签
```

---

## 🟡 性能问题

### 1. 大文件卡顿

**阈值**: 元素数 > 1000

**解决方案**:

1. 分割为多个文件
2. 关闭压缩 (临时)
3. 使用 Frame 分组

**插件设置** (Obsidian):

```
Settings → Excalidraw → Saving → Compress (关闭)
```

---

### 2. 实时协作延迟

**问题**: 多人编辑卡顿

**优化**:

- 定期导出保存
- 限制同时编辑人数 (<5人)
- 使用 Excalidraw+ (Pro版)

---

## 🟠 集成问题

### 1. Obsidian 插件错误

**常见问题**:

- 自动保存失败
- 同步冲突
- 元数据菜单插件冲突

**解决方案**:

1. 更新到最新版本
2. 禁用冲突插件 (Metadata Menu, Templater)
3. 检查主题兼容性 (Minimal Theme)

---

### 2. GitHub Markdown 不支持

**现状**: GitHub 不原生支持 .excalidraw

**临时方案**:

```markdown
# 方案1: 导出 SVG

![diagram](diagram.excalidraw.svg)

# 方案2: PNG

![diagram](diagram.png)

# 方案3: 使用在线链接

[Edit on Excalidraw](https://excalidraw.com/#json=...)
```

---

### 3. 字体显示问题

**问题**: 手绘字体未正确显示

**原因**: 字体未加载

**解决**:

```html
<!-- 引入字体 -->
<link href="https://fonts.googleapis.com/css2?family=Virgil&display=swap" rel="stylesheet" />
```

---

## 🔵 Canvas 限制

### 1. 超出最大尺寸

**错误**: "Canvas Exceeds Max Size"

**限制**: 取决于浏览器

**解决**:

- Chrome: 最大 32767x32767
- 缩小画布范围
- 分割为多个文件

---

### 2. 意外清除画布

**问题**: 无撤销历史

**预防**:

1. 启用自动保存
2. 定期手动保存
3. 使用版本控制 (Git)

**恢复方法**:

- 检查浏览器缓存
- 从备份还原

---

## 🟣 触控设备问题

### 1. 全屏模式快捷键冲突

**问题**: Ctrl+Tab 不工作

**临时方案**: 使用鼠标/菜单切换

---

### 2. 平板/手机支持不完整

**限制**:

- 触控精度
- 手势冲突
- 工具栏适配

**建议**: 使用桌面端

---

## 📋 排查清单

- [ ] JSON 格式正确?
- [ ] 文件大小合理? (<5MB)
- [ ] 插件版本最新?
- [ ] 浏览器兼容? (Chrome/Edge推荐)
- [ ] 同步服务稳定?
- [ ] 已启用自动保存?

---

## 🔗 参考

- Issues: https://github.com/excalidraw/excalidraw/issues
- Discussions: https://github.com/excalidraw/excalidraw/discussions
- Obsidian Plugin: https://github.com/zsviczian/obsidian-excalidraw-plugin/issues
