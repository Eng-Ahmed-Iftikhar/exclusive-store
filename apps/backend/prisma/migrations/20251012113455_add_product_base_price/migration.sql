-- AlterTable
ALTER TABLE "public"."products" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "price" DECIMAL(10,2),
ADD COLUMN     "salePrice" DECIMAL(10,2);
