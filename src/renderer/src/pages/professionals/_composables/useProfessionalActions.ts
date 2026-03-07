import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDatabase } from '@renderer/composables/useDatabase'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useMessages } from '@renderer/composables/useMessages'
import { professionalSchema } from '@renderer/schemas/professional.schema'
import type { Professional } from '#/types/professional'

export const useProfessionalActions = () => {
  const loading = ref(false)
  const professional = ref<Professional | null>(null)
  const router = useRouter()
  const route = useRoute()
  const { professionals, addItem, updateItem, removeItem, removeItems } = useDatabase()
  const messages = useMessages()
  const { handleSubmit, setFieldValue, setValues } = useForm({
    validationSchema: toTypedSchema(professionalSchema)
  })

  const handleCreate = handleSubmit(async (values) => {
    try {
      loading.value = true

      if (values.signature_file instanceof File) {
        const buffer = await values.signature_file.arrayBuffer()
        values.signature_file = {
          name: values.signature_file.name,
          data: new Uint8Array(buffer)
        }
      }

      const professional = await window.api.professional.create(values)

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

      if (values.signature_file instanceof File) {
        const buffer = await values.signature_file.arrayBuffer()
        values.signature_file = {
          name: values.signature_file.name,
          data: new Uint8Array(buffer)
        }
      }

      const professional = await window.api.professional.update(Number(route.params.id), values)

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
      await window.api.professional.delete(id)

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
      await window.api.professional.deleteMany(ids)

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
        const data = await window.api.professional.getById(Number(route.params.id))

        if (!data) return router.push('/professionals')

        professional.value = data

        setValues({
          fullname: data.fullname,
          tuition_number: data.tuition_number,
          signature_file: undefined // We start as undefined (not touched)
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
    handleDeleteMany
  }
}
