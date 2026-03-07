<script setup lang="ts">
import { useProfessionalActions } from './_composables/useProfessionalActions'
import AppInput from '@renderer/components/form/AppInput.vue'
import AppImagePicker from '@renderer/components/form/AppImagePicker.vue'

const { loading, professional, handleUpdate } = useProfessionalActions()
</script>

<template>
  <v-container fluid>
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
          <AppImagePicker
            name="signature_file"
            label="Firma del profesional"
            :initial-url="
              professional?.signature_path ? 'app-data://' + professional.signature_path : null
            "
          />
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
