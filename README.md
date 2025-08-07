# RAI Auth - Next.js with Auth0

โปรเจค Next.js ที่ใช้ Auth0 สำหรับการ authentication

## การติดตั้งและการใช้งาน

### 1. ติดตั้ง dependencies

```bash
npm install
```

### 2. ตั้งค่า Auth0

1. เข้าไปที่ [Auth0 Dashboard](https://manage.auth0.com/)
2. สร้าง Application ใหม่ (Single Page Application)
3. ตั้งค่า Allowed Callback URLs: `http://localhost:3000/callback`
4. ตั้งค่า Allowed Logout URLs: `http://localhost:3000`
5. ตั้งค่า Allowed Web Origins: `http://localhost:3000`

### 3. ตั้งค่า Environment Variables

แก้ไขไฟล์ `.env.local`:

```env
NEXT_PUBLIC_AUTH0_DOMAIN=your-auth0-domain.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your-auth0-client-id
```

### 4. รันโปรเจค

```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

## โครงสร้างโปรเจค

```
src/
├── app/
│   ├── callback/
│   │   └── page.tsx          # หน้า callback สำหรับ Auth0
│   ├── layout.tsx            # Layout หลักที่มี AuthProvider
│   └── page.tsx              # หน้าแรก
├── components/
│   └── LoginButton.tsx       # ปุ่ม Login/Logout
├── contexts/
│   └── AuthContext.tsx       # Context สำหรับจัดการ auth state
└── utils/
    └── auth0.utils.ts        # Utility สำหรับ Auth0
```

## คุณสมบัติ

- ✅ เข้าสู่ระบบด้วย Auth0
- ✅ แสดงข้อมูลผู้ใช้เมื่อเข้าสู่ระบบแล้ว
- ✅ ปุ่มออกจากระบบ
- ✅ หน้า callback สำหรับรับ response จาก Auth0
- ✅ Loading states และ error handling
- ✅ Responsive design ด้วย Tailwind CSS

## การใช้งาน

1. กดปุ่ม "เข้าสู่ระบบ" เพื่อเริ่มกระบวนการ authentication
2. ระบบจะพาไปยังหน้า Auth0 login
3. เมื่อเข้าสู่ระบบสำเร็จ ระบบจะพากลับมาที่หน้า callback
4. หน้า callback จะประมวลผล authentication และพากลับไปหน้าแรก
5. หน้าแรกจะแสดงข้อมูลผู้ใช้และปุ่มออกจากระบบ
