import { PrismaClient, Company } from '#/generated/prisma/client'
import { prisma } from '#/src/main/lib/prisma'

export class CompanyService {
  private static instance: CompanyService

  private constructor(private prisma: PrismaClient) {}

  /**
   * Singleton Pattern
   */
  public static getInstance(): CompanyService {
    if (!CompanyService.instance) {
      CompanyService.instance = new CompanyService(prisma)
    }

    return CompanyService.instance
  }

  async getAll(): Promise<Company[]> {
    return this.prisma.company.findMany({
      orderBy: {
        id: 'asc'
      }
    })
  }

  async getById(id: number): Promise<Company | null> {
    return this.prisma.company.findUnique({
      where: { id }
    })
  }

  async search(query: string): Promise<Company[]> {
    const queryLower = query.toLowerCase()
    return this.prisma.company.findMany({
      where: {
        OR: [
          { fantasy_name: { contains: queryLower } },
          { social_reason: { contains: queryLower } },
          { cuit: { contains: queryLower } }
        ]
      },
      orderBy: { id: 'asc' }
    })
  }

  async create(data: any): Promise<Company> {
    const fantasyNameUpper = data.fantasy_name.toUpperCase().trim()

    const cuitExists = await this.prisma.company.findUnique({
      where: { cuit: data.cuit }
    })
    if (cuitExists) {
      throw new Error('EL CUIT YA SE ENCUENTRA REGISTRADO')
    }

    const nameExists = await this.prisma.company.findUnique({
      where: { fantasy_name: fantasyNameUpper }
    })
    if (nameExists) {
      throw new Error('EL NOMBRE DE FANTASÍA YA SE ENCUENTRA REGISTRADO')
    }

    return this.prisma.company.create({
      data: {
        cuit: data.cuit,
        social_reason: data.social_reason?.toUpperCase().trim() || null,
        social_number: data.social_number || null,
        fantasy_name: fantasyNameUpper,
        address: data.address?.toUpperCase().trim() || '',
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
        phone: data.phone || null,
        contact_name: data.contact_name?.toUpperCase().trim() || null,
        updatedAt: new Date()
      }
    })
  }

  async update(id: number, data: any): Promise<Company> {
    const fantasyNameUpper = data.fantasy_name.toUpperCase().trim()

    const cuitExists = await this.prisma.company.findFirst({
      where: {
        cuit: data.cuit,
        id: { not: id }
      }
    })
    if (cuitExists) {
      throw new Error('EL CUIT YA SE ENCUENTRA REGISTRADO EN OTRA EMPRESA')
    }

    const nameExists = await this.prisma.company.findFirst({
      where: {
        fantasy_name: fantasyNameUpper,
        id: { not: id }
      }
    })
    if (nameExists) {
      throw new Error('EL NOMBRE DE FANTASÍA YA SE ENCUENTRA REGISTRADO EN OTRA EMPRESA')
    }

    return this.prisma.company.update({
      where: { id },
      data: {
        cuit: data.cuit,
        social_reason: data.social_reason?.toUpperCase().trim() || null,
        social_number: data.social_number || null,
        fantasy_name: fantasyNameUpper,
        address: data.address?.toUpperCase().trim() || '',
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
        phone: data.phone || null,
        contact_name: data.contact_name?.toUpperCase().trim() || null,
        updatedAt: new Date()
      }
    })
  }

  async delete(id: number): Promise<void> {
    await this.prisma.company.delete({
      where: { id }
    })
  }

  async deleteMany(ids: number[]): Promise<void> {
    await this.prisma.company.deleteMany({
      where: {
        id: { in: ids }
      }
    })
  }
}

export const companyService = CompanyService.getInstance()
