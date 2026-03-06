# 🚀 Quick Reference - Deploy to Apache2

เอกสารอ้างอิงด่วนสำหรับการ deploy Portfolio บน Ubuntu + Apache2 + Cloudflare

---

## ⚙️ ตั้งค่าครั้งแรก (One-time Setup)

### 1. สร้างโฟลเดอร์บน Server
```bash
ssh username@server-ip
sudo mkdir -p /var/www/portfolio
sudo chown -R $USER:$USER /var/www/portfolio
sudo chmod -R 755 /var/www/portfolio
```

### 2. สร้าง Virtual Host
```bash
sudo nano /etc/apache2/sites-available/portfolio.conf
```

วางโค้ด:
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    ServerAlias www.your-domain.com
    DocumentRoot /var/www/portfolio
    
    <Directory /var/www/portfolio>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        FallbackResource /index.html
    </Directory>
</VirtualHost>
```

### 3. Enable Site
```bash
sudo a2enmod rewrite deflate expires headers
sudo a2ensite portfolio.conf
sudo apache2ctl configtest
sudo systemctl restart apache2
```

### 4. ตั้งค่า Cloudflare
1. Add site → เพิ่ม domain
2. DNS: A record `@` → `server-ip` (Proxied 🟠)
3. DNS: CNAME `www` → `your-domain.com` (Proxied 🟠)
4. เปลี่ยน nameservers ของ domain
5. SSL/TLS → "Flexible"
6. เปิด "Always Use HTTPS"

---

## 📤 Deploy (ทุกครั้งที่ต้องการอัพเดต)

### วิธีที่ 1: Deploy Script (แนะนำ!)
```bash
cd /Users/macbook/hifiw/frontend

# แก้ไขค่า config ใน deploy.sh ครั้งแรก
nano deploy.sh
# แก้: SERVER_USER, SERVER_IP

# รัน deploy
./deploy.sh
```

### วิธีที่ 2: Manual Deploy
```bash
# Build
cd /Users/macbook/hifiw/frontend
npm run build

# Upload
rsync -avz --delete dist/ username@server-ip:/var/www/portfolio/

# Set permissions (on server)
ssh username@server-ip
sudo chmod -R 755 /var/www/portfolio
sudo chown -R www-data:www-data /var/www/portfolio
```

---

## 🔧 คำสั่งที่ใช้บ่อย

### Apache
```bash
# Restart Apache
sudo systemctl restart apache2

# Reload Apache (no downtime)
sudo systemctl reload apache2

# ตรวจสอบสถานะ
sudo systemctl status apache2

# ตรวจสอบ config
sudo apache2ctl configtest

# ดู error log
sudo tail -f /var/log/apache2/portfolio-error.log

# ดู access log
sudo tail -f /var/log/apache2/portfolio-access.log
```

### Firewall
```bash
# เปิด port 80, 443
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
sudo ufw status
```

### Permissions
```bash
# Fix permissions
sudo chmod -R 755 /var/www/portfolio
sudo chown -R www-data:www-data /var/www/portfolio
```

---

## 🐛 แก้ปัญหาด่วน

### ❌ ไม่สามารถเข้าเว็บได้
```bash
# ตรวจสอบ Apache
sudo systemctl status apache2
sudo apache2ctl configtest

# ตรวจสอบ Firewall
sudo ufw status

# ดู log
sudo tail -50 /var/log/apache2/portfolio-error.log
```

### ❌ 404 เมื่อ refresh
เพิ่มใน Virtual Host:
```apache
FallbackResource /index.html
```
แล้ว:
```bash
sudo systemctl restart apache2
```

### ❌ CSS/JS ไม่โหลด
```bash
# Fix permissions
sudo chmod -R 755 /var/www/portfolio
sudo chown -R www-data:www-data /var/www/portfolio

# Clear browser cache
# Ctrl+Shift+R (hard refresh)
```

### ❌ Cloudflare SSL Error
1. SSL/TLS → เปลี่ยนเป็น "Flexible"
2. Caching → Purge Everything
3. รอ 5-10 นาที
4. ลอง incognito mode

---

## 📊 Monitoring

```bash
# ดูจำนวน request วันนี้
grep $(date +%d/%b/%Y) /var/log/apache2/portfolio-access.log | wc -l

# ดู IP ที่เข้ามามากที่สุด
awk '{print $1}' /var/log/apache2/portfolio-access.log | sort | uniq -c | sort -rn | head -10

# ดู 404 errors
grep "404" /var/log/apache2/portfolio-access.log

# ดูการใช้งาน disk
df -h
du -sh /var/www/portfolio
```

---

## 🔄 Update Workflow

```bash
# 1. แก้ไขโค้ด
vim src/components/portfolio/Hero.tsx

# 2. ทดสอบ local
npm run dev

# 3. Commit
git add .
git commit -m "Update hero section"
git push

# 4. Deploy
./deploy.sh

# 5. Clear Cloudflare cache
# ไปที่ Cloudflare Dashboard → Caching → Purge Everything

# 6. ทดสอบ
curl -I https://your-domain.com
```

---

## ⚡ Performance Tips

```bash
# Enable Gzip compression
sudo a2enmod deflate

# Enable browser caching
sudo a2enmod expires

# ใน Virtual Host เพิ่ม:
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/* "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

---

## 📋 Checklist

**ติดตั้งครั้งแรก:**
- [ ] สร้างโฟลเดอร์ `/var/www/portfolio`
- [ ] สร้าง Virtual Host config
- [ ] Enable modules: rewrite, deflate, expires
- [ ] Enable site และ restart Apache
- [ ] เพิ่ม domain เข้า Cloudflare
- [ ] ตั้ง DNS records
- [ ] เปลี่ยน nameservers
- [ ] ตั้ง SSL/TLS mode

**ทุกครั้งที่ Deploy:**
- [ ] Build (`npm run build`)
- [ ] Upload ไฟล์ขึ้น server
- [ ] Set permissions
- [ ] ทดสอบเว็บ
- [ ] Clear Cloudflare cache

---

## 🔗 Links

- **คู่มือเต็ม:** [DEPLOYMENT-APACHE.md](DEPLOYMENT-APACHE.md)
- **Deploy Script:** [deploy.sh](deploy.sh)
- **Cloudflare Dashboard:** https://dash.cloudflare.com
- **Apache Docs:** https://httpd.apache.org/docs/

---

**Need help?** ดูคู่มือเต็มได้ที่ `DEPLOYMENT-APACHE.md` 📖
