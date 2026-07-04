<script setup lang="ts">
import { ref } from 'vue'
import EditorControls from '@/components/EditorControls.vue'
import ImageCropper from '@/components/ImageCropper.vue'
import ImagePreview from '@/components/ImagePreview.vue'
import ImageUpload from '@/components/ImageUpload.vue'
import { useEditorStore } from '@/stores/editor'

const store = useEditorStore()
const isCropperOpen = ref(false)
</script>

<template>
  <v-app>
    <v-app-bar flat border>
      <v-app-bar-title>Image Editor</v-app-bar-title>
      <template #append>
        <v-btn
          v-if="store.hasImage"
          icon="mdi-image-plus"
          variant="text"
          aria-label="New image"
          class="d-sm-none"
          @click="store.clear()"
        />
        <v-btn
          v-if="store.hasImage"
          prepend-icon="mdi-image-plus"
          variant="text"
          class="d-none d-sm-flex"
          @click="store.clear()"
        >
          New image
        </v-btn>
      </template>
    </v-app-bar>

    <v-main class="bg-grey-lighten-4">
      <v-container v-if="!store.hasImage" class="fill-height" fluid>
        <ImageUpload />
      </v-container>
      <v-container v-else fluid class="pa-2 pa-sm-4" style="max-width: 1440px">
        <v-row dense class="ma-0">
          <v-col cols="12" md="8" class="pa-1 pa-sm-2">
            <ImagePreview />
          </v-col>
          <v-col cols="12" md="4" class="pa-1 pa-sm-2">
            <EditorControls @crop="isCropperOpen = true" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <ImageCropper v-model="isCropperOpen" />
  </v-app>
</template>
