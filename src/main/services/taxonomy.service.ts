import { PrismaClient, Taxonomy } from '#/generated/prisma/client'
import { TaxonomyType } from '#/generated/prisma/enums'
import { prisma } from '#/src/main/lib/prisma'
import { normalizeText } from '#/src/main/lib/normalization'

export class TaxonomyService {
  private static instance: TaxonomyService

  private constructor(private prisma: PrismaClient) {}

  /**
   * Singleton Pattern
   */
  public static getInstance(): TaxonomyService {
    if (!TaxonomyService.instance) {
      TaxonomyService.instance = new TaxonomyService(prisma)
    }

    return TaxonomyService.instance
  }

  async search(query: string): Promise<Taxonomy[]> {
    const normalizedQuery = normalizeText(query)
    return this.prisma.taxonomy.findMany({
      where: {
        OR: [
          { name: { contains: query.toLowerCase() } },
          { normalized_name: { contains: normalizedQuery } }
        ]
      },
      orderBy: { id: 'asc' }
    })
  }

  async getAll(): Promise<Taxonomy[]> {
    return this.prisma.taxonomy.findMany({
      orderBy: {
        id: 'asc'
      }
    })
  }

  async getByType(type: TaxonomyType): Promise<Taxonomy[]> {
    return this.prisma.taxonomy.findMany({
      where: { type },
      orderBy: {
        name: 'asc'
      }
    })
  }

  async create(data: { name: string; type: TaxonomyType }): Promise<Taxonomy> {
    const nameLower = data.name.toLowerCase().trim()
    const normalized = normalizeText(data.name)

    const exists = await this.prisma.taxonomy.findFirst({
      where: {
        normalized_name: normalized,
        type: data.type
      }
    })

    if (exists) {
      throw new Error(
        `YA EXISTE UNA TAXONOMÍA DE TIPO "${data.type}" CON EL NOMBRE "${nameLower.toUpperCase()}"`
      )
    }

    return this.prisma.taxonomy.create({
      data: {
        name: nameLower,
        type: data.type,
        normalized_name: normalized,
        updatedAt: new Date()
      }
    })
  }

  async update(data: { id: number; name: string; type: TaxonomyType }): Promise<Taxonomy> {
    const nameLower = data.name.toLowerCase().trim()
    const normalized = normalizeText(data.name)

    const exists = await this.prisma.taxonomy.findFirst({
      where: {
        normalized_name: normalized,
        type: data.type,
        id: { not: data.id }
      }
    })

    if (exists) {
      throw new Error(
        `YA EXISTE OTRA TAXONOMÍA DE TIPO "${data.type}" CON EL NOMBRE "${nameLower.toUpperCase()}"`
      )
    }

    return this.prisma.taxonomy.update({
      where: { id: data.id },
      data: {
        name: nameLower,
        type: data.type,
        normalized_name: normalized,
        updatedAt: new Date()
      }
    })
  }

  async delete(id: number): Promise<void> {
    await this.prisma.taxonomy.delete({
      where: { id }
    })
  }

  async deleteMany(ids: number[]): Promise<void> {
    await this.prisma.taxonomy.deleteMany({
      where: {
        id: { in: ids }
      }
    })
  }
}

export const taxonomyService = TaxonomyService.getInstance()
