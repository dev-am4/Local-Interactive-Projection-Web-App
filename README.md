# Local Interactive Projection Web App

เว็บแอพแบบ Local Kiosk สำหรับสถานี **Career Radar Chart / Skills Mapping** ใน Zone 6: Future Careers ของนิทรรศการดาราศาสตร์และอวกาศ

## แนวทางระบบ

- ทำงานแบบ Offline First บนเครื่อง PC หน้างาน
- แสดงผล 1:1 สำหรับ Projection Mapping
- พื้นที่ข้อมูลหลักอยู่ใน Safe Area 4:3 ตรงกลาง
- รองรับปุ่มกดทางกายภาพ 6 ปุ่มผ่าน USB Keyboard/HID Encoder
- ปุ่ม 1–6 เลือกอาชีพ, `0` หรือ `Esc` กลับหน้า Idle, `F` เข้า/ออก Fullscreen
- ไม่มี Compare Mode เพื่อให้ใช้งานง่ายและลดความซับซ้อนหน้างาน
- Spider/Radar Chart วาดแบบ real-time ด้วย SVG
- Background ambience เป็น CSS/SVG และรองรับการใส่วิดีโอของแต่ละอาชีพภายหลัง
- ไม่มี Backend, Login, Database หรือ API

## อาชีพ 6 สาย

1. นักดาราศาสตร์ — Astronomer
2. นักบินอวกาศ — Astronaut
3. วิศวกรการบินและอวกาศ — Aerospace Engineer
4. นักวิทยาศาสตร์และนักวิจัยอวกาศ — Space Scientist / Researcher
5. นักพัฒนาซอฟต์แวร์และ AI — Software & AI Developer
6. ศิลปินดิจิทัลด้านวิทยาศาสตร์ — Scientific Digital Artist

> คะแนน Skills ในเวอร์ชันนี้เป็นข้อมูลต้นแบบสำหรับการออกแบบ/นำเสนอ ควรให้ฝ่ายวิชาการตรวจและอนุมัติก่อนใช้งานจริง

## เริ่มต้นพัฒนา

```bash
npm install
npm run dev
```

เปิด `http://localhost:5173`

## Build สำหรับหน้างาน

```bash
npm run build
npm run preview
```

หรือบน Windows ใช้

```bat
build-kiosk.bat
start-kiosk.bat
```

`start-kiosk.bat` จะเปิด Microsoft Edge ใน Kiosk Fullscreen ที่ `http://127.0.0.1:4173`

## การต่อปุ่มจริง

แนะนำ USB HID / Keyboard Encoder ให้แต่ละปุ่มส่งคีย์ 1–6:

- Button 1 → `1`
- Button 2 → `2`
- Button 3 → `3`
- Button 4 → `4`
- Button 5 → `5`
- Button 6 → `6`

Numpad 1–6 รองรับเช่นกัน

## ใส่วิดีโอภายหลัง

นำไฟล์ไว้ใน `public/media/` แล้วกำหนด `backgroundMedia` ของอาชีพใน `src/data/careers.ts` เช่น

```ts
backgroundMedia: "/media/astronaut-loop.mp4"
```

ถ้าไฟล์ไม่มีหรือโหลดไม่ได้ ระบบจะใช้ ambience ที่สร้างด้วย CSS แทนโดยอัตโนมัติ

## Calibration / Debug

เติม `?debug=1` หลัง URL เพื่อแสดงกรอบ 1:1, Safe Area 4:3 และข้อมูลคีย์สำหรับทดสอบ เช่น

`http://localhost:5173/?debug=1`
