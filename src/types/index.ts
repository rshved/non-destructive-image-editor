export interface CropArea {
  left: number
  top: number
  width: number
  height: number
}

export interface Adjustments {
  brightness: number
  contrast: number
  saturation: number
}

export type FilterName = 'none' | 'grayscale' | 'sepia'

export type Operation =
  | ({ type: 'crop' } & CropArea)
  | ({ type: 'adjust' } & Adjustments)
  | { type: 'filter'; name: Exclude<FilterName, 'none'> }

export interface ExportManifest {
  version: number
  source: string
  operations: Operation[]
}
