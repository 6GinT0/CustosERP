import { ref, watch, onMounted, type Ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useRouter, useRoute } from 'vue-router'
import { inspectionFormSchema } from '@/schemas/inspections.schema'
import { useMessages } from './useMessages'
import { useDatabase } from './useDatabase'
import { inspectionService } from '@/services/InspectionService'
import { inspectionResultService } from '@/services/InspectionResultService'

export const useInspectionForm = (
  formRefs: Ref<any[]> = ref([]),
  steps: any[] = [],
  currentStep: Ref<number> = ref(1),
) => {
  const loading = ref(false)
  const inspectionData = ref<any>(null)
  const initialValues = ref<any>({
    inspections: {},
    observations: {},
    results: {},
  })
  const router = useRouter()
  const route = useRoute()
  const messages = useMessages()
  const { inspections, addItem, updateItem, removeItem, removeItems } = useDatabase()

  const { handleSubmit, values, setFieldValue, setValues } = useForm({
    validationSchema: toTypedSchema(inspectionFormSchema),
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
        setFieldValue(steps[currentStep.value - 1].key as any, newStepValues)
      }
    },
    { deep: true },
  )

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
      const result = await inspectionService.create(formValues as any)
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
      const result = await inspectionService.update(id, formValues as any)

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
      await inspectionService.delete(id)
      removeItem(inspections, id)
      messages.addMessageToQueue('Inspección eliminada correctamente', 'success')
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Error al eliminar la inspección'
      messages.addMessageToQueue(errorMessage, 'error')
    }
  }

  const handleDeleteMany = async (ids: number[]) => {
    try {
      await inspectionService.deleteMany(ids)
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
          inspectionService.getById(id),
          inspectionResultService.getByInspectionId(id),
        ])

        if (!data) {
          messages.addMessageToQueue('No se encontró la inspección', 'error')
          return router.push('/inspections')
        }

        inspectionData.value = data

        const formattedValues = {
          inspection: {
            date: data.date ? new Date(data.date) : new Date(),
            company_id: data.companyId,
            professional_id: data.professionalId,
            area_id: data.areaId,
            sector_id: data.sectorId,
            reason_id: data.reasonId,
            art: data.art,
            work_schedule: data.workSchedule,
            current_employee_count: data.currentEmployeeCount,
            signature_customer_file: null,
          },
          observations: {
            observations: data.observations,
            breach: data.breach,
          },
          results: {
            results: results.map((r) => ({
              category_item_id: r.categoryItemId,
              status: r.status,
            })),
          },
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
    prevStep,
  }
}
