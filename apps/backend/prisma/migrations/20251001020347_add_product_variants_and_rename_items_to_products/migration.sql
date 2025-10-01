/*
  Warnings:

  - You are about to drop the column `itemId` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `favorites` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `flash_sale_items` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `prices` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `ratings` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `stock` table. All the data in the column will be lost.
  - You are about to drop the `item_images` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `items` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[productId,userId]` on the table `favorites` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[flashSaleId,productId]` on the table `flash_sale_items` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productId,userId]` on the table `ratings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productId,userId]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[variantId]` on the table `stock` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `variantId` to the `cart_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `favorites` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `flash_sale_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variantId` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variantId` to the `prices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `ratings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variantId` to the `stock` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."cart_items" DROP CONSTRAINT "cart_items_itemId_fkey";

-- DropForeignKey
ALTER TABLE "public"."favorites" DROP CONSTRAINT "favorites_itemId_fkey";

-- DropForeignKey
ALTER TABLE "public"."flash_sale_items" DROP CONSTRAINT "flash_sale_items_itemId_fkey";

-- DropForeignKey
ALTER TABLE "public"."item_images" DROP CONSTRAINT "item_images_fileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."item_images" DROP CONSTRAINT "item_images_itemId_fkey";

-- DropForeignKey
ALTER TABLE "public"."items" DROP CONSTRAINT "items_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."items" DROP CONSTRAINT "items_subcategoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."order_items" DROP CONSTRAINT "order_items_itemId_fkey";

-- DropForeignKey
ALTER TABLE "public"."prices" DROP CONSTRAINT "prices_itemId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ratings" DROP CONSTRAINT "ratings_itemId_fkey";

-- DropForeignKey
ALTER TABLE "public"."reviews" DROP CONSTRAINT "reviews_itemId_fkey";

-- DropForeignKey
ALTER TABLE "public"."stock" DROP CONSTRAINT "stock_itemId_fkey";

-- DropIndex
DROP INDEX "public"."favorites_itemId_userId_key";

-- DropIndex
DROP INDEX "public"."flash_sale_items_flashSaleId_itemId_key";

-- DropIndex
DROP INDEX "public"."ratings_itemId_userId_key";

-- DropIndex
DROP INDEX "public"."reviews_itemId_userId_key";

-- DropIndex
DROP INDEX "public"."stock_itemId_key";

-- AlterTable
ALTER TABLE "public"."cart_items" DROP COLUMN "itemId",
ADD COLUMN     "variantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."favorites" DROP COLUMN "itemId",
ADD COLUMN     "productId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."flash_sale_items" DROP COLUMN "itemId",
ADD COLUMN     "productId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."order_items" DROP COLUMN "itemId",
ADD COLUMN     "variantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."prices" DROP COLUMN "itemId",
ADD COLUMN     "variantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."ratings" DROP COLUMN "itemId",
ADD COLUMN     "productId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."reviews" DROP COLUMN "itemId",
ADD COLUMN     "productId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."stock" DROP COLUMN "itemId",
ADD COLUMN     "variantId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."item_images";

-- DropTable
DROP TABLE "public"."items";

-- CreateTable
CREATE TABLE "public"."products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sku" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "categoryId" TEXT,
    "subcategoryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_variants" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "attributes" JSONB,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_images" (
    "id" TEXT NOT NULL,
    "productId" TEXT,
    "variantId" TEXT,
    "fileId" TEXT NOT NULL,
    "altText" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "public"."products"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_sku_key" ON "public"."product_variants"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_productId_userId_key" ON "public"."favorites"("productId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "flash_sale_items_flashSaleId_productId_key" ON "public"."flash_sale_items"("flashSaleId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "ratings_productId_userId_key" ON "public"."ratings"("productId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_productId_userId_key" ON "public"."reviews"("productId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "stock_variantId_key" ON "public"."stock"("variantId");

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "public"."subcategories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_variants" ADD CONSTRAINT "product_variants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cart_items" ADD CONSTRAINT "cart_items_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "public"."product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "order_items_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "public"."product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."prices" ADD CONSTRAINT "prices_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "public"."product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."stock" ADD CONSTRAINT "stock_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "public"."product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_images" ADD CONSTRAINT "product_images_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_images" ADD CONSTRAINT "product_images_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "public"."product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_images" ADD CONSTRAINT "product_images_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "public"."files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ratings" ADD CONSTRAINT "ratings_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."favorites" ADD CONSTRAINT "favorites_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."flash_sale_items" ADD CONSTRAINT "flash_sale_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
