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

  private mapFromDb(dbItem: any): CategoryItem {
    return {
      id: dbItem.id,
      categoryId: dbItem.category_id,
      name: dbItem.name,
      lawReference: dbItem.law_reference,
    }
  }

  async getAll(): Promise<CategoryItem[]> {
    const db = await this.getDb()

    const result = await db.select<any[]>('SELECT * FROM category_items')

    return result.map((item) => this.mapFromDb(item))
  }

  async getByCategoryId(categoryId: number): Promise<CategoryItem[]> {
    const db = await this.getDb()

    const result = await db.select<any[]>('SELECT * FROM category_items WHERE category_id = $1', [
      categoryId,
    ])

    return result.map((item) => this.mapFromDb(item))
  }

  async create(item: Omit<CategoryItem, 'id'>): Promise<CategoryItem> {
    const db = await this.getDb()

    const result = await db.execute(
      'INSERT INTO category_items (category_id, name, law_reference) VALUES ($1, $2, $3)',
      [item.categoryId, item.name.toUpperCase(), item.lawReference?.toUpperCase() || null],
    )

    return {
      ...item,
      name: item.name.toUpperCase(),
      lawReference: item.lawReference?.toUpperCase() || undefined,
      id: result.lastInsertId as number,
    }
  }

  async update(item: CategoryItem): Promise<CategoryItem> {
    const db = await this.getDb()

    await db.execute(
      'UPDATE category_items SET category_id = $1, name = $2, law_reference = $3 WHERE id = $4',
      [item.categoryId, item.name.toUpperCase(), item.lawReference?.toUpperCase() || null, item.id],
    )

    return {
      ...item,
      name: item.name.toUpperCase(),
      lawReference: item.lawReference?.toUpperCase() || undefined,
    }
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
