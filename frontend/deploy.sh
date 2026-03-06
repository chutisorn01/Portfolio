#!/bin/bash

# ====================================
# Portfolio Deployment Script
# Deploy to Ubuntu Server with Apache2
# ====================================

# สี
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/Users/macbook/hifiw/frontend"
SERVER_USER="username"  # เปลี่ยนเป็น username จริง
SERVER_IP="your-server-ip"  # เปลี่ยนเป็น IP จริง
SERVER_PATH="/var/www/portfolio"
BUILD_DIR="dist"

echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}  Portfolio Deployment Script${NC}"
echo -e "${BLUE}=====================================${NC}"
echo ""

# ตรวจสอบว่าอยู่ใน project directory
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${RED}Error: Project directory not found!${NC}"
    echo "Please update PROJECT_DIR in script"
    exit 1
fi

cd "$PROJECT_DIR"

# Step 1: Install Dependencies
echo -e "${YELLOW}[1/5] Installing dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: npm install failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 2: Build Project
echo -e "${YELLOW}[2/5] Building project...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Build completed${NC}"
echo ""

# Step 3: Check build directory
if [ ! -d "$BUILD_DIR" ]; then
    echo -e "${RED}Error: Build directory not found!${NC}"
    exit 1
fi

# Step 4: Create backup on server (optional)
echo -e "${YELLOW}[3/5] Creating backup on server...${NC}"
BACKUP_NAME="portfolio-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
ssh $SERVER_USER@$SERVER_IP "cd $SERVER_PATH && sudo tar -czf ~/backups/$BACKUP_NAME ." 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backup created: $BACKUP_NAME${NC}"
else
    echo -e "${YELLOW}⚠ Backup skipped (may not exist yet)${NC}"
fi
echo ""

# Step 5: Upload files to server
echo -e "${YELLOW}[4/5] Uploading files to server...${NC}"
rsync -avz --delete $BUILD_DIR/ $SERVER_USER@$SERVER_IP:$SERVER_PATH/
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Upload failed${NC}"
    echo "Please check:"
    echo "  - SERVER_USER is correct"
    echo "  - SERVER_IP is correct"
    echo "  - SSH key is set up"
    echo "  - Server path exists"
    exit 1
fi
echo -e "${GREEN}✓ Files uploaded${NC}"
echo ""

# Step 6: Set permissions on server
echo -e "${YELLOW}[5/5] Setting permissions...${NC}"
ssh $SERVER_USER@$SERVER_IP "sudo chmod -R 755 $SERVER_PATH && sudo chown -R www-data:www-data $SERVER_PATH"
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠ Could not set permissions (may need manual setup)${NC}"
else
    echo -e "${GREEN}✓ Permissions set${NC}"
fi
echo ""

# Success
echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}  Deployment Complete! 🎉${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""
echo "Your website should be live at:"
echo -e "${BLUE}  http://$SERVER_IP${NC}"
echo -e "${BLUE}  https://your-domain.com${NC}"
echo ""
echo "Next steps:"
echo "  1. Test the website"
echo "  2. Clear Cloudflare cache (if using)"
echo "  3. Monitor Apache logs: ssh $SERVER_USER@$SERVER_IP 'sudo tail -f /var/log/apache2/portfolio-error.log'"
echo ""
