import Database from '@tauri-apps/plugin-sql'
import type { Company } from '@/types/Company'
import type { Company as CSchema } from '@/schemas/company.schema'

class CompanyService {
  private static instance: CompanyService
  private readonly dbPath = 'sqlite:app.db'

  private constructor() {}

  /**
   * Singleton Pattern
   */
  public static getInstance(): CompanyService {
    if (!CompanyService.instance) {
      CompanyService.instance = new CompanyService()
    }

    return CompanyService.instance
  }

  private async getDb() {
    const db = await Database.load(this.dbPath)

    await db.execute(`
      CREATE VIRTUAL TABLE IF NOT EXISTS companies_fts USING fts5(
        fantasy_name, 
        social_reason,
        content='companies', 
        content_rowid='id'
      )
    `)

    return db
  }

  async search(query: string): Promise<Company[]> {
    const db = await this.getDb()
    const result = await db.select<any[]>(
      'SELECT c.* FROM companies c JOIN companies_fts f ON c.id = f.rowid WHERE companies_fts MATCH $1 ORDER BY rank',
      [query],
    )
    return result.map((item) => this.mapFromDb(item))
  }

  private mapFromDb(dbItem: any): Company {
    return {
      id: dbItem.id,
      cuit: dbItem.cuit,
      socialReason: dbItem.social_reason,
      socialNumber: dbItem.social_number,
      fantasyName: dbItem.fantasy_name,
      address: dbItem.address,
      latitude: dbItem.latitude,
      longitude: dbItem.longitude,
      phone: dbItem.phone,
      contactName: dbItem.contact_name,
      totalVisitsCount: dbItem.total_visits_count,
      totalInspectionsCount: dbItem.total_inspections_count,
    }
  }

  async getAll(): Promise<Company[]> {
    const db = await this.getDb()

    const result = await db.select<any[]>('SELECT * FROM companies')

    return result.map((item) => this.mapFromDb(item))
  }

  async getById(id: number): Promise<Company> {
    const db = await this.getDb()

    const result = await db.select<any[]>('SELECT * FROM companies WHERE id = $1', [id])

    return this.mapFromDb(result[0])
  }

  async create(company: CSchema): Promise<Company> {
    const db = await this.getDb()

    const fantasyNameUpper = company.fantasy_name.toUpperCase()

    const cuitExists = await db.select<any[]>('SELECT id FROM companies WHERE cuit = $1', [
      company.cuit,
    ])
    if (cuitExists.length > 0) {
      throw new Error('EL CUIT YA SE ENCUENTRA REGISTRADO')
    }

    const nameExists = await db.select<any[]>('SELECT id FROM companies WHERE fantasy_name = $1', [
      fantasyNameUpper,
    ])
    if (nameExists.length > 0) {
      throw new Error('EL NOMBRE DE FANTASÍA YA SE ENCUENTRA REGISTRADO')
    }

    const result = await db.execute(
      'INSERT INTO companies (cuit, social_reason, social_number, fantasy_name, address, latitude, longitude, phone, contact_name, total_visits_count, total_inspections_count) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
      [
        company.cuit,
        company.social_reason?.toUpperCase() || null,
        company.social_number || null,
        fantasyNameUpper,
        company.address?.toUpperCase() || null,
        company.latitude || null,
        company.longitude || null,
        company.phone || null,
        company.contact_name?.toUpperCase() || null,
        company.total_visits_count || 0,
        company.total_inspections_count || 0,
      ],
    )

    const newId = result.lastInsertId as number

    await db.execute(
      'INSERT INTO companies_fts (rowid, fantasy_name, social_reason) VALUES ($1, $2, $3)',
      [newId, fantasyNameUpper, company.social_reason?.toUpperCase() || ''],
    )

    return {
      id: newId,
      cuit: company.cuit,
      socialReason: company.social_reason?.toUpperCase() || undefined,
      socialNumber: company.social_number ?? undefined,
      fantasyName: fantasyNameUpper,
      address: company.address?.toUpperCase(),
      latitude: company.latitude,
      longitude: company.longitude,
      phone: company.phone ?? undefined,
      contactName: company.contact_name?.toUpperCase() || undefined,
      totalVisitsCount: company.total_visits_count,
      totalInspectionsCount: company.total_inspections_count,
    }
  }

  async update(id: number, company: Company): Promise<Company> {
    const db = await this.getDb()

    const fantasyNameUpper = company.fantasyName?.toUpperCase() || ''

    const cuitExists = await db.select<any[]>(
      'SELECT id FROM companies WHERE cuit = $1 AND id != $2',
      [company.cuit, id],
    )
    if (cuitExists.length > 0) {
      throw new Error('EL CUIT YA SE ENCUENTRA REGISTRADO EN OTRA EMPRESA')
    }

    const nameExists = await db.select<any[]>(
      'SELECT id FROM companies WHERE fantasy_name = $1 AND id != $2',
      [fantasyNameUpper, id],
    )
    if (nameExists.length > 0) {
      throw new Error('EL NOMBRE DE FANTASÍA YA SE ENCUENTRA REGISTRADO EN OTRA EMPRESA')
    }

    await db.execute(
      'UPDATE companies SET cuit = $1, social_reason = $2, social_number = $3, fantasy_name = $4, address = $5, latitude = $6, longitude = $7, phone = $8, contact_name = $9 WHERE id = $10',
      [
        company.cuit,
        company.socialReason?.toUpperCase() || null,
        company.socialNumber || null,
        fantasyNameUpper,
        company.address?.toUpperCase() || null,
        company.latitude || null,
        company.longitude || null,
        company.phone || null,
        company.contactName?.toUpperCase() || null,
        id,
      ],
    )

    await db.execute(
      'INSERT OR REPLACE INTO companies_fts (rowid, fantasy_name, social_reason) VALUES ($1, $2, $3)',
      [id, fantasyNameUpper, company.socialReason?.toUpperCase() || ''],
    )

    return {
      ...company,
      id,
      socialReason: company.socialReason?.toUpperCase() || undefined,
      fantasyName: fantasyNameUpper,
      address: company.address?.toUpperCase(),
      contactName: company.contactName?.toUpperCase() || undefined,
      phone: company.phone ?? undefined,
      socialNumber: company.socialNumber ?? undefined,
    }
  }

  async delete(id: number): Promise<void> {
    const db = await this.getDb()

    await db.execute('DELETE FROM companies WHERE id = $1', [id])
    await db.execute('DELETE FROM companies_fts WHERE rowid = $1', [id])
  }

  async deleteMany(ids: number[]): Promise<void> {
    if (ids.length === 0) return

    const db = await this.getDb()

    const placeholders = ids.map((_, i) => `$${i + 1}`).join(', ')

    const query = `DELETE FROM companies WHERE id IN (${placeholders})`
    const ftsQuery = `DELETE FROM companies_fts WHERE rowid IN (${placeholders})`

    await db.execute(query, ids)
    await db.execute(ftsQuery, ids)
  }
}

export const companyService = CompanyService.getInstance()
