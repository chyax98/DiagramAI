#!/bin/bash
#
# Prompt 迁移 - 回滚脚本
#
# 功能: 恢复到迁移前的状态
#
# 使用方法:
#   bash scripts/rollback-migration.sh
#

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

header() {
    echo ""
    echo "======================================================"
    echo "$1"
    echo "======================================================"
    echo ""
}

# 主流程
main() {
    header "🔄 Prompt 迁移 - 回滚"

    # 检查备份文件
    if [ ! -d ".backups" ] || [ -z "$(ls -A .backups/*.tar.gz 2>/dev/null)" ]; then
        error "未找到备份文件"
        exit 1
    fi

    # 列出可用的备份
    info "可用的备份文件:"
    echo ""
    ls -lh .backups/*.tar.gz
    echo ""

    # 选择最新的备份
    LATEST_BACKUP=$(ls -t .backups/*.tar.gz | head -1)
    info "将使用最新备份: $LATEST_BACKUP"

    echo ""
    read -p "$(echo -e ${YELLOW}确认回滚? [y/N]:${NC} )" -n 1 -r
    echo ""

    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        warning "用户取消回滚"
        exit 0
    fi

    # 1. 恢复旧的 index.ts
    if [ -f "src/lib/constants/prompts/index.ts.backup" ]; then
        info "恢复旧的 index.ts..."
        mv src/lib/constants/prompts/index.ts.backup \
           src/lib/constants/prompts/index.ts
        success "index.ts 已恢复"
    fi

    # 2. 解压备份文件
    info "解压备份文件..."
    tar -xzf "$LATEST_BACKUP"
    success "备份文件已解压"

    # 3. 删除迁移生成的文件
    if [ -d "src/lib/constants/prompts/data" ]; then
        info "删除迁移生成的 .txt 文件..."
        rm -rf src/lib/constants/prompts/data
        success ".txt 文件已删除"
    fi

    # 4. 删除新的加载器（如果存在）
    if [ -f "src/lib/constants/prompts/index.new.ts" ]; then
        rm src/lib/constants/prompts/index.new.ts
    fi

    header "✅ 回滚完成!"

    echo "已恢复到迁移前的状态"
    echo ""
    echo "下一步:"
    echo "  1. 重启开发服务器: npm run dev"
    echo "  2. 验证功能正常"
    echo ""
}

main
