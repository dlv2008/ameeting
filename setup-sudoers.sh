#!/bin/bash

# Intrascribe Sudoers Configuration Script
# Purpose: Configure password-less sudo for Intrascribe services
# Author: Intrascribe Team

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get current username
CURRENT_USER=$(whoami)
SUDOERS_FILE="/etc/sudoers.d/intrascribe"

echo -e "${BLUE}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Intrascribe Sudoers 免密配置脚本              ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}当前用户: ${CURRENT_USER}${NC}"
echo ""

# Check if running with sudo
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}错误: 此脚本需要使用 sudo 运行${NC}"
   echo -e "${YELLOW}请使用: sudo bash $0${NC}"
   exit 1
fi

# Create sudoers configuration
echo -e "${BLUE}[1/3] 创建 sudoers 配置文件...${NC}"

cat > "$SUDOERS_FILE" << EOF
# Intrascribe Service Sudoers Configuration
# Generated on $(date)
# User: $CURRENT_USER

# Nginx configuration commands
$CURRENT_USER ALL=(ALL) NOPASSWD: /usr/bin/tee /etc/nginx/sites-available/intrascribe.conf
$CURRENT_USER ALL=(ALL) NOPASSWD: /bin/ln -sf /etc/nginx/sites-available/intrascribe.conf /etc/nginx/sites-enabled/intrascribe.conf
$CURRENT_USER ALL=(ALL) NOPASSWD: /usr/sbin/nginx -t
$CURRENT_USER ALL=(ALL) NOPASSWD: /bin/systemctl reload nginx
$CURRENT_USER ALL=(ALL) NOPASSWD: /bin/rm -f /etc/nginx/sites-enabled/intrascribe.conf

# Redis service commands
$CURRENT_USER ALL=(ALL) NOPASSWD: /bin/systemctl start redis-server
$CURRENT_USER ALL=(ALL) NOPASSWD: /bin/systemctl start redis
$CURRENT_USER ALL=(ALL) NOPASSWD: /bin/systemctl stop redis-server
$CURRENT_USER ALL=(ALL) NOPASSWD: /bin/systemctl stop redis

# Supabase commands
$CURRENT_USER ALL=(ALL) NOPASSWD: /usr/bin/supabase start -x edge-runtime
$CURRENT_USER ALL=(ALL) NOPASSWD: /usr/bin/supabase stop
EOF

echo -e "${GREEN}✓ 配置文件已创建: $SUDOERS_FILE${NC}"

# Set correct permissions
echo -e "${BLUE}[2/3] 设置文件权限...${NC}"
chmod 0440 "$SUDOERS_FILE"
echo -e "${GREEN}✓ 权限已设置为 0440${NC}"

# Validate sudoers file
echo -e "${BLUE}[3/3] 验证 sudoers 配置...${NC}"
if visudo -c -f "$SUDOERS_FILE"; then
    echo -e "${GREEN}✓ Sudoers 配置验证通过!${NC}"
    echo ""
    echo -e "${GREEN}╔══════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║          配置成功完成!                          ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}已配置的免密命令:${NC}"
    echo "  • nginx 配置管理"
    echo "  • redis 服务管理"
    echo "  • supabase 服务管理"
    echo ""
    echo -e "${BLUE}现在可以运行 ./run.sh 而无需输入 sudo 密码${NC}"
else
    echo -e "${RED}✗ Sudoers 配置验证失败!${NC}"
    rm -f "$SUDOERS_FILE"
    echo -e "${RED}配置文件已删除，请检查脚本${NC}"
    exit 1
fi
