/*
  Warnings:

  - You are about to drop the column `image` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `subcategories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."categories" DROP COLUMN "image";

-- AlterTable
ALTER TABLE "public"."subcategories" DROP COLUMN "image";
