# DiagramAI Prompt Assembly & Validation Workflow

> 目标：将 L1/L2/L3 三级提示词按请求动态拼接，并在上线前完成长度预算、渲染校验与发布追踪。适用于 Promote-V2 数据集及后续版本。

## 1. 输入工单

- **请求上下文**：包含用户任务模式、业务描述、目标语言、图表类型、附加配置。
- **提示词仓库**：`Promote-V2/` 目录下的 L1、全部 L2、全部 L3 文件，按 DEPTH 标题拆段。
- **系统常量**：长度预算、禁止词表、SECURE 配置、渲染服务 URL。

## 2. 拼接流程

1. **检索**
   - 读取 L1 全部 DEPTH 段。
   - 按请求语言选取对应 L2，若缺失则报错并回退至运营告警。
   - 按图表类型选取对应 L3，若缺失则降级为仅 L1+L2 并记录缺口。
2. **标准化**
   - 去除段内多余空行、首尾空格，将中文全角符号统一为约定格式。
   - 对同一 DEPTH 合并时执行术语去重（ID 规则、SECURE 限制等保持一次）。
3. **重写组合**
   - 严格按照顺序生成：角色 → 指标 → 背景 → 任务 → 自检。
   - 使用句式转换器将条目改写为自然语言段落，避免显式提及 L1/L2/L3。
   - 检查句首语态，保持命令式或陈述式。
4. **输出封装**
   - 产出 JSON：`{ depthSegments, finalPrompt, metadata }`。
   - `metadata` 记录源文件版本、拼接时间、token 统计、缺失项。

## 3. 长度与 token 控制

- **预算基线**：总字符数 1,500-5,000；提示词 token ≤ 1,500。
- **监控指标**：
  - `depthSegments[i].lengthChars`
  - `depthSegments[i].lengthTokens`
  - `finalPrompt.lengthChars`
  - `finalPrompt.lengthTokens`
- **策略**：
  1. 若超出 token 上限，优先裁剪 L3 的非硬性描述，再裁剪 L2 次要提示，最后压缩 L1 语句长度。
  2. 若低于 1,500 字符，提醒补充类型细节或示例语句。
  3. 引入自动化重写器（如模板化句式）控制单句 30-80 字范围。
- **实现建议**：使用 `tiktoken` 计算 token，写入 `metadata.tokenBudget` 字段。

## 4. 渲染校验流程

1. **语法自检**：
   - 解析 finalPrompt 中的代码块，拆出语言源文本。
   - 依据语言类型调用静态语法检查器（Mermaid/PlantUML/D2/DBML 自研规则或 linter）。
2. **Kroki 预渲染**：
   - 调用内部 Kroki 服务（SECURE 模式）进行 dry-run。
   - 捕获错误关键词：`unknown token`, `Lexical error`, `Cannot open URL`, `Syntax Error?`, `empty message` 等。
3. **回溯定位**：
   - 若渲染失败，通过 metadata 中的 DEPTH 来源定位问题段并回写修复建议。
4. **快照归档**：
   - 成功渲染后保存 SVG、日志与 finalPrompt 输出至 `data/verification/YYYYMMDD/`，支持回归对比。

## 5. 集成检查点

- **CI 阶段**：在提交新提示词时运行 token & render 测试，标记差异报告。
- **打包阶段**：发布前生成 release manifest，列出各语言/类型的提示词版本与校验状态。
- **运行时**：在 API 层添加速率限制与超时处理，若渲染失败返回原始错误与人工兜底指令。

## 6. 角色分工与职责

- **提示词维护者**：更新 L1/L2/L3 内容，确保 DEPTH 结构一致。
- **工程支持**：实现重写器、token 计量、Kroki 调用与快照归档。
- **QA 团队**：定期抽检关键语言/类型组合，校验渲染结果与用例覆盖率。

## 7. 监控与迭代

- 建议每月统计：拼接失败率、渲染失败率、token 超标率、人工回滚次数。
- 若某类型失败率 > 3%，应触发专项回顾，回查 L3 语句或 Kroki 版本变动。
- 根据反馈持续优化句式模板、术语对齐表与异常回退策略。
