import { PrismaClient, Inspection as PrismaInspection, Prisma } from '#/generated/prisma/client'
import { prisma } from '#/src/main/lib/prisma'
import { storage } from '../lib/storage'
import { inspectionResultService } from './inspection-result.service'

export type DashboardFilters = {
  dateStart?: Date | null
  dateEnd?: Date | null
  areaId?: number | null
  sectorId?: number | null
  reasonId?: number | null
  companyId?: number | null
  professionalId?: number | null
}

/**
 * Builds a Prisma `where` clause from the provided dashboard filters.
 * All filters are optional — omitted/null values are excluded.
 */
function buildWhere(f?: DashboardFilters): Prisma.InspectionWhereInput {
  if (!f) return {}
  const where: Prisma.InspectionWhereInput = {}
  if (f.dateStart || f.dateEnd) {
    where.date = {}
    if (f.dateStart) (where.date as Prisma.DateTimeFilter).gte = f.dateStart
    if (f.dateEnd) (where.date as Prisma.DateTimeFilter).lte = f.dateEnd
  }
  if (f.areaId) where.area_id = f.areaId
  if (f.sectorId) where.sector_id = f.sectorId
  if (f.reasonId) where.reason_id = f.reasonId
  if (f.companyId) where.company_id = f.companyId
  if (f.professionalId) where.professional_id = f.professionalId
  return where
}

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

  async getMostFrequentReason(
    filters?: DashboardFilters
  ): Promise<{ id: number; name: string } | null> {
    const where = buildWhere(filters)
    const result = await this.prisma.inspection.groupBy({
      by: ['reason_id'],
      where,
      _count: { reason_id: true },
      orderBy: { _count: { reason_id: 'desc' } },
      take: 1
    })

    if (result.length > 0) {
      return this.prisma.taxonomy.findUnique({ where: { id: result[0].reason_id } })
    }

    return null
  }

  async getTotalInspectionsAndVisits(
    filters?: DashboardFilters
  ): Promise<{ inspections: number; visits: number }> {
    const where = buildWhere(filters)
    const result = await this.prisma.inspection.aggregate({
      where,
      _sum: {
        total_inspections_count: true,
        total_visits_count: true
      }
    })
    return {
      inspections: result._sum.total_inspections_count || 0,
      visits: result._sum.total_visits_count || 0
    }
  }

  async getCompliancePercentage(filters?: DashboardFilters): Promise<number> {
    const where = buildWhere(filters)

    const inspections = await this.prisma.inspection.findMany({
      where,
      select: { id: true }
    })

    const inspIds = inspections.map((i) => i.id)

    if (inspIds.length === 0) {
      return 0
    }

    const results = await this.prisma.inspectionResult.groupBy({
      by: ['status'],
      where: inspIds.length ? { inspection_id: { in: inspIds } } : undefined,
      _count: { status: true }
    })

    let okCount = 0
    let notOkCount = 0
    for (const r of results) {
      if (r.status === 'OK') okCount += r._count.status
      else if (r.status === 'No OK') notOkCount += r._count.status
    }

    const totalApplicable = okCount + notOkCount
    if (totalApplicable === 0) return 0
    return Math.round((okCount / totalApplicable) * 100)
  }

  async getInspectionsPerDay(
    startDate: Date,
    endDate: Date,
    filters?: DashboardFilters
  ): Promise<{ date: string; count: number }[]> {
    const where = buildWhere({ ...filters, dateStart: startDate, dateEnd: endDate })
    const inspections = await this.prisma.inspection.findMany({ where, select: { date: true } })

    const counts: Record<string, number> = {}
    for (const insp of inspections) {
      if (!insp.date) continue
      const day = insp.date.toISOString().split('T')[0]
      counts[day] = (counts[day] || 0) + 1
    }
    return Object.keys(counts).map((date) => ({ date, count: counts[date] }))
  }

  async getDistribution(filters?: DashboardFilters): Promise<{
    areas: { name: string; count: number }[]
    sectors: { name: string; count: number }[]
    reasons: { name: string; count: number }[]
  }> {
    const where = buildWhere(filters)
    const taxonomies = await this.prisma.taxonomy.findMany()
    const tMap = new Map(taxonomies.map((t) => [t.id, t.name]))

    const formatG = (g: { [key: string]: unknown; _count: Record<string, number> }[], k: string) =>
      g.map((row) => ({ name: tMap.get(row[k] as number) || '?', count: row._count[k] }))

    const [a, s, r] = await Promise.all([
      this.prisma.inspection.groupBy({ by: ['area_id'], where, _count: { area_id: true } }),
      this.prisma.inspection.groupBy({ by: ['sector_id'], where, _count: { sector_id: true } }),
      this.prisma.inspection.groupBy({ by: ['reason_id'], where, _count: { reason_id: true } })
    ])

    return {
      areas: formatG(a as Parameters<typeof formatG>[0], 'area_id'),
      sectors: formatG(s as Parameters<typeof formatG>[0], 'sector_id'),
      reasons: formatG(r as Parameters<typeof formatG>[0], 'reason_id')
    }
  }

  async getCompliancePerItem(
    filters?: DashboardFilters
  ): Promise<{ name: string; percentage: number; ok: number; noOk: number; na: number }[]> {
    const where = buildWhere(filters)

    const inspections = await this.prisma.inspection.findMany({
      where,
      select: { id: true }
    })

    const inspIds = inspections.map((i) => i.id)

    if (inspIds.length === 0) {
      return []
    }

    const results = await this.prisma.inspectionResult.groupBy({
      by: ['category_item_id', 'status'],
      where: inspIds.length ? { inspection_id: { in: inspIds } } : undefined,
      _count: { status: true }
    })

    const items = await this.prisma.categoryItem.findMany()
    const itemMap = new Map(items.map((i) => [i.id, i.name]))

    const statsMap: Record<number, { ok: number; noOk: number; na: number }> = {}
    for (const r of results) {
      if (!statsMap[r.category_item_id]) statsMap[r.category_item_id] = { ok: 0, noOk: 0, na: 0 }
      if (r.status === 'OK') statsMap[r.category_item_id].ok += r._count.status
      else if (r.status === 'No OK') statsMap[r.category_item_id].noOk += r._count.status
      else if (r.status === 'N/A') statsMap[r.category_item_id].na += r._count.status
    }

    const payload = Object.keys(statsMap).map((idStr) => {
      const id = parseInt(idStr)
      const data = statsMap[id]
      const totalApplicable = data.ok + data.noOk
      const percentage = totalApplicable === 0 ? 0 : Math.round((data.ok / totalApplicable) * 100)
      return {
        name: itemMap.get(id) || `Item ${id}`,
        percentage,
        ok: data.ok,
        noOk: data.noOk,
        na: data.na
      }
    })

    return payload.sort((a, b) => b.percentage - a.percentage)
  }

  async getRecentInspections(filters?: DashboardFilters): Promise<
    {
      id: number
      date: string
      company: string
      compliance: string
      visitNumber: number | string
      inspectionNumber: number | string
    }[]
  > {
    const where = buildWhere(filters)
    const rows = await this.prisma.inspection.findMany({
      where,
      take: 8,
      orderBy: { date: 'desc' },
      include: {
        company: { select: { fantasy_name: true, social_reason: true } },
        results: { select: { status: true } }
      }
    })

    return rows.map((i) => {
      let okCount = 0
      let totalApplicable = 0
      for (const r of i.results) {
        if (r.status === 'OK') {
          okCount++
          totalApplicable++
        } else if (r.status === 'No OK') totalApplicable++
      }
      const compliance = totalApplicable > 0 ? Math.round((okCount / totalApplicable) * 100) : 0
      const dateStr = i.date
        ? `${String(i.date.getDate()).padStart(2, '0')}/${String(i.date.getMonth() + 1).padStart(2, '0')}/${i.date.getFullYear()}`
        : 'S/F'
      return {
        id: i.id,
        date: dateStr,
        company: i.company?.fantasy_name || i.company?.social_reason || 'Desconocida',
        compliance: `${compliance}%`,
        visitNumber: i.total_visits_count || '-',
        inspectionNumber: i.total_inspections_count || '-'
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
    const rows = await this.prisma.inspection.findMany({
      where: { id: { in: ids } }
    })

    for (const inspection of rows) {
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
