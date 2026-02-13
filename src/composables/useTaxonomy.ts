import { ref, type Ref } from 'vue'
import { useDialog } from './useDialog'
import { useMessages } from './useMessages'
import { useDatabase } from './useDatabase'

export type CRUDAction = 'create' | 'edit' | 'remove' | 'removeMany'

export const useTaxonomy = <T extends { id: number }>(list: Ref<T[]>) => {
  const { isDialogOpen, openDialog, closeDialog } = useDialog()
  const { addMessageToQueue } = useMessages()
  const { addItem, updateItem, removeItem, removeItems, isLoading } = useDatabase()

  const selectedItem = ref<any | null>(null)
  const selected = ref<number[]>([])
  const search = ref('')
  const action = ref<CRUDAction>('create')

  const create = () => {
    action.value = 'create'

    selectedItem.value = null

    openDialog()
  }

  const edit = (item: T) => {
    action.value = 'edit'

    selectedItem.value = { ...item }

    openDialog()
  }

  const remove = (item: T) => {
    action.value = 'remove'

    selectedItem.value = item

    openDialog()
  }

  const removeMany = () => {
    action.value = 'removeMany'

    selectedItem.value = null

    openDialog()
  }

  const cancel = () => {
    selectedItem.value = null

    closeDialog()
  }

  const runAction = async (task: () => Promise<void>, msg: string) => {
    try {
      await task()
      addMessageToQueue(msg, 'success')

      closeDialog()
    } catch (e: any) {
      addMessageToQueue(e.message || 'Error al procesar la solicitud', 'error')
    }
  }

  const handleCreate = async (task: () => Promise<T>, msg: string) => {
    await runAction(async () => {
      const result = await task()

      addItem(list, result)
    }, msg)
  }

  const handleUpdate = async (task: () => Promise<T>, msg: string) => {
    await runAction(async () => {
      const result = await task()

      updateItem(list, result)
    }, msg)
  }

  const handleDelete = async (id: number, task: () => Promise<void>, msg: string) => {
    await runAction(async () => {
      await task()

      removeItem(list, id)
    }, msg)
  }

  const handleDeleteMany = async (ids: number[], task: () => Promise<void>, msg: string) => {
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
    handleDeleteMany,
  }
}
