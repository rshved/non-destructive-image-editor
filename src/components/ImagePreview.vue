<script setup lang="ts">
import { useEditorStore } from '@/stores/editor'
import { drawImage, loadImage } from '@/utils/canvas'
import { storeToRefs } from 'pinia'
import { ref, shallowRef, watch, watchEffect } from 'vue'
import { useDisplay } from 'vuetify'

const { smAndDown } = useDisplay()
const store = useEditorStore()
const { sourceUrl, crop, isComparing } = storeToRefs(store)
const stage = ref<HTMLElement>()
const editedCanvas = ref<HTMLCanvasElement>()
const originalCanvas = ref<HTMLCanvasElement>()
const image = shallowRef<HTMLImageElement | null>(null)
const comparePosition = ref(50)

watch(
  sourceUrl,
  async (url) => {
    image.value = url ? await loadImage(url) : null
  },
  { immediate: true },
)

watch(isComparing, () => {
  comparePosition.value = 50
})

watchEffect(() => {
  if (!image.value) return
  if (editedCanvas.value) drawImage(editedCanvas.value, image.value, crop.value)
  if (originalCanvas.value) drawImage(originalCanvas.value, image.value, null)
})

function startCompareDrag(event: PointerEvent) {
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
}

function moveCompareDrag(event: PointerEvent) {
  if (event.buttons === 0 || !stage.value) return
  const { left, width } = stage.value.getBoundingClientRect()
  comparePosition.value = Math.min(100, Math.max(0, ((event.clientX - left) / width) * 100))
}
</script>

<template>
  <v-sheet border rounded="lg" class="pa-2 pa-sm-4 w-100">
    <div ref="stage" class="position-relative w-100" :style="{ height: smAndDown ? '55dvh' : '70vh' }">
      <canvas
        ref="editedCanvas"
        class="d-block w-100 h-100"
        :style="{ filter: store.cssFilter, objectFit: 'contain' }"
      />
      <template v-if="isComparing">
        <v-chip size="small" class="position-absolute top-0 right-0 ma-2 ma-sm-3">Edited</v-chip>
        <div
          class="position-absolute top-0 left-0 w-100 h-100 bg-surface"
          :style="{ clipPath: `inset(0 ${100 - comparePosition}% 0 0)` }"
        >
          <canvas ref="originalCanvas" class="d-block w-100 h-100" style="object-fit: contain" />
          <v-chip size="small" class="position-absolute top-0 left-0 ma-2 ma-sm-3">Original</v-chip>
        </div>
        <div
          class="position-absolute top-0 h-100 d-flex align-center justify-center"
          :style="{
            left: `calc(${comparePosition}% - 22px)`,
            width: '44px',
            cursor: 'col-resize',
            touchAction: 'none',
          }"
          @pointerdown="startCompareDrag"
          @pointermove="moveCompareDrag"
        >
          <div class="position-absolute top-0 h-100 bg-white" style="width: 2px" />
          <v-avatar color="white" size="32" class="elevation-2">
            <v-icon icon="mdi-arrow-left-right" size="16" color="grey-darken-3" />
          </v-avatar>
        </div>
      </template>
    </div>
  </v-sheet>
</template>
