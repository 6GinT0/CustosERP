import { PrismaClient, InspectionResult as PrismaInspectionResult } from '#/generated/prisma/client'
import { prisma } from '#/src/main/lib/prisma'

export class InspectionResultService {
  private static instance: InspectionResultService

  private constructor(private prisma: PrismaClient) {}

  /**
   * Singleton Pattern
   */
  public static getInstance(): InspectionResultService {
    if (!InspectionResultService.instance) {
      InspectionResultService.instance = new InspectionResultService(prisma)
    }

    return InspectionResultService.instance
  }

  async getAll(): Promise<PrismaInspectionResult[]> {
    return this.prisma.inspectionResult.findMany()
  }

  async getByInspectionId(inspectionId: number): Promise<PrismaInspectionResult[]> {
    return this.prisma.inspectionResult.findMany({
      where: { inspection_id: inspectionId }
    })
  }

  async create(data: any): Promise<PrismaInspectionResult> {
    return this.prisma.inspectionResult.create({
      data: {
        inspection_id: data.inspectionId,
        category_item_id: data.categoryItemId,
        status: data.status,
        item_snapshot: data.itemSnapshot ? JSON.stringify(data.itemSnapshot) : null
      }
    })
  }

  async createManyWithSnapshots(
    inspectionId: number,
    results: { category_item_id: number; status: string }[]
  ): Promise<void> {
    if (results.length === 0) return

    // 1. Fetch all items to get snapshots
    const items = await this.prisma.categoryItem.findMany({
      select: {
        id: true,
        name: true,
        law_reference: true
      }
    })

    const itemsMap = new Map(
      items.map((i) => [
        i.id,
        {
          name: i.name,
          law_reference: i.law_reference
        }
      ])
    )

    const dataToCreate = results.map((res) => {
      const snapshot = itemsMap.get(res.category_item_id)
      return {
        inspection_id: inspectionId,
        category_item_id: res.category_item_id,
        status: res.status,
        item_snapshot: snapshot ? JSON.stringify(snapshot) : null
      }
    })

    await this.prisma.inspectionResult.createMany({
      data: dataToCreate
    })
  }

  async update(id: number, data: any): Promise<PrismaInspectionResult> {
    return this.prisma.inspectionResult.update({
      where: { id },
      data: {
        inspection_id: data.inspectionId,
        category_item_id: data.categoryItemId,
        status: data.status,
        item_snapshot: data.itemSnapshot ? JSON.stringify(data.itemSnapshot) : undefined
      }
    })
  }

  async deleteByInspectionId(inspectionId: number): Promise<void> {
    await this.prisma.inspectionResult.deleteMany({
      where: { inspection_id: inspectionId }
    })
  }

  async delete(id: number): Promise<void> {
    await this.prisma.inspectionResult.delete({
      where: { id }
    })
  }
}

export const inspectionResultService = InspectionResultService.getInstance()
