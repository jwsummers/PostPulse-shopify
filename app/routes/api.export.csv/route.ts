// app/routes/api.export.csv/route.ts
import type { LoaderFunctionArgs } from '@remix-run/node'
import { prisma } from '../../db.server'
import { authenticate } from '../../shopify.server'

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticate.admin(request)

  const rows = await prisma.response.findMany({
    orderBy: { createdAt: 'desc' },
    include: { Shop: { select: { shopDomain: true } } },
  })

  const header = [
    'createdAt','shopDomain','orderId','orderToken','hdyhau'
  ].join(',')

  const lines = rows.map(r => ([
    r.createdAt.toISOString(),
    r.Shop?.shopDomain ?? '',
    r.orderId,
    r.orderToken,
    r.hdyhau ?? ''
  ].map(field => `"${String(field).replace(/"/g,'""')}"`).join(',')))

  const csv = [header, ...lines].join('\n')

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="postpulse-responses.csv"',
      'Cache-Control': 'no-store',
    },
  })
}
