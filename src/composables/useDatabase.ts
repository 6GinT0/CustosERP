import { ref, type Ref } from 'vue'
import { createGlobalState } from '@vueuse/core'
import type { Taxonomy } from '@/types/Taxonomy'
import type { Category } from '@/types/Category'
import type { CategoryItem } from '@/types/CategoryItem'
import { taxonomyService } from '@/services/TaxonomyService'
import { categoryService } from '@/services/CategoryService'
import { categoryItemService } from '@/services/CategoryItemService'

export const useDatabase = createGlobalState(() => {
  const isLoading: Ref<boolean> = ref(false)
  const taxonomies: Ref<Taxonomy[]> = ref([])
  const categories: Ref<Category[]> = ref([])
  const categoryItems: Ref<CategoryItem[]> = ref([])

  async function loadInitialData() {
    isLoading.value = true

    const [taxResult, catResult, itemResult] = await Promise.all([
      taxonomyService.getAll(),
      categoryService.getAll(),
      categoryItemService.getAll(),
    ])

    taxonomies.value = taxResult
    categories.value = catResult
    categoryItems.value = itemResult

    isLoading.value = false
  }

  function addItem<T>(list: Ref<T[]>, item: T) {
    list.value.push(item)
  }

  function updateItem<T extends { id: number }>(list: Ref<T[]>, item: T) {
    const index = list.value.findIndex((i) => i.id === item.id)

    if (index !== -1) {
      list.value[index] = { ...item }
    }
  }

  function removeItem<T extends { id: number }>(list: Ref<T[]>, id: number) {
    list.value = list.value.filter((i) => i.id !== id)
  }

  function removeItems<T extends { id: number }>(list: Ref<T[]>, ids: number[]) {
    list.value = list.value.filter((i) => !ids.includes(i.id))
  }

  return {
    isLoading,
    taxonomies,
    categories,
    categoryItems,
    loadInitialData,
    addItem,
    updateItem,
    removeItem,
    removeItems,
  }
})
