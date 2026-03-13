import { ipcMain } from 'electron'
import { pdfService } from '../services/pdf.service'

export function registerPdfHandlers(): void {
  ipcMain.handle(
    'pdf:save',
    async (_, { fileName, pdfData }: { fileName: string; pdfData: number[] }) => {
      const uint8Array = new Uint8Array(pdfData)
      return pdfService.savePdf({
        fileName,
        pdfData: uint8Array
      })
    }
  )

  ipcMain.handle('pdf:generate', async (_, { inspectionId }: { inspectionId: number }) => {
    return await pdfService.generatePdf({ inspectionId })
  })
}
