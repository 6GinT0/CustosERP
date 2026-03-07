import { ref } from 'vue'

export const useDialog = () => {
  const isDialogOpen = ref(false)

  const openDialog = (): void => {
    isDialogOpen.value = true
  }

  const closeDialog = (): void => {
    isDialogOpen.value = false
  }

  return {
    isDialogOpen,
    openDialog,
    closeDialog
  }
}
