-- CreateTable
CREATE TABLE "public"."Shop" (
    "id" SERIAL NOT NULL,
    "shopDomain" TEXT NOT NULL,
    "installedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "billingStatus" TEXT NOT NULL DEFAULT 'trial',

    CONSTRAINT "Shop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Response" (
    "id" TEXT NOT NULL,
    "shopId" INTEGER NOT NULL,
    "orderId" TEXT NOT NULL,
    "orderToken" TEXT NOT NULL,
    "customerId" TEXT,
    "isRepeat" BOOLEAN NOT NULL DEFAULT false,
    "hdyhau" TEXT,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shop_shopDomain_key" ON "public"."Shop"("shopDomain");

-- CreateIndex
CREATE UNIQUE INDEX "Response_orderToken_key" ON "public"."Response"("orderToken");

-- AddForeignKey
ALTER TABLE "public"."Response" ADD CONSTRAINT "Response_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "public"."Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
