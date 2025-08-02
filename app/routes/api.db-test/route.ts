import { json } from '@remix-run/node'
import prisma from '../../db.server'

export async function loader() {
  const shops = await prisma.shop.count()
  return json({ ok: true, shops })
}
