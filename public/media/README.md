# Media assets

วางไฟล์วิดีโอ ambience / career reveal ในโฟลเดอร์นี้ แล้วกำหนด path ใน `src/data/careers.ts`

ตัวอย่าง:

```ts
backgroundMedia: '/media/astronaut-loop.mp4'
```

คำแนะนำสำหรับ Projection:

- ทำไฟล์ตามสัดส่วน output จริงของโปรเจคเตอร์
- ถ้า output เป็น 1:1 ให้ render วิดีโอ 1:1 เช่น 1920x1920
- อย่าวางข้อความหรือข้อมูลสำคัญในพื้นที่ ambience ด้านบน/ล่าง
- ให้ข้อมูลสำคัญอยู่ใน Safe Area 4:3 กลางจอ
- แนะนำ H.264 MP4 สำหรับความเข้ากันได้กับ Edge/Chrome
- ถ้าต้องการ alpha video ให้ทดสอบ codec กับเครื่องหน้างานก่อน
- ทำ loop ให้รอยต่อเนียนเพื่อให้ idle/background เล่นต่อเนื่องได้

ถ้าไม่กำหนด `backgroundMedia` ระบบจะใช้ CSS/SVG ambience ที่มีอยู่ในแอพแทน
