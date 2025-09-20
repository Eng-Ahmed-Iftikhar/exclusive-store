/*
  Warnings:

  - You are about to drop the column `icon` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `item_images` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `subcategories` table. All the data in the column will be lost.
  - Added the required column `fileId` to the `item_images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."categories" DROP COLUMN "icon",
ADD COLUMN     "iconFileId" TEXT;

-- AlterTable
ALTER TABLE "public"."item_images" DROP COLUMN "url",
ADD COLUMN     "fileId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."subcategories" DROP COLUMN "icon",
ADD COLUMN     "iconFileId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_iconFileId_fkey" FOREIGN KEY ("iconFileId") REFERENCES "public"."files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subcategories" ADD CONSTRAINT "subcategories_iconFileId_fkey" FOREIGN KEY ("iconFileId") REFERENCES "public"."files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."item_images" ADD CONSTRAINT "item_images_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "public"."files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
