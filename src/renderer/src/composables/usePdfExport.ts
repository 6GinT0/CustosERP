import { ref } from 'vue'

export const isExportingPdf = ref(false)

export async function exportInspectionToPdf(
  inspectionId: number
): Promise<{ success: boolean; error?: string }> {
  isExportingPdf.value = true

  try {
    const result = await window.api.pdf.generate(inspectionId)
    return result
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Error exporting PDF'
    }
  } finally {
    isExportingPdf.value = false
  }
}
