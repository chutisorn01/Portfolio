# 🌟 Portfolio Website

เว็บไซต์ Portfolio สวยงาม สร้างด้วย React + TypeScript + Tailwind CSS

## ✨ Features

- 🎨 **UI/UX สวยงาม** - ออกแบบด้วย Tailwind CSS และ shadcn/ui
- 📱 **Responsive Design** - ใช้งานได้ดีทุกอุปกรณ์
- ⚡ **Performance** - สร้างด้วย Vite สำหรับความเร็วสูงสุด
- 🚀 **Deploy ง่าย** - พร้อม deploy บน Netlify ในคลิกเดียว

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Build Tool:** Vite
- **Deployment:** Netlify

## 🚀 การติดตั้ง

1. Clone repository
```bash
git clone <your-repo-url>
cd frontend
```

2. ติดตั้ง dependencies
```bash
npm install
```

3. รันโปรเจค
```bash
npm run dev
```

4. เปิดเบราว์เซอร์ที่ `http://localhost:5173`

## 📦 Build สำหรับ Production

```bash
npm run build
```

ไฟล์ที่ build แล้วจะอยู่ในโฟลเดอร์ `dist/`

## 🌐 Deploy บน Netlify

### วิธีที่ 1: Deploy ด้วย Netlify CLI

1. ติดตั้ง Netlify CLI
```bash
npm install -g netlify-cli
```

2. Login เข้า Netlify
```bash
netlify login
```

3. Deploy
```bash
cd frontend
netlify deploy --prod
```

### วิธีที่ 2: Deploy ผ่าน Netlify Website (แนะนำ)

1. Push code ขึ้น GitHub
2. เข้า [Netlify](https://netlify.com)
3. คลิก "Add new site" → "Import an existing project"
4. เชื่อมต่อกับ GitHub repository
5. ตั้งค่า:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
6. คลิก "Deploy site"

### วิธีที่ 3: Deploy ด้วย Drag & Drop

1. Build โปรเจค
```bash
cd frontend
npm run build
```

2. เข้า [Netlify Drop](https://app.netlify.com/drop)
3. ลากโฟลเดอร์ `dist/` วางลงไป
4. เสร็จสิ้น! 🎉

## 📝 ปรับแต่งเนื้อหา

แก้ไขเนื้อหาต่างๆ ในไฟล์เหล่านี้:

- **Hero Section:** `src/components/portfolio/Hero.tsx` - หน้าแรก
- **About Section:** `src/components/portfolio/About.tsx` - เกี่ยวกับ
- **Skills Section:** `src/components/portfolio/Skills.tsx` - ทักษะ
- **Projects Section:** `src/components/portfolio/Projects.tsx` - ผลงาน
- **Contact Section:** `src/components/portfolio/Contact.tsx` - ติดต่อ
- **Navbar:** `src/components/portfolio/Navbar.tsx` - เมนูบาร์
- **Footer:** `src/components/portfolio/Footer.tsx` - ท้ายหน้า

## 🎨 ปรับแต่งสี Theme

แก้ไขไฟล์ `src/index.css` ส่วน CSS variables หรือปรับสีใน Tailwind classes โดยตรง

## 📞 ติดต่อ

อย่าลืมแก้ไขข้อมูลติดต่อใน:
- `Contact.tsx`
- `Footer.tsx`

## 📄 License

MIT License - ใช้งานได้อย่างอิสระ!

---

Made with ❤️ using React + TypeScript + Tailwind CSS
