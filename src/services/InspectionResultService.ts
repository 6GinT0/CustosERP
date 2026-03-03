import Database from '@tauri-apps/plugin-sql'
import type { InspectionResult } from '@/types/InspectionResult'

class InspectionResultService {
  private static instance: InspectionResultService
  private readonly dbPath = 'sqlite:app.db'

  private constructor() {}

  /**
   * Singleton Pattern
   */
  public static getInstance(): InspectionResultService {
    if (!InspectionResultService.instance) {
      InspectionResultService.instance = new InspectionResultService()
    }

    return InspectionResultService.instance
  }

  private async getDb() {
    return await Database.load(this.dbPath)
  }

  private mapFromDb(dbItem: any): InspectionResult {
    return {
      id: dbItem.id,
      inspectionId: dbItem.inspection_id,
      categoryItemId: dbItem.category_item_id,
      status: dbItem.status as InspectionResult['status'],
      itemSnapshot: dbItem.item_snapshot,
    }
  }

  async getAll(): Promise<InspectionResult[]> {
    const db = await this.getDb()
    const result = await db.select<any[]>('SELECT * FROM inspection_results')
    return result.map((item) => this.mapFromDb(item))
  }

  async getByInspectionId(inspectionId: number): Promise<InspectionResult[]> {
    const db = await this.getDb()
    const result = await db.select<any[]>(
      'SELECT * FROM inspection_results WHERE inspection_id = $1',
      [inspectionId],
    )
    return result.map((item) => this.mapFromDb(item))
  }

  async create(result: Omit<InspectionResult, 'id'>): Promise<InspectionResult> {
    const db = await this.getDb()

    const executeResult = await db.execute(
      'INSERT INTO inspection_results (inspection_id, category_item_id, status, item_snapshot) VALUES ($1, $2, $3, $4)',
      [
        result.inspectionId,
        result.categoryItemId,
        result.status,
        result.itemSnapshot ? JSON.stringify(result.itemSnapshot) : null,
      ],
    )

    const newId = executeResult.lastInsertId as number

    return {
      ...result,
      id: newId,
    }
  }

  async createManyWithSnapshots(
    inspectionId: number,
    results: { category_item_id: number; status: number }[],
  ): Promise<void> {
    if (results.length === 0) return
    const db = await this.getDb()

    // 1. Fetch all items to get snapshots
    const items = await db.select<any[]>('SELECT id, name, law_reference FROM category_items')
    const itemsMap = new Map(
      items.map((i) => [
        i.id,
        {
          name: i.name,
          law_reference: i.law_reference,
        },
      ]),
    )

    for (const res of results) {
      const snapshot = itemsMap.get(res.category_item_id)
      await db.execute(
        'INSERT INTO inspection_results (inspection_id, category_item_id, status, item_snapshot) VALUES ($1, $2, $3, $4)',
        [
          inspectionId,
          res.category_item_id,
          res.status,
          snapshot ? JSON.stringify(snapshot) : null,
        ],
      )
    }
  }

  async update(id: number, result: Partial<InspectionResult>): Promise<void> {
    const db = await this.getDb()
    const current = await db.select<any[]>('SELECT * FROM inspection_results WHERE id = $1', [id])
    if (current.length === 0) throw new Error('Inspection result not found')

    const item = current[0]

    await db.execute(
      'UPDATE inspection_results SET inspection_id = $1, category_item_id = $2, status = $3, item_snapshot = $4 WHERE id = $5',
      [
        result.inspectionId ?? item.inspection_id,
        result.categoryItemId ?? item.category_item_id,
        result.status ?? item.status,
        result.itemSnapshot ? JSON.stringify(result.itemSnapshot) : item.item_snapshot,
        id,
      ],
    )
  }

  async deleteByInspectionId(inspectionId: number): Promise<void> {
    const db = await this.getDb()
    await db.execute('DELETE FROM inspection_results WHERE inspection_id = $1', [inspectionId])
  }

  async delete(id: number): Promise<void> {
    const db = await this.getDb()
    await db.execute('DELETE FROM inspection_results WHERE id = $1', [id])
  }
}

export const inspectionResultService = InspectionResultService.getInstance()
