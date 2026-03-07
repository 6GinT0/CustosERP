import { ipcMain } from 'electron'
import { categoryItemService } from '../services/category-item.service'

export function registerCategoryItemHandlers(): void {
  ipcMain.handle('categoryItem:getAll', async () => {
    return categoryItemService.getAll()
  })

  ipcMain.handle('categoryItem:getByCategoryId', async (_event, categoryId) => {
    return categoryItemService.getByCategoryId(categoryId)
  })

  ipcMain.handle('categoryItem:create', async (_event, data) => {
    return categoryItemService.create(data)
  })

  ipcMain.handle('categoryItem:search', async (_event, { query, categoryId }) => {
    return categoryItemService.search(query, categoryId)
  })

  ipcMain.handle('categoryItem:update', async (_event, data) => {
    return categoryItemService.update(data)
  })

  ipcMain.handle('categoryItem:delete', async (_event, id) => {
    return categoryItemService.delete(id)
  })

  ipcMain.handle('categoryItem:deleteMany', async (_event, ids) => {
    return categoryItemService.deleteMany(ids)
  })
}
