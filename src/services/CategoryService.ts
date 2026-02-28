import Database from '@tauri-apps/plugin-sql'
import type { Category } from '@/types/Category'

class CategoryService {
  private static instance: CategoryService
  private readonly dbPath = 'sqlite:app.db'

  private constructor() {}

  /**
   * Singleton Pattern
   */
  public static getInstance(): CategoryService {
    if (!CategoryService.instance) {
      CategoryService.instance = new CategoryService()
    }

    return CategoryService.instance
  }

  private async getDb() {
    const db = await Database.load(this.dbPath)

    await db.execute(`
      CREATE VIRTUAL TABLE IF NOT EXISTS categories_fts USING fts5(
        name, 
        content='categories', 
        content_rowid='id'
      )
    `)

    return db
  }

  async search(query: string): Promise<Category[]> {
    const db = await this.getDb()
    const result = await db.select<Category[]>(
      'SELECT c.* FROM categories c JOIN categories_fts f ON c.id = f.rowid WHERE categories_fts MATCH $1 ORDER BY rank',
      [query],
    )
    return result
  }

  async getAll(): Promise<Category[]> {
    const db = await this.getDb()

    return await db.select<Category[]>('SELECT * FROM categories')
  }

  async create(category: Omit<Category, 'id'>): Promise<Category> {
    const db = await this.getDb()

    const nameUpper = category.name.toUpperCase()

    const exists = await db.select<any[]>('SELECT id FROM categories WHERE name = $1', [nameUpper])

    if (exists.length > 0) {
      throw new Error(`YA EXISTE UNA CATEGORÍA CON EL NOMBRE "${nameUpper}"`)
    }

    const result = await db.execute('INSERT INTO categories (name, description) VALUES ($1, $2)', [
      nameUpper,
      category.description?.toUpperCase() || null,
    ])

    const newId = result.lastInsertId as number

    await db.execute('INSERT INTO categories_fts (rowid, name) VALUES ($1, $2)', [newId, nameUpper])

    return {
      ...category,
      name: nameUpper,
      description: category.description?.toUpperCase() || undefined,
      id: newId,
    }
  }

  async update(category: Category): Promise<Category> {
    const db = await this.getDb()

    const nameUpper = category.name.toUpperCase()

    const exists = await db.select<any[]>(
      'SELECT id FROM categories WHERE name = $1 AND id != $2',
      [nameUpper, category.id],
    )

    if (exists.length > 0) {
      throw new Error(`YA EXISTE OTRA CATEGORÍA CON EL NOMBRE "${nameUpper}"`)
    }

    await db.execute('UPDATE categories SET name = $1, description = $2 WHERE id = $3', [
      nameUpper,
      category.description?.toUpperCase() || null,
      category.id,
    ])

    await db.execute('INSERT OR REPLACE INTO categories_fts (rowid, name) VALUES ($1, $2)', [
      category.id,
      nameUpper,
    ])

    return {
      ...category,
      name: nameUpper,
      description: category.description?.toUpperCase() || undefined,
    }
  }

  async delete(id: number): Promise<void> {
    const db = await this.getDb()

    await db.execute('DELETE FROM categories WHERE id = $1', [id])
    await db.execute('DELETE FROM categories_fts WHERE rowid = $1', [id])
  }

  async deleteMany(ids: number[]): Promise<void> {
    if (ids.length === 0) return

    const db = await this.getDb()

    const placeholders = ids.map((_, i) => `$${i + 1}`).join(', ')

    const query = `DELETE FROM categories WHERE id IN (${placeholders})`
    const ftsQuery = `DELETE FROM categories_fts WHERE rowid IN (${placeholders})`

    await db.execute(query, ids)
    await db.execute(ftsQuery, ids)
  }
}

export const categoryService = CategoryService.getInstance()
