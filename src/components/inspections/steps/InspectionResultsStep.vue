<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useDatabase } from '@/composables/useDatabase'
import { useForm } from 'vee-validate'
import { inspectionResultSchema, InspectionStatus } from '@/schemas/inspections.schema'
import { toTypedSchema } from '@vee-validate/zod'

const { categoryItems } = useDatabase()
const resultsRef = ref(
  categoryItems.value.map((el) => ({
    category_item_id: el.id,
    name: el.name,
    apply: true,
    compliance: false,
    status: InspectionStatus.OK,
  })),
)

const props = defineProps<{
  initialValues?: any
}>()

const { validate, values, setValues } = useForm({
  validationSchema: toTypedSchema(inspectionResultSchema),
})

function setStatus(idx: number) {
  if (!resultsRef.value[idx].apply) {
    resultsRef.value[idx].status = InspectionStatus['N/A']
    resultsRef.value[idx].compliance = false

    return
  }

  resultsRef.value[idx].status = resultsRef.value[idx].compliance
    ? InspectionStatus.OK
    : InspectionStatus['No OK']
}

defineExpose({
  validateForm: async () => {
    const { valid, errors } = await validate()

    return { valid, errors }
  },
  exposeValues: () => values,
})

watch(
  resultsRef,
  () => {
    setValues({
      results: resultsRef.value.map((el) => ({
        category_item_id: el.category_item_id,
        status: el.status,
      })),
    })
  },
  { deep: true, immediate: true },
)

onMounted(() => {
  if (props.initialValues) {
    setValues(props.initialValues)

    const results = props.initialValues.results

    results.forEach((result: any) => {
      const index = resultsRef.value.findIndex(
        (el) => el.category_item_id === result.category_item_id,
      )

      if (index !== -1) {
        if (result.status === 0) {
          resultsRef.value[index].apply = false
          resultsRef.value[index].compliance = false
          resultsRef.value[index].status = InspectionStatus['No OK']
        } else if (result.status === 1) {
          resultsRef.value[index].apply = true
          resultsRef.value[index].compliance = false
          resultsRef.value[index].status = InspectionStatus['N/A']
        } else if (result.status === 2) {
          resultsRef.value[index].apply = true
          resultsRef.value[index].compliance = true
          resultsRef.value[index].status = InspectionStatus.OK
        }
      }
    })
  }
})
</script>

<template>
  <v-row class="pa-4">
    <v-col cols="12">
      <v-table class="w-100">
        <thead>
          <tr>
            <th>Item</th>
            <th>Aplica</th>
            <th>Cumplimiento</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in resultsRef" :key="index">
            <td>{{ item.name }}</td>
            <td>
              <v-checkbox v-model="item.apply" @update:model-value="setStatus(index)"></v-checkbox>
            </td>
            <td>
              <v-checkbox
                v-model="item.compliance"
                :disabled="!item.apply"
                @update:model-value="setStatus(index)"
              ></v-checkbox>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
    <v-col cols="12">
      <input type="hidden" name="results" />
    </v-col>
  </v-row>
</template>
