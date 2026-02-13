export const TAXONOMY_METADATA = {
  areas: { label: 'Zona', gender: 'f' },
  sectors: { label: 'Sector', gender: 'm' },
  reasons: { label: 'Motivo', gender: 'm' },
  categories: { label: 'Categoría', gender: 'f' },
  items: { label: 'Items', gender: 'f' },
} as const

export type TaxonomySlug = keyof typeof TAXONOMY_METADATA

export const typeLabels: Record<string, string> = {
  AREA: 'ZONA',
  SECTOR: 'ACTIVIDAD',
  REASON: 'MOTIVO',
}

export const typeOptions = [
  { title: 'ZONA', value: 'AREA' },
  { title: 'ACTIVIDAD', value: 'SECTOR' },
  { title: 'MOTIVO', value: 'REASON' },
]
