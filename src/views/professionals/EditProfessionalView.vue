<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue'
import { useFileDialog, useDropZone, useObjectUrl } from '@vueuse/core'
import { useProfessional } from '@/composables/useProfessional'
import AppInput from '@/components/AppInput.vue'
import { convertFileSrc } from '@tauri-apps/api/core'

const dropZoneRef = useTemplateRef('dropZoneRef')
const selectedFile = ref<File | null>(null)
const previewUrl = useObjectUrl(selectedFile)

const { loading, professional, handleUpdate, setFieldValue } = useProfessional()

const existingSignatureUrl = ref<string | null>(null)

watch(
  () => professional.value,
  (newVal) => {
    if (newVal?.signaturePath) {
      existingSignatureUrl.value = convertFileSrc(newVal.signaturePath)
    }
  },
  { immediate: true },
)

function onDrop(files: File[] | null) {
  if (files && files.length > 0) {
    selectedFile.value = files[0]
    setFieldValue('signature_file', selectedFile.value)
    existingSignatureUrl.value = null
  }
}

const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop,
  dataTypes: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml'],
  multiple: false,
  preventDefaultForUnhandled: false,
})

const { open, reset, onChange } = useFileDialog({
  accept: 'image/*',
  multiple: false,
})

onChange((files) => {
  if (files && files.length > 0) {
    selectedFile.value = files[0]
    setFieldValue('signature_file', selectedFile.value)
    existingSignatureUrl.value = null
  }
})

function removeImage() {
  selectedFile.value = null
  setFieldValue('signature_file', null)
  existingSignatureUrl.value = null
  reset()
}
</script>

<template>
  <v-container>
    <v-card class="border pa-4" flat :loading="loading">
      <v-row class="pa-4">
        <v-col cols="12" md="6">
          <AppInput type="text" name="fullname" label="Nombre completo" placeholder="Juan Peréz" />
        </v-col>
        <v-col cols="12" md="6">
          <AppInput
            type="text"
            name="tuition_number"
            label="Matrícula del profesional"
            placeholder="Matrícula"
          />
        </v-col>
        <v-col cols="12">
          <div
            ref="dropZoneRef"
            class="rounded border-sm border-dashed pa-4 position-relative"
            :class="{ 'bg-grey-lighten-4': isOverDropZone }"
          >
            <v-card flat color="transparent">
              <v-card-title class="text-center my-4 text-h6 font-weight-bold">
                Firma del profesional
              </v-card-title>

              <div
                v-if="previewUrl || existingSignatureUrl"
                class="d-flex flex-column align-center gap-4 py-4"
              >
                <v-img
                  :src="previewUrl || existingSignatureUrl!"
                  max-height="300"
                  width="100%"
                  contain
                  class="rounded bg-white mb-4"
                />
                <v-btn color="error" variant="text" prepend-icon="mdi-delete" @click="removeImage">
                  Eliminar/Cambiar firma
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
            </v-card>
          </div>
        </v-col>

        <v-col cols="12" class="d-flex justify-end gap-4 mt-4">
          <v-btn variant="text" to="/professionals">Cancelar</v-btn>
          <v-btn color="primary" flat class="ml-4" :loading="loading" @click="handleUpdate">
            Actualizar Profesional
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
