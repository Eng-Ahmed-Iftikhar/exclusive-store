/*
  Warnings:

  - You are about to alter the column `price` on the `cart_items` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to drop the column `currency` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `salePrice` on the `products` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cartId,productId,variantId]` on the table `cart_items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productId` to the `cart_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."roles" DROP CONSTRAINT "roles_createdBy_fkey";

-- AlterTable
ALTER TABLE "public"."cart_items" ADD COLUMN     "productId" TEXT NOT NULL,
ALTER COLUMN "quantity" SET DEFAULT 1,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "variantId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."carts" ADD COLUMN     "shippingCost" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "subtotal" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "tax" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "total" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "totalItems" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."prices" ADD COLUMN     "productId" TEXT,
ALTER COLUMN "variantId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."products" DROP COLUMN "currency",
DROP COLUMN "price",
DROP COLUMN "salePrice",
ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."roles" ALTER COLUMN "createdBy" DROP NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cartId_productId_variantId_key" ON "public"."cart_items"("cartId", "productId", "variantId");

-- AddForeignKey
ALTER TABLE "public"."roles" ADD CONSTRAINT "roles_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."prices" ADD CONSTRAINT "prices_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cart_items" ADD CONSTRAINT "cart_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
