// app/routes/app._index.tsx
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";

import {
  Page,
  Layout,
  Card,
  Text,
  InlineStack,
  Button,
  BlockStack,
} from "@shopify/polaris";

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticate.admin(request);

  const [total, recent, bySource] = await Promise.all([
    prisma.response.count(),
    prisma.response.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { Shop: { select: { shopDomain: true } } },
    }),
    prisma.response.groupBy({
      by: ["hdyhau"],
      where: { hdyhau: { not: null } },
      _count: { _all: true },
    }),
  ]);

  return json({ total, recent, bySource });
}

type BySourceRow = { hdyhau: string | null; _count: { _all: number } };
type RecentRow = {
  id: string;
  createdAt: string | Date;
  hdyhau: string | null;
  Shop: { shopDomain: string } | null;
};

export default function AppIndex() {
  const { total, recent, bySource } = useLoaderData<typeof loader>();

  return (
    <Page title="PostPulse">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="200">
              <InlineStack align="space-between">
                <Text as="h2" variant="headingMd">
                  Responses
                </Text>
                {/* Polaris Button uses `url` for link behavior */}
                <Button url="/api/export.csv">Download CSV</Button>
              </InlineStack>
              <Text as="p" variant="bodyMd">
                Total collected: {total}
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section variant="oneHalf">
          <Card>
            <BlockStack gap="200">
              <Text as="h3" variant="headingSm">
                Top sources
              </Text>
              {bySource.length === 0 ? (
                <Text as="p">No data yet.</Text>
              ) : (
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {(bySource as BySourceRow[]).map((r) => (
                    <li key={r.hdyhau ?? "unknown"}>
                      <strong>{r.hdyhau ?? "Unknown"}</strong>: {r._count._all}
                    </li>
                  ))}
                </ul>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section variant="oneHalf">
          <Card>
            <BlockStack gap="200">
              <Text as="h3" variant="headingSm">
                Recent (10)
              </Text>
              {recent.length === 0 ? (
                <Text as="p">No recent responses.</Text>
              ) : (
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {(recent as RecentRow[]).map((r) => (
                    <li key={r.id}>
                      {new Date(r.createdAt).toLocaleString()} —{" "}
                      {r.Shop?.shopDomain ?? "—"} — {r.hdyhau ?? "—"}
                    </li>
                  ))}
                </ul>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
