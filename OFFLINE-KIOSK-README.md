# Space Career Explorer — Offline Kiosk v1

Branch นี้ทำไว้สำหรับใช้งานหน้างานแบบออฟไลน์โดยเฉพาะ และแยกจาก `main` เพื่อไม่กระทบเวอร์ชันที่ผ่านการทดสอบออนไลน์แล้ว

## Hardware ที่แนะนำ

- Windows PC 1 เครื่อง
- Projector 1 เครื่อง ต่อ HDMI/DisplayPort
- ปุ่มกดแบบ Momentary 6 ปุ่มฝังผนัง
- USB HID Keyboard Encoder 1 ตัว
- ตั้ง Encoder ให้ส่งคีย์ `1` ถึง `6`

| ปุ่ม | Keyboard | อาชีพ |
|---|---|---|
| 1 | 1 | นักดาราศาสตร์ |
| 2 | 2 | นักบินอวกาศ |
| 3 | 3 | วิศวกรการบินและอวกาศ |
| 4 | 4 | นักวิทยาศาสตร์และนักวิจัยอวกาศ |
| 5 | 5 | Software & AI |
| 6 | 6 | Scientific Digital Artist |

เว็บรองรับแถวตัวเลขปกติและ Numpad อยู่แล้ว ดังนั้น Encoder ที่ทำตัวเป็น Keyboard ใช้งานได้ทันทีโดยไม่ต้องเขียน Arduino firmware

## ติดตั้งครั้งแรกบน PC หน้างาน

1. ติดตั้ง Node.js LTS 20 หรือใหม่กว่า
2. Clone/Download branch `offline-kiosk-v1`
3. วางโฟลเดอร์ไว้ถาวร เช่น `C:\Exhibition\SpaceCareer`
4. ดับเบิลคลิก `BUILD_OFFLINE.bat`
5. หลัง build สำเร็จ ดับเบิลคลิก `START_EXHIBITION.bat`
6. ทดสอบปุ่ม 1–6
7. ถ้าพร้อมใช้งานจริง ให้รัน `INSTALL_STARTUP.bat` เพื่อให้เปิดเองเมื่อ Windows Sign in

## ไฟล์สำคัญ

- `BUILD_OFFLINE.bat` — build เว็บลง `dist/`
- `START_EXHIBITION.bat` — เปิด local server และเปิด Edge/Chrome แบบ Kiosk
- `STOP_EXHIBITION.bat` — ปิด Kiosk และ local server
- `MAINTENANCE.bat` — เปิดหน้าตรวจปุ่มและ media
- `INSTALL_STARTUP.bat` — ให้ระบบเริ่มเองตอน Windows Sign in
- `REMOVE_STARTUP.bat` — ยกเลิก Auto Start
- `KIOSK_SETTINGS.bat` — ตั้งพิกัดจอ Projector
- `dist/offline-content.json` — เปลี่ยนภาพ/วิดีโอภายหลังโดยไม่ต้องแก้ React

## ตั้งจอ Projector

แก้ `KIOSK_SETTINGS.bat`

กรณี Projector เป็นจอหลัก:

```bat
set "PROJECTOR_X=0"
set "PROJECTOR_Y=0"
```

กรณีจอช่าง 1920×1080 อยู่ซ้าย และ Projector อยู่ขวา:

```bat
set "PROJECTOR_X=1920"
set "PROJECTOR_Y=0"
```

ถ้า Projector อยู่ซ้ายของจอหลัก Windows จะใช้ค่า X ติดลบ เช่น `-1920`

แนะนำ Windows:

- Scale 100%
- Resolution = Native resolution ของ Projector
- Sleep = Never
- Screen Saver = Off
- Notifications / Focus Assist = ปิดการแจ้งเตือนที่รบกวนงาน
- Browser Zoom = 100%

## เปลี่ยนภาพ Character ภายหลัง

หลัง build แล้ว สามารถแก้ไฟล์ใน `dist/` ได้โดยตรง เช่น

```text
dist/characters/astronaut.webp
```

หรือใส่ไฟล์ใหม่ เช่น

```text
dist/media/astronaut/new-character.webp
```

แล้วแก้ `dist/offline-content.json`

```json
"astronaut": {
  "character": "/media/astronaut/new-character.webp",
  "backgroundImage": "",
  "backgroundVideo": "",
  "videoEnabled": false,
  "backgroundOpacity": 0.22
}
```

Refresh หน้าเว็บหนึ่งครั้ง ภาพใหม่จะถูกใช้ทันที ไม่ต้อง build ใหม่

## เพิ่ม Background Image

วางไฟล์ เช่น

```text
dist/media/astronaut/background.webp
```

แล้วแก้ config:

```json
"backgroundImage": "/media/astronaut/background.webp",
"backgroundVideo": "",
"videoEnabled": false,
"backgroundOpacity": 0.22
```

ค่าความโปร่งใสแนะนำ `0.15–0.35` เพื่อไม่ให้พื้นหลังแย่ง Radar และข้อความ

## เพิ่ม Background Video

วางไฟล์ เช่น

```text
dist/media/astronaut/background.mp4
```

แก้ config:

```json
"backgroundImage": "",
"backgroundVideo": "/media/astronaut/background.mp4",
"videoEnabled": true,
"backgroundOpacity": 0.22
```

วิดีโอจะ autoplay, muted และ loop อัตโนมัติ

แนะนำไฟล์:

- MP4 / H.264
- 1920×1080
- 25 หรือ 30 fps
- 8–15 Mbps
- ทำ loop ให้เนียนก่อนนำมาใช้

Local server รองรับ HTTP Range สำหรับ MP4/WebM เพื่อให้ browser seek และ loop ได้เสถียร

## Maintenance / ทดสอบปุ่ม

เปิด `MAINTENANCE.bat`

หรือจากหน้า Exhibition กด:

```text
Ctrl + Shift + M
```

หน้า Maintenance จะแสดง:

- สถานะคีย์ 1–6
- Character ของแต่ละอาชีพว่าพบไฟล์หรือไม่
- Background image/video ตาม config
- ขนาด viewport
- สถานะ Fullscreen / Network

หมายเหตุ: Network ขึ้น Offline ถือว่าปกติ ระบบนี้ออกแบบให้ทำงานโดยไม่ใช้อินเทอร์เน็ต

## การใช้งานจริงแบบ 6 ปุ่ม

```text
Physical Button
      ↓
USB HID Keyboard Encoder
      ↓
Windows รับเป็นคีย์ 1–6
      ↓
Offline web app ที่ localhost
      ↓
Projector
```

ไม่ต้องใช้ Internet, Vercel, Supabase หรือ API ภายนอกในการแสดงผลหลัก

## Backup หน้างาน

ก่อนติดตั้งจริงให้สำรองทั้งโฟลเดอร์หลัง build ลง USB อย่างน้อย 1 ชุด เช่น

```text
SPACE-CAREER-BACKUP/
  app/
  dist/
  tools/
  START_EXHIBITION.bat
  STOP_EXHIBITION.bat
  KIOSK_SETTINGS.bat
```

แนะนำเก็บ zip เวอร์ชันที่ผ่าน Site Acceptance Test ไว้อีกชุด และไม่แก้ไฟล์ชุดนั้นโดยตรง

## เวอร์ชัน

- `main` = เวอร์ชันออนไลน์ stable ห้ามแก้เพื่อทดลอง Offline
- `offline-kiosk-v1` = เวอร์ชันเตรียมหน้างาน Offline

เมื่อ Offline ทดสอบครบแล้ว ค่อย tag/release เป็น `offline-v1.0-stable`
