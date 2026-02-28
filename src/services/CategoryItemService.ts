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
    const db = await Database.load(this.dbPath)

    await db.execute(`
      CREATE VIRTUAL TABLE IF NOT EXISTS category_items_fts USING fts5(
        name, 
        law_reference,
        content='category_items', 
        content_rowid='id',
        tokenize="unicode61 remove_diacritics 1"
      )
    `)

    return db
  }

  async search(query: string): Promise<CategoryItem[]> {
    const db = await this.getDb()
    const result = await db.select<any[]>(
      'SELECT c.* FROM category_items c JOIN category_items_fts f ON c.id = f.rowid WHERE category_items_fts MATCH $1 ORDER BY rank',
      [query],
    )
    return result.map((item) => this.mapFromDb(item))
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

    const nameUpper = item.name.toUpperCase()

    const exists = await db.select<any[]>(
      'SELECT id FROM category_items WHERE name = $1 AND category_id = $2',
      [nameUpper, item.categoryId],
    )

    if (exists.length > 0) {
      throw new Error(`YA EXISTE EL ÍTEM "${nameUpper}" EN ESTA CATEGORÍA`)
    }

    const result = await db.execute(
      'INSERT INTO category_items (category_id, name, law_reference) VALUES ($1, $2, $3)',
      [item.categoryId, nameUpper, item.lawReference?.toUpperCase() || null],
    )

    const newId = result.lastInsertId as number

    await db.execute(
      'INSERT INTO category_items_fts (rowid, name, law_reference) VALUES ($1, $2, $3)',
      [newId, nameUpper, item.lawReference?.toUpperCase() || ''],
    )

    return {
      ...item,
      name: nameUpper,
      lawReference: item.lawReference?.toUpperCase() || undefined,
      id: newId,
    }
  }

  async update(item: CategoryItem): Promise<CategoryItem> {
    const db = await this.getDb()

    const nameUpper = item.name.toUpperCase()

    const exists = await db.select<any[]>(
      'SELECT id FROM category_items WHERE name = $1 AND category_id = $2 AND id != $3',
      [nameUpper, item.categoryId, item.id],
    )

    if (exists.length > 0) {
      throw new Error(`YA EXISTE OTRO ÍTEM CON EL NOMBRE "${nameUpper}" EN ESTA CATEGORÍA`)
    }

    await db.execute(
      'UPDATE category_items SET category_id = $1, name = $2, law_reference = $3 WHERE id = $4',
      [item.categoryId, nameUpper, item.lawReference?.toUpperCase() || null, item.id],
    )

    await db.execute(
      'INSERT OR REPLACE INTO category_items_fts (rowid, name, law_reference) VALUES ($1, $2, $3)',
      [item.id, nameUpper, item.lawReference?.toUpperCase() || ''],
    )

    return {
      ...item,
      name: nameUpper,
      lawReference: item.lawReference?.toUpperCase() || undefined,
    }
  }

  async delete(id: number): Promise<void> {
    const db = await this.getDb()

    await db.execute('DELETE FROM category_items WHERE id = $1', [id])
    await db.execute('DELETE FROM category_items_fts WHERE rowid = $1', [id])
  }

  async deleteMany(ids: number[]): Promise<void> {
    if (ids.length === 0) return

    const db = await this.getDb()

    const placeholders = ids.map((_, i) => `$${i + 1}`).join(', ')

    const query = `DELETE FROM category_items WHERE id IN (${placeholders})`
    const ftsQuery = `DELETE FROM category_items_fts WHERE rowid IN (${placeholders})`

    await db.execute(query, ids)
    await db.execute(ftsQuery, ids)
  }
}

export const categoryItemService = CategoryItemService.getInstance()
