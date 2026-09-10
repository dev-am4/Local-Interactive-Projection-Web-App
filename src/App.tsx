import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react'
import { kioskConfig, keyboardMap } from './config'
import { careers, getTopSkillKeys, skillDefinitions } from './data/careers'
import { RadarChart } from './components/RadarChart'
import type { Career, SkillDefinition, SkillKey } from './types'

const getCareerIndexFromKeyboardEvent = (event: KeyboardEvent) => {
  const byKey = keyboardMap[event.key]
  if (typeof byKey === 'number') return byKey
  const byCode = keyboardMap[event.code]
  return typeof byCode === 'number' ? byCode : null
}

const skillDefinitionByKey = new Map(skillDefinitions.map((skill) => [skill.key, skill]))

function App() {
  const debug = useMemo(() => new URLSearchParams(window.location.search).get('debug') === '1', [])
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null)
  const [activeSkill, setActiveSkill] = useState<SkillKey | null>(null)
  const [animationKey, setAnimationKey] = useState(0)
  const [mediaFailed, setMediaFailed] = useState(false)

  const resetToIdle = useCallback(() => {
    setSelectedCareer(null)
    setActiveSkill(null)
    setMediaFailed(false)
    setAnimationKey((value) => value + 1)
  }, [])

  const selectCareer = useCallback((career: Career) => {
    const topSkills = getTopSkillKeys(career, 3)
    setSelectedCareer(career)
    setActiveSkill(topSkills[0] ?? null)
    setMediaFailed(false)
    setAnimationKey((value) => value + 1)
  }, [])

  useEffect(() => {
    const onKeyDown = async (event: KeyboardEvent) => {
      if (event.repeat) return

      const careerIndex = getCareerIndexFromKeyboardEvent(event)
      if (careerIndex !== null && careers[careerIndex]) {
        event.preventDefault()
        selectCareer(careers[careerIndex])
        return
      }

      if (event.key === 'Escape' || event.key === '0' || event.code === 'Numpad0') {
        event.preventDefault()
        resetToIdle()
        return
      }

      if (event.key.toLowerCase() === 'f') {
        event.preventDefault()
        try {
          if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen()
          } else {
            await document.exitFullscreen()
          }
        } catch {
          // Fullscreen may be blocked by browser policy. Kiosk mode still works without this shortcut.
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [resetToIdle, selectCareer])

  useEffect(() => {
    if (!selectedCareer) return

    const timeout = window.setTimeout(resetToIdle, kioskConfig.idleResetMs)
    return () => window.clearTimeout(timeout)
  }, [selectedCareer, animationKey, resetToIdle])

  useEffect(() => {
    if (!selectedCareer) return

    const topSkills = getTopSkillKeys(selectedCareer, 3)
    if (topSkills.length <= 1) return

    let index = 0
    let intervalId: number | undefined

    const startCycling = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        index = (index + 1) % topSkills.length
        setActiveSkill(topSkills[index] ?? topSkills[0])
      }, kioskConfig.skillStepMs)
    }, kioskConfig.careerRevealMs)

    return () => {
      window.clearTimeout(startCycling)
      if (intervalId !== undefined) window.clearInterval(intervalId)
    }
  }, [selectedCareer, animationKey])

  const pageStyle = {
    '--accent': selectedCareer?.accent ?? '#63dcff',
  } as CSSProperties

  const activeSkillDefinition = activeSkill ? skillDefinitionByKey.get(activeSkill) : undefined
  const activeSkillData = selectedCareer && activeSkill ? selectedCareer.skills[activeSkill] : null

  return (
    <main className={debug ? 'projection-app debug' : 'projection-app'} style={pageStyle}>
      <div className="space-backdrop" aria-hidden="true">
        <div className="nebula nebula-a" />
        <div className="nebula nebula-b" />
        <div className="star-layer star-layer-a" />
        <div className="star-layer star-layer-b" />
        <div className="orbit orbit-a" />
        <div className="orbit orbit-b" />
        <div className="scanline" />
      </div>

      {selectedCareer?.backgroundMedia && !mediaFailed && (
        <video
          className="career-media"
          key={selectedCareer.backgroundMedia}
          src={selectedCareer.backgroundMedia}
          autoPlay
          muted
          loop
          playsInline
          onError={() => setMediaFailed(true)}
        />
      )}

      <section className="ambience ambience-top" aria-hidden="true">
        <div className="zone-label">ZONE 6 / FUTURE CAREERS</div>
        <div className="ambience-copy">
          {selectedCareer ? selectedCareer.ambienceLabel : 'CAREER RADAR / SKILLS MAPPING'}
        </div>
      </section>

      <section className="safe-area">
        {!selectedCareer ? (
          <IdleScreen onSelect={selectCareer} />
        ) : (
          <CareerScreen
            career={selectedCareer}
            activeSkill={activeSkill}
            activeSkillDefinition={activeSkillDefinition}
            activeSkillData={activeSkillData}
            animationKey={animationKey}
            onSelect={selectCareer}
          />
        )}
      </section>

      <section className="ambience ambience-bottom" aria-hidden="true">
        <div className="bottom-grid" />
        <div className="bottom-copy">EXPLORE · LEARN · BUILD YOUR FUTURE</div>
      </section>

      {debug && (
        <aside className="debug-panel">
          <strong>DEBUG / CALIBRATION</strong>
          <span>Output: 1:1</span>
          <span>Safe content: 4:3</span>
          <span>Keys: 1–6 careers · 0/Esc idle · F fullscreen</span>
        </aside>
      )}
    </main>
  )
}

type IdleScreenProps = {
  onSelect: (career: Career) => void
}

function IdleScreen({ onSelect }: IdleScreenProps) {
  return (
    <div className="idle-screen">
      <div className="idle-visual" aria-hidden="true">
        <div className="idle-radar-ring ring-1" />
        <div className="idle-radar-ring ring-2" />
        <div className="idle-radar-ring ring-3" />
        <div className="idle-core">✦</div>
      </div>

      <div className="idle-copy">
        <p className="eyebrow">SPACE CAREER EXPLORER</p>
        <h1>อาชีพไหน<br />พาคุณไปสู่อวกาศ?</h1>
        <p className="idle-subtitle">กดปุ่มอาชีพบนผนัง เพื่อสำรวจทักษะสำคัญของแต่ละเส้นทาง</p>
      </div>

      <div className="career-button-grid" aria-label="ปุ่มเลือกอาชีพสำหรับทดสอบบนหน้าจอ">
        {careers.map((career) => (
          <button
            key={career.id}
            type="button"
            className="career-button"
            style={{ '--button-accent': career.accent } as CSSProperties}
            onClick={() => onSelect(career)}
          >
            <span className="keycap">{career.buttonKey}</span>
            <span className="career-button-icon">{career.icon}</span>
            <span className="career-button-text">
              <strong>{career.nameTh}</strong>
              <small>{career.nameEn}</small>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

type CareerScreenProps = {
  career: Career
  activeSkill: SkillKey | null
  activeSkillDefinition: SkillDefinition | undefined
  activeSkillData: Career['skills'][SkillKey] | null
  animationKey: number
  onSelect: (career: Career) => void
}

function CareerScreen({
  career,
  activeSkill,
  activeSkillDefinition,
  activeSkillData,
  animationKey,
  onSelect,
}: CareerScreenProps) {
  return (
    <div className="career-screen">
      <header className="career-header">
        <div className="career-number">BUTTON {career.buttonKey}</div>
        <div>
          <p className="eyebrow">{career.nameEn}</p>
          <h2>{career.nameTh}</h2>
          <p className="career-description">{career.shortDescription}</p>
        </div>
      </header>

      <div className="career-content">
        <div className="radar-column">
          <RadarChart
            career={career}
            activeSkill={activeSkill ?? undefined}
            animateKey={animationKey}
          />
        </div>

        <aside className="skill-panel">
          <div className="skill-panel-kicker">SKILL HIGHLIGHT</div>
          <div className="skill-panel-icon">{career.icon}</div>
          <h3>{activeSkillDefinition?.labelTh ?? 'ทักษะสำคัญ'}</h3>
          <p className="skill-panel-en">{activeSkillDefinition?.labelEn ?? 'CAREER SKILL'}</p>

          <div className="level-dots" aria-label={`ระดับความสำคัญ ${activeSkillData?.level ?? 0} จาก 5`}>
            {[1, 2, 3, 4, 5].map((value) => (
              <span key={value} className={value <= (activeSkillData?.level ?? 0) ? 'filled' : ''} />
            ))}
          </div>

          <div className="importance-label">
            {getImportanceLabel(activeSkillData?.level ?? 0)}
          </div>

          <p className="skill-summary">{activeSkillData?.summary}</p>
          <div className="growth-message">ทักษะนี้สามารถฝึกและพัฒนาได้</div>
        </aside>
      </div>

      <footer className="career-footer">
        <div className="career-closing">“{career.closingMessage}”</div>
        <div className="career-switcher" aria-label="เลือกอาชีพอื่น">
          {careers.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-label={`เลือก ${item.nameTh}`}
              className={item.id === career.id ? 'career-switch active' : 'career-switch'}
              style={{ '--button-accent': item.accent } as CSSProperties}
              onClick={() => onSelect(item)}
            >
              <span>{item.buttonKey}</span>
            </button>
          ))}
        </div>
      </footer>
    </div>
  )
}

function getImportanceLabel(level: number) {
  if (level >= 5) return 'สำคัญมาก'
  if (level === 4) return 'สำคัญ'
  if (level === 3) return 'มีบทบาทสำคัญ'
  if (level === 2) return 'มีส่วนเกี่ยวข้อง'
  return 'ทักษะเสริม'
}

export default App
