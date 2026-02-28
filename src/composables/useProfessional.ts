import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDatabase } from './useDatabase'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useMessages } from './useMessages'
import { professionalService } from '@/services/ProfessionalService'
import { professionalSchema } from '@/schemas/professional.schema'
import type { Professional } from '@/types/Professional'

export const useProfessional = () => {
  const loading = ref(false)
  const professional = ref<Professional | null>(null)
  const router = useRouter()
  const route = useRoute()
  const { professionals, addItem, updateItem, removeItem, removeItems } = useDatabase()
  const messages = useMessages()
  const { handleSubmit, setFieldValue, setValues } = useForm({
    validationSchema: toTypedSchema(professionalSchema),
  })

  const handleCreate = handleSubmit(async (values) => {
    try {
      loading.value = true
      const professional = await professionalService.create(values as any)

      addItem(professionals, professional)

      router.push('/professionals')

      messages.addMessageToQueue('Profesional creado correctamente', 'success')
    } catch (e: unknown) {
      if (e instanceof Error) {
        messages.addMessageToQueue(e.message, 'error')
      } else {
        messages.addMessageToQueue('Error al crear el profesional', 'error')
      }
    } finally {
      loading.value = false
    }
  })

  const handleUpdate = handleSubmit(async (values) => {
    try {
      loading.value = true
      const professional = await professionalService.update(Number(route.params.id), values as any)

      updateItem(professionals, professional)

      router.push('/professionals')

      messages.addMessageToQueue('Profesional actualizado correctamente', 'success')
    } catch (e: unknown) {
      if (e instanceof Error) {
        messages.addMessageToQueue(e.message, 'error')
      } else {
        messages.addMessageToQueue('Error al actualizar el profesional', 'error')
      }
    } finally {
      loading.value = false
    }
  })

  const handleDelete = async (id: number) => {
    try {
      await professionalService.delete(id)

      removeItem(professionals, id)

      messages.addMessageToQueue('Profesional eliminado correctamente', 'success')
    } catch (e: unknown) {
      if (e instanceof Error) {
        messages.addMessageToQueue(e.message, 'error')
      } else {
        messages.addMessageToQueue('Error al eliminar el profesional', 'error')
      }
    }
  }

  const handleDeleteMany = async (ids: number[]) => {
    try {
      await professionalService.deleteMany(ids)

      removeItems(professionals, ids)

      messages.addMessageToQueue('Profesionales eliminados correctamente', 'success')
    } catch (e: unknown) {
      if (e instanceof Error) {
        messages.addMessageToQueue(e.message, 'error')
      } else {
        messages.addMessageToQueue('Error al eliminar los profesionales', 'error')
      }
    }
  }

  onMounted(async () => {
    if (route.params.id) {
      loading.value = true

      try {
        const data = await professionalService.getById(Number(route.params.id))

        if (!data) return router.push('/professionals')

        professional.value = data

        setValues({
          fullname: data.fullName,
          tuition_number: data.tuitionNumber,
        })
      } catch (e) {
        messages.addMessageToQueue('Error al obtener el profesional', 'error')
      } finally {
        loading.value = false
      }
    }
  })

  return {
    loading,
    professional,
    setFieldValue,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleDeleteMany,
  }
}
