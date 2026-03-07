export type Company = {
  id: number
  cuit: string
  social_reason?: string | null
  social_number?: number | null
  fantasy_name: string
  address: string
  latitude: number
  longitude: number
  phone?: string | null
  contact_name?: string | null
  createdAt?: Date
  updatedAt?: Date
}
