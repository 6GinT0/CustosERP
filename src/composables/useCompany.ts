import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDatabase } from './useDatabase'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useMessages } from './useMessages'
import { companyService } from '@/services/CompanyService'
import { companySchema } from '@/schemas/company.schema'
import type { Company } from '@/types/Company'

export const useCompany = () => {
  const loading = ref(false)
  const company = ref<Company | null>(null)
  const mapReady = ref(false)
  const router = useRouter()
  const route = useRoute()
  const { companies, addItem, updateItem, removeItem, removeItems } = useDatabase()
  const messages = useMessages()
  const { handleSubmit, setFieldValue, setValues } = useForm({
    validationSchema: toTypedSchema(companySchema),
  })

  const address = reactive({
    street: '',
    number: '',
    department: '',
  })

  const handleCreate = handleSubmit(async (values) => {
    try {
      const company = await companyService.create(values as any)

      addItem(companies, company)

      router.push('/companies')

      messages.addMessageToQueue('Empresa creada correctamente', 'success')
    } catch (e) {
      messages.addMessageToQueue('Error al crear la empresa', 'error')
    }
  })

  const handleUpdate = handleSubmit(async (values) => {
    try {
      const company = await companyService.update(Number(route.params.id), values as any)

      updateItem(companies, company)

      router.push('/companies')

      messages.addMessageToQueue('Empresa actualizada correctamente', 'success')
    } catch (e) {
      messages.addMessageToQueue('Error al actualizar la empresa', 'error')
    }
  })

  const handleDelete = async (id: number) => {
    try {
      await companyService.delete(id)

      removeItem(companies, id)

      messages.addMessageToQueue('Empresa eliminada correctamente', 'success')
    } catch (e) {
      messages.addMessageToQueue('Error al eliminar la empresa', 'error')
    }
  }

  const handleDeleteMany = async (ids: number[]) => {
    try {
      await companyService.deleteMany(ids)

      removeItems(companies, ids)

      messages.addMessageToQueue('Empresas eliminadas correctamente', 'success')
    } catch (e) {
      messages.addMessageToQueue('Error al eliminar las empresas', 'error')
    }
  }

  onMounted(async () => {
    if (route.params.id) {
      loading.value = true

      try {
        const data = await companyService.getById(Number(route.params.id))

        if (!data) return router.push('/companies')

        company.value = data

        setValues({
          fantasy_name: data.fantasyName,
          cuit: data.cuit,
          social_reason: data.socialReason,
          social_number: data.socialNumber,
          address: data.address,
          latitude: data.latitude,
          longitude: data.longitude,
          phone: data.phone,
          contact_name: data.contactName,
          total_visits_count: data.totalVisitsCount,
          total_inspections_count: data.totalInspectionsCount,
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
    handleDeleteMany,
  }
}
