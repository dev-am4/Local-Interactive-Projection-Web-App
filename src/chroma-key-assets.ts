type ChromaAsset = {
  selector: string
  src: string
}

// Only assets that actually contain green-screen spill should be listed here.
// Keeping this explicit prevents real green/teal costume accents on other careers
// from being removed accidentally.
const CHROMA_ASSETS: ChromaAsset[] = [
  {
    selector: '.character-portrait[data-career="astronaut"] .character-sprite',
    src: '/characters/astronaut.webp?v=6',
  },
]

const clamp01 = (value: number) => Math.max(0, Math.min(1, value))

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.decoding = 'async'
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })

function removeGreenScreen(image: HTMLImageElement) {
  const canvas = document.createElement('canvas')
  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight

  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) throw new Error('Canvas 2D context unavailable')

  context.drawImage(image, 0, 0)

  const frame = context.getImageData(0, 0, canvas.width, canvas.height)
  const pixels = frame.data

  for (let index = 0; index < pixels.length; index += 4) {
    const r = pixels[index]
    const g = pixels[index + 1]
    const b = pixels[index + 2]
    const a = pixels[index + 3]

    if (a === 0) continue

    const maxRB = Math.max(r, b)
    const greenDominance = g - maxRB
    const chromaGreen =
      g > 82 &&
      greenDominance > 18 &&
      g > r * 1.22 &&
      g > b * 1.16

    if (!chromaGreen) continue

    const hardKey = g > 132 && greenDominance > 50 && g > r * 1.38 && g > b * 1.28
    if (hardKey) {
      pixels[index + 3] = 0
      continue
    }

    const feather = clamp01((greenDominance - 18) / 48)
    pixels[index + 3] = Math.round(a * (1 - feather * 0.94))
    pixels[index + 1] = Math.min(g, maxRB + 8)
  }

  context.putImageData(frame, 0, 0)
  return canvas.toDataURL('image/png')
}

async function installAsset({ selector, src }: ChromaAsset) {
  try {
    const image = await loadImage(src)
    const cleanDataUrl = removeGreenScreen(image)
    const style = document.createElement('style')
    style.dataset.chromaKey = selector
    style.textContent = `${selector} { background-image: url("${cleanDataUrl}") !important; }`
    document.head.appendChild(style)
  } catch (error) {
    console.warn('[chroma-key] Could not clean asset:', src, error)
  }
}

export function installChromaKeyAssets() {
  void Promise.all(CHROMA_ASSETS.map(installAsset))
}
