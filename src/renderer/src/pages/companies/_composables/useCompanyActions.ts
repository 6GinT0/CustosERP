import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDatabase } from '@renderer/composables/useDatabase'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useMessages } from '@renderer/composables/useMessages'
import { companySchema } from '@renderer/schemas/company.schema'
import type { Company } from '#/types/company'

export const useCompanyActions = () => {
  const loading = ref(false)
  const company = ref<Company | null>(null)
  const mapReady = ref(false)
  const router = useRouter()
  const route = useRoute()
  const { companies, addItem, updateItem, removeItem, removeItems } = useDatabase()
  const messages = useMessages()
  const { handleSubmit, setFieldValue, setValues } = useForm({
    validationSchema: toTypedSchema(companySchema)
  })

  const address = reactive({
    street: '',
    number: '',
    department: ''
  })

  const handleCreate = handleSubmit(async (values) => {
    try {
      const company = await window.api.company.create(values)

      addItem(companies, company)

      router.push('/companies')

      messages.addMessageToQueue('Empresa creada correctamente', 'success')
    } catch (e: unknown) {
      if (e instanceof Error) {
        messages.addMessageToQueue(e.message, 'error')
      } else {
        messages.addMessageToQueue('Error al crear la empresa', 'error')
      }
    }
  })

  const handleUpdate = handleSubmit(async (values) => {
    try {
      const company = await window.api.company.update(Number(route.params.id), values)

      updateItem(companies, company)

      router.push('/companies')

      messages.addMessageToQueue('Empresa actualizada correctamente', 'success')
    } catch (e: unknown) {
      if (e instanceof Error) {
        messages.addMessageToQueue(e.message, 'error')
      } else {
        messages.addMessageToQueue('Error al actualizar la empresa', 'error')
      }
    }
  })

  const handleDelete = async (id: number) => {
    try {
      await window.api.company.delete(id)

      removeItem(companies, id)

      messages.addMessageToQueue('Empresa eliminada correctamente', 'success')
    } catch (e: unknown) {
      if (e instanceof Error) {
        messages.addMessageToQueue(e.message, 'error')
      } else {
        messages.addMessageToQueue('Error al eliminar la empresa', 'error')
      }
    }
  }

  const handleDeleteMany = async (ids: number[]) => {
    try {
      await window.api.company.deleteMany(ids)

      removeItems(companies, ids)

      messages.addMessageToQueue('Empresas eliminadas correctamente', 'success')
    } catch (e: unknown) {
      if (e instanceof Error) {
        messages.addMessageToQueue(e.message, 'error')
      } else {
        messages.addMessageToQueue('Error al eliminar las empresas', 'error')
      }
    }
  }

  onMounted(async () => {
    if (route.params.id) {
      loading.value = true

      try {
        const data = await window.api.company.getById(Number(route.params.id))

        if (!data) return router.push('/companies')

        company.value = data

        setValues({
          fantasy_name: data.fantasy_name,
          cuit: data.cuit,
          social_reason: data.social_reason,
          social_number: data.social_number,
          address: data.address,
          latitude: data.latitude,
          longitude: data.longitude,
          phone: data.phone,
          contact_name: data.contact_name
        })

        const streetNumber = company.value?.address?.split(',')[0].split(' ')
        const number = streetNumber?.[streetNumber?.length - 1]
        const street = streetNumber?.slice(0, -1).join(' ')
        const department = company.value?.address?.split(',')[1].trim()

        address.street = street!
        address.number = number!
        address.department = department!
      } catch (e) {
        messages.addMessageToQueue('Error al obtener la empresa', 'error')
      } finally {
        loading.value = false

        await nextTick()

        mapReady.value = true
      }
    }
  })

  return {
    loading,
    mapReady,
    company,
    address,
    setFieldValue,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleDeleteMany
  }
}
