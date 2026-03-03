export type InspectionStatus = 0 | 1 | 2 // 0: N/A, 1: No OK, 2: OK

export type InspectionResult = {
  id: number
  inspectionId: number
  categoryItemId: number
  status: InspectionStatus
  itemSnapshot?: string
}
