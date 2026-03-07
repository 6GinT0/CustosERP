<script setup lang="ts">
import { ref, computed, watchEffect, onMounted } from 'vue'
import { useDatabase } from '@renderer/composables/useDatabase'
import { useInspectionActions } from '../_composables/useInspectionActions'
import { useForm } from 'vee-validate'
import { inspectionSchema } from '@renderer/schemas/inspection.schema'
import { toTypedSchema } from '@vee-validate/zod'
import AppInput from '@renderer/components/form/AppInput.vue'
import AppSelect from '@renderer/components/form/AppSelect.vue'
import AppInputNumber from '@renderer/components/form/AppInputNumber.vue'
import AppImagePicker from '@renderer/components/form/AppImagePicker.vue'
import AppDatePicker from '@renderer/components/form/AppDatePicker.vue'

const days = ref(['Lun', 'Mar', 'Mié', 'Jue', 'Vie'])
const fromHour = ref('09:00')
const toHour = ref('18:00')

const props = defineProps<{
  initialValues?: any
}>()

const { companies, professionals, taxonomies } = useDatabase()
const { inspectionData } = useInspectionActions()

const scheduleString = computed(() => {
  if (!days.value || days.value.length === 0) return undefined
  return `${days.value.join(', ')} de ${fromHour.value}hs a ${toHour.value}hs`
})

const areas = computed(() =>
  taxonomies.value.filter((t) => t.type === 'AREA').map((t) => ({ title: t.name, value: t.id }))
)
const sectors = computed(() =>
  taxonomies.value.filter((t) => t.type === 'SECTOR').map((t) => ({ title: t.name, value: t.id }))
)
const reasons = computed(() =>
  taxonomies.value.filter((t) => t.type === 'REASON').map((t) => ({ title: t.name, value: t.id }))
)

const companiesSelect = computed(() =>
  companies.value.map((c) => ({ title: c.fantasy_name!, value: c.id }))
)
const professionalsSelect = computed(() =>
  professionals.value.map((p) => ({ title: p.fullname, value: p.id }))
)

const { validate, values, setValues, setFieldValue } = useForm({
  validationSchema: toTypedSchema(inspectionSchema)
})

watchEffect(() => {
  setFieldValue('work_schedule', scheduleString.value)
})

defineExpose({
  validateForm: async () => {
    const { valid, errors } = await validate()

    return { valid, errors }
  },
  exposeValues: () => values
})

onMounted(async () => {
  if (props.initialValues) {
    setValues(props.initialValues)

    const schedule = props.initialValues.work_schedule
    const [daysStr, hoursStr] = schedule.split(' de ')
    const [fromHourStr, toHourStr] = hoursStr.split(' a ')

    days.value = daysStr.split(', ')
    fromHour.value = fromHourStr.replace('hs', '')
    toHour.value = toHourStr.replace('hs', '')
  }
})
</script>

<template>
  <v-row class="pa-4">
    <v-col cols="12" md="6">
      <AppDatePicker name="date" label="Fecha de Inspección" placeholder="Seleccione fecha" />
    </v-col>
    <v-col cols="12" md="6">
      <AppInputNumber name="total_visits_count" label="Nro. Visita" />
    </v-col>
    <v-col cols="12" md="6">
      <AppInputNumber name="total_inspections_count" label="Nro. Inspección" />
    </v-col>
    <v-col cols="12" md="6">
      <AppSelect name="company_id" label="Empresa" :options="companiesSelect" :selected-type="null">
        <template #prepend-item>
          <v-list>
            <v-list-item
              title="Agregar empresa"
              link
              prepend-icon="mdi-plus"
              to="/companies/add"
              base-color="primary"
            ></v-list-item>
          </v-list>

          <v-divider />
        </template>
      </AppSelect>
    </v-col>
    <v-col cols="12" md="6">
      <AppSelect
        name="professional_id"
        label="Profesional"
        :options="professionalsSelect"
        :selected-type="null"
      >
        <template #prepend-item>
          <v-list>
            <v-list-item
              title="Agregar profesional"
              link
              prepend-icon="mdi-plus"
              to="/professionals/add"
              base-color="primary"
            ></v-list-item>
          </v-list>

          <v-divider />
        </template>
      </AppSelect>
    </v-col>
    <v-col cols="12" md="6">
      <AppSelect name="area_id" label="Zona" :options="areas" :selected-type="null" />
    </v-col>
    <v-col cols="12" md="6">
      <AppSelect name="sector_id" label="Sector" :options="sectors" :selected-type="null" />
    </v-col>
    <v-col cols="12" md="6">
      <AppSelect name="reason_id" label="Motivo" :options="reasons" :selected-type="null" />
    </v-col>
    <v-col cols="12" md="6">
      <AppInput type="text" name="art" label="ART" placeholder="ART" />
    </v-col>
    <v-col cols="12" md="6">
      <AppInputNumber name="current_employee_count" label="Cantidad de empleados" />
    </v-col>
    <v-col cols="12">
      <v-card border="sm" flat class="pa-4">
        <div class="text-caption mb-2">Horarios de trabajo</div>
        <v-chip-group v-model="days" column multiple color="primary">
          <v-chip
            v-for="d in ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']"
            :key="d"
            :value="d"
            filter
          >
            {{ d }}
          </v-chip>
        </v-chip-group>

        <v-row class="mt-2">
          <v-col cols="6">
            <v-text-field
              v-model="fromHour"
              label="Desde"
              type="time"
              density="compact"
              variant="underlined"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="toHour"
              label="Hasta"
              type="time"
              density="compact"
              variant="underlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <input type="hidden" name="work_schedule" />
          </v-col>
        </v-row>

        <div class="text-caption mt-2 text-grey">
          <span>Vista previa: {{ scheduleString ?? 'Sin horario' }}</span>
        </div>
      </v-card>
    </v-col>
    <v-col cols="12">
      <AppImagePicker
        name="signature_customer_file"
        label="Firma del cliente"
        :initial-url="
          inspectionData?.signature_customer_path
            ? 'app-data://' + inspectionData.signature_customer_path
            : null
        "
      />
    </v-col>
  </v-row>
</template>
