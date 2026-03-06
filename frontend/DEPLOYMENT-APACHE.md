# 🚀 Deploy Portfolio บน Ubuntu Server + Apache2 + Cloudflare

คู่มือนี้จะสอนวิธีการ deploy เว็บ Portfolio ขึ้น Ubuntu Server ของคุณเอง โดยใช้ Apache2 เป็น web server และ Cloudflare สำหรับจัดการ domain และ SSL

---

## 📋 สิ่งที่ต้องมีก่อน

- ✅ Ubuntu Server (16.04+, 18.04, 20.04, 22.04, 24.04)
- ✅ Apache2 ติดตั้งแล้ว
- ✅ Domain name (เช่น example.com)
- ✅ Cloudflare account (ฟรี)
- ✅ SSH access เข้า server

---

## 🎯 ภาพรวม Process

```
Local Build → Upload to Server → Configure Apache → Setup Cloudflare → Done!
```

---

## 📦 ขั้นตอนที่ 1: Build โปรเจค

บนเครื่องของคุณ (local):

```bash
cd /Users/macbook/hifiw/frontend

# ติดตั้ง dependencies (ถ้ายังไม่ได้ทำ)
npm install

# Build โปรเจค
npm run build
```

จะได้โฟลเดอร์ `dist/` ที่มีไฟล์:
```
dist/
├── index.html
├── assets/
│   ├── index-xxxxx.js
│   ├── index-xxxxx.css
│   └── ...
└── ...
```

---

## 🔐 ขั้นตอนที่ 2: เชื่อมต่อ SSH และเตรียม Server

### 2.1 เชื่อมต่อ SSH

```bash
ssh username@your-server-ip
# หรือ
ssh username@your-domain.com
```

### 2.2 ตรวจสอบ Apache2

```bash
# ตรวจสอบว่า Apache2 ติดตั้งแล้ว
apache2 -v

# ตรวจสอบสถานะ Apache2
sudo systemctl status apache2

# ถ้ายังไม่ได้เปิด ให้เปิด
sudo systemctl start apache2
sudo systemctl enable apache2
```

### 2.3 สร้างโฟลเดอร์สำหรับเว็บไซต์

```bash
# สร้างโฟลเดอร์สำหรับเว็บไซต์
sudo mkdir -p /var/www/portfolio

# เปลี่ยน ownership
sudo chown -R $USER:$USER /var/www/portfolio

# ตั้งค่า permissions
sudo chmod -R 755 /var/www/portfolio
```

---

## 📤 ขั้นตอนที่ 3: Upload ไฟล์ขึ้น Server

### วิธีที่ 1: ใช้ SCP (แนะนำสำหรับครั้งแรก)

บนเครื่อง local:

```bash
cd /Users/macbook/hifiw/frontend

# Upload ทั้งโฟลเดอร์ dist/
scp -r dist/* username@your-server-ip:/var/www/portfolio/

# ตัวอย่าง:
# scp -r dist/* ubuntu@203.0.113.10:/var/www/portfolio/
```

### วิธีที่ 2: ใช้ rsync (เร็วกว่า เหมาะสำหรับ update)

```bash
# Sync เฉพาะไฟล์ที่เปลี่ยนแปลง
rsync -avz --delete dist/ username@your-server-ip:/var/www/portfolio/

# ตัวอย่าง:
# rsync -avz --delete dist/ ubuntu@203.0.113.10:/var/www/portfolio/
```

### วิธีที่ 3: ใช้ Git (แนะนำสำหรับ production)

บน server:

```bash
cd /var/www/portfolio

# Clone repository
git clone https://github.com/chutisorn01/Portfolio.git temp
cd temp/frontend

# ติดตั้ง Node.js (ถ้ายังไม่มี)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Build บน server
npm install
npm run build

# ย้ายไฟล์ไปที่ root
mv dist/* /var/www/portfolio/
cd /var/www/portfolio
rm -rf temp
```

### วิธีที่ 4: ใช้ SFTP (GUI)

ใช้โปรแกรม เช่น:
- **FileZilla** (ฟรี, ทุก OS)
- **Cyberduck** (ฟรี, Mac/Windows)
- **WinSCP** (ฟรี, Windows)

1. เชื่อมต่อ SFTP ไปที่ server
2. เข้าโฟลเดอร์ `/var/www/portfolio/`
3. ลากไฟล์ใน `dist/` ไปวาง

---

## ⚙️ ขั้นตอนที่ 4: ตั้งค่า Apache2 Virtual Host

### 4.1 สร้าง Virtual Host Configuration

```bash
sudo nano /etc/apache2/sites-available/portfolio.conf
```

วางโค้ดนี้ (แก้ `your-domain.com` เป็น domain จริง):

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    ServerAlias www.your-domain.com
    
    ServerAdmin webmaster@your-domain.com
    DocumentRoot /var/www/portfolio
    
    # Log files
    ErrorLog ${APACHE_LOG_DIR}/portfolio-error.log
    CustomLog ${APACHE_LOG_DIR}/portfolio-access.log combined
    
    <Directory /var/www/portfolio>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # SPA routing - redirect ทุก request ไปที่ index.html
        FallbackResource /index.html
    </Directory>
    
    # Compression
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
    </IfModule>
    
    # Browser Caching
    <IfModule mod_expires.c>
        ExpiresActive On
        ExpiresByType image/jpg "access plus 1 year"
        ExpiresByType image/jpeg "access plus 1 year"
        ExpiresByType image/gif "access plus 1 year"
        ExpiresByType image/png "access plus 1 year"
        ExpiresByType image/svg+xml "access plus 1 year"
        ExpiresByType text/css "access plus 1 month"
        ExpiresByType application/javascript "access plus 1 month"
        ExpiresByType text/javascript "access plus 1 month"
    </IfModule>
</VirtualHost>
```

บันทึกไฟล์: `Ctrl + X`, กด `Y`, กด `Enter`

### 4.2 เปิดใช้งาน Modules ที่จำเป็น

```bash
# เปิดใช้งาน rewrite module (สำหรับ SPA routing)
sudo a2enmod rewrite

# เปิดใช้งาน deflate (compression)
sudo a2enmod deflate

# เปิดใช้งาน expires (caching)
sudo a2enmod expires

# เปิดใช้งาน headers
sudo a2enmod headers
```

### 4.3 เปิดใช้งาน Site

```bash
# เปิดใช้งาน site ใหม่
sudo a2ensite portfolio.conf

# ปิด default site (ถ้าไม่ต้องการ)
sudo a2dissite 000-default.conf

# ทดสอบ configuration
sudo apache2ctl configtest

# ถ้าได้ "Syntax OK" ให้ restart Apache
sudo systemctl restart apache2
```

---

## 🌐 ขั้นตอนที่ 5: ตั้งค่า Cloudflare

### 5.1 เพิ่ม Domain เข้า Cloudflare

1. **Login Cloudflare:** https://dash.cloudflare.com
2. **Add a Site:**
   - คลิก "Add a Site"
   - ใส่ domain ของคุณ (ตัวอย่าง: `example.com`)
   - เลือก Free plan
   - คลิก "Add site"

3. **Scan DNS Records:**
   - Cloudflare จะ scan DNS records ที่มีอยู่
   - รอสักครู่ให้เสร็จ

### 5.2 ตั้งค่า DNS Records

เพิ่ม/แก้ไข DNS records:

**A Record (สำหรับ root domain):**
```
Type: A
Name: @
IPv4 address: your-server-ip
Proxy status: Proxied (🟠 เปิด)
TTL: Auto
```

**CNAME Record (สำหรับ www):**
```
Type: CNAME
Name: www
Target: your-domain.com
Proxy status: Proxied (🟠 เปิด)
TTL: Auto
```

### 5.3 เปลี่ยน Nameservers

Cloudflare จะให้ nameservers 2 ตัว เช่น:
```
alex.ns.cloudflare.com
rose.ns.cloudflare.com
```

**ไปที่ Domain Registrar** (ตัวอย่าง GoDaddy, Namecheap, etc.):
1. เข้าหน้าจัดการ domain
2. หา DNS/Nameserver settings
3. เปลี่ยน nameservers เป็นของ Cloudflare
4. Save

**รอ propagation:** อาจใช้เวลา 5 นาที - 48 ชั่วโมง

### 5.4 ตั้งค่า SSL/TLS

บน Cloudflare dashboard:

1. **SSL/TLS → Overview:**
   - เลือก **"Flexible"** (ถ้ายังไม่มี SSL บน server)
   - หรือ **"Full"** (ถ้ามี SSL แล้ว)

2. **SSL/TLS → Edge Certificates:**
   - เปิด "Always Use HTTPS"
   - เปิด "Automatic HTTPS Rewrites"
   - เปิด "Minimum TLS Version" → TLS 1.2

---

## 🎨 ขั้นตอนที่ 6: Optimization (Optional)

### 6.1 ตั้งค่า .htaccess (ถ้าต้องการ)

```bash
nano /var/www/portfolio/.htaccess
```

เพิ่มโค้ด:

```apache
# Security Headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Disable directory browsing
Options -Indexes

# Force HTTPS (ถ้าใช้ Flexible SSL แนะนำให้ปิด)
# RewriteEngine On
# RewriteCond %{HTTPS} off
# RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### 6.2 Cloudflare Page Rules

สร้าง Page Rules สำหรับ optimization:

1. **Cache Everything:**
   ```
   URL: your-domain.com/*
   Settings:
   - Cache Level: Cache Everything
   - Browser Cache TTL: 1 month
   ```

2. **Always Use HTTPS:**
   ```
   URL: http://your-domain.com/*
   Settings:
   - Always Use HTTPS
   ```

### 6.3 Cloudflare Speed Settings

1. **Speed → Optimization:**
   - เปิด "Auto Minify" (JavaScript, CSS, HTML)
   - เปิด "Brotli"
   - เปิด "Early Hints"

---

## ✅ ขั้นตอนที่ 7: ทดสอบ

### 7.1 ทดสอบการเข้าถึง

เปิดเบราว์เซอร์:
```
http://your-domain.com
https://your-domain.com
https://www.your-domain.com
```

### 7.2 ทดสอบ DNS

```bash
# บนเครื่อง local
dig your-domain.com

# ตรวจสอบ DNS propagation
# เข้า: https://www.whatsmydns.net
```

### 7.3 ทดสอบ SSL

- เข้า: https://www.ssllabs.com/ssltest/
- ใส่ domain แล้ว test

### 7.4 ทดสอบ Performance

- Google PageSpeed Insights: https://pagespeed.web.dev/
- GTmetrix: https://gtmetrix.com/

---

## 🔄 Update เว็บไซต์

เมื่อต้องการอัพเดตเนื้อหา:

### วิธีที่ 1: Update ด้วย rsync (แนะนำ)

```bash
# บนเครื่อง local
cd /Users/macbook/hifiw/frontend
npm run build
rsync -avz --delete dist/ username@your-server-ip:/var/www/portfolio/
```

### วิธีที่ 2: Update ด้วย Git

```bash
# Push code ใหม่ขึ้น GitHub
git add .
git commit -m "Update content"
git push

# บน server
ssh username@your-server-ip
cd /var/www/portfolio-repo  # ที่เก็บ git repo
git pull
cd frontend
npm run build
rsync -avz dist/ /var/www/portfolio/
```

### วิธีที่ 3: Automated Deployment Script

สร้างไฟล์ `deploy.sh`:

```bash
#!/bin/bash
cd /Users/macbook/hifiw/frontend
npm run build
rsync -avz --delete dist/ username@your-server-ip:/var/www/portfolio/

# Clear Cloudflare cache
curl -X POST "https://api.cloudflare.com/client/v4/zones/YOUR_ZONE_ID/purge_cache" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'

echo "Deployment complete!"
```

รัน:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 🐛 แก้ไขปัญหา

### ❌ ไม่สามารถเข้าเว็บได้

**ตรวจสอบ Apache:**
```bash
sudo systemctl status apache2
sudo apache2ctl configtest
sudo tail -f /var/log/apache2/portfolio-error.log
```

**ตรวจสอบ Firewall:**
```bash
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
```

### ❌ 404 Not Found เมื่อ refresh หน้า

แก้ไข Virtual Host เพิ่ม:
```apache
FallbackResource /index.html
```

หรือเพิ่มใน `.htaccess`:
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### ❌ Cloudflare แสดง SSL Error

1. เปลี่ยน SSL/TLS mode เป็น "Flexible"
2. รอ 5-10 นาที
3. Clear cache ของ Cloudflare
4. ลอง browse แบบ incognito

### ❌ DNS ไม่ทำงาน

1. ตรวจสอบว่าเปลี่ยน nameservers แล้ว
2. รอ DNS propagation (อาจใช้เวลา 24-48 ชม.)
3. ลองใช้ `dig` หรือ `nslookup` ทดสอบ

### ❌ ไฟล์ CSS/JS ไม่โหลด

**ตรวจสอบ permissions:**
```bash
sudo chmod -R 755 /var/www/portfolio
sudo chown -R www-data:www-data /var/www/portfolio
```

**ตรวจสอบ path ใน index.html:**
- ต้องเป็น relative path หรือ absolute path ที่ถูกต้อง

---

## 📊 Monitoring และ Maintenance

### ดู Log files

```bash
# Apache access log
sudo tail -f /var/log/apache2/portfolio-access.log

# Apache error log
sudo tail -f /var/log/apache2/portfolio-error.log

# ดู log แบบกรอง
sudo grep "Error" /var/log/apache2/portfolio-error.log
```

### Backup

```bash
# Backup ไฟล์เว็บ
sudo tar -czf portfolio-backup-$(date +%Y%m%d).tar.gz /var/www/portfolio/

# Backup Apache config
sudo cp /etc/apache2/sites-available/portfolio.conf ~/portfolio.conf.backup
```

### Update Server

```bash
# Update packages
sudo apt update
sudo apt upgrade

# Restart Apache
sudo systemctl restart apache2
```

---

## 🎯 Checklist

- [ ] Build โปรเจคสำเร็จ (`npm run build`)
- [ ] Upload ไฟล์ขึ้น server แล้ว
- [ ] ตั้งค่า Apache Virtual Host แล้ว
- [ ] Enable Apache modules (rewrite, deflate, expires)
- [ ] Restart Apache แล้ว
- [ ] เพิ่ม domain เข้า Cloudflare
- [ ] ตั้งค่า DNS records (A, CNAME)
- [ ] เปลี่ยน nameservers แล้ว
- [ ] ตั้งค่า SSL/TLS เป็น Flexible/Full
- [ ] ทดสอบเข้าเว็บได้ (HTTP/HTTPS)
- [ ] ทดสอบ www subdomain
- [ ] ทดสอบ SSL certificate
- [ ] Clear Cloudflare cache
- [ ] ทดสอบ performance

---

## 📚 Resources

- **Apache Documentation:** https://httpd.apache.org/docs/
- **Cloudflare Docs:** https://developers.cloudflare.com/
- **Ubuntu Server Guide:** https://ubuntu.com/server/docs
- **Let's Encrypt (ถ้าต้องการ SSL บน server):** https://letsencrypt.org/

---

## 💡 Tips

1. **ใช้ Cloudflare Cache** ให้เต็มที่เพื่อลด load บน server
2. **Backup** เว็บไซต์และ config เป็นประจำ
3. **Monitor logs** เพื่อดู errors และ traffic
4. **Update** server security patches เป็นประจำ
5. **ใช้ Git** สำหรับ version control และ deployment

---

**เสร็จแล้ว! 🎉** 

เว็บไซต์ของคุณควรจะออนไลน์และเข้าถึงได้จาก domain ของคุณแล้ว!

มีคำถามหรือเจอปัญหาอะไร สามารถถามได้เลยครับ 😊
