export type InspectionStatus = 0 | 1 | 2; // 0: N/A, 1: OK, 2: No OK

export type InspectionResult = {
  id: number;
  inspectionId: number;
  categoryItemId: number;
  status: InspectionStatus;
  itemSnapshot?: string;
};
