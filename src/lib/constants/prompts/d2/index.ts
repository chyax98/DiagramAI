/**
 * D2 提示词模块导出
 *
 * 组织结构：
 * - L2: common.ts - D2 语言通用规范
 * - L3: 各种图表类型的具体要求（符合 diagram-types.ts 定义）
 *   - flowchart.ts - 流程图
 *   - sequence.ts - 时序图
 *   - architecture.ts - 系统架构图
 *   - network.ts - 网络拓扑图
 */

export { D2_COMMON_PROMPT } from "./common";
export { D2_FLOWCHART_PROMPT } from "./flowchart";
export { D2_SEQUENCE_PROMPT } from "./sequence";
export { D2_ARCHITECTURE_PROMPT } from "./architecture";
export { D2_NETWORK_PROMPT } from "./network";

