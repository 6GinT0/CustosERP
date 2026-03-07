import { PrismaClient, Inspection as PrismaInspection } from '#/generated/prisma/client'
import { prisma } from '#/src/main/lib/prisma'
import { storage } from '../lib/storage'
import { inspectionResultService } from './inspection-result.service'

export class InspectionService {
  private static instance: InspectionService
  private readonly signaturesDir = 'customer_signatures'

  private constructor(private prisma: PrismaClient) {}

  /**
   * Singleton Pattern
   */
  public static getInstance(): InspectionService {
    if (!InspectionService.instance) {
      InspectionService.instance = new InspectionService(prisma)
    }

    return InspectionService.instance
  }

  async getAll(): Promise<PrismaInspection[]> {
    return this.prisma.inspection.findMany({
      include: {
        company: true,
        professional: true,
        area: true,
        sector: true,
        reason: true
      },
      orderBy: {
        date: 'desc'
      }
    })
  }

  async getById(id: number): Promise<PrismaInspection | null> {
    return this.prisma.inspection.findUnique({
      where: { id },
      include: {
        company: true,
        professional: true,
        area: true,
        sector: true,
        reason: true,
        results: true
      }
    })
  }

  async getByCompany(companyId: number): Promise<PrismaInspection[]> {
    return this.prisma.inspection.findMany({
      where: { company_id: companyId },
      include: {
        professional: true,
        area: true,
        sector: true,
        reason: true
      },
      orderBy: {
        date: 'desc'
      }
    })
  }

  async create(data: any): Promise<PrismaInspection> {
    const { inspection, observations, results } = data
    let signature_customer_path = ''

    // Handle signature file
    if (
      inspection.signature_customer_file &&
      typeof inspection.signature_customer_file === 'object' &&
      inspection.signature_customer_file.data
    ) {
      const { name, data: fileBuffer } = inspection.signature_customer_file
      const fileName = `inspection_${Date.now()}_${name}`
      signature_customer_path = storage.saveFile(this.signaturesDir, fileName, fileBuffer)
    }

    const newInspection = await this.prisma.inspection.create({
      data: {
        date: new Date(inspection.date),
        company_id: inspection.company_id,
        professional_id: inspection.professional_id,
        area_id: inspection.area_id,
        sector_id: inspection.sector_id,
        reason_id: inspection.reason_id,
        art: inspection.art,
        work_schedule: inspection.work_schedule,
        total_visits_count: inspection.total_visits_count || 0,
        total_inspections_count: inspection.total_inspections_count || 0,
        current_employee_count: inspection.current_employee_count,
        observations: observations.observations,
        breach: observations.breach,
        signature_customer_path: signature_customer_path
      }
    })

    if (results.results && results.results.length > 0) {
      await inspectionResultService.createManyWithSnapshots(newInspection.id, results.results)
    }

    return newInspection
  }

  async update(id: number, data: any): Promise<PrismaInspection> {
    const { inspection, observations, results } = data
    const current = await this.getById(id)
    if (!current) throw new Error('INSPECCIÓN NO ENCONTRADA')

    let signature_customer_path = current.signature_customer_path || ''

    // Handle signature file
    if (inspection.signature_customer_file === null) {
      if (signature_customer_path) {
        storage.deleteFile(signature_customer_path)
      }
      signature_customer_path = ''
    } else if (
      inspection.signature_customer_file &&
      typeof inspection.signature_customer_file === 'object' &&
      inspection.signature_customer_file.data
    ) {
      if (signature_customer_path) {
        storage.deleteFile(signature_customer_path)
      }

      const { name, data: fileBuffer } = inspection.signature_customer_file
      const fileName = `inspection_${Date.now()}_${name}`
      signature_customer_path = storage.saveFile(this.signaturesDir, fileName, fileBuffer)
    }

    const updatedInspection = await this.prisma.inspection.update({
      where: { id },
      data: {
        date: new Date(inspection.date),
        company_id: inspection.company_id,
        professional_id: inspection.professional_id,
        area_id: inspection.area_id,
        sector_id: inspection.sector_id,
        reason_id: inspection.reason_id,
        art: inspection.art,
        work_schedule: inspection.work_schedule,
        total_visits_count: inspection.total_visits_count || 0,
        total_inspections_count: inspection.total_inspections_count || 0,
        current_employee_count: inspection.current_employee_count,
        observations: observations.observations,
        breach: observations.breach,
        signature_customer_path: signature_customer_path,
        updatedAt: new Date()
      }
    })

    // Update results by deleting current and recreating
    await inspectionResultService.deleteByInspectionId(id)
    if (results.results && results.results.length > 0) {
      await inspectionResultService.createManyWithSnapshots(id, results.results)
    }

    return updatedInspection
  }

  async delete(id: number): Promise<void> {
    const current = await this.getById(id)
    if (current?.signature_customer_path) {
      storage.deleteFile(current.signature_customer_path)
    }

    await this.prisma.inspection.delete({
      where: { id }
    })
  }

  async deleteMany(ids: number[]): Promise<void> {
    const inspections = await this.prisma.inspection.findMany({
      where: { id: { in: ids } }
    })

    for (const inspection of inspections) {
      if (inspection.signature_customer_path) {
        storage.deleteFile(inspection.signature_customer_path)
      }
    }

    await this.prisma.inspection.deleteMany({
      where: { id: { in: ids } }
    })
  }
}

export const inspectionService = InspectionService.getInstance()
