import type { CropArea } from '@/types'

export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Failed to load image'))
    image.src = url
  })
}

export function drawImage(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  crop: CropArea | null,
  filter = 'none',
) {
  const area = crop ?? { left: 0, top: 0, width: image.naturalWidth, height: image.naturalHeight }
  canvas.width = area.width
  canvas.height = area.height
  const context = canvas.getContext('2d')
  if (!context) return
  context.filter = filter
  context.drawImage(image, area.left, area.top, area.width, area.height, 0, 0, area.width, area.height)
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Failed to export canvas'))))
  })
}
