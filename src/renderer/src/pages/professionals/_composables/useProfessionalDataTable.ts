import { ref } from 'vue'
import { useProfessionalActions } from './useProfessionalActions'
import { useDatabase } from '@renderer/composables/useDatabase'
import { useDialog } from '@renderer/composables/useDialog'

export const useProfessionalDataTable = () => {
  const search = ref('')
  const selected = ref([])
  const professionalData = ref<any>(null)
  const { handleDelete, handleDeleteMany } = useProfessionalActions()
  const { professionals } = useDatabase()
  const { isDialogOpen, openDialog, closeDialog } = useDialog()

  async function openAction(item: any) {
    selected.value = []

    professionalData.value = item
    professionalData.value.name = professionalData.value.fullName

    openDialog()
  }

  async function openManyAction() {
    professionalData.value = null

    openDialog()
  }

  async function cancelAction() {
    selected.value = []
    professionalData.value = null

    closeDialog()
  }

  async function deleteAction() {
    await handleDelete(professionalData.value.id)

    professionalData.value = null

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
    professionals,
    professionalData,
    isDialogOpen,
    openAction,
    openManyAction,
    cancelAction,
    deleteAction,
    deleteManyAction
  }
}
