#!/bin/bash
# DiagramAI PM2 管理脚本

APP_NAME="diagramai"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 函数：显示状态
show_status() {
    print_info "查看进程状态..."
    pm2 list
    echo ""
    pm2 show $APP_NAME
}

# 函数：查看日志
show_logs() {
    print_info "显示最近 50 行日志..."
    pm2 logs $APP_NAME --lines 50 --nostream
}

# 函数：实时日志
tail_logs() {
    print_info "实时查看日志 (Ctrl+C 退出)..."
    pm2 logs $APP_NAME
}

# 函数：重启应用
restart_app() {
    print_info "重启应用..."
    pm2 restart $APP_NAME
    sleep 2
    pm2 list
}

# 函数：重新加载配置
reload_config() {
    print_info "重新加载配置文件..."
    pm2 reload ecosystem.config.cjs
    pm2 save
    print_info "配置已重新加载并保存"
}

# 函数：完全重启 (停止 -> 删除 -> 启动)
full_restart() {
    print_warn "执行完全重启..."
    pm2 delete $APP_NAME 2>/dev/null || true
    pm2 start ecosystem.config.cjs
    pm2 save
    print_info "完全重启完成"
}

# 函数：清理日志
clean_logs() {
    print_warn "清理所有日志..."
    pm2 flush
    rm -f logs/pm2-*.log
    print_info "日志已清理"
}

# 函数：查看资源使用
show_resources() {
    print_info "实时监控资源使用 (Ctrl+C 退出)..."
    pm2 monit
}

# 函数：显示帮助
show_help() {
    cat << EOF
DiagramAI PM2 管理脚本

用法: ./pm2-manage.sh [命令]

可用命令:
  status       - 查看进程状态
  logs         - 查看最近日志 (50 行)
  tail         - 实时查看日志
  restart      - 重启应用
  reload       - 重新加载配置文件
  full-restart - 完全重启 (删除 -> 重新启动)
  clean-logs   - 清理所有日志
  monitor      - 实时监控资源使用
  help         - 显示此帮助信息

快捷操作:
  # 更新代码后重启
  git pull && npm install && ./pm2-manage.sh full-restart

  # 查看错误日志
  pm2 logs $APP_NAME --err --lines 100

  # 查看内存使用
  pm2 show $APP_NAME | grep memory

示例:
  ./pm2-manage.sh status
  ./pm2-manage.sh restart
  ./pm2-manage.sh tail
EOF
}

# 主逻辑
case "${1:-help}" in
    status)
        show_status
        ;;
    logs)
        show_logs
        ;;
    tail)
        tail_logs
        ;;
    restart)
        restart_app
        ;;
    reload)
        reload_config
        ;;
    full-restart)
        full_restart
        ;;
    clean-logs)
        clean_logs
        ;;
    monitor)
        show_resources
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "未知命令: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
