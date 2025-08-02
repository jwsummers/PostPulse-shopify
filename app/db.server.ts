// app/db.server.ts
import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

declare global {
  // eslint-disable-next-line no-var
  var __prisma__: PrismaClient | undefined
}

function makeClient() {
  return new PrismaClient()
}

if (process.env.NODE_ENV === 'production') {
  prisma = makeClient()
} else {
  if (!global.__prisma__) global.__prisma__ = makeClient()
  prisma = global.__prisma__!
}

export { prisma }
export default prisma
