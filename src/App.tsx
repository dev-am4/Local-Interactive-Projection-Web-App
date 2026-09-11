import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react'
import { kioskConfig, keyboardMap } from './config'
import { careers, skillDefinitions } from './data/careers'
import { RadarChart } from './components/RadarChart'
import type { Career } from './types'

const IDLE_QUESTIONS = [
  'ถ้าได้ทำงานกับอวกาศ\nคุณอยากเป็นใคร?',
  'ถ้าได้ขึ้นยานอวกาศ\nคุณอยากทำหน้าที่อะไร?',
  'คุณถนัดค้นหา\nสร้าง หรือออกแบบ?',
  'ทักษะของคุณ\nพาไปสู่อาชีพไหน?',
  'อนาคตในโลกอวกาศ\nของคุณเป็นแบบไหน?',
] as const

const getCareerIndexFromKeyboardEvent = (event: KeyboardEvent) => {
  const byKey = keyboardMap[event.key]
  if (typeof byKey === 'number') return byKey
  const byCode = keyboardMap[event.code]
  return typeof byCode === 'number' ? byCode : null
}

function App() {
  const debug = useMemo(() => new URLSearchParams(window.location.search).get('debug') === '1', [])
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null)
  const [animationKey, setAnimationKey] = useState(0)
  const [mediaFailed, setMediaFailed] = useState(false)

  const resetToIdle = useCallback(() => {
    setSelectedCareer(null)
    setMediaFailed(false)
    setAnimationKey((value) => value + 1)
  }, [])

  const selectCareer = useCallback((career: Career) => {
    setSelectedCareer(career)
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
          if (!document.fullscreenElement) await document.documentElement.requestFullscreen()
          else await document.exitFullscreen()
        } catch {
          // Browser kiosk/fullscreen policy may block the shortcut.
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

  const pageStyle = {
    '--accent': selectedCareer?.accent ?? '#63dcff',
  } as CSSProperties

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

      <div className="ambience ambience-top" aria-hidden="true">
        <div className="ambient-orbit-line" />
        <div className="ambient-spark spark-a" />
        <div className="ambient-spark spark-b" />
      </div>

      <section className="safe-area">
        <div className="safe-content">
          {!selectedCareer ? (
            <IdleScreen />
          ) : (
            <CareerScreen
              key={`${selectedCareer.id}-${animationKey}`}
              career={selectedCareer}
              animationKey={animationKey}
            />
          )}
        </div>

        <CareerSelector
          selectedCareer={selectedCareer}
          onSelect={selectCareer}
        />
      </section>

      <div className="ambience ambience-bottom" aria-hidden="true">
        <div className="ambient-horizon" />
        <div className="ambient-dust" />
      </div>

      {debug && (
        <aside className="debug-panel">
          <strong>CALIBRATION</strong>
          <span>SAFE CONTENT</span>
          <span>BUTTON ROW LOCKED</span>
        </aside>
      )}
    </main>
  )
}

function IdleScreen() {
  const [questionIndex, setQuestionIndex] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setQuestionIndex((current) => (current + 1) % IDLE_QUESTIONS.length)
    }, 5200)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className="idle-stage idle-stage-cinematic">
      <div className="idle-constellation idle-constellation-center" aria-hidden="true">
        <div className="idle-ring ring-1" />
        <div className="idle-ring ring-2" />
        <div className="idle-ring ring-3" />
        <div className="idle-star">✦</div>
      </div>

      <div className="idle-question-wrap">
        <p className="idle-kicker">อนาคตของอวกาศ อาจเริ่มจากคุณ</p>
        <div className="idle-question-frame" key={questionIndex}>
          <h1 className="idle-question">{IDLE_QUESTIONS[questionIndex]}</h1>
        </div>
        <div className="idle-question-progress" aria-hidden="true">
          {IDLE_QUESTIONS.map((_, index) => (
            <span key={index} className={index === questionIndex ? 'active' : ''} />
          ))}
        </div>
      </div>

      <div className="idle-continue" aria-hidden="true">
        <span className="idle-continue-line" />
        <span className="idle-continue-text">แตะปุ่มอาชีพด้านล่าง เพื่อดูต่อ</span>
        <span className="idle-continue-chevron">⌄</span>
      </div>
    </div>
  )
}

type CareerScreenProps = {
  career: Career
  animationKey: number
}

function CareerScreen({ career, animationKey }: CareerScreenProps) {
  return (
    <div className="career-stage career-stage-all-skills">
      <header className="career-title-zone">
        <p className="career-title-en">{career.nameEn}</p>
        <h1>{career.nameTh}</h1>
      </header>

      <div className="career-main-row">
        <section className="character-zone">
          <div className="character-aura" aria-hidden="true" />
          <CharacterPortrait career={career} variant="hero" />
        </section>

        <section className="radar-zone">
          <RadarChart
            career={career}
            animateKey={animationKey}
          />
        </section>

        <section className="content-zone content-zone-all-skills">
          <p className="eyebrow">เกี่ยวกับอาชีพนี้</p>
          <p className="career-description">{career.shortDescription}</p>

          <div className="all-skill-list" aria-label="ทักษะทั้งหมดของอาชีพนี้">
            {skillDefinitions.map((definition) => {
              const data = career.skills[definition.key]
              return (
                <div key={definition.key} className="all-skill-item">
                  <div className="all-skill-head">
                    <span className="all-skill-name">{definition.labelTh}</span>
                    <div className="level-dots compact" aria-label={`ระดับความสำคัญ ${data.level} จาก 5`}>
                      {[1, 2, 3, 4, 5].map((value) => (
                        <span key={value} className={value <= data.level ? 'filled' : ''} />
                      ))}
                    </div>
                  </div>
                  <p>{data.summary}</p>
                </div>
              )
            })}
          </div>

          <blockquote>{career.closingMessage}</blockquote>
        </section>
      </div>
    </div>
  )
}

type CareerSelectorProps = {
  selectedCareer: Career | null
  onSelect: (career: Career) => void
}

function CareerSelector({ selectedCareer, onSelect }: CareerSelectorProps) {
  return (
    <nav className="career-selector" aria-label="เลือกอาชีพ">
      {careers.map((career, index) => {
        const active = selectedCareer?.id === career.id
        return (
          <button
            key={career.id}
            type="button"
            className={active ? 'career-choice active' : 'career-choice'}
            style={{
              '--choice-accent': career.accent,
              '--choice-index': index,
            } as CSSProperties}
            onClick={() => onSelect(career)}
            aria-pressed={active}
            aria-label={`เลือก ${career.nameTh}`}
          >
            <div className="choice-character">
              <CharacterPortrait career={career} variant="button" />
            </div>
            <div className="choice-name">{career.nameTh}</div>
            <div className="physical-button-marker" aria-hidden="true">
              <span className="physical-button-core" />
              <span className="physical-button-ripple" />
            </div>
          </button>
        )
      })}
    </nav>
  )
}

type CharacterPortraitProps = {
  career: Career
  variant: 'hero' | 'button'
}

function CharacterPortrait({ career, variant }: CharacterPortraitProps) {
  return (
    <div
      className={`character-portrait ${variant}`}
      data-career={career.id}
      style={{ '--portrait-accent': career.accent } as CSSProperties}
      aria-hidden="true"
    >
      <span className="character-sprite" />
    </div>
  )
}

export default App
