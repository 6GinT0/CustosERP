<script setup lang="ts">
import { ref } from 'vue'
import { useInspectionActions } from './_composables/useInspectionActions'
import StepInspection from './_components/StepInspection.vue'
import StepInspectionResults from './_components/StepResults.vue'
import StepObservations from './_components/StepObservations.vue'

const currentStep = ref(1)
const formRefs = ref<any[]>([])

const steps = [
  { title: 'Inspección', value: 1, component: StepInspection, key: 'inspection' },
  { title: 'Resultados', value: 2, component: StepInspectionResults, key: 'results' },
  { title: 'Observaciones', value: 3, component: StepObservations, key: 'observations' }
]

const { handleCreate, loading, nextStep, prevStep } = useInspectionActions(
  formRefs,
  steps,
  currentStep
)
</script>

<template>
  <v-stepper v-model="currentStep" class="border" alt-labels flat>
    <v-stepper-header class="elevation-0 border-b-sm">
      <template v-for="(item, i) in steps" :key="i">
        <v-divider v-if="i"></v-divider>

        <v-stepper-item v-bind="item" :complete="currentStep > item.value"></v-stepper-item>
      </template>
    </v-stepper-header>

    <v-stepper-window>
      <v-stepper-window-item v-for="(step, index) in steps" :key="index" :value="step.value">
        <component :is="step.component" :ref="(el) => (formRefs[index] = el)" />
      </v-stepper-window-item>
    </v-stepper-window>

    <v-stepper-actions class="border-t-sm pt-4" @prev="prevStep" @next="nextStep">
      <template #prev>
        <v-btn :disabled="currentStep === 1" @click="prevStep"> Anterior </v-btn>
      </template>

      <template #next>
        <v-btn
          v-if="currentStep < steps.length"
          color="indigo-darken-3"
          variant="outlined"
          @click="nextStep"
        >
          Siguiente
        </v-btn>
        <v-btn
          v-else
          color="indigo-darken-3"
          variant="flat"
          :loading="loading"
          :disabled="false"
          @click="handleCreate"
        >
          Finalizar
        </v-btn>
      </template>
    </v-stepper-actions>
  </v-stepper>
</template>
