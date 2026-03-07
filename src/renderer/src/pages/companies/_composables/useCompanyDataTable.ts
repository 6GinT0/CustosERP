import { ref } from 'vue'
import { useCompanyActions } from './useCompanyActions'
import { useDatabase } from '@renderer/composables/useDatabase'
import { useDialog } from '@renderer/composables/useDialog'

export const useCompanyDataTable = () => {
  const search = ref('')
  const selected = ref([])
  const companyData = ref<any>(null)
  const { handleDelete, handleDeleteMany } = useCompanyActions()
  const { companies } = useDatabase()
  const { isDialogOpen, openDialog, closeDialog } = useDialog()

  async function openAction(item: any) {
    selected.value = []

    companyData.value = item
    companyData.value.name = companyData.value.fantasyName

    openDialog()
  }

  async function openManyAction() {
    companyData.value = null

    openDialog()
  }

  async function cancelAction() {
    selected.value = []
    companyData.value = null

    closeDialog()
  }

  async function deleteAction() {
    await handleDelete(companyData.value.id)

    companyData.value = null

    closeDialog()
  }

  async function deleteManyAction() {
    await handleDeleteMany([...selected.value])

    selected.value = []

    closeDialog()
  }

  return {
    search,
    selected,
    companies,
    companyData,
    isDialogOpen,
    openAction,
    openManyAction,
    cancelAction,
    deleteAction,
    deleteManyAction
  }
}
