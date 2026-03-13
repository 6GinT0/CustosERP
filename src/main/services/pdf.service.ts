import { app, BrowserWindow } from 'electron'
import * as fs from 'fs'
import * as path from 'path'
import { inspectionService } from './inspection.service'
import { generateInspectionHtml } from '../templates/inspection-pdf.template'

export interface SavePdfOptions {
  fileName: string
  pdfData: Uint8Array
}

export interface GeneratePdfOptions {
  inspectionId: number
}

export interface SavePdfResult {
  success: boolean
  filePath?: string
  error?: string
}

export interface GeneratePdfResult {
  success: boolean
  filePath?: string
  error?: string
}

export class PdfService {
  private static instance: PdfService

  private constructor() {} // eslint-disable-line @typescript-eslint/no-empty-function

  public static getInstance(): PdfService {
    if (!PdfService.instance) {
      PdfService.instance = new PdfService()
    }
    return PdfService.instance
  }

  public savePdf(options: SavePdfOptions): SavePdfResult {
    try {
      const downloadsPath = app.getPath('downloads')
      const filePath = path.join(downloadsPath, options.fileName)

      fs.writeFileSync(filePath, options.pdfData)

      return {
        success: true,
        filePath
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error saving PDF'
      }
    }
  }

  public async generatePdf(options: GeneratePdfOptions): Promise<GeneratePdfResult> {
    return new Promise((resolve) => {
      const now = new Date()
      const dateStr = now.toISOString().split('T')[0]
      const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '')
      const fileName = `inspection_${options.inspectionId}_${dateStr}_${timeStr}.pdf`

      const hiddenWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        show: false,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true
        }
      })

      hiddenWindow.loadURL('about:blank')

      hiddenWindow.webContents.once('did-finish-load', async () => {
        try {
          const inspection = await inspectionService.getById(options.inspectionId)

          if (!inspection) {
            hiddenWindow.close()
            resolve({
              success: false,
              error: 'Inspección no encontrada'
            })
            return
          }

          const html = generateInspectionHtml(inspection)

          await hiddenWindow.webContents.executeJavaScript(`
            document.open();
            document.write(${JSON.stringify(html)});
            document.close();
          `)

          await new Promise((resolve) => setTimeout(resolve, 500))

          const pdfData = await hiddenWindow.webContents.printToPDF({
            printBackground: true,
            landscape: false,
            pageSize: 'A4'
          })

          const saveResult = this.savePdf({ fileName, pdfData })

          hiddenWindow.close()
          resolve(saveResult)
        } catch (error) {
          hiddenWindow.close()
          resolve({
            success: false,
            error: error instanceof Error ? error.message : 'Error generating PDF'
          })
        }
      })

      hiddenWindow.webContents.once('did-fail-load', (_, errorCode, errorDescription) => {
        hiddenWindow.close()
        resolve({
          success: false,
          error: `Failed to load: ${errorDescription} (${errorCode})`
        })
      })
    })
  }
}

export const pdfService = PdfService.getInstance()
