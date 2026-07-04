<script setup lang="ts">
import { ref } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { pickFile } from '@/utils/files'

const emit = defineEmits<{ crop: [] }>()
const store = useEditorStore()
const isImportErrorVisible = ref(false)

async function importOperations() {
  const file = await pickFile('application/json,.json')
  if (file) isImportErrorVisible.value = !(await store.importManifest(file))
}

const adjustmentSliders = [
  { key: 'brightness', label: 'Brightness' },
  { key: 'contrast', label: 'Contrast' },
  { key: 'saturation', label: 'Saturation' },
] as const

const filterOptions = [
  { value: 'none', label: 'None' },
  { value: 'grayscale', label: 'Grayscale' },
  { value: 'sepia', label: 'Sepia' },
] as const
</script>

<template>
  <v-card border flat rounded="lg">
    <v-card-text class="d-flex flex-column ga-4">
      <v-btn variant="outlined" block prepend-icon="mdi-crop" @click="emit('crop')"> Crop image </v-btn>

      <div>
        <div class="text-subtitle-2 mb-2">Adjustments</div>
        <v-slider
          v-for="slider in adjustmentSliders"
          :key="slider.key"
          v-model="store.adjustments[slider.key]"
          :label="slider.label"
          min="0"
          max="200"
          step="1"
          thumb-label
          hide-details
        />
      </div>

      <div>
        <div class="text-subtitle-2 mb-2">Filter</div>
        <v-btn-toggle v-model="store.filter" mandatory divided border density="comfortable" class="w-100">
          <v-btn
            v-for="option in filterOptions"
            :key="option.value"
            :value="option.value"
            style="min-width: 0; flex: 1 1 0"
          >
            {{ option.label }}
          </v-btn>
        </v-btn-toggle>
      </div>

      <v-divider />

      <v-btn
        variant="tonal"
        block
        prepend-icon="mdi-compare"
        :color="store.isComparing ? 'primary' : undefined"
        :disabled="!store.hasEdits"
        @click="store.isComparing = !store.isComparing"
      >
        Compare with original
      </v-btn>
      <v-btn
        variant="text"
        block
        prepend-icon="mdi-restore"
        :disabled="!store.hasEdits"
        @click="store.resetEdits()"
      >
        Reset edits
      </v-btn>
      <v-btn color="primary" variant="flat" block prepend-icon="mdi-download" @click="store.exportImage()">
        Export image
      </v-btn>
      <v-btn variant="text" block prepend-icon="mdi-code-json" @click="store.exportOperations()">
        Export operations
      </v-btn>
      <v-btn variant="text" block prepend-icon="mdi-code-json" @click="importOperations">
        Import operations
      </v-btn>
    </v-card-text>
  </v-card>

  <v-snackbar v-model="isImportErrorVisible" color="error">
    The selected file is not a valid operations manifest.
  </v-snackbar>
</template>
