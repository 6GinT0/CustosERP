import Database from '@tauri-apps/plugin-sql'
import { invoke } from '@tauri-apps/api/core'
import type { Inspection } from '@/types/Inspection'
import { inspectionResultService } from './InspectionResultService'
import type {
  InspectionResult as RSCHEMA,
  Observation as OSCHEMA,
  Inspection as ISCHEMA,
} from '@/schemas/inspections.schema'

export type CompleteInspectionSave = {
  inspection: ISCHEMA & { signature_customer_file?: File | null }
  observations: OSCHEMA
  results: RSCHEMA
}

class InspectionService {
  private static instance: InspectionService
  private readonly dbPath = 'sqlite:app.db'

  private constructor() {}

  /**
   * Singleton Pattern
   */
  public static getInstance(): InspectionService {
    if (!InspectionService.instance) {
      InspectionService.instance = new InspectionService()
    }

    return InspectionService.instance
  }

  private async getDb() {
    return await Database.load(this.dbPath)
  }

  private mapFromDb(dbItem: any): Inspection {
    return {
      id: dbItem.id,
      date: dbItem.date,
      companyId: dbItem.company_id,
      professionalId: dbItem.professional_id,
      areaId: dbItem.area_id,
      sectorId: dbItem.sector_id,
      reasonId: dbItem.reason_id,
      art: dbItem.art,
      workSchedule: dbItem.work_schedule,
      currentEmployeeCount: dbItem.current_employee_count,
      observations: dbItem.observations,
      breach: dbItem.breach,
      signatureCustomerPath: dbItem.signature_customer_path,
    }
  }

  async getAll(): Promise<Inspection[]> {
    const db = await this.getDb()
    const result = await db.select<any[]>('SELECT * FROM inspections ORDER BY date DESC')
    return result.map((item) => this.mapFromDb(item))
  }

  async getById(id: number): Promise<Inspection | null> {
    const db = await this.getDb()
    const result = await db.select<any[]>('SELECT * FROM inspections WHERE id = $1', [id])
    if (result.length === 0) return null
    return this.mapFromDb(result[0])
  }

  async create(data: CompleteInspectionSave): Promise<Inspection> {
    const db = await this.getDb()
    let signaturePath: string | null = null

    if (data.inspection.signature_customer_file) {
      const file = data.inspection.signature_customer_file as File
      const arrayBuffer = await file.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)
      const fileName = `inspection_${Date.now()}_${file.name}`

      signaturePath = await invoke<string>('save_file', {
        name: fileName,
        data: Array.from(uint8Array),
      })
    }

    const result = await db.execute(
      `INSERT INTO inspections (
        date, company_id, professional_id, area_id, sector_id, reason_id, 
        art, work_schedule, current_employee_count, observations, breach, 
        signature_customer_path
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        data.inspection.date.toISOString(),
        data.inspection.company_id,
        data.inspection.professional_id,
        data.inspection.area_id,
        data.inspection.sector_id,
        data.inspection.reason_id,
        data.inspection.art,
        data.inspection.work_schedule,
        data.inspection.current_employee_count,
        data.observations.observations,
        data.observations.breach,
        signaturePath,
      ],
    )

    const newId = result.lastInsertId as number

    if (data.results.results && data.results.results.length > 0) {
      await inspectionResultService.createManyWithSnapshots(newId, data.results.results)
    }

    return (await this.getById(newId))!
  }

  async update(id: number, data: CompleteInspectionSave): Promise<Inspection> {
    const db = await this.getDb()
    const current = await this.getById(id)
    if (!current) throw new Error('Inspection not found')

    let signaturePath: string | null = current.signatureCustomerPath || null

    if (data.inspection.signature_customer_file instanceof File) {
      const file = data.inspection.signature_customer_file
      const arrayBuffer = await file.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)
      const fileName = `inspection_${Date.now()}_${file.name}`

      signaturePath = await invoke<string>('save_file', {
        name: fileName,
        data: Array.from(uint8Array),
      })
    } else if (data.inspection.signature_customer_file === null) {
      signaturePath = null
    }

    await db.execute(
      `UPDATE inspections SET 
        date = $1, company_id = $2, professional_id = $3, area_id = $4, 
        sector_id = $5, reason_id = $6, art = $7, work_schedule = $8, 
        current_employee_count = $9, observations = $10, breach = $11, 
        signature_customer_path = $12 
      WHERE id = $13`,
      [
        data.inspection.date.toISOString(),
        data.inspection.company_id,
        data.inspection.professional_id,
        data.inspection.area_id,
        data.inspection.sector_id,
        data.inspection.reason_id,
        data.inspection.art,
        data.inspection.work_schedule,
        data.inspection.current_employee_count,
        data.observations.observations,
        data.observations.breach,
        signaturePath,
        id,
      ],
    )

    await inspectionResultService.deleteByInspectionId(id)
    if (data.results.results && data.results.results.length > 0) {
      await inspectionResultService.createManyWithSnapshots(id, data.results.results)
    }

    return (await this.getById(id))!
  }

  async delete(id: number): Promise<void> {
    const db = await this.getDb()

    await db.execute('DELETE FROM inspection_results WHERE inspection_id = $1', [id])
    await db.execute('DELETE FROM inspections WHERE id = $1', [id])
  }

  async deleteMany(ids: number[]): Promise<void> {
    if (ids.length === 0) return
    const db = await this.getDb()
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(', ')

    await db.execute(`DELETE FROM inspection_results WHERE inspection_id IN (${placeholders})`, ids)
    await db.execute(`DELETE FROM inspections WHERE id IN (${placeholders})`, ids)
  }
}

export const inspectionService = InspectionService.getInstance()
