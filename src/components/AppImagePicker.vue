<script setup lang="ts">
import { useField } from 'vee-validate'
import { watch, ref } from 'vue'
import { useImageUpload } from '@/composables/useImageUpload'
import { convertFileSrc } from '@tauri-apps/api/core'

const props = defineProps<{
  name: string
  label: string
  initialUrl?: string | null
}>()

const { value, errorMessage } = useField<File | null>(props.name)
const { dropZoneRef, selectedFile, previewUrl, isOverDropZone, open, removeImage } =
  useImageUpload()

const currentExistingUrl = ref<string | null>(null)

watch(
  () => props.initialUrl,
  (newUrl) => {
    if (newUrl) {
      currentExistingUrl.value = convertFileSrc(newUrl)
    } else {
      currentExistingUrl.value = null
    }
  },
  { immediate: true },
)

watch(selectedFile, (newFile) => {
  value.value = newFile
  if (newFile) {
    currentExistingUrl.value = null
  }
})

watch(value, (newValue) => {
  if (newValue instanceof File) {
    if (newValue !== selectedFile.value) {
      selectedFile.value = newValue
    }
  } else if (newValue === null) {
    selectedFile.value = null
    currentExistingUrl.value = null
  }
})

const handleRemove = () => {
  removeImage()
  currentExistingUrl.value = null
  value.value = null
}

defineExpose({
  dropZoneRef,
})
</script>

<template>
  <div
    ref="dropZoneRef"
    class="rounded border-sm border-dashed pa-4 position-relative"
    :class="[
      { 'bg-grey-lighten-4': isOverDropZone },
      { 'border-error': !!errorMessage, 'text-error': !!errorMessage },
    ]"
  >
    <v-card flat color="transparent">
      <v-card-title class="text-center my-4 text-h6 font-weight-bold">
        {{ label }}
      </v-card-title>

      <div
        v-if="previewUrl || currentExistingUrl"
        class="d-flex flex-column align-center gap-4 py-4"
      >
        <v-img
          :src="previewUrl || currentExistingUrl!"
          max-height="300"
          width="100%"
          contain
          class="rounded bg-white mb-4"
        />
        <v-btn color="error" variant="text" prepend-icon="mdi-delete" @click="handleRemove">
          Eliminar/Cambiar imagen
        </v-btn>
      </div>

      <template v-else>
        <v-card-subtitle class="text-center my-4">
          Arrastre y suelte archivos aquí
        </v-card-subtitle>
        <v-divider>O</v-divider>
        <v-card-text class="text-center my-4">
          <v-btn color="primary" flat @click="open">Busca un archivo</v-btn>
        </v-card-text>
      </template>

      <div v-if="errorMessage" class="text-caption text-error text-center mt-2">
        {{ errorMessage }}
      </div>
    </v-card>
  </div>
</template>

<style scoped>
.border-error {
  border-color: rgb(var(--v-theme-error)) !important;
}
</style>
