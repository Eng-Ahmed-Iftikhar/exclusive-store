-- Add missing columns to orders table
ALTER TABLE "orders" ADD COLUMN "orderNumber" TEXT;
ALTER TABLE "orders" ADD COLUMN "estimatedDelivery" TIMESTAMP(3);
ALTER TABLE "orders" ADD COLUMN "actualDelivery" TIMESTAMP(3);
ALTER TABLE "orders" ADD COLUMN "trackingNumber" TEXT;
ALTER TABLE "orders" ADD COLUMN "carrier" TEXT;
ALTER TABLE "orders" ADD COLUMN "priority" TEXT NOT NULL DEFAULT 'normal';
ALTER TABLE "orders" ADD COLUMN "tags" TEXT[];
ALTER TABLE "orders" ADD COLUMN "internalNotes" TEXT;

-- Update existing orders with orderNumber
UPDATE "orders" SET "orderNumber" = "id" WHERE "orderNumber" IS NULL;

-- Make orderNumber NOT NULL and unique
ALTER TABLE "orders" ALTER COLUMN "orderNumber" SET NOT NULL;
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "orderId" TEXT,
    "userId" TEXT,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "description" TEXT NOT NULL,
    "reference" TEXT,
    "metadata" JSONB,
    "paymentMethod" TEXT,
    "paymentMethodDetails" JSONB,
    "processingFee" DOUBLE PRECISION,
    "platformFee" DOUBLE PRECISION,
    "netAmount" DOUBLE PRECISION NOT NULL,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
