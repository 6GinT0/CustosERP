export type Inspection = {
  id: number
  date: Date
  company_id: number
  professional_id: number
  area_id: number
  sector_id: number
  reason_id: number
  art: string
  work_schedule?: string | null
  total_visits_count: number
  total_inspections_count: number
  current_employee_count?: number | null
  observations?: string | null
  breach?: string | null
  signature_customer_path?: string | null
  createdAt?: Date
  updatedAt?: Date
}
