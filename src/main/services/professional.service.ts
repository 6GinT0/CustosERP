import { PrismaClient, Professional } from '#/generated/prisma/client'
import { prisma } from '#/src/main/lib/prisma'
import { storage } from '../lib/storage'

export class ProfessionalService {
  private static instance: ProfessionalService
  private readonly signaturesDir = 'professionals_signatures'

  private constructor(private prisma: PrismaClient) {}

  /**
   * Singleton Pattern
   */
  public static getInstance(): ProfessionalService {
    if (!ProfessionalService.instance) {
      ProfessionalService.instance = new ProfessionalService(prisma)
    }

    return ProfessionalService.instance
  }

  async getAll(): Promise<Professional[]> {
    return this.prisma.professional.findMany({
      orderBy: {
        id: 'asc'
      }
    })
  }

  async getById(id: number): Promise<Professional | null> {
    return this.prisma.professional.findUnique({
      where: { id }
    })
  }

  async search(query: string): Promise<Professional[]> {
    const queryLower = query.toLowerCase()
    return this.prisma.professional.findMany({
      where: {
        OR: [{ fullname: { contains: queryLower } }, { tuition_number: { contains: queryLower } }]
      },
      orderBy: { id: 'asc' }
    })
  }

  async create(data: any): Promise<Professional> {
    // Check Tuition Number
    const exists = await this.prisma.professional.findUnique({
      where: { tuition_number: data.tuition_number }
    })

    if (exists) {
      throw new Error('LA MATRÍCULA YA SE ENCUENTRA REGISTRADA')
    }

    let signature_path = ''

    // Extract file if exists
    if (data.signature_file) {
      const { name, data: fileBuffer } = data.signature_file
      const fileName = `${Date.now()}_${name}`
      signature_path = storage.saveFile(this.signaturesDir, fileName, fileBuffer)
    }

    return this.prisma.professional.create({
      data: {
        fullname: data.fullname.toUpperCase().trim(),
        tuition_number: data.tuition_number.toUpperCase().trim(),
        signature_path: signature_path,
        updatedAt: new Date()
      }
    })
  }

  async update(id: number, data: any): Promise<Professional> {
    // Check Tuition Number
    const exists = await this.prisma.professional.findFirst({
      where: {
        tuition_number: data.tuition_number,
        id: { not: id }
      }
    })

    if (exists) {
      throw new Error('LA MATRÍCULA YA SE ENCUENTRA REGISTRADA EN OTRO PROFESIONAL')
    }

    const current = await this.getById(id)
    if (!current) throw new Error('PROFESIONAL NO ENCONTRADO')

    let signature_path = current.signature_path || ''

    // Logic for signature management:
    // 1. If data.signature_file is null -> User explicitly deleted the signature
    if (data.signature_file === null) {
      if (signature_path) {
        storage.deleteFile(signature_path)
      }
      signature_path = ''
    }
    // 2. If data.signature_file is an object with data -> User uploaded a new signature
    else if (
      data.signature_file &&
      typeof data.signature_file === 'object' &&
      data.signature_file.data
    ) {
      if (signature_path) {
        storage.deleteFile(signature_path)
      }

      const { name, data: fileBuffer } = data.signature_file
      const fileName = `${Date.now()}_${name}`
      signature_path = storage.saveFile(this.signaturesDir, fileName, fileBuffer)
    }
    // 3. If data.signature_file is undefined -> Keep current signature_path

    return this.prisma.professional.update({
      where: { id },
      data: {
        fullname: data.fullname.toUpperCase().trim(),
        tuition_number: data.tuition_number.toUpperCase().trim(),
        signature_path: signature_path,
        updatedAt: new Date()
      }
    })
  }

  async delete(id: number): Promise<void> {
    const current = await this.getById(id)

    if (current?.signature_path) {
      storage.deleteFile(current.signature_path)
    }

    await this.prisma.professional.delete({
      where: { id }
    })
  }

  async deleteMany(ids: number[]): Promise<void> {
    const professionals = await this.prisma.professional.findMany({
      where: { id: { in: ids } }
    })

    for (const p of professionals) {
      if (p.signature_path) {
        storage.deleteFile(p.signature_path)
      }
    }

    await this.prisma.professional.deleteMany({
      where: {
        id: { in: ids }
      }
    })
  }
}

export const professionalService = ProfessionalService.getInstance()
