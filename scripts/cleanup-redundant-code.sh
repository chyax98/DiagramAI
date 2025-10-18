#!/bin/bash

# DiagramAI 代码冗余清理脚本
# 用途: 自动清理未使用的依赖和修复配置
# 注意: 图标清理需要手动处理（需要先确认实际使用的图标）

set -e  # 遇到错误立即退出

echo "🧹 开始清理 DiagramAI 代码冗余..."
echo ""

# 检查是否在项目根目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    exit 1
fi

# 备份 package.json
echo "📦 备份 package.json..."
cp package.json package.json.backup
echo "✅ 已备份到 package.json.backup"
echo ""

# 步骤 1: 删除未使用的依赖
echo "🗑️  步骤 1: 删除未使用的依赖..."
echo "  - @ai-sdk/cerebras"
echo "  - @ai-sdk/provider-utils"
echo "  - critters"
npm uninstall @ai-sdk/cerebras @ai-sdk/provider-utils critters
echo "✅ 依赖删除完成"
echo ""

# 步骤 2: 修复 knip.json 配置
echo "🔧 步骤 2: 修复 knip.json 配置..."
if grep -q '"src/middleware.ts"' knip.json; then
    # 使用 sed 删除包含 src/middleware.ts 的行
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' '/"src\/middleware.ts"/d' knip.json
    else
        # Linux
        sed -i '/"src\/middleware.ts"/d' knip.json
    fi
    echo "✅ 已删除 knip.json 中的 src/middleware.ts 配置"
else
    echo "ℹ️  knip.json 配置已正确（无需修改）"
fi
echo ""

# 步骤 3: 验证构建
echo "🔨 步骤 3: 验证项目构建..."
echo "  运行 TypeScript 类型检查..."
npm run type-check
echo "✅ TypeScript 类型检查通过"
echo ""

echo "  运行 ESLint 检查..."
npm run lint || echo "⚠️  存在 lint 警告（不影响清理）"
echo ""

# 步骤 4: 重新运行死代码检查
echo "🔍 步骤 4: 重新检测死代码..."
npm run dead-code || echo "⚠️  仍存在未使用的代码（需要手动清理图标）"
echo ""

# 步骤 5: 生成清理报告
echo "📊 清理完成！生成报告..."
echo ""
echo "================================"
echo "清理摘要"
echo "================================"
echo "✅ 已删除 3 个未使用的依赖"
echo "✅ 已修复 knip.json 配置"
echo "✅ TypeScript 类型检查通过"
echo ""
echo "⚠️  后续手动任务："
echo "  1. 清理 src/components/icons/index.ts 中未使用的图标导出"
echo "  2. 决定 src/hooks/useReportFailure.ts 的去留"
echo "     - 方案 A: 集成到 EditorHeader.tsx (推荐)"
echo "     - 方案 B: 删除文件"
echo ""
echo "📖 详细分析报告: CODE_REDUNDANCY_ANALYSIS.md"
echo ""
echo "💾 如需恢复，运行: mv package.json.backup package.json && npm install"
echo ""
echo "🎉 清理完成！"

