#!/bin/bash
#
# Prompt 迁移 - 一键完成脚本
#
# 功能:
# 1. 执行迁移 (.ts → .txt)
# 2. 验证迁移结果
# 3. 备份旧文件
# 4. 更新加载器
# 5. 生成报告
#
# 使用方法:
#   bash scripts/complete-migration.sh
#

set -e  # 遇到错误立即退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印信息
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

# 打印标题
header() {
    echo ""
    echo "======================================================"
    echo "$1"
    echo "======================================================"
    echo ""
}

# 检查依赖
check_dependencies() {
    header "检查依赖"

    if ! command -v python3 &> /dev/null; then
        error "Python3 未安装，请先安装 Python3"
        exit 1
    fi

    success "Python3 已安装: $(python3 --version)"
}

# Step 1: 预览迁移
preview_migration() {
    header "Step 1: 预览迁移"

    info "运行迁移脚本（预览模式）..."
    python3 scripts/migrate-prompts-to-txt.py

    echo ""
    read -p "$(echo -e ${YELLOW}继续执行迁移? [y/N]:${NC} )" -n 1 -r
    echo ""

    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        warning "用户取消迁移"
        exit 0
    fi
}

# Step 2: 执行迁移
execute_migration() {
    header "Step 2: 执行迁移"

    info "开始迁移 .ts → .txt..."
    python3 scripts/migrate-prompts-to-txt.py --execute

    if [ $? -eq 0 ]; then
        success "迁移完成"
    else
        error "迁移失败"
        exit 1
    fi
}

# Step 3: 验证结果
verify_migration() {
    header "Step 3: 验证迁移结果"

    info "验证文件完整性..."
    python3 scripts/migrate-prompts-to-txt.py --verify

    if [ $? -eq 0 ]; then
        success "验证通过"
    else
        error "验证失败，请检查错误信息"
        exit 1
    fi
}

# Step 4: 备份旧文件
backup_old_files() {
    header "Step 4: 备份旧文件"

    # 创建备份目录
    mkdir -p .backups

    # 生成备份文件名
    BACKUP_FILE=".backups/prompts-ts-backup-$(date +%Y%m%d-%H%M%S).tar.gz"

    info "备份旧的 .ts 文件到 $BACKUP_FILE..."

    # 备份所有 prompt .ts 文件
    tar -czf "$BACKUP_FILE" \
        --exclude="src/lib/constants/prompts/index.ts" \
        --exclude="src/lib/constants/prompts/types.ts" \
        --exclude="src/lib/constants/prompts/auto-select.ts" \
        --exclude="src/lib/constants/prompts/loaders" \
        --exclude="src/lib/constants/prompts/data" \
        src/lib/constants/prompts/

    if [ $? -eq 0 ]; then
        success "备份完成: $BACKUP_FILE"
    else
        error "备份失败"
        exit 1
    fi
}

# Step 5: 更新加载器
update_loader() {
    header "Step 5: 更新 Prompt 加载器"

    info "备份旧的 index.ts..."
    cp src/lib/constants/prompts/index.ts \
       src/lib/constants/prompts/index.ts.backup

    info "使用新的 index.ts..."
    mv src/lib/constants/prompts/index.new.ts \
       src/lib/constants/prompts/index.ts

    success "加载器已更新"
}

# Step 6: 清理旧文件 (可选)
cleanup_old_files() {
    header "Step 6: 清理旧文件 (可选)"

    echo ""
    read -p "$(echo -e ${YELLOW}是否删除旧的 .ts prompt 文件? [y/N]:${NC} )" -n 1 -r
    echo ""

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        info "删除旧的 .ts prompt 文件..."

        # 删除 prompt 内容文件，保留 index.ts, types.ts 等
        find src/lib/constants/prompts -name "*.ts" \
            ! -name "index.ts" \
            ! -name "types.ts" \
            ! -name "auto-select.ts" \
            ! -path "*/loaders/*" \
            -type f -delete

        # 删除空目录
        find src/lib/constants/prompts -type d -empty -delete

        success "旧文件已清理"
    else
        warning "保留旧的 .ts 文件"
    fi
}

# Step 7: 生成报告
generate_report() {
    header "Step 7: 生成迁移报告"

    info "生成详细报告..."
    python3 scripts/migrate-prompts-to-txt.py --report

    success "报告已生成: claudedocs/migration-report.md"
}

# Step 8: 完成
finish() {
    header "✨ 迁移完成!"

    echo "下一步:"
    echo ""
    echo "  1. 查看迁移报告:"
    echo "     cat claudedocs/migration-report.md"
    echo ""
    echo "  2. 运行测试:"
    echo "     npm test"
    echo ""
    echo "  3. 启动开发服务器:"
    echo "     npm run dev"
    echo ""
    echo "  4. 测试图表生成功能"
    echo ""
    echo "如果出现问题，可以回滚:"
    echo "  bash scripts/rollback-migration.sh"
    echo ""

    success "所有步骤完成！"
}

# 主流程
main() {
    header "🚀 Prompt 迁移 - 一键执行"

    check_dependencies
    preview_migration
    execute_migration
    verify_migration
    backup_old_files
    update_loader
    cleanup_old_files
    generate_report
    finish
}

# 执行主流程
main
