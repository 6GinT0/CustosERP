import Database from '@tauri-apps/plugin-sql'
import type { CategoryItem } from '@/types/CategoryItem'

class CategoryItemService {
  private static instance: CategoryItemService
  private readonly dbPath = 'sqlite:app.db'

  private constructor() {}

  /**
   * Singleton Pattern
   */
  public static getInstance(): CategoryItemService {
    if (!CategoryItemService.instance) {
      CategoryItemService.instance = new CategoryItemService()
    }

    return CategoryItemService.instance
  }

  private async getDb() {
    return await Database.load(this.dbPath)
  }

  async getAll(): Promise<CategoryItem[]> {
    const db = await this.getDb()

    return await db.select<CategoryItem[]>('SELECT * FROM category_items')
  }

  async getByCategoryId(categoryId: number): Promise<CategoryItem[]> {
    const db = await this.getDb()

    return await db.select<CategoryItem[]>('SELECT * FROM category_items WHERE categoryId = $1', [
      categoryId,
    ])
  }

  async create(item: Omit<CategoryItem, 'id'>): Promise<void> {
    const db = await this.getDb()

    await db.execute(
      'INSERT INTO category_items (categoryId, name, lawReference) VALUES ($1, $2, $3)',
      [item.categoryId, item.name, item.lawReference || null],
    )
  }

  async update(item: CategoryItem): Promise<void> {
    const db = await this.getDb()

    await db.execute(
      'UPDATE category_items SET categoryId = $1, name = $2, lawReference = $3 WHERE id = $4',
      [item.categoryId, item.name, item.lawReference || null, item.id],
    )
  }

  async delete(id: number): Promise<void> {
    const db = await this.getDb()

    await db.execute('DELETE FROM category_items WHERE id = $1', [id])
  }

  async deleteMany(ids: number[]): Promise<void> {
    if (ids.length === 0) return

    const db = await this.getDb()

    const placeholders = ids.map((_, i) => `$${i + 1}`).join(', ')

    const query = `DELETE FROM category_items WHERE id IN (${placeholders})`

    await db.execute(query, ids)
  }
}

export const categoryItemService = CategoryItemService.getInstance()
