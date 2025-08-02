import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from '@remix-run/node'
import prisma from '../../db.server'

const cors = {
  'Access-Control-Allow-Origin': '*', // tighten later to your domain if you want
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function loader({request}: LoaderFunctionArgs) {
  return new Response('OK', { headers: cors })
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method === 'OPTIONS') return new Response(null, { headers: cors })

  try {
    const body = await request.json()
    const {
      shopDomain,
      orderId,
      orderToken,
      isRepeat = false,
      hdyhau = null,
      comment = null,
      customerId = null,
    } = body ?? {}

    if (!shopDomain || !orderId || !orderToken) {
      return json({ ok: false, error: 'missing fields' }, { status: 400, headers: cors })
    }

    let shop = await prisma.shop.findUnique({ where: { shopDomain } })
    if (!shop) shop = await prisma.shop.create({ data: { shopDomain } })

    await prisma.response.upsert({
      where: { orderToken: String(orderToken) },
      update: { hdyhau, comment, isRepeat, customerId },
      create: {
        shopId: shop.id,
        orderId: String(orderId),
        orderToken: String(orderToken),
        hdyhau, comment, isRepeat, customerId,
      },
    })

    return json({ ok: true }, { headers: cors })
  } catch {
    return json({ ok: false }, { status: 200, headers: cors })
  }
}
