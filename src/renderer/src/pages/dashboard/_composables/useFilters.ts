import { ref, reactive, watch } from 'vue'
import { createGlobalState } from '@vueuse/core'
import { startOfDay, subDays } from 'date-fns'
import type { DashboardFilters } from '#/src/preload/index.d'
import { useDatabase } from '@renderer/composables/useDatabase'

export const useFilters = createGlobalState(() => {
  const filters = reactive({
    dateRange: {
      start: subDays(new Date(), 30),
      end: startOfDay(new Date())
    },
    area: null as number | null,
    sector: null as number | null,
    reason: null as number | null,
    company: null as number | null,
    professional: null as number | null
  })

  const mostFrequentReason = ref<null | string>(null)
  const totalInspections = ref<number>(0)
  const totalVisits = ref<number>(0)
  const compliancePercentage = ref<number>(0)
  const inspectionsData = ref<{ date: string; count: number }[]>([])
  const distributionData = ref<{
    areas: { name: string; count: number }[]
    sectors: { name: string; count: number }[]
    reasons: { name: string; count: number }[]
  }>({ areas: [], sectors: [], reasons: [] })
  const compliancePerItemData = ref<
    { name: string; percentage: number; ok: number; noOk: number; na: number }[]
  >([])
  const recentInspections = ref<
    {
      id: number
      date: string
      company: string
      compliance: string
      visitNumber: number | string
      inspectionNumber: number | string
    }[]
  >([])
  const { inspections } = useDatabase()

  /**
   * Maps the reactive `filters` object into the `DashboardFilters` format
   * expected by the backend service / IPC layer.
   */
  const buildApiFilters = (): DashboardFilters => ({
    dateStart: filters.dateRange.start ? new Date(filters.dateRange.start) : null,
    dateEnd: filters.dateRange.end ? new Date(filters.dateRange.end) : null,
    areaId: filters.area ?? null,
    sectorId: filters.sector ?? null,
    reasonId: filters.reason ?? null,
    companyId: filters.company ?? null,
    professionalId: filters.professional ?? null
  })

  watch(
    [filters, inspections],
    async () => {
      const f = buildApiFilters()

      mostFrequentReason.value =
        (await window.api.inspection.getMostFrequentReason(f))?.name ?? null
      compliancePercentage.value = await window.api.inspection.getCompliancePercentage(f)
      const stats = await window.api.inspection.getTotalInspectionsAndVisits(f)
      totalInspections.value = stats.inspections
      totalVisits.value = stats.visits

      inspectionsData.value = await window.api.inspection.getInspectionsPerDay(
        filters.dateRange.start,
        filters.dateRange.end,
        f
      )

      distributionData.value = await window.api.inspection.getDistribution(f)
      compliancePerItemData.value = await window.api.inspection.getCompliancePerItem(f)
      recentInspections.value = await window.api.inspection.getRecentInspections(f)
    },
    { immediate: true, deep: true }
  )

  return {
    filters,
    mostFrequentReason,
    totalInspections,
    totalVisits,
    compliancePercentage,
    inspectionsData,
    distributionData,
    compliancePerItemData,
    recentInspections
  }
})
