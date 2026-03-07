import { PrismaClient, CategoryItem } from '#/generated/prisma/client'
import { prisma } from '#/src/main/lib/prisma'
import { normalizeText } from '#/src/main/lib/normalization'

export class CategoryItemService {
  private static instance: CategoryItemService

  private constructor(private prisma: PrismaClient) {}

  /**
   * Singleton Pattern
   */
  public static getInstance(): CategoryItemService {
    if (!CategoryItemService.instance) {
      CategoryItemService.instance = new CategoryItemService(prisma)
    }

    return CategoryItemService.instance
  }

  async getAll(): Promise<CategoryItem[]> {
    return this.prisma.categoryItem.findMany({
      orderBy: {
        id: 'asc'
      }
    })
  }

  async getByCategoryId(categoryId: number): Promise<CategoryItem[]> {
    return this.prisma.categoryItem.findMany({
      where: { category_id: categoryId },
      orderBy: {
        id: 'asc'
      }
    })
  }

  async search(query: string, categoryId?: number): Promise<CategoryItem[]> {
    const normalizedQuery = normalizeText(query)
    return this.prisma.categoryItem.findMany({
      where: {
        category_id: categoryId,
        OR: [
          { name: { contains: query.toLowerCase() } },
          { normalized_name: { contains: normalizedQuery } }
        ]
      },
      orderBy: { id: 'asc' }
    })
  }

  async create(data: {
    name: string
    category_id: number
    law_reference?: string | null
  }): Promise<CategoryItem> {
    const nameLower = data.name.toLowerCase().trim()
    const normalized = normalizeText(data.name)

    const exists = await this.prisma.categoryItem.findFirst({
      where: {
        normalized_name: normalized,
        category_id: data.category_id
      }
    })

    if (exists) {
      throw new Error(
        `YA EXISTE UN ÍTEM CON EL NOMBRE "${nameLower.toUpperCase()}" EN ESTA CATEGORÍA`
      )
    }

    return this.prisma.categoryItem.create({
      data: {
        name: nameLower,
        category_id: data.category_id,
        law_reference: data.law_reference?.trim() || null,
        normalized_name: normalized,
        updatedAt: new Date()
      }
    })
  }

  async update(data: {
    id: number
    name: string
    category_id: number
    law_reference?: string | null
  }): Promise<CategoryItem> {
    const nameLower = data.name.toLowerCase().trim()
    const normalized = normalizeText(data.name)

    const exists = await this.prisma.categoryItem.findFirst({
      where: {
        normalized_name: normalized,
        category_id: data.category_id,
        id: { not: data.id }
      }
    })

    if (exists) {
      throw new Error(
        `YA EXISTE OTRO ÍTEM CON EL NOMBRE "${nameLower.toUpperCase()}" EN ESTA CATEGORÍA`
      )
    }

    return this.prisma.categoryItem.update({
      where: { id: data.id },
      data: {
        name: nameLower,
        category_id: data.category_id,
        law_reference: data.law_reference?.trim() || null,
        normalized_name: normalized,
        updatedAt: new Date()
      }
    })
  }

  async delete(id: number): Promise<void> {
    await this.prisma.categoryItem.delete({
      where: { id }
    })
  }

  async deleteMany(ids: number[]): Promise<void> {
    await this.prisma.categoryItem.deleteMany({
      where: {
        id: { in: ids }
      }
    })
  }
}

export const categoryItemService = CategoryItemService.getInstance()
