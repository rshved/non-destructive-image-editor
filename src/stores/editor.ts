import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Adjustments, CropArea, ExportManifest, FilterName, Operation } from '@/types'
import { canvasToBlob, drawImage, loadImage } from '@/utils/canvas'
import { downloadBlob, downloadJson } from '@/utils/files'

const createDefaultAdjustments = (): Adjustments => ({
  brightness: 100,
  contrast: 100,
  saturation: 100,
})

export const useEditorStore = defineStore('editor', () => {
  const sourceUrl = ref('')
  const sourceName = ref('')
  const crop = ref<CropArea | null>(null)
  const adjustments = ref(createDefaultAdjustments())
  const filter = ref<FilterName>('none')
  const isComparing = ref(false)

  const hasImage = computed(() => sourceUrl.value !== '')
  const isAdjusted = computed(() => Object.values(adjustments.value).some((value) => value !== 100))
  const hasEdits = computed(() => crop.value !== null || isAdjusted.value || filter.value !== 'none')

  const cssFilter = computed(() => {
    const { brightness, contrast, saturation } = adjustments.value
    const functions = [`brightness(${brightness}%)`, `contrast(${contrast}%)`, `saturate(${saturation}%)`]
    if (filter.value !== 'none') functions.push(`${filter.value}(100%)`)
    return functions.join(' ')
  })

  const operations = computed(() => {
    const result: Operation[] = []
    const activeFilter = filter.value
    if (crop.value) result.push({ type: 'crop', ...crop.value })
    if (isAdjusted.value) result.push({ type: 'adjust', ...adjustments.value })
    if (activeFilter !== 'none') result.push({ type: 'filter', name: activeFilter })
    return result
  })

  function loadFile(file: File) {
    clear()
    sourceUrl.value = URL.createObjectURL(file)
    sourceName.value = file.name
  }

  function resetEdits() {
    crop.value = null
    adjustments.value = createDefaultAdjustments()
    filter.value = 'none'
    isComparing.value = false
  }

  function applyOperation(operation: Operation) {
    switch (operation.type) {
      case 'crop':
        crop.value = {
          left: operation.left,
          top: operation.top,
          width: operation.width,
          height: operation.height,
        }
        break
      case 'adjust':
        adjustments.value = {
          brightness: operation.brightness,
          contrast: operation.contrast,
          saturation: operation.saturation,
        }
        break
      case 'filter':
        filter.value = operation.name
        break
    }
  }

  async function importManifest(file: File): Promise<boolean> {
    try {
      const manifest = JSON.parse(await file.text()) as ExportManifest
      if (!Array.isArray(manifest.operations)) return false
      resetEdits()
      manifest.operations.forEach(applyOperation)
      return true
    } catch {
      return false
    }
  }

  function clear() {
    if (sourceUrl.value) URL.revokeObjectURL(sourceUrl.value)
    sourceUrl.value = ''
    sourceName.value = ''
    resetEdits()
  }

  async function exportImage() {
    const image = await loadImage(sourceUrl.value)
    const canvas = document.createElement('canvas')
    drawImage(canvas, image, crop.value, cssFilter.value)
    downloadBlob(await canvasToBlob(canvas), `${baseName()}-edited.png`)
  }

  function exportOperations() {
    const manifest: ExportManifest = { version: 1, source: sourceName.value, operations: operations.value }
    downloadJson(manifest, `${baseName()}-operations.json`)
  }

  function baseName() {
    return sourceName.value.replace(/\.[^.]+$/, '')
  }

  return {
    sourceUrl,
    sourceName,
    crop,
    adjustments,
    filter,
    isComparing,
    hasImage,
    hasEdits,
    cssFilter,
    operations,
    loadFile,
    resetEdits,
    importManifest,
    clear,
    exportImage,
    exportOperations,
  }
})
