#!/bin/bash

# DiagramAI 图标使用分析脚本
# 用途: 识别实际使用的图标，生成清理建议

set -e

echo "🔍 分析图标使用情况..."
echo ""

# 检查是否在项目根目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    exit 1
fi

# 输出文件
OUTPUT_FILE="scripts/icons-usage-report.txt"

# 1. 查找所有使用的图标
echo "📊 步骤 1: 扫描代码中使用的图标..."
echo ""
echo "实际使用的图标:" > "$OUTPUT_FILE"
echo "==================" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# 在所有 TypeScript/TSX 文件中查找 Icon 开头的标识符
grep -roh "Icon[A-Z][a-zA-Z]*" src/components --include="*.tsx" --include="*.ts" | \
    sort | uniq | \
    grep -v "IconProps" | \
    tee -a "$OUTPUT_FILE"

echo "" >> "$OUTPUT_FILE"
echo "==================" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# 2. 统计使用次数
echo "📈 步骤 2: 统计使用频率..."
echo "" >> "$OUTPUT_FILE"
echo "使用频率统计:" >> "$OUTPUT_FILE"
echo "==================" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

grep -roh "Icon[A-Z][a-zA-Z]*" src/components --include="*.tsx" --include="*.ts" | \
    grep -v "IconProps" | \
    sort | uniq -c | sort -rn | \
    tee -a "$OUTPUT_FILE"

echo "" >> "$OUTPUT_FILE"
echo "==================" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# 3. 列出所有导出的图标
echo "📋 步骤 3: 列出所有导出的图标..."
echo "" >> "$OUTPUT_FILE"
echo "所有导出的图标:" >> "$OUTPUT_FILE"
echo "==================" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

grep "Icon[A-Z]" src/components/icons/index.ts | \
    grep -o "Icon[A-Z][a-zA-Z]*" | \
    sort | uniq | \
    tee -a "$OUTPUT_FILE"

echo "" >> "$OUTPUT_FILE"
echo "==================" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# 4. 生成统计报告
USED_COUNT=$(grep -roh "Icon[A-Z][a-zA-Z]*" src/components --include="*.tsx" --include="*.ts" | \
    grep -v "IconProps" | sort | uniq | wc -l | tr -d ' ')
EXPORTED_COUNT=$(grep "Icon[A-Z]" src/components/icons/index.ts | \
    grep -o "Icon[A-Z][a-zA-Z]*" | sort | uniq | wc -l | tr -d ' ')
UNUSED_COUNT=$((EXPORTED_COUNT - USED_COUNT))

echo "📊 统计摘要" | tee -a "$OUTPUT_FILE"
echo "==================" | tee -a "$OUTPUT_FILE"
echo "实际使用: $USED_COUNT 个图标" | tee -a "$OUTPUT_FILE"
echo "已导出: $EXPORTED_COUNT 个图标" | tee -a "$OUTPUT_FILE"
echo "未使用: $UNUSED_COUNT 个图标" | tee -a "$OUTPUT_FILE"
echo "冗余率: $((UNUSED_COUNT * 100 / EXPORTED_COUNT))%" | tee -a "$OUTPUT_FILE"
echo "" | tee -a "$OUTPUT_FILE"

# 5. 生成建议的图标文件
echo "💡 步骤 4: 生成优化建议..."
echo "" >> "$OUTPUT_FILE"
echo "建议的 src/components/icons/index.ts 内容:" >> "$OUTPUT_FILE"
echo "==================" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

cat >> "$OUTPUT_FILE" << 'EOF'
/**
 * 图标导出 - 仅包含实际使用的图标
 * 
 * 注意: 此文件由 analyze-icons-usage.sh 生成
 * 请根据实际使用情况调整
 */

// 基础操作图标
export {
  Download as IconDownload,
  Trash2 as IconTrash,
  Copy as IconCopy,
} from "lucide-react";

// 状态指示图标
export {
  Loader2 as IconLoading,
  AlertCircle as IconAlertCircle,
  Sparkles as IconSparkles,
} from "lucide-react";

// 主题切换图标
export {
  Sun as IconSun,
  Moon as IconMoon,
} from "lucide-react";

// 统一图标组件（保留）
export { Icon } from "./Icon";
export type { IconProps } from "./Icon";

EOF

echo ""
echo "✅ 分析完成！"
echo ""
echo "📄 详细报告已保存到: $OUTPUT_FILE"
echo ""
echo "📝 后续步骤:"
echo "  1. 查看报告: cat $OUTPUT_FILE"
echo "  2. 备份当前文件: cp src/components/icons/index.ts src/components/icons/index.ts.backup"
echo "  3. 根据报告中的建议修改 src/components/icons/index.ts"
echo "  4. 运行测试: npm run type-check && npm run build"
echo ""

