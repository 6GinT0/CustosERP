export type Inspection = {
  id: number;
  date: string; // Assuming ISO date string
  companyId: number;
  professionalId: number;
  areaId?: number;
  sectorId?: number;
  reasonId?: number;
  art?: string;
  workSchedule?: string;
  currentEmployeeCount?: number;
  observations?: string;
  breach?: string;
  signatureCustomerPath?: string;
};
