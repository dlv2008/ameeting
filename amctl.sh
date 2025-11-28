#!/bin/bash

# Intrascribe Service Control Script
# Purpose: Unified service management for Intrascribe
# Author: Intrascribe Team

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="$SCRIPT_DIR/.intrascribe.pid"
LOG_DIR="$SCRIPT_DIR/logs"
CRON_MARKER="# INTRASCRIBE_AUTO_START"

# Print functions
print_header() {
    echo -e "${PURPLE}╔══════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║        Intrascribe 服务管理工具                 ║${NC}"
    echo -e "${PURPLE}╚══════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if service is running
is_running() {
    if [[ -f "$PID_FILE" ]]; then
        local pid=$(cat "$PID_FILE")
        if kill -0 "$pid" 2>/dev/null; then
            return 0
        else
            # PID file exists but process is dead
            rm -f "$PID_FILE"
            return 1
        fi
    fi
    return 1
}

# Start service
start_service() {
    print_header
    echo -e "${CYAN}启动 Intrascribe 服务...${NC}\n"
    
    if is_running; then
        print_warning "服务已在运行中 (PID: $(cat "$PID_FILE"))"
        echo ""
        print_status "使用 '$0 status' 查看服务状态"
        exit 0
    fi
    
    print_status "启动服务..."
    
    # Start run.sh in background with nohup
    nohup "$SCRIPT_DIR/run.sh" > "$LOG_DIR/startup.log" 2>&1 &
    local main_pid=$!
    
    # Save PID
    echo "$main_pid" > "$PID_FILE"
    
    # Wait a moment for startup
    sleep 3
    
    if is_running; then
        print_success "服务启动成功 (PID: $main_pid)"
        echo ""
        print_status "访问地址将在服务完全启动后可用（大约需要1-2分钟）"
        print_status "使用 '$0 logs' 查看启动日志"
        print_status "使用 '$0 status' 查看服务状态"
    else
        print_error "服务启动失败"
        print_status "请查看日志: tail -f $LOG_DIR/startup.log"
        exit 1
    fi
}

# Stop service
stop_service() {
    print_header
    echo -e "${CYAN}停止 Intrascribe 服务...${NC}\n"
    
    if ! is_running; then
        print_warning "服务未在运行"
        exit 0
    fi
    
    local main_pid=$(cat "$PID_FILE")
    print_status "正在停止服务 (PID: $main_pid)..."
    
    # Get all child processes
    local all_pids=$(pgrep -P "$main_pid" 2>/dev/null || echo "")
    all_pids="$main_pid $all_pids"
    
    # Kill all processes
    for pid in $all_pids; do
        if kill -0 "$pid" 2>/dev/null; then
            print_status "停止进程 $pid..."
            kill "$pid" 2>/dev/null || true
        fi
    done
    
    # Wait for processes to stop
    sleep 2
    
    # Force kill if still running
    for pid in $all_pids; do
        if kill -0 "$pid" 2>/dev/null; then
            print_warning "强制终止进程 $pid..."
            kill -9 "$pid" 2>/dev/null || true
        fi
    done
    
    # Clean up PID file
    rm -f "$PID_FILE"
    
    print_success "服务已停止"
    echo ""
    print_status "所有进程已终止"
}

# Restart service
restart_service() {
    print_header
    echo -e "${CYAN}重启 Intrascribe 服务...${NC}\n"
    
    if is_running; then
        stop_service
        sleep 2
    fi
    
    start_service
}

# Show service status
show_status() {
    print_header
    
    if is_running; then
        local main_pid=$(cat "$PID_FILE")
        echo -e "${GREEN}● Intrascribe 服务运行中${NC}"
        echo ""
        echo -e "  主进程 PID: ${CYAN}$main_pid${NC}"
        
        # Show child processes
        local children=$(pgrep -P "$main_pid" 2>/dev/null | wc -l)
        echo -e "  子进程数量: ${CYAN}$children${NC}"
        
        # Show uptime
        if ps -p "$main_pid" -o etime= > /dev/null 2>&1; then
            local uptime=$(ps -p "$main_pid" -o etime= | tr -d ' ')
            echo -e "  运行时间: ${CYAN}$uptime${NC}"
        fi
        
        echo ""
        print_status "使用 '$0 logs' 查看日志"
    else
        echo -e "${RED}● Intrascribe 服务未运行${NC}"
        echo ""
        print_status "使用 '$0 start' 启动服务"
    fi
    
    echo ""
    
    # Check auto-start status
    if crontab -l 2>/dev/null | grep -q "$CRON_MARKER"; then
        echo -e "${GREEN}✓ 开机自启动: 已启用${NC}"
    else
        echo -e "${YELLOW}✗ 开机自启动: 未启用${NC}"
        print_status "使用 '$0 enable' 启用开机自启动"
    fi
}

# Show logs
show_logs() {
    local log_file="${1:-startup}"
    local log_path="$LOG_DIR/${log_file}.log"
    
    if [[ ! -f "$log_path" ]]; then
        print_error "日志文件不存在: $log_path"
        echo ""
        print_status "可用的日志文件:"
        ls -1 "$LOG_DIR"/*.log 2>/dev/null | xargs -n1 basename || echo "  (无日志文件)"
        exit 1
    fi
    
    print_header
    echo -e "${CYAN}查看日志: $log_file${NC}"
    echo -e "${YELLOW}按 Ctrl+C 退出${NC}\n"
    
    tail -f "$log_path"
}

# List available logs
list_logs() {
    print_header
    echo -e "${CYAN}可用的日志文件:${NC}\n"
    
    if ls "$LOG_DIR"/*.log > /dev/null 2>&1; then
        for log in "$LOG_DIR"/*.log; do
            local basename=$(basename "$log" .log)
            local size=$(du -h "$log" | cut -f1)
            echo -e "  • ${CYAN}$basename${NC} ($size)"
        done
        echo ""
        print_status "查看日志: $0 logs <名称>"
        print_status "例如: $0 logs startup"
    else
        print_warning "没有找到日志文件"
    fi
}

# Enable auto-start
enable_autostart() {
    print_header
    echo -e "${CYAN}启用开机自动启动...${NC}\n"
    
    # Check if already enabled
    if crontab -l 2>/dev/null | grep -q "$CRON_MARKER"; then
        print_warning "开机自启动已经启用"
        print_status "使用 '$0 disable' 禁用自启动"
        exit 0
    fi
    
    # Create crontab entry with delay
    local cron_entry="@reboot sleep 30 && cd $SCRIPT_DIR && $SCRIPT_DIR/amctl.sh start $CRON_MARKER"
    
    # Add to crontab
    (crontab -l 2>/dev/null || echo "") | { cat; echo "$cron_entry"; } | crontab -
    
    print_success "开机自启动已启用"
    echo ""
    print_status "系统重启后将自动启动 Intrascribe 服务"
    print_status "启动延迟: 30秒（等待网络就绪）"
    echo ""
    print_warning "提示: 请确保已配置 sudoers 免密，否则自动启动可能失败"
    print_status "运行: sudo bash setup-sudoers.sh"
}

# Disable auto-start
disable_autostart() {
    print_header
    echo -e "${CYAN}禁用开机自动启动...${NC}\n"
    
    # Check if enabled
    if ! crontab -l 2>/dev/null | grep -q "$CRON_MARKER"; then
        print_warning "开机自启动未启用"
        exit 0
    fi
    
    # Remove from crontab
    crontab -l 2>/dev/null | grep -v "$CRON_MARKER" | crontab -
    
    print_success "开机自启动已禁用"
    echo ""
    print_status "系统重启后将不再自动启动服务"
}

# Show help
show_help() {
    print_header
    echo -e "${CYAN}用法:${NC}"
    echo "  $0 <命令> [选项]"
    echo ""
    echo -e "${CYAN}可用命令:${NC}"
    echo "  start          启动服务"
    echo "  stop           停止服务"
    echo "  restart        重启服务"
    echo "  status         查看服务状态"
    echo "  logs [名称]    查看日志（默认: startup）"
    echo "  list-logs      列出所有可用日志"
    echo "  enable         启用开机自动启动"
    echo "  disable        禁用开机自动启动"
    echo "  help           显示此帮助信息"
    echo ""
    echo -e "${CYAN}示例:${NC}"
    echo "  $0 start              # 启动服务"
    echo "  $0 stop               # 停止服务"
    echo "  $0 status             # 查看状态"
    echo "  $0 logs               # 查看启动日志"
    echo "  $0 logs api_service   # 查看 API 服务日志"
    echo "  $0 enable             # 启用开机自启"
    echo "  $0 disable            # 禁用开机自启"
}

# Main
main() {
    # Create log directory if not exists
    mkdir -p "$LOG_DIR"
    
    case "${1:-}" in
        start)
            start_service
            ;;
        stop)
            stop_service
            ;;
        restart)
            restart_service
            ;;
        status)
            show_status
            ;;
        logs)
            show_logs "${2:-startup}"
            ;;
        list-logs)
            list_logs
            ;;
        enable)
            enable_autostart
            ;;
        disable)
            disable_autostart
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "未知命令: ${1:-}"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
