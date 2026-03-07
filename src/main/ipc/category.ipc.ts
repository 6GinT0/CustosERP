import { ipcMain } from 'electron'
import { categoryService } from '../services/category.service'

export function registerCategoryHandlers(): void {
  ipcMain.handle('category:getAll', async () => {
    return categoryService.getAll()
  })

  ipcMain.handle('category:create', async (_event, data) => {
    return categoryService.create(data)
  })

  ipcMain.handle('category:search', async (_event, query) => {
    return categoryService.search(query)
  })

  ipcMain.handle('category:update', async (_event, data) => {
    return categoryService.update(data)
  })

  ipcMain.handle('category:delete', async (_event, id) => {
    return categoryService.delete(id)
  })

  ipcMain.handle('category:deleteMany', async (_event, ids) => {
    return categoryService.deleteMany(ids)
  })
}
