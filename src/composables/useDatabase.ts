import { ref, type Ref } from 'vue'
import { createGlobalState } from '@vueuse/core'
import Database from '@tauri-apps/plugin-sql'
import type { Taxonomy } from '@/types/Taxonomy'
import type { Category } from '@/types/Category'
import type { CategoryItem } from '@/types/CategoryItem'

export const useDatabase = createGlobalState(() => {
  const isLoading: Ref<boolean> = ref(false)
  const areas: Ref<Taxonomy[]> = ref([])
  const sectors: Ref<Taxonomy[]> = ref([])
  const reasons: Ref<Taxonomy[]> = ref([])
  const categories: Ref<Category[]> = ref([])
  const categoryItems: Ref<CategoryItem[]> = ref([])

  async function loadInitialData() {
    isLoading.value = true

    const db = await Database.load('sqlite:app.db')

    const [taxResult, catResult, itemResult] = await Promise.all([
      db.select<Taxonomy[]>('SELECT * FROM taxonomies'),
      db.select<Category[]>('SELECT * FROM categories'),
      db.select<CategoryItem[]>('SELECT * FROM category_items'),
    ])

    areas.value = taxResult.filter((t) => t.type === 'AREA')
    sectors.value = taxResult.filter((t) => t.type === 'SECTOR')
    reasons.value = taxResult.filter((t) => t.type === 'REASON')
    categories.value = catResult
    categoryItems.value = itemResult

    isLoading.value = false
  }

  return {
    isLoading,
    taxonomies: {
      areas,
      sectors,
      reasons,
    },
    categories,
    categoryItems,
    loadInitialData,
  }
})
