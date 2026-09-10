import type { CSSProperties } from 'react'
import { skillDefinitions } from '../data/careers'
import type { Career, SkillKey } from '../types'

type Props = {
  career: Career
  activeSkill?: SkillKey
  animateKey: number
}

const SIZE = 640
const CENTER = SIZE / 2
const MAX_RADIUS = 205
const RINGS = [1, 2, 3, 4, 5]

const polar = (index: number, radius: number) => {
  const angle = -Math.PI / 2 + (index * Math.PI * 2) / skillDefinitions.length
  return {
    x: CENTER + Math.cos(angle) * radius,
    y: CENTER + Math.sin(angle) * radius,
  }
}

const polygonPoints = (radius: number) =>
  skillDefinitions
    .map((_, index) => {
      const point = polar(index, radius)
      return `${point.x},${point.y}`
    })
    .join(' ')

export function RadarChart({ career, activeSkill, animateKey }: Props) {
  const dataPoints = skillDefinitions.map((skillDef, index) => {
    const level = career.skills[skillDef.key].level
    const radius = (level / 5) * MAX_RADIUS
    return { ...polar(index, radius), level, key: skillDef.key }
  })

  const dataPolygon = dataPoints.map((point) => `${point.x},${point.y}`).join(' ')
  const style = { '--career-accent': career.accent } as CSSProperties

  return (
    <div className="radar-wrap" style={style} aria-label={`กราฟทักษะ ${career.nameTh}`}>
      <svg className="radar-svg" viewBox={`0 0 ${SIZE} ${SIZE}`} role="img">
        <defs>
          <radialGradient id={`radarGlow-${career.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={career.accent} stopOpacity="0.22" />
            <stop offset="100%" stopColor={career.accent} stopOpacity="0.01" />
          </radialGradient>
          <filter id={`softGlow-${career.id}`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx={CENTER} cy={CENTER} r={MAX_RADIUS + 38} fill={`url(#radarGlow-${career.id})`} />

        {RINGS.map((ring) => (
          <polygon
            key={ring}
            points={polygonPoints((ring / 5) * MAX_RADIUS)}
            className="radar-ring"
          />
        ))}

        {skillDefinitions.map((skillDef, index) => {
          const end = polar(index, MAX_RADIUS)
          return (
            <line
              key={skillDef.key}
              x1={CENTER}
              y1={CENTER}
              x2={end.x}
              y2={end.y}
              className="radar-axis"
            />
          )
        })}

        <polygon
          key={`${career.id}-${animateKey}`}
          points={dataPolygon}
          className="radar-data"
          fill={career.accent}
          stroke={career.accent}
          filter={`url(#softGlow-${career.id})`}
        />

        {dataPoints.map((point) => {
          const isActive = activeSkill === point.key
          return (
            <g key={point.key} className={isActive ? 'radar-node active' : 'radar-node'}>
              <circle cx={point.x} cy={point.y} r={isActive ? 11 : 7} fill={career.accent} />
              {isActive && (
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="20"
                  fill="none"
                  stroke={career.accent}
                  strokeOpacity="0.52"
                  className="node-pulse"
                />
              )}
            </g>
          )
        })}

        {skillDefinitions.map((skillDef, index) => {
          const labelPoint = polar(index, MAX_RADIUS + 70)
          const isActive = activeSkill === skillDef.key
          return (
            <text
              key={`label-${skillDef.key}`}
              x={labelPoint.x}
              y={labelPoint.y + 5}
              textAnchor="middle"
              className={isActive ? 'radar-label active' : 'radar-label'}
              fill={isActive ? career.accent : undefined}
            >
              {skillDef.labelTh}
            </text>
          )
        })}

        <circle cx={CENTER} cy={CENTER} r="7" fill={career.accent} className="radar-center" />
      </svg>
    </div>
  )
}
