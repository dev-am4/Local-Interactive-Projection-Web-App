import type { Career, SkillDefinition, SkillKey } from '../types'

export const skillDefinitions: SkillDefinition[] = [
  { key: 'science', labelTh: 'วิทยาศาสตร์', labelEn: 'SCIENCE', shortLabel: 'SCIENCE' },
  { key: 'mathData', labelTh: 'คณิตศาสตร์และข้อมูล', labelEn: 'MATH & DATA', shortLabel: 'MATH' },
  { key: 'technology', labelTh: 'เทคโนโลยี', labelEn: 'TECHNOLOGY', shortLabel: 'TECH' },
  { key: 'analysis', labelTh: 'การคิดวิเคราะห์', labelEn: 'ANALYSIS', shortLabel: 'ANALYSIS' },
  { key: 'creativity', labelTh: 'ความคิดสร้างสรรค์', labelEn: 'CREATIVITY', shortLabel: 'CREATE' },
  { key: 'communication', labelTh: 'การสื่อสารและทำงานร่วมกัน', labelEn: 'COMMUNICATION', shortLabel: 'COMM' },
]

const skill = (level: 1 | 2 | 3 | 4 | 5, summary: string) => ({ level, summary })

export const careers: Career[] = [
  {
    id: 'astronomer',
    buttonKey: '1',
    icon: '✦',
    nameTh: 'นักดาราศาสตร์',
    nameEn: 'ASTRONOMER',
    shortDescription: 'สำรวจดวงดาวและปรากฏการณ์ในจักรวาล ผ่านการสังเกต การคำนวณ และการวิเคราะห์ข้อมูล',
    closingMessage: 'มองให้ไกล ตั้งคำถามให้ลึก แล้วใช้หลักฐานค้นหาคำตอบจากจักรวาล',
    accent: '#59d9ff',
    ambienceLabel: 'STAR MAP / OBSERVATION DATA',
    skills: {
      science: skill(5, 'ใช้ฟิสิกส์และฟิสิกส์ดาราศาสตร์เพื่อทำความเข้าใจดาวฤกษ์ กาแล็กซี และปรากฏการณ์ในจักรวาล'),
      mathData: skill(5, 'ใช้คณิตศาสตร์และข้อมูลจากการสังเกต เพื่อคำนวณ วิเคราะห์ และทดสอบสมมติฐาน'),
      technology: skill(4, 'ใช้กล้องโทรทรรศน์ เครื่องตรวจวัด ซอฟต์แวร์ และระบบประมวลผลข้อมูลทางดาราศาสตร์'),
      analysis: skill(5, 'เปรียบเทียบข้อมูล สังเกตรูปแบบ และตีความหลักฐานเพื่ออธิบายสิ่งที่เกิดขึ้นในจักรวาล'),
      creativity: skill(3, 'ใช้จินตนาการทางวิทยาศาสตร์ในการตั้งคำถามใหม่และออกแบบวิธีค้นหาคำตอบ'),
      communication: skill(4, 'เขียนรายงานวิจัย นำเสนอผล และสื่อสารข้อมูลทางวิทยาศาสตร์ร่วมกับทีมระดับนานาชาติ'),
    },
  },
  {
    id: 'astronaut',
    buttonKey: '2',
    icon: '◉',
    nameTh: 'นักบินอวกาศ',
    nameEn: 'ASTRONAUT',
    shortDescription: 'ปฏิบัติภารกิจ ทดลอง และทำงานร่วมกับทีมในสภาพแวดล้อมที่ท้าทายที่สุดแห่งหนึ่ง',
    closingMessage: 'ภารกิจอวกาศสำเร็จได้ด้วยความรู้ การฝึกซ้อม วินัย และการทำงานเป็นทีม',
    accent: '#ffcf5a',
    ambienceLabel: 'ORBIT / MISSION TELEMETRY',
    skills: {
      science: skill(4, 'ต้องเข้าใจวิทยาศาสตร์พื้นฐานและการทดลอง เพื่อทำงานกับภารกิจและอุปกรณ์ในอวกาศ'),
      mathData: skill(4, 'ใช้คณิตศาสตร์ การอ่านค่าระบบ และข้อมูลภารกิจเพื่อช่วยตัดสินใจอย่างแม่นยำ'),
      technology: skill(4, 'ใช้งานระบบยาน อุปกรณ์ทดลอง ชุดอวกาศ และเครื่องมือเฉพาะทางได้อย่างถูกต้อง'),
      analysis: skill(4, 'วิเคราะห์สถานการณ์และแก้ปัญหาอย่างเป็นระบบเมื่อเกิดเหตุไม่คาดคิด'),
      creativity: skill(3, 'ปรับตัวและคิดวิธีแก้ปัญหาภายใต้ข้อจำกัดของเวลา อุปกรณ์ และสภาพแวดล้อม'),
      communication: skill(5, 'สื่อสารกับลูกเรือและศูนย์ควบคุมอย่างชัดเจน พร้อมทำงานร่วมกันภายใต้แรงกดดัน'),
    },
  },
  {
    id: 'aerospace-engineer',
    buttonKey: '3',
    icon: '△',
    nameTh: 'วิศวกรการบินและอวกาศ',
    nameEn: 'AEROSPACE ENGINEER',
    shortDescription: 'ออกแบบและพัฒนายานอวกาศ ดาวเทียม โครงสร้าง ระบบขับเคลื่อน และระบบควบคุม',
    closingMessage: 'เปลี่ยนหลักฟิสิกส์และสมการ ให้กลายเป็นยานและระบบที่เดินทางได้จริง',
    accent: '#ff7a59',
    ambienceLabel: 'BLUEPRINT / ENGINEERING WIREFRAME',
    skills: {
      science: skill(5, 'ใช้ฟิสิกส์ กลศาสตร์ วัสดุ และหลักวิทยาศาสตร์เพื่อออกแบบระบบที่ทำงานได้จริง'),
      mathData: skill(5, 'ใช้แคลคูลัส แบบจำลอง และข้อมูลการทดสอบเพื่อคำนวณแรง การเคลื่อนที่ และสมรรถนะ'),
      technology: skill(5, 'ใช้ CAD การจำลองทางวิศวกรรม ระบบควบคุม Avionics และเครื่องมือทดสอบ'),
      analysis: skill(5, 'วิเคราะห์ข้อจำกัด ความเสี่ยง และผลการทดสอบเพื่อแก้ปัญหาทางวิศวกรรม'),
      creativity: skill(4, 'คิดแนวทางออกแบบใหม่ภายใต้ข้อจำกัดด้านน้ำหนัก พลังงาน ความปลอดภัย และต้นทุน'),
      communication: skill(3, 'ทำงานร่วมกับวิศวกรหลายสาขาและสื่อสารรายละเอียดทางเทคนิคให้ทีมเข้าใจตรงกัน'),
    },
  },
  {
    id: 'space-scientist',
    buttonKey: '4',
    icon: '⌁',
    nameTh: 'นักวิทยาศาสตร์และนักวิจัยอวกาศ',
    nameEn: 'SPACE SCIENTIST / RESEARCHER',
    shortDescription: 'ตั้งคำถาม ออกแบบการทดลอง และใช้ข้อมูลจากโลกและอวกาศเพื่อสร้างองค์ความรู้ใหม่',
    closingMessage: 'ทุกการค้นพบเริ่มจากคำถามที่ดี และการทดลองที่ตรวจสอบได้',
    accent: '#b987ff',
    ambienceLabel: 'RESEARCH / PARTICLE & DATA FIELD',
    skills: {
      science: skill(5, 'ใช้ความรู้เฉพาะทาง เช่น ฟิสิกส์ ชีววิทยา เคมี หรือวิทยาศาสตร์ดาวเคราะห์ตามโจทย์วิจัย'),
      mathData: skill(4, 'ใช้คณิตศาสตร์ สถิติ และแบบจำลองเพื่อวิเคราะห์ผลการทดลองและข้อมูลจำนวนมาก'),
      technology: skill(4, 'ใช้เครื่องมือทดลอง เซนเซอร์ ซอฟต์แวร์ และระบบประมวลผลข้อมูลในการทำวิจัย'),
      analysis: skill(5, 'ตั้งสมมติฐาน ตรวจสอบหลักฐาน แปลผล และแยกข้อสรุปออกจากสิ่งที่ข้อมูลยังตอบไม่ได้'),
      creativity: skill(4, 'ออกแบบการทดลองใหม่และค้นหาวิธีตอบคำถามที่ยังไม่มีคำตอบชัดเจน'),
      communication: skill(4, 'บันทึกผล เขียนรายงาน นำเสนอ และทำงานร่วมกับทีมวิจัยหลายสาขา'),
    },
  },
  {
    id: 'software-ai-developer',
    buttonKey: '5',
    icon: '⌘',
    nameTh: 'นักพัฒนาซอฟต์แวร์และ AI',
    nameEn: 'SOFTWARE & AI DEVELOPER',
    shortDescription: 'สร้างซอฟต์แวร์ ระบบอัตโนมัติ และ AI ที่ช่วยประมวลผลข้อมูลและสนับสนุนภารกิจอวกาศ',
    closingMessage: 'โค้ดหนึ่งบรรทัด อาจกลายเป็นส่วนหนึ่งของระบบที่ทำงานไกลออกไปนอกโลก',
    accent: '#60f0bd',
    ambienceLabel: 'CODE / AI / DATA STREAM',
    skills: {
      science: skill(3, 'ความเข้าใจบริบททางวิทยาศาสตร์ช่วยให้พัฒนาซอฟต์แวร์ที่ตอบโจทย์ภารกิจได้ถูกต้อง'),
      mathData: skill(4, 'ใช้ตรรกะ คณิตศาสตร์ สถิติ และข้อมูลเป็นพื้นฐานของอัลกอริทึมและระบบ AI'),
      technology: skill(5, 'ใช้ภาษาโปรแกรม โครงสร้างข้อมูล ฐานข้อมูล Cloud ระบบควบคุมเวอร์ชัน และเครื่องมือพัฒนา'),
      analysis: skill(5, 'แยกปัญหาเป็นส่วนย่อย ออกแบบอัลกอริทึม Debug และทดสอบระบบอย่างเป็นขั้นตอน'),
      creativity: skill(4, 'ออกแบบประสบการณ์และวิธีแก้ปัญหาใหม่ด้วยซอฟต์แวร์ ระบบอัตโนมัติ และ AI'),
      communication: skill(3, 'อธิบายระบบและทำงานร่วมกับนักวิทยาศาสตร์ วิศวกร นักออกแบบ และผู้ใช้งาน'),
    },
  },
  {
    id: 'scientific-digital-artist',
    buttonKey: '6',
    icon: '✧',
    nameTh: 'ศิลปินดิจิทัลด้านวิทยาศาสตร์',
    nameEn: 'SCIENTIFIC DIGITAL ARTIST',
    shortDescription: 'เปลี่ยนข้อมูลและแนวคิดทางวิทยาศาสตร์ ให้กลายเป็นภาพ 2D/3D และประสบการณ์ที่คนเข้าใจได้',
    closingMessage: 'ศิลปะ เทคโนโลยี และวิทยาศาสตร์ สามารถทำงานร่วมกันเพื่อทำให้สิ่งที่มองไม่เห็นมองเห็นได้',
    accent: '#ff69d4',
    ambienceLabel: 'VISUALIZATION / 3D / CREATIVE DATA',
    skills: {
      science: skill(4, 'ต้องเข้าใจเนื้อหาวิทยาศาสตร์ต้นทางเพื่อสร้างภาพที่สวยและไม่ทำให้สาระสำคัญผิดเพี้ยน'),
      mathData: skill(3, 'ใช้สัดส่วน พิกัด ข้อมูล และแนวคิดเชิงตัวเลขในการสร้างภาพจำลองและ Visualization'),
      technology: skill(5, 'ใช้ซอฟต์แวร์ 2D/3D Modeling Rendering Motion รวมถึง Coding และ AI ตามลักษณะงาน'),
      analysis: skill(3, 'วิเคราะห์ข้อมูลและเลือกว่าจะสื่อสารส่วนใด เพื่อให้ภาพช่วยอธิบายเรื่องยากได้ชัดเจน'),
      creativity: skill(5, 'ออกแบบภาพ รูปทรง การเคลื่อนไหว และวิธีเล่าเรื่องเพื่อเปลี่ยนแนวคิดซับซ้อนให้จับต้องได้'),
      communication: skill(4, 'ทำงานกับนักวิทยาศาสตร์และทีมสื่อ พร้อมถ่ายทอดความหมายผ่านภาพให้ผู้ชมเข้าใจ'),
    },
  },
]

export const careerByKey = new Map(careers.map((career, index) => [String(index + 1), career]))

export const getTopSkillKeys = (career: Career, count = 3): SkillKey[] =>
  (Object.entries(career.skills) as [SkillKey, Career['skills'][SkillKey]][])
    .sort(([, a], [, b]) => b.level - a.level)
    .slice(0, count)
    .map(([key]) => key)
