<script setup lang="ts">
import { Cropper } from 'vue-advanced-cropper'
import { useDisplay } from 'vuetify'
import { useEditorStore } from '@/stores/editor'
import type { CropArea } from '@/types'
import 'vue-advanced-cropper/dist/style.css'

const isOpen = defineModel<boolean>({ required: true })
const { smAndDown } = useDisplay()
const store = useEditorStore()

let pendingCrop: CropArea | null = null

function onChange({ coordinates }: { coordinates: CropArea }) {
  pendingCrop = {
    left: Math.round(coordinates.left),
    top: Math.round(coordinates.top),
    width: Math.round(coordinates.width),
    height: Math.round(coordinates.height),
  }
}

function applyCrop() {
  store.crop = pendingCrop
  isOpen.value = false
}
</script>

<template>
  <v-dialog v-model="isOpen" max-width="900" :fullscreen="smAndDown">
    <v-card
      title="Crop image"
      rounded="lg"
      class="d-flex flex-column"
      :height="smAndDown ? '100%' : undefined"
    >
      <v-card-text class="overflow-hidden pa-2 pa-sm-4">
        <Cropper
          class="h-100"
          :src="store.sourceUrl"
          :default-position="store.crop ?? undefined"
          :default-size="store.crop ?? undefined"
          :style="smAndDown ? undefined : { maxHeight: '60vh' }"
          @change="onChange"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="isOpen = false">Cancel</v-btn>
        <v-btn color="primary" variant="flat" @click="applyCrop">Apply</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
