import { ref, type Ref } from 'vue'
import { useDialog } from '@renderer/composables/useDialog'
import { useMessages } from '@renderer/composables/useMessages'
import { useDatabase } from '@renderer/composables/useDatabase'

export type CRUDAction = 'create' | 'edit' | 'remove' | 'removeMany'

export const useClassification = <T extends { id: number }>(list: Ref<T[]>) => {
  const { isDialogOpen, openDialog, closeDialog } = useDialog()
  const { addMessageToQueue } = useMessages()
  const { addItem, updateItem, removeItem, removeItems, isLoading } = useDatabase()

  const selectedItem = ref<any | null>(null)
  const selected = ref<number[]>([])
  const search = ref('')
  const action = ref<CRUDAction>('create')

  const create = (): void => {
    action.value = 'create'

    selectedItem.value = null

    openDialog()
  }

  const edit = (item: T): void => {
    action.value = 'edit'

    selectedItem.value = { ...item }

    openDialog()
  }

  const remove = (item: T): void => {
    action.value = 'remove'

    selectedItem.value = item

    openDialog()
  }

  const removeMany = (): void => {
    action.value = 'removeMany'

    selectedItem.value = null

    openDialog()
  }

  const cancel = (): void => {
    selectedItem.value = null

    closeDialog()
  }

  const runAction = async (task: () => Promise<void>, msg: string): Promise<void> => {
    try {
      await task()
      addMessageToQueue(msg, 'success')

      closeDialog()
    } catch (e: unknown) {
      if (e instanceof Error) {
        addMessageToQueue(e.message, 'error')
      } else {
        addMessageToQueue('Error al procesar la solicitud', 'error')
      }
    }
  }

  const handleCreate = async (task: () => Promise<T>, msg: string): Promise<void> => {
    await runAction(async () => {
      const result = await task()

      addItem(list, result)
    }, msg)
  }

  const handleUpdate = async (task: () => Promise<T>, msg: string): Promise<void> => {
    await runAction(async () => {
      const result = await task()

      updateItem(list, result)
    }, msg)
  }

  const handleDelete = async (
    id: number,
    task: () => Promise<void>,
    msg: string
  ): Promise<void> => {
    await runAction(async () => {
      await task()

      removeItem(list, id)
    }, msg)
  }

  const handleDeleteMany = async (
    ids: number[],
    task: () => Promise<void>,
    msg: string
  ): Promise<void> => {
    await runAction(async () => {
      await task()

      removeItems(list, ids)

      selected.value = []
    }, msg)
  }

  return {
    isDialogOpen,
    selectedItem,
    selected,
    search,
    isLoading,
    action,
    create,
    edit,
    remove,
    removeMany,
    cancel,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleDeleteMany
  }
}
