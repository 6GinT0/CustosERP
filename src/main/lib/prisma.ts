import 'dotenv/config'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '../../../generated/prisma/client'

let prismaInstance: PrismaClient | null = null

export function getPrisma(): PrismaClient {
  if (!prismaInstance) {
    const connectionString = process.env.DATABASE_URL

    if (!connectionString) {
      throw new Error(
        '[Prisma] DATABASE_URL no está configurada. Asegúrate de llamar initDatabase() antes de usar Prisma.'
      )
    }

    const adapter = new PrismaBetterSqlite3({ url: connectionString })
    prismaInstance = new PrismaClient({ adapter })
  }

  return prismaInstance
}

export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrisma()
    return (client as any)[prop]
  }
})
