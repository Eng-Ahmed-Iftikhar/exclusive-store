/*
  Warnings:

  - You are about to drop the column `roleId` on the `user_teams` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,teamId]` on the table `user_teams` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."user_teams" DROP CONSTRAINT "user_teams_roleId_fkey";

-- DropIndex
DROP INDEX "public"."user_teams_userId_teamId_roleId_key";

-- AlterTable
ALTER TABLE "public"."user_teams" DROP COLUMN "roleId";

-- CreateTable
CREATE TABLE "public"."team_roles" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "team_roles_teamId_roleId_key" ON "public"."team_roles"("teamId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "user_teams_userId_teamId_key" ON "public"."user_teams"("userId", "teamId");

-- AddForeignKey
ALTER TABLE "public"."team_roles" ADD CONSTRAINT "team_roles_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."team_roles" ADD CONSTRAINT "team_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
