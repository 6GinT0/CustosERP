<script setup lang="ts">
import { useProfessionalActions } from './_composables/useProfessionalActions'
import AppInput from '@renderer/components/form/AppInput.vue'
import AppImagePicker from '@renderer/components/form/AppImagePicker.vue'

const { loading, handleCreate } = useProfessionalActions()
</script>

<template>
  <v-container fluid>
    <v-card class="border pa-4" flat>
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
          <AppImagePicker name="signature_file" label="Firma del profesional" />
        </v-col>

        <v-col cols="12" class="d-flex justify-end gap-4 mt-4">
          <v-btn variant="text" to="/professionals">Cancelar</v-btn>
          <v-btn flat color="primary" class="ml-4" :loading="loading" @click="handleCreate">
            Guardar Profesional
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
