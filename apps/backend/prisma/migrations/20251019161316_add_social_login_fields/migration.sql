/*
  Warnings:

  - You are about to drop the column `stock` on the `products` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[googleId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[facebookId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[twitterId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[githubId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[linkedinId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."stock_variantId_key";

-- AlterTable
ALTER TABLE "public"."products" DROP COLUMN "stock";

-- AlterTable
ALTER TABLE "public"."stock" ADD COLUMN     "productId" TEXT,
ALTER COLUMN "variantId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."users"
ADD COLUMN     "facebookId" TEXT,
ADD COLUMN     "githubId" TEXT,
ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "linkedinId" TEXT,
ADD COLUMN     "provider" TEXT,
ADD COLUMN     "twitterId" TEXT,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "public"."users"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "users_facebookId_key" ON "public"."users"("facebookId");

-- CreateIndex
CREATE UNIQUE INDEX "users_twitterId_key" ON "public"."users"("twitterId");

-- CreateIndex
CREATE UNIQUE INDEX "users_githubId_key" ON "public"."users"("githubId");

-- CreateIndex
CREATE UNIQUE INDEX "users_linkedinId_key" ON "public"."users"("linkedinId");

-- AddForeignKey
ALTER TABLE "public"."stock" ADD CONSTRAINT "stock_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
