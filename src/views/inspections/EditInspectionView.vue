<script setup lang="ts">
import { ref } from 'vue'
import { useInspectionForm } from '@/composables/useInspectionForm'
import InspectionStep from '@/components/inspections/steps/InspectionStep.vue'
import InspectionResultsStep from '@/components/inspections/steps/InspectionResultsStep.vue'
import ObservationsStep from '@/components/inspections/steps/ObservationsStep.vue'

const currentStep = ref(1)
const formRefs = ref<any[]>([])

const steps = [
  { title: 'Inspección', value: 1, component: InspectionStep, key: 'inspection' },
  { title: 'Resultados', value: 2, component: InspectionResultsStep, key: 'results' },
  { title: 'Observaciones', value: 3, component: ObservationsStep, key: 'observations' },
]

const { handleUpdate, loading, initialValues, nextStep, prevStep } = useInspectionForm(
  formRefs,
  steps,
  currentStep,
)
</script>

<template>
  <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>
  <v-stepper v-else v-model="currentStep" class="border" alt-labels flat :loading="loading">
    <v-stepper-header class="elevation-0 border-b-sm">
      <template v-for="(item, i) in steps" :key="i">
        <v-divider v-if="i"></v-divider>

        <v-stepper-item v-bind="item" :complete="currentStep > item.value"></v-stepper-item>
      </template>
    </v-stepper-header>

    <v-stepper-window>
      <v-stepper-window-item v-for="(step, index) in steps" :key="index" :value="step.value">
        <component
          :is="step.component"
          :ref="(el) => (formRefs[index] = el)"
          :initial-values="initialValues[step.key]"
        />
      </v-stepper-window-item>
    </v-stepper-window>

    <v-stepper-actions class="border-t-sm pt-4" @prev="prevStep" @next="nextStep">
      <template #prev>
        <v-btn :disabled="currentStep === 1" @click="prevStep"> Anterior </v-btn>
      </template>

      <template #next>
        <v-btn
          v-if="currentStep < steps.length"
          @click="nextStep"
          color="indigo-darken-3"
          variant="outlined"
        >
          Siguiente
        </v-btn>
        <v-btn
          v-else
          @click="handleUpdate"
          color="indigo-darken-3"
          variant="flat"
          :loading="loading"
          :disabled="false"
        >
          Actualizar
        </v-btn>
      </template>
    </v-stepper-actions>
  </v-stepper>
</template>
