import { PrismaClient, Category } from '#/generated/prisma/client'
import { prisma } from '#/src/main/lib/prisma'
import { normalizeText } from '#/src/main/lib/normalization'

export class CategoryService {
  private static instance: CategoryService

  private constructor(private prisma: PrismaClient) {}

  /**
   * Singleton Pattern
   */
  public static getInstance(): CategoryService {
    if (!CategoryService.instance) {
      CategoryService.instance = new CategoryService(prisma)
    }

    return CategoryService.instance
  }

  async search(query: string): Promise<Category[]> {
    const normalizedQuery = normalizeText(query)
    return this.prisma.category.findMany({
      where: {
        OR: [
          { name: { contains: query.toLowerCase() } },
          { normalized_name: { contains: normalizedQuery } }
        ]
      },
      orderBy: { id: 'asc' }
    })
  }

  async getAll(): Promise<Category[]> {
    return this.prisma.category.findMany({
      orderBy: {
        id: 'asc'
      }
    })
  }

  async create(data: { name: string; description?: string | null }): Promise<Category> {
    const nameLower = data.name.toLowerCase().trim()
    const normalized = normalizeText(data.name)

    const exists = await this.prisma.category.findFirst({
      where: {
        normalized_name: normalized
      }
    })

    if (exists) {
      throw new Error(`YA EXISTE UNA CATEGORÍA CON EL NOMBRE "${nameLower.toUpperCase()}"`)
    }

    return this.prisma.category.create({
      data: {
        name: nameLower,
        description: data.description?.toLowerCase().trim() || null,
        normalized_name: normalized,
        updatedAt: new Date()
      }
    })
  }

  async update(data: { id: number; name: string; description?: string | null }): Promise<Category> {
    const nameLower = data.name.toLowerCase().trim()
    const normalized = normalizeText(data.name)

    const exists = await this.prisma.category.findFirst({
      where: {
        normalized_name: normalized,
        id: { not: data.id }
      }
    })

    if (exists) {
      throw new Error(`YA EXISTE OTRA CATEGORÍA CON EL NOMBRE "${nameLower.toUpperCase()}"`)
    }

    return this.prisma.category.update({
      where: { id: data.id },
      data: {
        name: nameLower,
        description: data.description?.toLowerCase().trim() || null,
        normalized_name: normalized,
        updatedAt: new Date()
      }
    })
  }

  async delete(id: number): Promise<void> {
    await this.prisma.category.delete({
      where: { id }
    })
  }

  async deleteMany(ids: number[]): Promise<void> {
    await this.prisma.category.deleteMany({
      where: {
        id: { in: ids }
      }
    })
  }
}

export const categoryService = CategoryService.getInstance()
