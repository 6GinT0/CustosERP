import { app } from 'electron'
import fs from 'fs'
import path from 'path'
import { is } from '@electron-toolkit/utils'

export class StorageService {
  private static instance: StorageService
  private baseDir: string

  private constructor() {
    // In development, use a 'storage' folder in the root
    // In production, use the user data path
    if (is.dev) {
      this.baseDir = path.resolve(process.cwd(), 'storage')
    } else {
      this.baseDir = path.join(app.getPath('userData'), 'storage')
    }

    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true })
    }
  }

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService()
    }
    return StorageService.instance
  }

  public getPath(...subpaths: string[]): string {
    const fullPath = path.join(this.baseDir, ...subpaths)
    const dir = path.dirname(fullPath)

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    return fullPath
  }

  public saveFile(subDir: string, fileName: string, data: Buffer): string {
    const relativePath = path.join(subDir, fileName)
    const absolutePath = this.getPath(relativePath)

    fs.writeFileSync(absolutePath, data)

    return relativePath.replace(/\\/g, '/')
  }

  public deleteFile(relativePath: string): void {
    const absolutePath = path.join(this.baseDir, relativePath)
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath)
    }
  }

  public getAbsolutePath(relativePath: string): string {
    return path.join(this.baseDir, relativePath)
  }
}

export const storage = StorageService.getInstance()
