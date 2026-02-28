import Database from '@tauri-apps/plugin-sql'
import { invoke } from '@tauri-apps/api/core'
import type { Professional } from '@/types/Professional'
import type { Professional as PSchema } from '@/schemas/professional.schema'

class ProfessionalService {
  private static instance: ProfessionalService
  private readonly dbPath = 'sqlite:app.db'

  private constructor() {}

  public static getInstance(): ProfessionalService {
    if (!ProfessionalService.instance) {
      ProfessionalService.instance = new ProfessionalService()
    }
    return ProfessionalService.instance
  }

  private async getDb() {
    const db = await Database.load(this.dbPath)

    await db.execute(`
      CREATE VIRTUAL TABLE IF NOT EXISTS professionals_fts USING fts5(
        fullname, 
        tuition_number,
        content='professionals', 
        content_rowid='id',
        tokenize="unicode61 remove_diacritics 1"
      )
    `)

    return db
  }

  private mapFromDb(dbItem: any): Professional {
    if (!dbItem) return null as any
    return {
      id: dbItem.id,
      fullName: dbItem.fullname,
      tuitionNumber: dbItem.tuition_number,
      signaturePath: dbItem.signature_path,
    }
  }

  async search(query: string): Promise<Professional[]> {
    const db = await this.getDb()
    const result = await db.select<any[]>(
      'SELECT p.* FROM professionals p JOIN professionals_fts f ON p.id = f.rowid WHERE professionals_fts MATCH $1 ORDER BY rank',
      [query],
    )
    return result.map((item) => this.mapFromDb(item))
  }

  async getAll(): Promise<Professional[]> {
    const db = await this.getDb()
    const result = await db.select<any[]>('SELECT * FROM professionals')
    return result.map((item) => this.mapFromDb(item))
  }

  async getById(id: number): Promise<Professional> {
    const db = await this.getDb()
    const result = await db.select<any[]>('SELECT * FROM professionals WHERE id = $1', [id])
    return this.mapFromDb(result[0])
  }

  async create(professional: PSchema): Promise<Professional> {
    const db = await this.getDb()
    let signaturePath: string | null = null

    if (professional.signature_file) {
      const file = professional.signature_file as File
      const arrayBuffer = await file.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)
      const fileName = `${Date.now()}_${file.name}`

      signaturePath = await invoke<string>('save_file', {
        name: fileName,
        data: Array.from(uint8Array),
      })
    }

    const result = await db.execute(
      'INSERT INTO professionals (fullname, tuition_number, signature_path) VALUES ($1, $2, $3)',
      [professional.fullname, professional.tuition_number, signaturePath],
    )

    const newId = result.lastInsertId as number

    await db.execute(
      'INSERT INTO professionals_fts (rowid, fullname, tuition_number) VALUES ($1, $2, $3)',
      [newId, professional.fullname, professional.tuition_number],
    )

    return {
      id: newId,
      fullName: professional.fullname,
      tuitionNumber: professional.tuition_number,
      signaturePath: signaturePath || undefined,
    }
  }

  async update(id: number, professional: PSchema): Promise<Professional> {
    const db = await this.getDb()
    let signaturePath: string | null = undefined as any

    if (professional.signature_file) {
      const file = professional.signature_file as File
      const arrayBuffer = await file.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)
      const fileName = `${Date.now()}_${file.name}`

      signaturePath = await invoke<string>('save_file', {
        name: fileName,
        data: Array.from(uint8Array),
      })
    } else if (professional.signature_file === null) {
      signaturePath = null
    }

    if (signaturePath !== undefined) {
      await db.execute(
        'UPDATE professionals SET fullname = $1, tuition_number = $2, signature_path = $3 WHERE id = $4',
        [professional.fullname, professional.tuition_number, signaturePath, id],
      )
    } else {
      await db.execute(
        'UPDATE professionals SET fullname = $1, tuition_number = $2 WHERE id = $3',
        [professional.fullname, professional.tuition_number, id],
      )
    }

    await db.execute(
      'INSERT OR REPLACE INTO professionals_fts (rowid, fullname, tuition_number) VALUES ($1, $2, $3)',
      [id, professional.fullname, professional.tuition_number],
    )

    return this.getById(id)
  }

  async delete(id: number): Promise<void> {
    const db = await this.getDb()
    await db.execute('DELETE FROM professionals WHERE id = $1', [id])
    await db.execute('DELETE FROM professionals_fts WHERE rowid = $1', [id])
  }

  async deleteMany(ids: number[]): Promise<void> {
    if (ids.length === 0) return
    const db = await this.getDb()
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(', ')
    await db.execute(`DELETE FROM professionals WHERE id IN (${placeholders})`, ids)
    await db.execute(`DELETE FROM professionals_fts WHERE rowid IN (${placeholders})`, ids)
  }
}

export const professionalService = ProfessionalService.getInstance()
