import { ref } from 'vue'
import { useInspectionActions } from './useInspectionActions'
import { useDatabase } from '@renderer/composables/useDatabase'
import { useDialog } from '@renderer/composables/useDialog'

export const useInspectionDataTable = () => {
  const search = ref('')
  const selected = ref([])
  const inspectionData = ref<any>(null)
  const { handleDelete, handleDeleteMany } = useInspectionActions()
  const { inspections } = useDatabase()
  const { isDialogOpen, openDialog, closeDialog } = useDialog()

  async function openAction(item: any) {
    selected.value = []

    inspectionData.value = item
    inspectionData.value.name = `Inspección #${item.id} - ${new Date(item.date).toLocaleDateString()}`

    openDialog()
  }

  async function openManyAction() {
    inspectionData.value = null

    openDialog()
  }

  async function cancelAction() {
    selected.value = []
    inspectionData.value = null

    closeDialog()
  }

  async function deleteAction() {
    await handleDelete(inspectionData.value.id)

    inspectionData.value = null

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
    inspections,
    inspectionData,
    isDialogOpen,
    openAction,
    openManyAction,
    cancelAction,
    deleteAction,
    deleteManyAction
  }
}
