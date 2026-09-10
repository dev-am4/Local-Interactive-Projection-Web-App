export type SkillKey =
  | 'science'
  | 'mathData'
  | 'technology'
  | 'analysis'
  | 'creativity'
  | 'communication'

export type CareerSkill = {
  level: 1 | 2 | 3 | 4 | 5
  summary: string
}

export type Career = {
  id: string
  buttonKey: string
  icon: string
  nameTh: string
  nameEn: string
  shortDescription: string
  closingMessage: string
  accent: string
  ambienceLabel: string
  backgroundMedia?: string
  skills: Record<SkillKey, CareerSkill>
}

export type SkillDefinition = {
  key: SkillKey
  labelTh: string
  labelEn: string
  shortLabel: string
}
