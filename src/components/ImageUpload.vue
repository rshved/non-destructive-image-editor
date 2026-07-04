<script setup lang="ts">
import { ref } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { pickFile } from '@/utils/files'

const store = useEditorStore()
const isDragging = ref(false)

async function browse() {
  const file = await pickFile('image/*')
  if (file) store.loadFile(file)
}

function onDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files[0]
  if (file?.type.startsWith('image/')) store.loadFile(file)
}
</script>

<template>
  <div class="d-flex align-center justify-center fill-height w-100">
    <v-card
      class="pa-6 pa-sm-12 text-center w-100"
      max-width="560"
      rounded="lg"
      border
      elevation="2"
      :color="isDragging ? 'primary' : undefined"
      @click="browse"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @drop.prevent="onDrop"
    >
      <v-icon icon="mdi-image-plus" size="72" :color="isDragging ? undefined : 'primary'" class="mb-4" />
      <div class="text-h6 mb-2">Upload an image</div>
      <div class="text-body-2 text-medium-emphasis">Click to browse or drag and drop a file</div>
    </v-card>
  </div>
</template>
