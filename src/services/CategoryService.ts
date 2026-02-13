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
    return await Database.load(this.dbPath)
  }

  async getAll(): Promise<Category[]> {
    const db = await this.getDb()

    return await db.select<Category[]>('SELECT * FROM categories')
  }

  async create(category: Omit<Category, 'id'>): Promise<Category> {
    const db = await this.getDb()

    const result = await db.execute('INSERT INTO categories (name, description) VALUES ($1, $2)', [
      category.name.toUpperCase(),
      category.description || null,
    ])

    return {
      ...category,
      name: category.name.toUpperCase(),
      id: result.lastInsertId as number,
    }
  }

  async update(category: Category): Promise<Category> {
    const db = await this.getDb()

    await db.execute('UPDATE categories SET name = $1, description = $2 WHERE id = $3', [
      category.name.toUpperCase(),
      category.description || null,
      category.id,
    ])

    return {
      ...category,
      name: category.name.toUpperCase(),
    }
  }

  async delete(id: number): Promise<void> {
    const db = await this.getDb()

    await db.execute('DELETE FROM categories WHERE id = $1', [id])
  }

  async deleteMany(ids: number[]): Promise<void> {
    if (ids.length === 0) return

    const db = await this.getDb()

    const placeholders = ids.map((_, i) => `$${i + 1}`).join(', ')

    const query = `DELETE FROM categories WHERE id IN (${placeholders})`

    await db.execute(query, ids)
  }
}

export const categoryService = CategoryService.getInstance()
