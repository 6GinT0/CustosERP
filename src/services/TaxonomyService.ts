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
    const db = await Database.load(this.dbPath)

    await db.execute(`
      CREATE VIRTUAL TABLE IF NOT EXISTS taxonomies_fts USING fts5(
        name, 
        content='taxonomies', 
        content_rowid='id',
        tokenize="unicode61 remove_diacritics 1"
      )
    `)

    return db
  }

  async search(query: string): Promise<Taxonomy[]> {
    const db = await this.getDb()
    const result = await db.select<Taxonomy[]>(
      'SELECT t.* FROM taxonomies t JOIN taxonomies_fts f ON t.id = f.rowid WHERE taxonomies_fts MATCH $1 ORDER BY rank',
      [query],
    )
    return result
  }

  async getAll(): Promise<Taxonomy[]> {
    const db = await this.getDb()

    const result = await db.select<Taxonomy[]>('SELECT * FROM taxonomies')

    return result
  }

  async create(taxonomy: Omit<Taxonomy, 'id'>): Promise<Taxonomy> {
    const db = await this.getDb()

    const nameUpper = taxonomy.name.toUpperCase()

    const exists = await db.select<any[]>(
      'SELECT id FROM taxonomies WHERE name = $1 AND type = $2',
      [nameUpper, taxonomy.type],
    )

    if (exists.length > 0) {
      throw new Error(
        `YA EXISTE UNA TAXONOMÍA DE TIPO "${taxonomy.type}" CON EL NOMBRE "${nameUpper}"`,
      )
    }

    const result = await db.execute('INSERT INTO taxonomies (name, type) VALUES ($1, $2)', [
      nameUpper,
      taxonomy.type,
    ])

    const newId = result.lastInsertId as number

    await db.execute('INSERT INTO taxonomies_fts (rowid, name) VALUES ($1, $2)', [newId, nameUpper])

    return {
      ...taxonomy,
      name: nameUpper,
      id: newId,
    }
  }

  async update(taxonomy: Taxonomy): Promise<Taxonomy> {
    const db = await this.getDb()

    const nameUpper = taxonomy.name.toUpperCase()

    const exists = await db.select<any[]>(
      'SELECT id FROM taxonomies WHERE name = $1 AND type = $2 AND id != $3',
      [nameUpper, taxonomy.type, taxonomy.id],
    )

    if (exists.length > 0) {
      throw new Error(
        `YA EXISTE OTRA TAXONOMÍA DE TIPO "${taxonomy.type}" CON EL NOMBRE "${nameUpper}"`,
      )
    }

    await db.execute('UPDATE taxonomies SET name = $1, type = $2 WHERE id = $3', [
      nameUpper,
      taxonomy.type,
      taxonomy.id,
    ])

    await db.execute('INSERT OR REPLACE INTO taxonomies_fts (rowid, name) VALUES ($1, $2)', [
      taxonomy.id,
      nameUpper,
    ])

    return {
      ...taxonomy,
      name: nameUpper,
    }
  }

  async delete(id: number): Promise<void> {
    const db = await this.getDb()

    await db.execute('DELETE FROM taxonomies WHERE id = $1', [id])
    await db.execute('DELETE FROM taxonomies_fts WHERE rowid = $1', [id])
  }

  async deleteMany(ids: number[]): Promise<void> {
    if (ids.length === 0) return

    const db = await this.getDb()

    const placeholders = ids.map((_, i) => `$${i + 1}`).join(', ')

    const query = `DELETE FROM taxonomies WHERE id IN (${placeholders})`
    const ftsQuery = `DELETE FROM taxonomies_fts WHERE rowid IN (${placeholders})`

    await db.execute(query, ids)
    await db.execute(ftsQuery, ids)
  }
}

export const taxonomyService = TaxonomyService.getInstance()
