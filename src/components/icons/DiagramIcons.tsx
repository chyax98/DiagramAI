/**
 * 图表语言和类型专用图标组件
 * 为 Mermaid、PlantUML、D2、Graphviz 等提供视觉标识
 */

import type { SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

/**
 * Mermaid 图标 (美人鱼主题)
 */
export function MermaidIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
      aria-label="Mermaid"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

/**
 * PlantUML 图标 (植物主题)
 */
export function PlantUMLIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
      aria-label="PlantUML"
    >
      <path d="M12 2c-.55 0-1 .45-1 1v7H8c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1h8c.55 0 1-.45 1-1v-8c0-.55-.45-1-1-1h-3V3c0-.55-.45-1-1-1z" />
      <path d="M9 12h6v6H9z" opacity="0.5" />
    </svg>
  );
}

/**
 * D2 图标 (D2 标识)
 */
export function D2Icon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props} aria-label="D2">
      <path d="M4 4h7c2.21 0 4 1.79 4 4s-1.79 4-4 4H4V4zm0 10h7c2.21 0 4 1.79 4 4s-1.79 4-4 4H4v-8z" />
      <text x="16" y="16" fontSize="10" fontWeight="bold">
        2
      </text>
    </svg>
  );
}

/**
 * Graphviz 图标 (图形可视化)
 */
export function GraphvizIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
      aria-label="Graphviz"
    >
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="12" cy="18" r="3" />
      <path d="M8.5 7.5l3 9M15.5 7.5l-3 9" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

/**
 * 流程图图标 (Flowchart)
 */
export function FlowchartIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      {...props}
      aria-label="Flowchart"
    >
      <rect x="4" y="3" width="7" height="5" rx="1" />
      <rect x="4" y="16" width="7" height="5" rx="1" />
      <rect x="13" y="9" width="7" height="6" rx="1" />
      <path d="M7.5 8v8M7.5 11h5.5M16.5 9V5.5H11" />
    </svg>
  );
}

/**
 * 序列图图标 (Sequence Diagram)
 */
export function SequenceDiagramIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      {...props}
      aria-label="Sequence Diagram"
    >
      <line x1="6" y1="3" x2="6" y2="21" />
      <line x1="12" y1="3" x2="12" y2="21" />
      <line x1="18" y1="3" x2="18" y2="21" />
      <path d="M6 6h6M12 10h6M6 14h12" />
      <circle cx="6" cy="6" r="1.5" fill="currentColor" />
      <circle cx="12" cy="10" r="1.5" fill="currentColor" />
      <circle cx="18" cy="14" r="1.5" fill="currentColor" />
    </svg>
  );
}

/**
 * 类图图标 (Class Diagram)
 */
export function ClassDiagramIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      {...props}
      aria-label="Class Diagram"
    >
      <rect x="3" y="3" width="8" height="10" rx="1" />
      <rect x="13" y="11" width="8" height="10" rx="1" />
      <line x1="3" y1="7" x2="11" y2="7" />
      <line x1="13" y1="15" x2="21" y2="15" />
      <path d="M11 8h2v8" />
    </svg>
  );
}

/**
 * ER 图图标 (Entity Relationship)
 */
export function ERDiagramIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      {...props}
      aria-label="ER Diagram"
    >
      <rect x="2" y="4" width="9" height="6" rx="1" />
      <rect x="13" y="14" width="9" height="6" rx="1" />
      <path d="M6.5 10v4h11M11 12l1.5 2 1.5-2" />
    </svg>
  );
}

/**
 * 状态图图标 (State Diagram)
 */
export function StateDiagramIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      {...props}
      aria-label="State Diagram"
    >
      <circle cx="7" cy="7" r="4" />
      <circle cx="17" cy="17" r="4" />
      <path d="M10 10l4 4M14 10l-4 4" />
    </svg>
  );
}

/**
 * 甘特图图标 (Gantt Chart)
 */
export function GanttChartIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      {...props}
      aria-label="Gantt Chart"
    >
      <rect x="4" y="4" width="10" height="3" fill="currentColor" />
      <rect x="6" y="9" width="14" height="3" fill="currentColor" />
      <rect x="4" y="14" width="8" height="3" fill="currentColor" />
      <line x1="2" y1="2" x2="2" y2="22" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  );
}

/**
 * 思维导图图标 (Mind Map)
 */
export function MindMapIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      {...props}
      aria-label="Mind Map"
    >
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
      <path d="M9.5 10.5L7 7M14.5 10.5L17 7M9.5 13.5L7 17M14.5 13.5L17 17" />
    </svg>
  );
}

/**
 * 图表语言图标映射
 */
export function getLanguageIcon(language: string): React.ComponentType<IconProps> {
  const langLower = language.toLowerCase();

  if (langLower.includes("mermaid")) return MermaidIcon;
  if (langLower.includes("plantuml")) return PlantUMLIcon;
  if (langLower.includes("d2")) return D2Icon;
  if (langLower.includes("graphviz") || langLower.includes("dot")) return GraphvizIcon;

  return MermaidIcon; // 默认 Mermaid
}

/**
 * 图表类型图标映射
 */
export function getDiagramTypeIcon(type: string): React.ComponentType<IconProps> {
  const typeLower = type.toLowerCase();

  if (typeLower.includes("flowchart") || typeLower.includes("flow")) return FlowchartIcon;
  if (typeLower.includes("sequence")) return SequenceDiagramIcon;
  if (typeLower.includes("class")) return ClassDiagramIcon;
  if (typeLower.includes("er") || typeLower.includes("entity")) return ERDiagramIcon;
  if (typeLower.includes("state")) return StateDiagramIcon;
  if (typeLower.includes("gantt")) return GanttChartIcon;
  if (typeLower.includes("mind") || typeLower.includes("mindmap")) return MindMapIcon;

  return FlowchartIcon; // 默认流程图
}

/**
 * 语言图标组件 (自动选择)
 */
export function LanguageIcon({
  language,
  className = "w-5 h-5",
  ...props
}: IconProps & { language: string }) {
  const IconComponent = getLanguageIcon(language);
  return <IconComponent className={className} {...props} />;
}

/**
 * 图表类型图标组件 (自动选择)
 */
export function DiagramTypeIcon({
  type,
  className = "w-5 h-5",
  ...props
}: IconProps & { type: string }) {
  const IconComponent = getDiagramTypeIcon(type);
  return <IconComponent className={className} {...props} />;
}
