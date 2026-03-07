import { ref, type Ref } from 'vue'
import { createGlobalState } from '@vueuse/core'
import { Taxonomy } from '#/types/Taxonomy'
import { Category } from '#/types/Category'
import { CategoryItem } from '#/types/category-item'
import { Company } from '#/types/company'
import { Professional } from '#/types/professional'
import { Inspection } from '#/types/inspection'
import { InspectionResult } from '#/types/inspection-result'

export const useDatabase = createGlobalState(() => {
  const isLoading: Ref<boolean> = ref(false)
  const taxonomies: Ref<Taxonomy[]> = ref([])
  const categories: Ref<Category[]> = ref([])
  const categoryItems: Ref<CategoryItem[]> = ref([])
  const companies: Ref<Company[]> = ref([])
  const professionals: Ref<Professional[]> = ref([])
  const inspections: Ref<Inspection[]> = ref([])
  const inspectionsResults: Ref<InspectionResult[]> = ref([])

  async function loadInitialData(): Promise<void> {
    isLoading.value = true

    const [
      taxResult,
      catResult,
      catItemsResult,
      companiesResult,
      professionalsResult,
      inspResult,
      inspResResult
    ] = await Promise.all([
      window.api.taxonomy.getAll(),
      window.api.category.getAll(),
      window.api.categoryItem.getAll(),
      window.api.company.getAll(),
      window.api.professional.getAll(),
      window.api.inspection.getAll(),
      window.api.inspectionResult.getAll()
    ])

    taxonomies.value = taxResult
    categories.value = catResult
    categoryItems.value = catItemsResult
    companies.value = companiesResult
    professionals.value = professionalsResult
    inspections.value = inspResult
    inspectionsResults.value = inspResResult

    isLoading.value = false
  }

  function addItem<T>(list: Ref<T[]>, item: T): void {
    list.value.push(item)
  }

  function updateItem<T extends { id: number }>(list: Ref<T[]>, item: T): void {
    const index = list.value.findIndex((i) => i.id === item.id)

    if (index !== -1) {
      list.value[index] = { ...item }
    }
  }

  function removeItem<T extends { id: number }>(list: Ref<T[]>, id: number): void {
    list.value = list.value.filter((i) => i.id !== id)
  }

  function removeItems<T extends { id: number }>(list: Ref<T[]>, ids: number[]): void {
    list.value = list.value.filter((i) => !ids.includes(i.id))
  }

  return {
    isLoading,
    taxonomies,
    categories,
    categoryItems,
    companies,
    professionals,
    inspections,
    inspectionsResults,
    loadInitialData,
    addItem,
    updateItem,
    removeItem,
    removeItems
  }
})
