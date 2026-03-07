import { ref, watch, onMounted, type Ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useRouter, useRoute } from 'vue-router'
import { inspectionFormSchema } from '@renderer/schemas/inspection.schema'
import { useMessages } from '@renderer/composables/useMessages'
import { useDatabase } from '@renderer/composables/useDatabase'

export const useInspectionActions = (
  formRefs: Ref<any[]> = ref([]),
  steps: any[] = [],
  currentStep: Ref<number> = ref(1)
) => {
  const loading = ref(false)
  const inspectionData = ref<any>(null)
  const initialValues = ref<any>({
    inspections: {},
    observations: {},
    results: {}
  })
  const router = useRouter()
  const route = useRoute()
  const messages = useMessages()
  const { inspections, addItem, updateItem, removeItem, removeItems } = useDatabase()

  const { handleSubmit, values, setFieldValue, setValues } = useForm({
    validationSchema: toTypedSchema(inspectionFormSchema)
  })

  // Linked values from child step to parent whenever it changes
  watch(
    () => {
      if (!formRefs || !formRefs.value || !currentStep) return null
      const activeRef = formRefs.value[currentStep.value - 1]
      return activeRef ? activeRef.exposeValues() : null
    },
    (newStepValues) => {
      if (newStepValues && currentStep && steps[currentStep.value - 1]) {
        setFieldValue(steps[currentStep.value - 1].key, newStepValues)
      }
    },
    { deep: true }
  )

  // Watch company_id to fetch next visit number for new inspections
  const nextStep = async () => {
    const { valid } = await formRefs.value[currentStep.value - 1].validateForm()

    if (valid) {
      currentStep.value++
    }
  }

  const prevStep = () => {
    if (currentStep && currentStep.value > 1) {
      currentStep.value--
    }
  }

  const handleCreate = handleSubmit(async (formValues) => {
    try {
      loading.value = true

      if (formValues.inspection?.signature_customer_file instanceof File) {
        const buffer = await formValues.inspection.signature_customer_file.arrayBuffer()
        formValues.inspection.signature_customer_file = {
          name: formValues.inspection.signature_customer_file.name,
          data: new Uint8Array(buffer)
        }
      }

      const result = await window.api.inspection.create(formValues)
      addItem(inspections, result)
      messages.addMessageToQueue('Inspección guardada correctamente', 'success')
      router.push('/inspections')
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Error al guardar la inspección'
      messages.addMessageToQueue(errorMessage, 'error')
    } finally {
      loading.value = false
    }
  })

  const handleUpdate = handleSubmit(async (formValues) => {
    try {
      loading.value = true
      const id = Number(route.params.id)

      if (formValues.inspection?.signature_customer_file instanceof File) {
        const buffer = await formValues.inspection.signature_customer_file.arrayBuffer()
        formValues.inspection.signature_customer_file = {
          name: formValues.inspection.signature_customer_file.name,
          data: new Uint8Array(buffer)
        }
      }

      const result = await window.api.inspection.update(id, formValues)

      updateItem(inspections, result)
      messages.addMessageToQueue('Inspección actualizada correctamente', 'success')
      router.push('/inspections')
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Error al actualizar la inspección'
      messages.addMessageToQueue(errorMessage, 'error')
    } finally {
      loading.value = false
    }
  })

  const handleDelete = async (id: number) => {
    try {
      await window.api.inspection.delete(id)
      removeItem(inspections, id)
      messages.addMessageToQueue('Inspección eliminada correctamente', 'success')
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Error al eliminar la inspección'
      messages.addMessageToQueue(errorMessage, 'error')
    }
  }

  const handleDeleteMany = async (ids: number[]) => {
    try {
      await window.api.inspection.deleteMany(ids)
      removeItems(inspections, ids)
      messages.addMessageToQueue('Inspecciones eliminadas correctamente', 'success')
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Error al eliminar las inspecciones'
      messages.addMessageToQueue(errorMessage, 'error')
    }
  }

  onMounted(async () => {
    if (route && route.params && route.params.id) {
      loading.value = true
      try {
        const id = Number(route.params.id)
        const [data, results] = await Promise.all([
          window.api.inspection.getById(id),
          window.api.inspectionResult.getByInspectionId(id)
        ])

        if (!data) {
          messages.addMessageToQueue('No se encontró la inspección', 'error')
          return router.push('/inspections')
        }

        inspectionData.value = data

        const formattedValues = {
          inspection: {
            date: data.date ? new Date(data.date) : new Date(),
            company_id: data.company_id,
            professional_id: data.professional_id,
            area_id: data.area_id,
            sector_id: data.sector_id,
            reason_id: data.reason_id,
            art: data.art,
            work_schedule: data.work_schedule,
            current_employee_count: data.current_employee_count,
            total_inspections_count: data.total_inspections_count,
            total_visits_count: data.total_visits_count,
            signature_customer_file: undefined
          },
          observations: {
            observations: data.observations,
            breach: data.breach
          },
          results: {
            results: results.map((r) => ({
              category_item_id: r.category_item_id,
              status: r.status as 'N/A' | 'No OK' | 'OK'
            }))
          }
        }

        setValues(formattedValues)

        initialValues.value = formattedValues
      } catch (e) {
        messages.addMessageToQueue('Error al cargar la inspección', 'error')
      } finally {
        loading.value = false
      }
    }
  })

  return {
    loading,
    values,
    initialValues,
    inspectionData,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleDeleteMany,
    nextStep,
    prevStep
  }
}
