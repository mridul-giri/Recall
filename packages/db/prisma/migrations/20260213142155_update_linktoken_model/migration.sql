/*
  Warnings:

  - You are about to drop the column `consumedAt` on the `LinkToken` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "LinkToken_token_idx";

-- AlterTable
ALTER TABLE "LinkToken" DROP COLUMN "consumedAt",
ADD COLUMN     "isUsed" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Content_userId_isDeleted_idx" ON "Content"("userId", "isDeleted");

-- CreateIndex
CREATE INDEX "Content_userId_status_idx" ON "Content"("userId", "status");

-- CreateIndex
CREATE INDEX "LinkToken_userId_idx" ON "LinkToken"("userId");
