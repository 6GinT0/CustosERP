import Database from '@tauri-apps/plugin-sql'
import type { Taxonomy } from '@/types/Taxonomy'

class TaxonomyService {
  private static instance: TaxonomyService
  private readonly dbPath = 'sqlite:app.db'

  private constructor() {}

  /**
   * Singleton Pattern
   */
  public static getInstance(): TaxonomyService {
    if (!TaxonomyService.instance) {
      TaxonomyService.instance = new TaxonomyService()
    }

    return TaxonomyService.instance
  }

  private async getDb() {
    return await Database.load(this.dbPath)
  }

  async getAll(): Promise<Taxonomy[]> {
    const db = await this.getDb()

    const result = await db.select<Taxonomy[]>('SELECT * FROM taxonomies')

    return result
  }

  async create(taxonomy: Omit<Taxonomy, 'id'>): Promise<void> {
    const db = await this.getDb()

    await db.execute('INSERT INTO taxonomies (name, type) VALUES ($1, $2)', [
      taxonomy.name,
      taxonomy.type,
    ])
  }

  async update(taxonomy: Taxonomy): Promise<void> {
    const db = await this.getDb()

    await db.execute('UPDATE taxonomies SET name = $1, type = $2 WHERE id = $3', [
      taxonomy.name,
      taxonomy.type,
      taxonomy.id,
    ])
  }

  async delete(id: number): Promise<void> {
    const db = await this.getDb()

    await db.execute('DELETE FROM taxonomies WHERE id = $1', [id])
  }

  async deleteMany(ids: number[]): Promise<void> {
    if (ids.length === 0) return

    const db = await this.getDb()

    const placeholders = ids.map((_, i) => `$${i + 1}`).join(', ')

    const query = `DELETE FROM taxonomies WHERE id IN (${placeholders})`

    await db.execute(query, ids)
  }
}

export const taxonomyService = TaxonomyService.getInstance()
