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
    return await Database.load(this.dbPath)
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

    const item = this.mapFromDb(company)

    const result = await db.execute(
      'INSERT INTO companies (cuit, social_reason, social_number, fantasy_name, address, latitude, longitude, phone, contact_name, total_visits_count, total_inspections_count) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
      [
        item.cuit,
        item.socialReason?.toUpperCase() || null,
        item.socialNumber || null,
        item.fantasyName?.toUpperCase() || null,
        item.address?.toUpperCase() || null,
        item.latitude || null,
        item.longitude || null,
        item.phone || null,
        item.contactName?.toUpperCase() || null,
        item.totalVisitsCount || 0,
        item.totalInspectionsCount || 0,
      ],
    )

    return {
      ...item,
      id: result.lastInsertId as number,
    }
  }

  async update(id: number, company: Company): Promise<Company> {
    const db = await this.getDb()

    const item = this.mapFromDb(company)

    await db.execute(
      'UPDATE companies SET cuit = $1, social_reason = $2, social_number = $3, fantasy_name = $4, address = $5, latitude = $6, longitude = $7, phone = $8, contact_name = $9 WHERE id = $10',
      [
        item.cuit,
        item.socialReason?.toUpperCase() || null,
        item.socialNumber || null,
        item.fantasyName?.toUpperCase() || null,
        item.address?.toUpperCase() || null,
        item.latitude || null,
        item.longitude || null,
        item.phone || null,
        item.contactName?.toUpperCase() || null,
        id,
      ],
    )

    return { ...item, id }
  }

  async delete(id: number): Promise<void> {
    const db = await this.getDb()

    await db.execute('DELETE FROM companies WHERE id = $1', [id])
  }

  async deleteMany(ids: number[]): Promise<void> {
    if (ids.length === 0) return

    const db = await this.getDb()

    const placeholders = ids.map((_, i) => `$${i + 1}`).join(', ')

    const query = `DELETE FROM companies WHERE id IN (${placeholders})`

    await db.execute(query, ids)
  }
}

export const companyService = CompanyService.getInstance()
